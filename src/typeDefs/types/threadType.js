const gql = require('graphql-tag')

const threadType = gql`
  type Thread {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    abusive: Boolean!
    group: Group!
    posts: [Post!]!
    published: Boolean!
    title: String!
  }
`

module.exports = {
  threadType,
}
