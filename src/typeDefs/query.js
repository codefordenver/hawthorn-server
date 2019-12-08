const gql = require('graphql-tag')

const query = gql`
  type Query {
    publishedThreads: [Thread!]!
  }
`

module.exports = {
  query,
};
