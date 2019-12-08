const groupsResolvers = {
  Group: {
    threads(root, args, context) {
      return context.prisma
        .group({
          id: root.id
        })
        .threads({
          orderBy: "createdAt_DESC",
          where: {
            abusive: false,
            published: true
          }
        })
    }
  },
  Query: {
    groups(root, args, context) {
      return context.prisma.groups({
        orderBy: "createdAt_DESC",
      })
    },
  },
  Mutation: {
    createGroup(root, args, context) {
      return context.prisma.createGroup({
        name: args.name,
        description: args.description,
      })
    },
  }
}

module.exports = {
  groupsResolvers,
}