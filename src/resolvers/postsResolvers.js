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
      return context.prisma.createPost({
        content: args.content,
        published: true,
        thread: {
          connect: { id: args.threadId }
        },
      })
    },
  }
}

module.exports = {
  postsResolvers,
}