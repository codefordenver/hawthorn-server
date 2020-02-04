const gql = require('graphql-tag');

const fusionAuthConfigType = gql`
  type FusionAuthConfig {
    endpoint: String!
    clientId: String!
    redirectUri: String!
    tenantId: String!
  }
`;

module.exports = {
  fusionAuthConfigType
};
