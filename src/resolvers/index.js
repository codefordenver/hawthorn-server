const { groupsResolvers } = require('./groupsResolvers');
const { moderationResolvers } = require('./moderationResolvers');
const { postsResolvers } = require('./postsResolvers');
const { threadsResolvers } = require('./threadsResolvers');
const { usersResolvers } = require('./usersResolvers');

const resolvers = [
  groupsResolvers,
  moderationResolvers,
  postsResolvers,
  threadsResolvers,
  usersResolvers
];

module.exports = {
  resolvers
};
