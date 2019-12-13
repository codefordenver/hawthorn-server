const { filterText } = require('../services/moderator');

const postsResolvers = {
  Post: {
    thread(root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .thread()
    }
  },
  Mutation: {
    createPost(root, args, context) {
      let post = {
        content: args.content,
        thread: {
          connect: { id: args.threadId }
        },
      }
      return filterText(context.config.cleanspeak, args.content).then(function(filter) {
        if (filter === false) {
          post.published = true
        } else {
          post.abusive = true
          post.published = false
        }

        return context.prisma.createPost(post)
      })
    },
  }
}

module.exports = {
  postsResolvers,
}