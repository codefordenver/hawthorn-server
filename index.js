const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const { AuthenticationError, ForbiddenError } = require('apollo-server')
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
const roles = {
  facilitator: 'facilitator'
}

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

const _requiresAuthentication = function(decodedJWT, role) {
  if (decodedJWT === null) {
    throw new AuthenticationError('You must be logged in for that');
  }
  if (!decodedJWT.active) {
    throw new AuthenticationError('Your session expired, please log back in');
  }
  if (decodedJWT.roles.indexOf(role) === -1) {
    throw new ForbiddenError('You cannot see that')
  }
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
    publishedPrompts(root, args, context) {
      return context.prisma.prompts({
        orderBy: "createdAt_DESC",
        where: { published: true }
      })
    }
  },
  Mutation: {
    createPost(root, args, context) {
      return context.prisma.createPost({
        title: args.title,
        published: true,
        prompt: {
          connect: { id: args.promptId }
        },
      })
    },
    createPrompt(root, args, context) {
      _requiresAuthentication(context.request.decodedJWT, roles.facilitator)
      return context.prisma.createPrompt({
        title: args.title,
        authorId: context.request.decodedJWT.sub,
        published: true,
      })
    },
  },
  User: {
    // Pull random avatar from an open API
    imageUrl: function(root) {
      return `https://api.adorable.io/avatars/50/${root.id}.png`
    }
  },
  Post: {
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
        .posts({
          orderBy: "createdAt_DESC"
        })
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

const refreshAccessToken = async function(refreshToken) {
  let formData = {
    "client_id": fusionAuthClientId,
    "client_secret": fusionAuthSecret,
    "grant_type": "refresh_token",
    "redirect_uri": fusionAuthRedirectUri,
    "refresh_token": refreshToken
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
    // Check if the refresh token expired
    if (body.error_reason === 'refresh_token_not_found') {
      throw new AuthenticationError('Your session expired, please log back in');
    }
    throw new Error("Error occurred trying to refresh the session:", body.error_description)
  }

  return body.access_token
}

const introspect = async function(jwt) {
  let formData = {
    "client_id": fusionAuthClientId,
    "token": jwt,
  }
  const introspectEndpoint = `${fusionAuthEndpoint}/oauth2/introspect`
  const response = await fetch(introspectEndpoint, {
      method: 'post',
      body: new URLSearchParams(formData)
    })
  return response.json();
}

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
