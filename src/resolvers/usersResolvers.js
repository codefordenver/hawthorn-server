const { getUser } = require('../services/auth')

const usersResolvers = {
  User: {
    // Delegate to authClient.getUser
  },
  Query: {
    async account(root, args, context) {
      context.authClient.requiresAuthentication(context.request.session)
      // Return the full user if the passed userId belongs to the currently logged in user
      if (context.request.session.userId === args.userId ) {
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
    async register(root, {email, password, username}, context) {
      const userId = await context.authClient.register(email, password, username)

      // Retrieve any group invitations for this email
      const groupInvitations = await context.prisma.externalGroupInvitations({
        where: {
          email: email
        }
      })
      // Add the user to all of the groups they have been invited to
      groupInvitations.forEach(async function(invitation){
        await context.authClient.addUserToGroup(invitation.groupId, userId)
        await context.authClient.convertExternalUserInGroup(invitation.groupId, userId, email)
        // Delete the invitation from the Hawthorn database
        await context.prisma.deleteExternalGroupInvitation({
          id: invitation.id
        })
      })

      return userId
    }
  }
}

module.exports = {
  usersResolvers,
}