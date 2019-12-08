const gql = require('graphql-tag')

const mutation = gql`
type Mutation {
  createPost(content: String!, threadId: ID!): Post!
  createThread(title: String!): Thread!
}
`

module.exports = {
  mutation,
};
