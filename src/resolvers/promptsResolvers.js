const { roles, validateRoleAssignment } = require('../services/authorization')

const promptsResolvers = {
  Prompt: {
    author(root, args, context){
      return getUser(root.authorId)
    },
    posts(root, args, context) {
      return context.prisma
        .prompt({
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
    publishedPrompts(root, args, context) {
      return context.prisma.prompts({
        orderBy: "createdAt_DESC",
        where: {
          abusive: false,
          published: true
        }
      })
    },
    moderatablePrompts(root, args, context) {
      validateRoleAssignment(context.request.decodedJWT, roles.moderator)
      return context.prisma.prompts({
        orderBy: "createdAt_DESC",
        where: {
          abusive: false,
          published: false
        }
      })
    }
  },
  Mutation: {
    createPrompt(root, args, context) {
      return context.prisma.createPrompt({
        title: args.title,
        // authorId may be null
        authorId: context.request.decodedJWT.sub,
        published: false,
      })
    },
    flagPromptForAbuse(root, args, context) {
      validateRoleAssignment(context.request.decodedJWT, roles.moderator)
      return context.prisma.updatePrompt({
        data: {
          abusive: true
        },
        where: { id: args.promptId }
      })
    },
    publishPrompt(root, args, context) {
      validateRoleAssignment(context.request.decodedJWT, roles.moderator)
      return context.prisma.updatePrompt({
        data: {
          published: true
        },
        where: { id: args.promptId }
      })
    },
  }
}

module.exports = {
  promptsResolvers,
}