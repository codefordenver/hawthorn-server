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
    async createPrivateGroup(root, {name, description}, context) {
      context.authClient.requiresAuthentication(context.request.session)
      const group = await context.authClient
        .createGroup(name, description, context.request.session.userId, true)
      context.authClient.addUserToGroup(group.id, context.request.session.userId)
      return group
    },
  }
}

module.exports = {
  groupsResolvers,
}