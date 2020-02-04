const { query } = require('./query');
const { mutation } = require('./mutation');
const {
  fusionAuthConfigType,
  groupType,
  moderationType,
  postType,
  threadType,
  userType
} = require('./types');

const typeDefs = [
  query,
  mutation,
  fusionAuthConfigType,
  groupType,
  moderationType,
  postType,
  threadType,
  userType
];

module.exports = {
  typeDefs
};
