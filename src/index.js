const { GraphQLServer } = require('graphql-yoga')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const { prisma } = require('./generated/prisma-client')
const { config } = require('./config')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const { introspect, refreshAccessToken } = require('./services/authentication')

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

server.express.use(compression())
server.express.use(helmet())

server.express.use(
  session({
    name: "qid",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
)

server.express.use(async function(req, res, next) {
  const jwt = req.session.jwt
  if (jwt === null) {
    next()
  }
  let decodedJWT = await introspect(jwt);
  if (decodedJWT.error != null) {
    throw new Error(decodedJWT.error_description)
  }

  // Refresh the access token on the session if it has expired
  if (!decodedJWT.active && req.session.refreshToken) {
    const refreshedJwt = await refreshAccessToken(req.session.refreshToken)
    if (refreshedJwt === null) {
      next()
    }
    req.session.jwt = refreshedJwt

    decodedJWT = await introspect(refreshedJwt);
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
};

server.start(opts,
  () => console.log(`Server is running on http://localhost:${opts.port}`))
