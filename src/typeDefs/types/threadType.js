const gql = require('graphql-tag')

const threadType = gql`
  type Thread {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    group: Group!
    posts: [Post!]!
    moderation: Moderation
    title: String!
  }
`

module.exports = {
  threadType,
}
