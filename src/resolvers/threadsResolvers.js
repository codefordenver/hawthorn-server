const { filterText } = require('../services/moderator');

const threadsResolvers = {
  Thread: {
    group(root, args, context) {
      return context.prisma
        .thread({
          id: root.id
        })
        .group()
    },
    posts(root, args, context) {
      return context.prisma
        .thread({
          id: root.id
        })
        .posts({
          orderBy: "createdAt_DESC",
          where: {
            abusive: false,
            published: true
          }
        })
    }
  },
  Query: {
    thread(root, args, context) {
      return context.prisma.thread({
        id: args.id,
      })
    },
  },
  Mutation: {
    createThread(root, args, context) {
      let thread = {
        group: {
          connect: { id: args.groupId }
        },
        title: args.title,
      }
      return filterText(context.config.cleanspeak, args.title).then(function(filter) {
        if (filter === false) {
          thread.published = true
        } else {
          thread.abusive = true
          thread.published = false
        }

        return context.prisma.createThread(thread)
      })
    },
  }
}

module.exports = {
  threadsResolvers,
}