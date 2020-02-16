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
    async inviteUserToGroupByEmail(root, {groupId, email}, context) {
      // TODO -
      //  - check by email if the user has an account
      //  - if account
      //    - add user to unclaimed invite db - same as unregistered users?
      //    - send email linking to accept invite page for that invite
      //      - conditional in template to point to claim URL, versus signup prompt
      //    - group appears on account page, with link to accept invite
      //  - else
      //    - add email to unclaimed invite db
      //    - [x] send email to invite to hawthorn with group name in invite
      //      - upon registration, user is added as member of all groups they have been invited to
      // {
      //   "invites": {
      //     "trevorcarringtonsmith@gmail.com": ["groupId_1", ..., "groupId_n"],
      //     "a@a.com": ["groupId_1", ..., "groupId_n"]
      //   }
      // }
      const group = await context.authClient.getGroup(groupId)
      // TODO - check that group exists
      // TODO - get fromUsername from context user
      context.emailClient.sendInvitationToGroup(group.name, email, 'LilPetey')
      return group
    }
  }
}

module.exports = {
  groupsResolvers,
}