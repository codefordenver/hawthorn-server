const gql = require('graphql-tag')

const dateTimeScalar = gql`
  scalar DateTime
`

module.exports = {
  dateTimeScalar,
};