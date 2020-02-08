const gql = require('graphql-tag')

const query = gql`
  type Query {
    account(userId: String!): User
    fusionAuthConfig: FusionAuthConfig!
    group(id: ID!): Group
    login(code: String!): String
    logout: Boolean!
    thread(id: ID!): Thread
  }
`

module.exports = {
  query,
};
