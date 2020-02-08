module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.23.0-test.3). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateModeration {
  count: Int!
}

type AggregatePost {
  count: Int!
}

type AggregateThread {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Long

type Moderation {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  status: ModerationStatus!
}

type ModerationConnection {
  pageInfo: PageInfo!
  edges: [ModerationEdge]!
  aggregate: AggregateModeration!
}

input ModerationCreateInput {
  id: ID
  status: ModerationStatus!
}

input ModerationCreateOneInput {
  create: ModerationCreateInput
  connect: ModerationWhereUniqueInput
}

type ModerationEdge {
  node: Moderation!
  cursor: String!
}

enum ModerationOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  status_ASC
  status_DESC
}

type ModerationPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  status: ModerationStatus!
}

enum ModerationStatus {
  TRIGGERED_CONTENT_FILTER
  APPROVED_BY_MODERATOR
}

type ModerationSubscriptionPayload {
  mutation: MutationType!
  node: Moderation
  updatedFields: [String!]
  previousValues: ModerationPreviousValues
}

input ModerationSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ModerationWhereInput
  AND: [ModerationSubscriptionWhereInput!]
  OR: [ModerationSubscriptionWhereInput!]
  NOT: [ModerationSubscriptionWhereInput!]
}

input ModerationUpdateDataInput {
  status: ModerationStatus
}

input ModerationUpdateInput {
  status: ModerationStatus
}

input ModerationUpdateManyMutationInput {
  status: ModerationStatus
}

input ModerationUpdateOneInput {
  create: ModerationCreateInput
  update: ModerationUpdateDataInput
  upsert: ModerationUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: ModerationWhereUniqueInput
}

input ModerationUpsertNestedInput {
  update: ModerationUpdateDataInput!
  create: ModerationCreateInput!
}

input ModerationWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  status: ModerationStatus
  status_not: ModerationStatus
  status_in: [ModerationStatus!]
  status_not_in: [ModerationStatus!]
  AND: [ModerationWhereInput!]
  OR: [ModerationWhereInput!]
  NOT: [ModerationWhereInput!]
}

input ModerationWhereUniqueInput {
  id: ID
}

type Mutation {
  createModeration(data: ModerationCreateInput!): Moderation!
  updateModeration(data: ModerationUpdateInput!, where: ModerationWhereUniqueInput!): Moderation
  updateManyModerations(data: ModerationUpdateManyMutationInput!, where: ModerationWhereInput): BatchPayload!
  upsertModeration(where: ModerationWhereUniqueInput!, create: ModerationCreateInput!, update: ModerationUpdateInput!): Moderation!
  deleteModeration(where: ModerationWhereUniqueInput!): Moderation
  deleteManyModerations(where: ModerationWhereInput): BatchPayload!
  createPost(data: PostCreateInput!): Post!
  updatePost(data: PostUpdateInput!, where: PostWhereUniqueInput!): Post
  updateManyPosts(data: PostUpdateManyMutationInput!, where: PostWhereInput): BatchPayload!
  upsertPost(where: PostWhereUniqueInput!, create: PostCreateInput!, update: PostUpdateInput!): Post!
  deletePost(where: PostWhereUniqueInput!): Post
  deleteManyPosts(where: PostWhereInput): BatchPayload!
  createThread(data: ThreadCreateInput!): Thread!
  updateThread(data: ThreadUpdateInput!, where: ThreadWhereUniqueInput!): Thread
  updateManyThreads(data: ThreadUpdateManyMutationInput!, where: ThreadWhereInput): BatchPayload!
  upsertThread(where: ThreadWhereUniqueInput!, create: ThreadCreateInput!, update: ThreadUpdateInput!): Thread!
  deleteThread(where: ThreadWhereUniqueInput!): Thread
  deleteManyThreads(where: ThreadWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Post {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  content: String!
  moderation: Moderation
  thread: Thread
}

type PostConnection {
  pageInfo: PageInfo!
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  id: ID
  content: String!
  moderation: ModerationCreateOneInput
  thread: ThreadCreateOneWithoutPostsInput
}

input PostCreateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  connect: [PostWhereUniqueInput!]
}

input PostCreateWithoutThreadInput {
  id: ID
  content: String!
  moderation: ModerationCreateOneInput
}

type PostEdge {
  node: Post!
  cursor: String!
}

enum PostOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  content_ASC
  content_DESC
}

type PostPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  content: String!
}

input PostScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  AND: [PostScalarWhereInput!]
  OR: [PostScalarWhereInput!]
  NOT: [PostScalarWhereInput!]
}

type PostSubscriptionPayload {
  mutation: MutationType!
  node: Post
  updatedFields: [String!]
  previousValues: PostPreviousValues
}

input PostSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PostWhereInput
  AND: [PostSubscriptionWhereInput!]
  OR: [PostSubscriptionWhereInput!]
  NOT: [PostSubscriptionWhereInput!]
}

input PostUpdateInput {
  content: String
  moderation: ModerationUpdateOneInput
  thread: ThreadUpdateOneWithoutPostsInput
}

