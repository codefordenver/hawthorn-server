const { filterText, moderationStatus } = require('../services/moderator');

const groupsResolvers = {
  Group: {
    threads(root, args, context, info) {
      return context.prisma
        .threads({
          orderBy: "createdAt_DESC",
          where: {
            groupId: root.id
          }
      }, info)
    }
  },
  Query: {
    group(root, {id}, context) {
      return context.authClient.getGroup(id)
    },
  },
  Mutation: {
    async acceptGroupInvite(root, {invitationId}, context) {
      context.authClient.requiresAuthentication(context.request.session)
      // Verify the invitation belongs to the authenticated user
      const invitation = await context.prisma.groupInvitation({ id: invitationId })
      if (!invitation.userId || invitation.userId !== context.request.session.userId) {
        throw new Error("Invitation [" + invitationId + "] is not able to be accepted by user [" + context.request.session.userId + "]")
      }

      await context.authClient.addUserToGroup(invitation.groupId, context.request.session.userId)
      await context.prisma.updateGroupInvitation({
        where: {
          id: invitationId
        },
        data: {
          accepted: true
        }
      })

      return context.authClient.getGroup(invitation.groupId)
    },
    async createPrivateGroup(root, {name, description}, context) {
      context.authClient.requiresAuthentication(context.request.session)
      const group = await context.authClient
        .createGroup(name, description, context.request.session.userId, true)

      context.authClient.addUserToGroup(group.id, context.request.session.userId)
      return group
    },
    async inviteUserToGroupByEmail(root, {email, groupId, customMessage}, context, info) {
      context.authClient.requiresAuthentication(context.request.session)
      // Validate the user making the request belongs to this group
      let sessionUser = await context.authClient.getUser(context.request.session.userId)
      let belongsToGroup = false
      sessionUser.groups.forEach(function(group){
        if (group.id === groupId){
          belongsToGroup = true
          break
        }
      })
      if (!belongsToGroup) {
        throw new Error("User [" + context.request.session.userId + "] is not able to invite [" + email + "] to Group [" + groupId + "]")
      }

      const group = await context.authClient.getGroup(groupId)

      const existingGroupInvitations = await context.prisma.groupInvitations({
        where: {
          email: email,
          groupId: groupId
        }
      })
      // Send an invitation if one does not yet exist for this user : group
      if (existingGroupInvitations.length == 0) {
        // Check by email if the user has an account
        const existingUser = await context.authClient.getUserByEmail(email)
        await context.prisma.createGroupInvitation({
          accepted: false,
          email: email,
          groupId: groupId,
          inviterUserId: context.request.session.userId,
          userId: existingUser ? existingUser.id : null
        }, info)
        context.emailClient.sendGroupInvitationToUser(group.name, email, existingUser !== null, customMessage, sessionUser.username)
      }
      return group
    }
  }
}

module.exports = {
  groupsResolvers,
}