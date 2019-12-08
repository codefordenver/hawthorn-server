const { query } = require('./query')
const { mutation } = require('./mutation')
const { groupType, postType, threadType } = require('./types')

const typeDefs = [query, mutation, groupType, postType, threadType]

module.exports = {
  typeDefs,
}
