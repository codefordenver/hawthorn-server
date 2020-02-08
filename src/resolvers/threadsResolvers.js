const { filterText, moderationStatus } = require('../services/moderator');

const threadsResolvers = {
  Thread: {
    group(root, args, context) {
      return context.authClient.getGroup(root.groupId)
    },
    moderation(root, args, context) {
      return context.prisma
        .thread({
          id: root.id
        })
        .moderation()
    },
    posts(root, args, context, info) {
      return context.prisma
        .thread({
          id: root.id
        })
        .posts({
          orderBy: "createdAt_DESC",
          where: {
            moderation: null
          }
        }, info)
    }
  },
  Query: {
    thread(root, {id}, context) {
      return context.prisma.thread({
        id: id,
      })
    },
  },
  Mutation: {
    createThread(root, {groupId, title}, context) {
      let thread = {
        groupId: groupId,
        title: title,
      }
      return filterText(context.config.cleanspeak, title).then(function(filter) {
        if (filter === true) {
          return context.prisma.createThread({
            moderation: {
              create: {
                status: "TRIGGERED_CONTENT_FILTER"
              }
            },
            ...thread
          })
        } else {
          return context.prisma.createThread(thread)
        }
      })
    },
  }
}

module.exports = {
  threadsResolvers,
}