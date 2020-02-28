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
    acceptGroupInvite(root, {groupId}, context) {
      return context.authClient.getGroup(groupId)
    },
    async createPrivateGroup(root, {name, description}, context) {
      context.authClient.requiresAuthentication(context.request.session)
      const group = await context.authClient
        .createGroup(name, description, context.request.session.userId, true)

      context.authClient.addUserToGroup(group.id, context.request.session.userId)
      return group
    },
    async inviteUserToGroupByEmail(root, {email, groupId, customMessage}, context, info) {
      // TODO - validate the user making the request is authenticated and belongs to this group
      // TODO take inviterUserId from context user id
      let inviterUserId = "57ab155a-1893-46b4-ba14-f3f25ca1e147"
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
          inviterUserId: inviterUserId,
          userId: existingUser ? existingUser.id : null
        }, info)
        // TODO - take fromUserName from context user, axe LilPetey
        context.emailClient.sendGroupInvitationToUser(group.name, email, existingUser !== null, customMessage, 'LilPetey')
      }
      return group
    }
  }
}

module.exports = {
  groupsResolvers,
}