const { getUser } = require('../services/auth')

const usersResolvers = {
  User: {
    // TODO - populate from FusionAuth?

    // Pull random avatar from an open API
    imageUrl: function(root) {
      return `https://api.adorable.io/avatars/50/${root.id}.png`
    }
  },
  Query: {
    async account(root, args, context) {
      // Return the full user if the passed userId belongs to the currently logged in user
      if (context.request.session && context.request.session.userId
          && context.request.session.userId === args.userId ) {
         return context.authClient.getUser(context.request.session.userId)
      }
      return null
    },
    fusionAuthConfig(root, args, context) {
     return context.authClient.config()
    },
    async login(root, args, context) {
     if (context.request.session && context.request.session.userId) {
        // Session exists, user is already authenticated
        return context.request.session.userId
     }
     // Finish authenticating the user
     let user = await context.authClient.login(context, args.code)
     if (user && user.id) {
       return user.id
     }
     return null
    },
    logout(root, args, context) {
     context.request.session.destroy()
     return true
    }
  },
  Mutation: {
    register(root, args, context) {
      return context.authClient.register(args.email, args.password, args.username)
    }
  }
}

module.exports = {
  usersResolvers,
}