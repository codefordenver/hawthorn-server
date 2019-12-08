const gql = require('graphql-tag')

const mutation = gql`
type Mutation {
  createPost(title: String!, threadId: ID!): Post!
  createThread(title: String!): Thread!
}
`

module.exports = {
  mutation,
};
