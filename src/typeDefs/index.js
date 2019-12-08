const { query } = require('./query')
const { mutation } = require('./mutation')
const { postType, threadType } = require('./types')

const typeDefs = [query, mutation, postType, threadType]

module.exports = {
  typeDefs,
}
