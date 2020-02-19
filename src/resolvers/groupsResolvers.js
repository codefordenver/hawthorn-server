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
      // TODO - validate the user is authenticated and belongs to this group
      // TODO - check that the group exists
      const group = await context.authClient.getGroup(groupId)
      if (!group) {
        // TODO - validation error
        //  - may need to check on the group request, error may be thrown in authCLient
      }

      // Check by email if the user has an account
      const existingUser = await context.authClient.getUserByEmail(email)
      if (existingUser) {
        // TODO -
        //  - check by email if the user has an account
        //  - if account
        //    - add user to unclaimed invite db - same as unregistered users?
        //    - send email linking to accept invite page for that invite
        //      - conditional in template to point to claim URL, versus signup prompt
        //    - group appears on account page, with link to accept invite

        //context.emailClient.sendInvitationToGroup(group.name, email, customMessage, 'LilPetey')
      } else {
        // Check if this email already has an invitation to this group
        const groupInvitations = await context.prisma.externalGroupInvitations({
          where: {
            email: email,
            groupId: groupId
          }
        })
        // Create a new invitation for this email address
        if (groupInvitations.length == 0) {
          await context.prisma.createExternalGroupInvitation({
              email: email,
              groupId: groupId,
              // TODO take inviterUserId from context user id
              inviterUserId: '57ab155a-1893-46b4-ba14-f3f25ca1e147',
              accepted: false
          }, info)
        }
      }

      //context.emailClient.sendInvitationToGroup(group.name, email, customMessage, 'LilPetey')
      return group
    }
  }
}

module.exports = {
  groupsResolvers,
}