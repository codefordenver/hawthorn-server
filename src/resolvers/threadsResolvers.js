const { filterText, moderationStatus } = require('../services/moderator');

const threadsResolvers = {
  Thread: {
    group(root, args, context) {
      return context.prisma
        .thread({
          id: root.id
        })
        .group();
    },
    moderation(root, args, context) {
      return context.prisma
        .thread({
          id: root.id
        })
        .moderation();
    },
    posts(root, args, context, info) {
      return context.prisma
        .thread({
          id: root.id
        })
        .posts(
          {
            orderBy: 'createdAt_DESC',
            where: {
              moderation: null
            }
          },
          info
        );
    }
  },
  Query: {
    thread(root, args, context) {
      return context.prisma.thread({
        id: args.id
      });
    }
  },
  Mutation: {
    createThread(root, args, context) {
      const thread = {
        group: {
          connect: { id: args.groupId }
        },
        title: args.title
      };
      return filterText(context.config.cleanspeak, args.title).then(function(filter) {
        if (filter === true) {
          return context.prisma.createThread({
            moderation: {
              create: {
                status: 'TRIGGERED_CONTENT_FILTER'
              }
            },
            ...thread
          });
        }
        return context.prisma.createThread(thread);
      });
    }
  }
};

module.exports = {
  threadsResolvers
};
