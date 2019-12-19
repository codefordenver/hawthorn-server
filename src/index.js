const { GraphQLServer } = require('graphql-yoga')
const compression = require('compression')
const helmet = require('helmet')
const { prisma } = require('./generated/prisma-client')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const { dotenv } = require('dotenv')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
      config: {
        cleanspeak: {
          apiKey: process.env.CLEANSPEAK_API_KEY,
          applicationId: process.env.APPLICATION_ID,
          baseUrl: process.env.CLEANSPEAK_BASE_URL
        }
      },
    }
  },
})
server.express.use(compression())
server.express.use(helmet())

const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: true
  }
}

server.start(opts,
  () => console.log(`Server is running on http://localhost:${opts.port}`))
