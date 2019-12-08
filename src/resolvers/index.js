const { postsResolvers } = require('./postsResolvers');
const { threadsResolvers } = require('./threadsResolvers');

const resolvers = [postsResolvers, threadsResolvers];

module.exports = {
  resolvers,
};