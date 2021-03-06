const gql = require('graphql-tag')

const userType = gql`
  type User {
    id: String!
    email: String
    firstName: String
    groups: [Group!]!
    lastName: String
    unacceptedGroupInvitations: [Group!]!
    imageUrl: String!
    username: String!
  }
`

module.exports = {
  userType,
}