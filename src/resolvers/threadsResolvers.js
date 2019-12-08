const threadsResolvers = {
  Thread: {
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
    publishedThreads(root, args, context) {
      return context.prisma.threads({
        orderBy: "createdAt_DESC",
        where: {
          abusive: false,
          published: true
        }
      })
    },
  },
  Mutation: {
    createThread(root, args, context) {
      return context.prisma.createThread({
        title: args.title,
        published: true,
      })
    },
  }
}

module.exports = {
  threadsResolvers,
}