input PostUpdateManyDataInput {
  content: String
}

input PostUpdateManyMutationInput {
  content: String
}

input PostUpdateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  delete: [PostWhereUniqueInput!]
  connect: [PostWhereUniqueInput!]
  set: [PostWhereUniqueInput!]
  disconnect: [PostWhereUniqueInput!]
  update: [PostUpdateWithWhereUniqueWithoutThreadInput!]
  upsert: [PostUpsertWithWhereUniqueWithoutThreadInput!]
  deleteMany: [PostScalarWhereInput!]
  updateMany: [PostUpdateManyWithWhereNestedInput!]
}

input PostUpdateManyWithWhereNestedInput {
  where: PostScalarWhereInput!
  data: PostUpdateManyDataInput!
}

input PostUpdateWithoutThreadDataInput {
  content: String
  moderation: ModerationUpdateOneInput
}

input PostUpdateWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  data: PostUpdateWithoutThreadDataInput!
}

input PostUpsertWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  update: PostUpdateWithoutThreadDataInput!
  create: PostCreateWithoutThreadInput!
}

input PostWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  moderation: ModerationWhereInput
  thread: ThreadWhereInput
  AND: [PostWhereInput!]
  OR: [PostWhereInput!]
  NOT: [PostWhereInput!]
}

input PostWhereUniqueInput {
  id: ID
}

type Query {
  moderation(where: ModerationWhereUniqueInput!): Moderation
  moderations(where: ModerationWhereInput, orderBy: ModerationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Moderation]!
  moderationsConnection(where: ModerationWhereInput, orderBy: ModerationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ModerationConnection!
  post(where: PostWhereUniqueInput!): Post
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]!
  postsConnection(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PostConnection!
  thread(where: ThreadWhereUniqueInput!): Thread
  threads(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Thread]!
  threadsConnection(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ThreadConnection!
  node(id: ID!): Node
}

type Subscription {
  moderation(where: ModerationSubscriptionWhereInput): ModerationSubscriptionPayload
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
  thread(where: ThreadSubscriptionWhereInput): ThreadSubscriptionPayload
}

type Thread {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  groupId: String!
  moderation: Moderation
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post!]
  title: String!
}

type ThreadConnection {
  pageInfo: PageInfo!
  edges: [ThreadEdge]!
  aggregate: AggregateThread!
}

input ThreadCreateInput {
  id: ID
  groupId: String!
  moderation: ModerationCreateOneInput
  posts: PostCreateManyWithoutThreadInput
  title: String!
}

input ThreadCreateOneWithoutPostsInput {
  create: ThreadCreateWithoutPostsInput
  connect: ThreadWhereUniqueInput
}

input ThreadCreateWithoutPostsInput {
  id: ID
  groupId: String!
  moderation: ModerationCreateOneInput
  title: String!
}

type ThreadEdge {
  node: Thread!
  cursor: String!
}

enum ThreadOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  groupId_ASC
  groupId_DESC
  title_ASC
  title_DESC
}

type ThreadPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  groupId: String!
  title: String!
}

type ThreadSubscriptionPayload {
  mutation: MutationType!
  node: Thread
  updatedFields: [String!]
  previousValues: ThreadPreviousValues
}

input ThreadSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ThreadWhereInput
  AND: [ThreadSubscriptionWhereInput!]
  OR: [ThreadSubscriptionWhereInput!]
  NOT: [ThreadSubscriptionWhereInput!]
}

input ThreadUpdateInput {
  groupId: String
  moderation: ModerationUpdateOneInput
  posts: PostUpdateManyWithoutThreadInput
  title: String
}

input ThreadUpdateManyMutationInput {
  groupId: String
  title: String
}

input ThreadUpdateOneWithoutPostsInput {
  create: ThreadCreateWithoutPostsInput
  update: ThreadUpdateWithoutPostsDataInput
  upsert: ThreadUpsertWithoutPostsInput
  delete: Boolean
  disconnect: Boolean
  connect: ThreadWhereUniqueInput
}

input ThreadUpdateWithoutPostsDataInput {
  groupId: String
  moderation: ModerationUpdateOneInput
  title: String
}

input ThreadUpsertWithoutPostsInput {
  update: ThreadUpdateWithoutPostsDataInput!
  create: ThreadCreateWithoutPostsInput!
}

input ThreadWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  groupId: String
  groupId_not: String
  groupId_in: [String!]
  groupId_not_in: [String!]
  groupId_lt: String
  groupId_lte: String
  groupId_gt: String
  groupId_gte: String
  groupId_contains: String
  groupId_not_contains: String
  groupId_starts_with: String
  groupId_not_starts_with: String
  groupId_ends_with: String
  groupId_not_ends_with: String
  moderation: ModerationWhereInput
  posts_every: PostWhereInput
  posts_some: PostWhereInput
  posts_none: PostWhereInput
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  AND: [ThreadWhereInput!]
  OR: [ThreadWhereInput!]
  NOT: [ThreadWhereInput!]
}

input ThreadWhereUniqueInput {
  id: ID
}
`
      }
    