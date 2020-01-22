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
   fusionAuthConfig(root, args, context) {
     return context.authClient.config()
   },
   async login(root, args, context) {
     return context.authClient.login(context, args.code)
   },
   logout(root, args, context) {
     context.request.session.destroy()
     return true
   }
  }
}

module.exports = {
  usersResolvers,
}