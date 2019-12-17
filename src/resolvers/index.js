const { groupsResolvers } = require('./groupsResolvers');
const { moderationResolvers } = require('./moderationResolvers');
const { postsResolvers } = require('./postsResolvers');
const { threadsResolvers } = require('./threadsResolvers');

const resolvers = [groupsResolvers, moderationResolvers, postsResolvers, threadsResolvers];

module.exports = {
  resolvers,
};