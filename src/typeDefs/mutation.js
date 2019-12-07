const gql = require('graphql-tag')

const mutation = gql`
type Mutation {
  createPost(title: String!, promptId: ID!): Post!
  flagPostForAbuse(postId: ID!): Post!
  publishPost(postId: ID!): Post!
  createPrompt(title: String!): Prompt!
  flagPromptForAbuse(promptId: ID!): Prompt!
  publishPrompt(promptId: ID!): Prompt!
}
`

module.exports = {
  mutation,
};
