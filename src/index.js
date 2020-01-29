const compression = require('compression')
const helmet = require('helmet')
const redis = require('redis')
const session = require('express-session')
const { dotenv } = require('dotenv')

const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const { resolvers } = require('./resolvers')
const { typeDefs } = require('./typeDefs')
const { AuthClient } = require('./services/auth')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const config = {
  cleanspeak: {
    apiKey: process.env.CLEANSPEAK_API_KEY,
    applicationId: process.env.APPLICATION_ID,
    baseUrl: process.env.CLEANSPEAK_BASE_URL
  },
  fusionAuth: {
    apiKey: process.env.FUSIONAUTH_API_KEY,
    clientId: process.env.FUSIONAUTH_CLIENT_ID,
    clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
    endpoint: process.env.FUSIONAUTH_ENDPOINT,
    redirectUri: process.env.FUSIONAUTH_CLIENT_REDIRECT_URI,
    tenantId: process.env.FUSIONAUTH_TENANT_ID,
  },
  sessionSecret: process.env.SESSION_SECRET
}

const authClient = new AuthClient(config.fusionAuth)
const sessionSecret = process.env.SESSION_SECRET

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
      authClient: authClient,
      config: config,
    }
  },
})
server.express.use(compression())
server.express.use(helmet())
server.express.use(
  session({
    name: "hawthorn.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    },
    store: new RedisStore({ client: redisClient })
  })
)

// TODO - move to auth service?
server.express.use(async function(req, res, next) {
  const jwt = req.session.jwt
  if (jwt === null) {
    next()
  }
  let decodedJWT = await authClient.introspect(jwt);
  if (decodedJWT.error != null) {
    throw new Error(decodedJWT.error_description)
  }

  // Refresh the access token on the session if it has expired
  if (!decodedJWT.active && req.session.refreshToken) {
    const refreshedJwt = await authClient.refreshAccessToken(req.session.refreshToken)
    if (refreshedJwt === null) {
      next()
    }
    req.session.jwt = refreshedJwt
    decodedJWT = await authClient.introspect(refreshedJwt);
    if (decodedJWT.error != null) {
      throw new Error(decodedJWT.error_description)
    }
  }

  req.decodedJWT = decodedJWT
  next()
})

const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: true
  }
}

server.start(opts,
  () => console.log(`Server is running on http://localhost:${opts.port}`))
