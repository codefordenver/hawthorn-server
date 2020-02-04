const { filterText, moderationStatus } = require('../services/moderator');

const postsResolvers = {
  Post: {
    moderation(root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .moderation();
    },
    thread(root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .thread();
    }
  },
  Mutation: {
    createPost(root, args, context) {
      const post = {
        content: args.content,
        thread: {
          connect: { id: args.threadId }
        }
      };
      return filterText(context.config.cleanspeak, args.content).then(function(filter) {
        if (filter === true) {
          return context.prisma.createPost({
            moderation: {
              create: {
                status: 'TRIGGERED_CONTENT_FILTER'
              }
            },
            ...post
          });
        }
        return context.prisma.createPost(post);
      });
    }
  }
};

module.exports = {
  postsResolvers
};
