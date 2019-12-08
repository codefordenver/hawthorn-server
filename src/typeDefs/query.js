const gql = require('graphql-tag')

const query = gql`
  type Query {
    publishedThreads: [Thread!]!
    groups: [Group!]!
  }
`

module.exports = {
  query,
};
