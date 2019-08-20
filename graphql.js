const prompt = require('./actions/prompt')
const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
    type Query {
        prompt: String
    }
    type Mutation {
        prompt: String
    }
`
exports.resolvers= {
    Query: {
        prompt: () => prompt.retrieve,
    },
    Mutation: {
        prompt: () => prompt.create,
    }
}
