const { AuthenticationError, ForbiddenError } = require('apollo-server')

const roles = {
  moderator: 'moderator'
}

// =======================================
// Role-based authorization
//
// throws an AuthenticationError when the user must be logged in to access the requested resource
//    and on an expired session
//
// throws a ForbiddenError when the user is not assigned the role required to access the requested resource
// =======================================
const validateRoleAssignment = function(decodedJWT, role) {
  if (decodedJWT === null) {
    throw new AuthenticationError('You must be logged in for that');
  }
  if (!decodedJWT.active) {
    throw new AuthenticationError('Your session expired, please log back in');
  }
  if (decodedJWT.roles.indexOf(role) === -1) {
    throw new ForbiddenError('You cannot see that')
  }
}

module.exports = {
  roles,
  validateRoleAssignment,
}