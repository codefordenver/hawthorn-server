const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const session = require('express-session')
const dotenv = require('dotenv');
const { FusionAuthClient } = require('fusionauth-node-client')

dotenv.config();

const client = new FusionAuthClient(
    process.env.FUSIONAUTH_API_KEY,
    'http://localhost:9011'
);

const applicationId = process.env.FUSIONAUTH_APPLICATION_ID;

const resolvers = {
  Query: {
    publishedPosts(root, args, context) {
      return context.prisma.posts({ where: { published: true } })
    },
    post(root, args, context) {
      return context.prisma.post({ id: args.postId })
    },
    postsByUser(root, args, context) {
      return context.prisma
        .user({
          id: args.userId,
        })
        .posts()
    },
    publishedPrompts(root, args, context) {
      return context.prisma.prompts({ where: { published: true } })
    },
    getUser(root, args, context) {
      if (context.request.session.user) {
        return client.retrieveUserByEmail(args.email)
               .then(function(clientResponse) {
                 return clientResponse.successResponse.user
               })
               .catch(function(error) {
                 throw new Error("Unexpected server error")
               });
       }
       throw new Error("You must be logged in to do that!")
    },
    login(root, args, context) {
      if (context.request.session.user) {
          return context.request.session.user
      } else {
          const obj = {
              'loginId': args.loginId,
              'password': args.password,
              'applicationId': applicationId
          };
          return client.login(obj)
              .then(function(clientResponse) {
                  context.request.session.user = clientResponse.successResponse.user
                  context.request.session.token = clientResponse.successResponse.token
                  return clientResponse.successResponse.user
              })
              .catch(function(error) {
                  throw new Error("Unexpected server error")
              });
      }
    },
    logout(root, args, context) {
      context.request.session.destroy()
      return "Successfully logged out"
    }
  },
  Mutation: {
    createDraftPost(root, args, context) {
      return context.prisma.createPost({
        title: args.title,
        author: {
          connect: { id: args.userId },
        },
        prompt: {
          connect: { id: args.promptId }
        },
      })
    },
    publishPost(root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: { published: true },
      })
    },
    createUser(root, args, context) {
      return context.prisma.createUser({ name: args.name })
    },
    createDraftPrompt(root, args, context) {
      return context.prisma.createPrompt({
        title: args.title,
        author: {
          connect: { id: args.userId },
        },
      })
    },
    publishPrompt(root, args, context) {
      return context.prisma.updatePrompt({
        where: { id: args.promptId },
        data: { published: true },
      })
    },
  },
  User: {
    posts(root, args, context) {
      return context.prisma
        .user({
          id: root.id,
        })
        .posts()
    },
  },
  Post: {
    author(root, args, context) {
      return context.prisma
        .post({
          id: root.id,
        })
        .author()
    },
    prompt(root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .prompt()
    }
  },
  Prompt: {
    author(root, args, context) {
      return context.prisma
        .prompt({
          id: root.id,
        })
        .author()
    },
    posts(root, args, context) {
      return context.prisma
        .prompt({
          id: root.id,
        })
        .posts()
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

server.express.use(
  session({
    secret: 'fusionauth',
    resave: false,
    saveUninitialized: true
  })
)

server.start(() => console.log('Server is running on http://localhost:4000'))
