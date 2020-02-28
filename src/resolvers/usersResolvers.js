const { getUser } = require('../services/auth')

const usersResolvers = {
  User: {
    // Most fields are handled by authClient.getUser

    async unacceptedGroupInvitations(root, args, context, info) {
      let groups = []
      const groupInvitations = await context.prisma.groupInvitations({
        where: {
          accepted: false,
          userId: root.id
        }
      })
      groupInvitations.forEach(async function(invitation){
        const group = context.authClient.getGroup(invitation.groupId)
        groups.push(group)
      })

      return groups
    }
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
      const groupInvitations = await context.prisma.groupInvitations({
        where: {
          email: email
        }
      })

      // Add the user to all of the groups they have been invited to
      groupInvitations.forEach(async function(invitation){
        await context.authClient.addUserToGroup(invitation.groupId, userId)
        await context.prisma.updateGroupInvitation({
          where: {
            id: invitation.id
          },
          data: {
            accepted: true,
            userId: userId
          }
        })
      })

      return userId
    }
  }
}

module.exports = {
  usersResolvers,
}