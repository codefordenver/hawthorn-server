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
const fusionAuthTenantId = process.env.FUSIONAUTH_TENANT_ID;
const fusionAuthRedirectUri = process.env.FUSIONAUTH_CLIENT_REDIRECT_URI;
const fusionAuthApiKey = process.env.FUSIONAUTH_API_KEY;
const fusionAuthEndpoint = process.env.FUSIONAUTH_ENDPOINT;
const sessionSecret = process.env.SESSION_SECRET;

if (!fusionAuthClientId ||
    !fusionAuthSecret ||
    !fusionAuthTenantId ||
    !fusionAuthRedirectUri ||
    !fusionAuthApiKey ||
    !fusionAuthEndpoint ||
    !sessionSecret) {
  console.info("Exiting - A required environment variable was not found")
  process.exit(1)
}

const getUser = function(id) {
  return client.retrieveUser(id).then(
    clientResponse => clientResponse.successResponse.user
  )
  .catch(error => {
    throw new Error("Unexpected server error " + error)
  })
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

const resolvers = {
  Query: {
    fusionAuthConfig() {
      return {
        endpoint: fusionAuthEndpoint,
        clientId: fusionAuthClientId,
        tenantId: fusionAuthTenantId,
        redirectUri: fusionAuthRedirectUri
      }
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
    post(root, args, context) {
      return context.prisma.post({ id: args.postId })
    },
    postsByUser(root, args, context) {
      return context.prisma
        .posts({
            authorId: root.id
        })
    },
    publishedPosts(root, args, context) {
      return context.prisma.posts({ where: { published: true } })
    },
    publishedPrompts(root, args, context) {
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
    createDraftPrompt(root, args, context) {
      return context.prisma.createPrompt({
        title: args.title,
        authorId: args.userId,
      })
    },
    publishPost(root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: { published: true },
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


server.express.use(
  session({
    name: "qid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

server.express.use(async function(req, res, next) {
  const token = req.session.jwt
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
})

const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: ["http://localhost:3000"]
  }
};

server.start(opts,
  () => console.log(`Server is running on http://localhost:${opts.port}`))
