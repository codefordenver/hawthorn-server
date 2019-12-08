const gql = require('graphql-tag')

const groupType = gql`
  type Group {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    description: String!
    name: String!
    threads: [Thread!]!
  }
`

module.exports = {
  groupType,
}
