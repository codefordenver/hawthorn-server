const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    publishedPosts(root, args, context) {
      return context.prisma.posts({ where: { published: true } })
    },
    post(root, args, context) {
      return context.prisma.post({ id: args.postId })
    },
    postsByUser(root, args, context) {
      return context.prisma
        .user({
          id: args.userId,
        })
        .posts()
    },
    publishedPrompts(root, args, context) {
      return context.prisma.prompts({ where: { published: true } })
    },
  },
  Mutation: {
    createDraftPost(root, args, context) {
      return context.prisma.createPost({
        title: args.title,
        author: {
          connect: { id: args.userId },
        },
        prompt: {
          connect: { id: args.promptId }
        },
      })
    },
    publishPost(root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: { published: true },
      })
    },
    createUser(root, args, context) {
      return context.prisma.createUser({ name: args.name })
    },
    createDraftPrompt(root, args, context) {
      return context.prisma.createPrompt({
        title: args.title,
        author: {
          connect: { id: args.userId },
        },
      })
    },
    publishPrompt(root, args, context) {
      return context.prisma.updatePrompt({
        where: { id: args.promptId },
        data: { published: true },
      })
    },
  },
  User: {
    posts(root, args, context) {
      return context.prisma
        .user({
          id: root.id,
        })
        .posts()
    },
  },
  Post: {
    author(root, args, context) {
      return context.prisma
        .post({
          id: root.id,
        })
        .author()
    },
    prompt(root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .prompt()
    }
  },
  Prompt: {
    author(root, args, context) {
      return context.prisma
        .prompt({
          id: root.id,
        })
        .author()
    },
    posts(root, args, context) {
      return context.prisma
        .prompt({
          id: root.id,
        })
        .posts()
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
