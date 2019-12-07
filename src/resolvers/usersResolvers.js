const usersResolvers = {
  User: {
    // Pull random avatar from an open API
    imageUrl: function(root) {
      return `https://api.adorable.io/avatars/50/${root.id}.png`
    }
  },
}

module.exports = {
  usersResolvers,
}