const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server')
const { FusionAuthClient } = require('fusionauth-node-client')

class AuthClient {
  constructor(fusionAuthConfig) {
    this.fusionAuthConfig = { ...fusionAuthConfig }
    // Create FusionAuth client and set the Tenant Id on the client to scope
    //  requests to a specific Tenant
    this.client = new FusionAuthClient(
        fusionAuthConfig.apiKey,
        fusionAuthConfig.endpoint
    )
    .setTenantId(this.fusionAuthConfig.tenantId)
  }

  async addUserToGroup(groupId, userId) {
    const requestBody = {
      "members": {
        [groupId]: [{
          "userId": userId
        }]
      }
    }
    return this.client.createGroupMembers(requestBody)
      .catch(error => {
        throw new Error("Unable to add user to group", error)
      })
  }

  config() {
    return {
      endpoint: this.fusionAuthConfig.endpoint,
      clientId: this.fusionAuthConfig.clientId,
      tenantId: this.fusionAuthConfig.tenantId,
      redirectUri: this.fusionAuthConfig.redirectUri
    }
  }

  async createGroup(name, description, userId, isPrivate) {
    const requestBody = {
      "group": {
        "data": {
          "admins": [userId],
          "description": description,
          "isPrivate": isPrivate
        },
        "name": name
      }
    }
    return this.client.createGroup(null, requestBody).then(
      clientResponse => this._normalizeGroup(clientResponse)
    ).catch(error => {
      this._handleError(error)
    })
  }

  getGroup(id) {
    return this.client.retrieveGroup(id).then((clientResponse) => {
        return this._normalizeGroup(clientResponse)
      }
    )
    .catch(error => {
      throw new Error("Unexpected server error " + JSON.stringify(error))
    })
  }

  getUser(id) {
    return this.client.retrieveUser(id).then(
      clientResponse => {
        let groups = []
        if (clientResponse.successResponse.user.memberships) {
          clientResponse.successResponse.user.memberships.forEach(membership => {
            groups.push(this.getGroup(membership.groupId))
          })
        }
        return {
          ...clientResponse.successResponse.user,
          groups: groups
        }
      }
    )
    .catch(error => {
      // If we get a 404, just return null user, otherwise throw an Error
      if (error.statusCode == 404) {
        return null
      }

      throw new Error("Unexpected server error ", error)
    })
  }

  getUserByEmail(email) {
    return this.client.retrieveUserByEmail(email).then(
      clientResponse => {
        let groups = []
        if (clientResponse.successResponse.user.memberships) {
          clientResponse.successResponse.user.memberships.forEach(membership => {
            groups.push(this.getGroup(membership.groupId))
          })
        }
        return {
          ...clientResponse.successResponse.user,
          groups: groups
        }
      }
    )
    .catch(error => {
      // If we get a 404, just return null user, otherwise throw an Error
      if (error.statusCode == 404) {
        return null
      }
      throw new Error("Unexpected server error ", error)
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
  // Validate the user is logged in
  //
  // throws an AuthenticationError when the user must be logged in to access the requested resource
  // =======================================
  requiresAuthentication(session) {
    if (session && session.userId) {
      return
    }
    throw new AuthenticationError('You must be logged in for that');
  }

  async register(email, password, username, sendSetPasswordEmail, skipRegistrationVerification, skipEmailVerification) {
    const registerEndpoint = `${this.fusionAuthConfig.endpoint}/api/user/registration`
    const postBody = {
    	"registration": {
    		"applicationId": `${this.fusionAuthConfig.clientId}`,
    	},
      "sendSetPasswordEmail": sendSetPasswordEmail,
      "skipRegistrationVerification": skipRegistrationVerification,
      "skipVerification": skipEmailVerification,
    	"user": {
    		"email": `${email}`,
        "imageUrl": `https://api.adorable.io/avatars/50/${Math.floor(Math.random() * 100000000)}.png`,
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

  _handleError(error) {
    if (error.errorResponse && error.errorResponse.fieldErrors) {
      let fieldErrors = []
      // FusionAuth returns an object of arrays, keyed by the field
      // Each field can have many validation errors, so need to pull the message off of each one
      Object.values(error.errorResponse.fieldErrors).forEach(fieldResult =>  {
        fieldResult.forEach(validationError => {
          fieldErrors.push(validationError.message)
        })
      })
      throw new UserInputError(
        "Validation error",
        { fieldErrors }
      )
    }
    throw new Error("Unexpected server error " + JSON.stringify(error))
  }

  _normalizeGroup(clientResponse) {
    return {
      "id": clientResponse.successResponse.group.id,
      "description": clientResponse.successResponse.group.data.description,
      "name": clientResponse.successResponse.group.name,
      "isPrivate": clientResponse.successResponse.group.data.isPrivate
    }
  }
}

module.exports = {
  AuthClient
}