const gql = require('graphql-tag')

const groupType = gql`
  type Group {
    id: ID!

    description: String!
    name: String!
    isPrivate: Boolean!
    threads: [Thread!]!
  }
`

module.exports = {
  groupType,
}
