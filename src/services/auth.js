const { AuthenticationError, ForbiddenError } = require('apollo-server')
const { FusionAuthClient } = require('fusionauth-node-client')

class AuthClient {
  constructor(fusionAuthConfig) {
    this.fusionAuthConfig = { ...fusionAuthConfig }
    this.client = new FusionAuthClient(
        fusionAuthConfig.apiKey,
        fusionAuthConfig.endpoint
    )
  }

  config() {
    return {
      endpoint: this.fusionAuthConfig.endpoint,
      clientId: this.fusionAuthConfig.clientId,
      tenantId: this.fusionAuthConfig.tenantId,
      redirectUri: this.fusionAuthConfig.redirectUri
    }
  }

  getUser(id) {
    return this.client.retrieveUser(id).then(
      clientResponse => clientResponse.successResponse.user
    )
    .catch(error => {
      throw new Error("Unexpected server error " + error)
    })
  }

  async introspect(jwt) {
    let formData = {
      "client_id": this.fusionAuthConfig.clientId,
      "token": jwt,
    }
    const introspectEndpoint = `${this.fusionAuthConfig.endpoint}/oauth2/introspect`
    const response = await fetch(introspectEndpoint, {
        method: 'post',
        body: new URLSearchParams(formData)
      })
    return response.json();
  }

  async login(context, authorizationCode) {
    let formData = {
      "client_id": this.fusionAuthConfig.clientId,
      "client_secret": this.fusionAuthConfig.clientSecret,
      "code": authorizationCode,
      "grant_type": "authorization_code",
      "redirect_uri": this.fusionAuthConfig.redirectUri
    }
    const tokenEndpoint = `${this.fusionAuthConfig.endpoint}/oauth2/token`
    const response = await fetch(tokenEndpoint, {
        method: 'post',
        headers: {
          'Bearer': this.fusionAuthConfig.apiKey
        },
        body: new URLSearchParams(formData)
      })
    const body = await response.json();
    if (body.error != null) {
      throw new Error(body.error_description)
    }

    context.request.session.jwt = body.access_token
    context.request.session.refreshToken = body.refresh_token
    context.request.session.userId = body.userId

    return this.getUser(body.userId)
  }
  // =======================================
  // Role authorization validation
  //
  // throws an AuthenticationError when the user must be logged in to access the requested resource
  // throws a ForbiddenError when the user must be logged in to access the requested resource
  // =======================================
  requiresAuthentication(decodedJWT, role) {
    if (decodedJWT === null) {
      throw new AuthenticationError('You must be logged in for that');
    }
    if (!decodedJWT.active) {
      throw new AuthenticationError('Your session expired, please log back in');
    }
    if (decodedJWT.roles.indexOf(role) === -1) {
      throw new ForbiddenError('You cannot see that')
    }
  }

  async register(email, password, username) {
    const registerEndpoint = `${this.fusionAuthConfig.endpoint}/api/user/registration`
    const postBody = {
    	"registration": {
    		"applicationId": `${this.fusionAuthConfig.clientId}`,
    	},
    	"user": {
    		"email": `${email}`,
    		"password": `${password}`,
    		"username": `${username}`
    	}
    }
    const response = await fetch(registerEndpoint, {
        method: 'post',
        headers: {
          'Authorization': this.fusionAuthConfig.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      })
    const body = await response.json();

    if (body.fieldErrors != null) {
      for (let errorKey in body.fieldErrors) {
        // Return the first field error for now
        // TODO - update to return all field errors so the user can correct all at once, and not piecemeal
        throw new Error(body.fieldErrors[errorKey][0].message)
      }
    }

    return body.user.id
  }

  async refreshAccessToken(refreshToken) {
    let formData = {
      "client_id":  this.fusionAuthConfig.clientId,
      "client_secret":  this.fusionAuthConfig.clientSecret,
      "grant_type": "refresh_token",
      "redirect_uri":  this.fusionAuthConfig.redirectUri,
      "refresh_token": refreshToken
    }
    const tokenEndpoint = `${this.fusionAuthConfig.endpoint}/oauth2/token`
    const response = await fetch(tokenEndpoint, {
        method: 'post',
        headers: {
          'Bearer':  this.fusionAuthConfig.apiKey
        },
        body: new URLSearchParams(formData)
      })
    const body = await response.json();
    if (body.error != null) {
      // Check if the refresh token expired
      if (body.error_reason === 'refresh_token_not_found') {
        throw new AuthenticationError('Your session expired, please log back in');
      }
      throw new Error("Error occurred trying to refresh the session:", body.error_description)
    }

    return body.access_token
  }
}

module.exports = {
  AuthClient
}