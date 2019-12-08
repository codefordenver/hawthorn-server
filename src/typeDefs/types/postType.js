const gql = require('graphql-tag')

const postType = gql`
  scalar DateTime
  type Post {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    abusive: Boolean!
    content: String!
    published: Boolean!
    thread: Thread!
  }
`

module.exports = {
  postType,
}