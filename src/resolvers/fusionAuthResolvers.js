const { getUser, idpConfig } = require('../services/authentication')

const fusionAuthClientId = process.env.FUSIONAUTH_CLIENT_ID;
const fusionAuthSecret = process.env.FUSIONAUTH_CLIENT_SECRET;
const fusionAuthTenantId = process.env.FUSIONAUTH_TENANT_ID;
const fusionAuthRedirectUri = process.env.FUSIONAUTH_CLIENT_REDIRECT_URI;
const fusionAuthApiKey = process.env.FUSIONAUTH_API_KEY;
const fusionAuthEndpoint = process.env.FUSIONAUTH_ENDPOINT;

const fusionAuthResolvers = {
  Query: {
    fusionAuthConfig() {
      return idpConfig()
    },
    async login(root, args, context) {
      let formData = {
        "client_id": fusionAuthClientId,
        "client_secret": fusionAuthSecret,
        "code": args.code,
        "grant_type": "authorization_code",
        "redirect_uri": fusionAuthRedirectUri
      }
      const tokenEndpoint = `${fusionAuthEndpoint}/oauth2/token`
      const response = await fetch(tokenEndpoint, {
          method: 'post',
          headers: {
            'Bearer': fusionAuthApiKey
          },
          body: new URLSearchParams(formData)
        })
      const body = await response.json();
      if (body.error != null) {
        throw new Error(body.error_description)
      }

      context.request.session.jwt = body.access_token
      context.request.session.refreshToken = body.refresh_token

      return getUser(body.userId)
    },
    logout(root, args, context) {
      context.request.session.destroy()
      return true
    },
  }
}

module.exports = {
  fusionAuthResolvers,
}