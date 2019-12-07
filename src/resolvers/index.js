const { fusionAuthResolvers } = require('./fusionAuthResolvers');
const { postsResolvers } = require('./postsResolvers');
const { promptsResolvers } = require('./promptsResolvers');
const { usersResolvers } = require('./usersResolvers');

const resolvers = [fusionAuthResolvers, postsResolvers, promptsResolvers, usersResolvers];

module.exports = {
  resolvers,
};