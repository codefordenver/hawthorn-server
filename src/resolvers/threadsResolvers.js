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
      return context.prisma.createThread({
        group: {
          connect: { id: args.groupId }
        },
        published: true,
        title: args.title,
      })
    },
  }
}

module.exports = {
  threadsResolvers,
}