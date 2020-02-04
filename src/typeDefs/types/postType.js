const gql = require('graphql-tag');

const postType = gql`
  scalar DateTime
  type Post {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    content: String!
    moderation: Moderation
    thread: Thread!
  }
`;

module.exports = {
  postType
};
