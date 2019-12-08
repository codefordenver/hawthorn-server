const gql = require('graphql-tag')

const postType = gql`
  scalar DateTime
  type Post {
    id: ID!
    abusive: Boolean!
    createdAt: DateTime!
    thread: Thread!
    published: Boolean!
    content: String!
    updatedAt: DateTime!
  }
`

module.exports = {
  postType,
}