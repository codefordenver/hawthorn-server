const gql = require('graphql-tag')

const threadType = gql`
  type Thread {
    id: ID!
    abusive: Boolean!
    createdAt: DateTime!
    posts: [Post!]!
    published: Boolean!
    title: String!
    updatedAt: DateTime!
  }
`

module.exports = {
  threadType,
}
