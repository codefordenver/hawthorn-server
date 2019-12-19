const { filterText, moderationStatus } = require('../services/moderator');

const groupsResolvers = {
  Group: {
    moderation(root, args, context) {
      return context.prisma
        .group({
          id: root.id
        })
        .moderation()
    },
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
      return context.prisma.group({
        id: args.id,
      })
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
    createGroup(root, args, context) {
      let group = {
        name: args.name,
        description: args.description,
      }
      const groupText = `${args.name}\n${args.description}`
      return filterText(context.config.cleanspeak, groupText).then(function(filter) {
        if (filter === true) {
          return context.prisma.createGroup({
            moderation: {
              create: {
                status: "TRIGGERED_CONTENT_FILTER"
              }
            },
            ...group
          })
        } else {
          return context.prisma.createGroup(group)
        }
      })
    },
  }
}

module.exports = {
  groupsResolvers,
}