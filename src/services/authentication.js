const dotenv = require('dotenv')
const { FusionAuthClient } = require('fusionauth-node-client')
const { config } = require('../config')

const client = new FusionAuthClient(
    config.fusionAuthApiKey,
    config.fusionAuthEndpoint
)

const getUser = function(id) {
  if (id !== null) {
    return client.retrieveUser(id).then(
      clientResponse => clientResponse.successResponse.user
    )
    .catch(error => {
      throw new Error("Unexpected server error " + JSON.stringify(error))
    })
  }
  return null
}

const idpConfig = function() {
  return {
    endpoint: config.fusionAuthEndpoint,
    clientId: config.fusionAuthClientId,
    tenantId: config.fusionAuthTenantId,
    redirectUri: config.fusionAuthRedirectUri,
  }
}

const introspect = async function(jwt) {
  let formData = {
    "client_id": config.fusionAuthClientId,
    "token": jwt,
  }
  const introspectEndpoint = `${config.fusionAuthEndpoint}/oauth2/introspect`
  const response = await fetch(introspectEndpoint, {
      method: 'post',
      body: new URLSearchParams(formData)
    })
  return response.json();
}

const refreshAccessToken = async function(refreshToken) {
  let formData = {
    "client_id": config.fusionAuthClientId,
    "client_secret": config.fusionAuthSecret,
    "grant_type": "refresh_token",
    "redirect_uri": config.fusionAuthRedirectUri,
    "refresh_token": config.refreshToken
  }
  const tokenEndpoint = `${config.fusionAuthEndpoint}/oauth2/token`
  const response = await fetch(tokenEndpoint, {
      method: 'post',
      headers: {
        'Bearer': config.fusionAuthApiKey
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

module.exports = {
  getUser,
  idpConfig,
  introspect,
  refreshAccessToken,
}