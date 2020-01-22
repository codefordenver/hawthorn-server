const gql = require('graphql-tag')

const query = gql`
  type Query {
    fusionAuthConfig: FusionAuthConfig!
    group(id: ID!): Group
    groups: [Group!]!
    login(code: String!): User!
    logout: Boolean!
    thread(id: ID!): Thread
  }
`

module.exports = {
  query,
};
