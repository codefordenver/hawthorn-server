const dotenv = require('dotenv')

dotenv.config()

const config = {
  fusionAuthClientId: process.env.FUSIONAUTH_CLIENT_ID,
  fusionAuthSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
  fusionAuthTenantId: process.env.FUSIONAUTH_TENANT_ID,
  fusionAuthRedirectUri: process.env.FUSIONAUTH_CLIENT_REDIRECT_URI,
  fusionAuthApiKey: process.env.FUSIONAUTH_API_KEY,
  fusionAuthEndpoint: process.env.FUSIONAUTH_ENDPOINT,
  sessionSecret: process.env.SESSION_SECRET,
}

if (!config.fusionAuthClientId ||
    !config.fusionAuthSecret ||
    !config.fusionAuthTenantId ||
    !config.fusionAuthRedirectUri ||
    !config.fusionAuthApiKey ||
    !config.fusionAuthEndpoint ||
    !config.sessionSecret) {
  console.info("Exiting - A required environment variable was not found")
  process.exit(1)
}

module.exports = {
  config,
}