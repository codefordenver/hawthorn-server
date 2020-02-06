const { filterText, moderationStatus } = require('../services/moderator');

const groupsResolvers = {
  Group: {
    threads(root, args, context, info) {
      return context.prisma
        .group({
          id: root.id
        })
        .threads({
          orderBy: "createdAt_DESC",
          where: {
            moderation: null
          }
        }, info)
    }
  },
  Query: {
    group(root, args, context) {
      return context.authClient.getGroup(args.id)
    },
    groups(root, args, context) {
      return context.prisma.groups({
        orderBy: "createdAt_DESC",
        where: {
          moderation: null
        },
      })
    },
  },
  Mutation: {
    async createPrivateGroup(root, args, context) {
      context.authClient.requiresAuthentication(context.request.session)
      const group = await context.authClient
        .createGroup(args.name, args.description, context.request.session.userId, true)
      context.authClient.addUserToGroup(group.id, context.request.session.userId)
      return group
    },
  }
}

module.exports = {
  groupsResolvers,
}