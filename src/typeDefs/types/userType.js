const gql = require('graphql-tag')

const userType = gql`
  type User {
    id: String!
    imageUrl: String
  }
`

module.exports = {
  userType,
};