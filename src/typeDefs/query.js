const gql = require('graphql-tag')

const query = gql`
  type Query {
    group(id: ID!): Group
    groups: [Group!]!
    thread(id: ID!): Thread
  }
`

module.exports = {
  query,
};
