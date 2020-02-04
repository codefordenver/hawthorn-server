const gql = require('graphql-tag');

const moderationType = gql`
  enum ModerationStatus {
    TRIGGERED_CONTENT_FILTER
    APPROVED_BY_MODERATOR
  }

  type Moderation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    status: ModerationStatus!
  }
`;

module.exports = {
  moderationType
};
