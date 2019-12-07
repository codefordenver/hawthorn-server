const { roles, validateRoleAssignment } = require('../services/authorization')

const postsResolvers = {
  Post: {
    prompt(root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .prompt()
    }
  },
  Mutation: {
    createPost(root, args, context) {
      return context.prisma.createPost({
        title: args.title,
        published: false,
        prompt: {
          connect: { id: args.promptId }
        },
      })
    },
    flagPostForAbuse(root, args, context) {
      validateRoleAssignment(context.request.decodedJWT, roles.moderator)
      return context.prisma.updatePost({
        data: {
          abusive: true
        },
        where: { id: args.postId }
      })
    },
    publishPost(root, args, context) {
      validateRoleAssignment(context.request.decodedJWT, roles.moderator)
      return context.prisma.updatePost({
        data: {
          published: true
        },
        where: { id: args.postId }
      })
    },
  }
}

module.exports = {
  postsResolvers,
}