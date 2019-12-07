const { query } = require('./query')
const { mutation } = require('./mutation')
const { fusionAuthConfigType, postType, promptType, userType } = require('./types')

const typeDefs = [query, mutation, fusionAuthConfigType, postType, promptType, userType]

module.exports = {
  typeDefs,
};
