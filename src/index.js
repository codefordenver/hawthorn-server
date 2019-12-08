const { GraphQLServer } = require('graphql-yoga')
const compression = require('compression')
const helmet = require('helmet')
const { prisma } = require('./generated/prisma-client')
const { config } = require('./config')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')

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

const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: true
  }
}

server.start(opts,
  () => console.log(`Server is running on http://localhost:${opts.port}`))
