const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const session = require('express-session')
const dotenv = require('dotenv');
const { FusionAuthClient } = require('fusionauth-node-client')

dotenv.config();

const client = new FusionAuthClient(
    process.env.FUSIONAUTH_API_KEY,
    process.env.FUSIONAUTH_ENDPOINT
)

const fusionAuthClientId = process.env.FUSIONAUTH_CLIENT_ID;
const fusionAuthSecret = process.env.FUSIONAUTH_CLIENT_SECRET;
const fusionAuthRedirectUri = process.env.FUSIONAUTH_CLIENT_REDIRECT_URI;
const fusionAuthApiKey = process.env.FUSIONAUTH_API_KEY;
const fusionAuthEndpoint = process.env.FUSIONAUTH_ENDPOINT;

const getUser = function(id) {
  return client.retrieveUser(id).then(
    clientResponse => clientResponse.successResponse.user
  )
  .catch(error => {
    throw new Error("Unexpected server error " + error)
  })
}

const getTokenFromHeader = function(authorizationHeader) {
  if (authorizationHeader != null) {
    const parts = authorizationHeader.split(" ")
    if (parts[0] === 'Bearer') {
      return parts[1]
    }
  }
  return null
}

const tokenMiddleware = async function(req, res, next) {
  const token = getTokenFromHeader(req.headers.authorization)
  if (token === null) {
    next()
  }
  let formData = {
    "client_id": fusionAuthClientId,
    "token": token,
  }
  const introspectEndpoint = `${fusionAuthEndpoint}/oauth2/introspect`
  const response = await fetch(introspectEndpoint, {
      method: 'post',
      body: new URLSearchParams(formData)
    })
  const body = await response.json();
  if (body.error != null) {
    throw new Error(body.error_description)
  }

  req.decodedJWT = body
  next()
}

const _authorized = function(decodedJWT, role) {
  if (decodedJWT === null) {
    return false;
  }
  if (!decodedJWT.active) {
    return false;
  }

  return decodedJWT.roles.indexOf(role) !== -1
}

class Token {
  constructor(accessToken, userId) {
    this.accessToken = accessToken
    this.userId = userId
  }
}

const resolvers = {
  Query: {
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

      return new Token(body.access_token, body.userId)
    },
    publishedPosts(root, args, context) {
      return context.prisma.posts({ where: { published: true } })
    },
    post(root, args, context) {
      return context.prisma.post({ id: args.postId })
    },
    postsByUser(root, args, context) {
      return context.prisma
        .posts({
            authorId: root.id
        })
    },
    async publishedPrompts(root, args, context) {
      if (_authorized(context.request.decodedJWT, 'user')) {
        return context.prisma.prompts({ where: { published: true } })
      }

      throw new Error("Unauthorized")
    },
    user(root, args, context) {
      return getUser(args.id)
    }
  },
  Mutation: {
    createDraftPost(root, args, context) {
      return context.prisma.createPost({
        title: args.title,
        authorId: args.userId,
        prompt: {
          connect: { id: args.promptId }
        },
      })
    },
    logout(root, args, context) {
      context.request.session.destroy()
      return "Successfully logged out"
    },
    publishPost(root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: { published: true },
      })
    },
    createDraftPrompt(root, args, context) {
      return context.prisma.createPrompt({
        title: args.title,
        authorId: args.userId,
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
      return context.prisma.posts({ where: { authorId: root.id } })
    },
  },
  Post: {
    author(root, args, context){
      return getUser(root.authorId)
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
    author(root, args, context){
      return getUser(root.authorId)
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

server.express.use(tokenMiddleware)

server.start(() => console.log('Server is running on http://localhost:4000'))
