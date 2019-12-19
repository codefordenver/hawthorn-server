const { query } = require('./query')
const { mutation } = require('./mutation')
const { groupType, moderationType, postType, threadType } = require('./types')

const typeDefs = [query, mutation, groupType, moderationType, postType, threadType]

module.exports = {
  typeDefs,
}
