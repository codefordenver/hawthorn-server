const { groupsResolvers } = require('./groupsResolvers');
const { postsResolvers } = require('./postsResolvers');
const { threadsResolvers } = require('./threadsResolvers');

const resolvers = [groupsResolvers, postsResolvers, threadsResolvers];

module.exports = {
  resolvers,
};