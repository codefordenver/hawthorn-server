const gql = require('graphql-tag')

const query = gql`
  type Query {
    fusionAuthConfig: FusionAuthConfig!
    login(code: String!): User!
    logout: Boolean!
    moderatablePrompts: [Prompt!]!
    publishedPrompts: [Prompt!]!
  }
`

module.exports = {
  query,
};
