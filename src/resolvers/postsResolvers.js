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
        title: args.title,
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