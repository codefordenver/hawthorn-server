const gql = require('graphql-tag')

const promptType = gql`
  type Prompt {
    id: ID!
    abusive: Boolean!
    author: User
    authorId: String
    createdAt: DateTime!
    posts: [Post!]!
    published: Boolean!
    title: String!
    updatedAt: DateTime!
  }
`

module.exports = {
  promptType,
};
