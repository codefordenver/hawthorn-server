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

      // Check by email if the user has an account
      const existingUser = await context.authClient.getUserByEmail(email)
      if (existingUser) {
        await context.authClient.inviteInternalUserToGroup(groupId, inviterUserId, existingUser.id)
        // TODO -
        //  - [x] check by email if the user has an account
        //  - if account
        //    - [x] add user to unclaimed invite db - same as unregistered users?
        //    - send email linking to accept invite page for that invite
        //      - conditional in template to point to claim URL, versus signup prompt
        //    - group appears on account page, with link to accept invite
      } else {
        // Check if this email already has an invitation to this group
        const groupInvitations = await context.prisma.externalGroupInvitations({
          where: {
            email: email,
            groupId: groupId
          }
        })
        // Create a new temporary invitation in the Hawthorn DB for this email address
        // This temporary store enables us to easily add them to all groups they
        //  have been invited to upon registration
        if (groupInvitations.length == 0) {
          await context.prisma.createExternalGroupInvitation({
              email: email,
              groupId: groupId
          }, info)
          // Also update the metadata on the FusionAuth group to mark this user as invited
          await context.authClient.inviteExternalUserToGroup(groupId, inviterUserId, email)
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