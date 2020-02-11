const gql = require('graphql-tag')

const mutation = gql`
type Mutation {
  createPrivateGroup(name: String!, description: String!): Group!
  acceptGroupInvite(groupId: ID!): Group!
  createPost(content: String!, threadId: ID!): Post!
  createThread(title: String!, groupId: ID!): Thread!
  inviteUserToGroupByEmail(groupId: ID!, email: String!): Group!
  register(email: String!, password: String!, username: String!): String
}
`

module.exports = {
  mutation,
};
