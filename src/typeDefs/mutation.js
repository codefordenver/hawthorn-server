const gql = require('graphql-tag')

const mutation = gql`
type Mutation {
  createGroup(name: String!, description: String!): Group!
  createPost(content: String!, threadId: ID!): Post!
  createThread(title: String!, groupId: ID!): Thread!
}
`

module.exports = {
  mutation,
};
