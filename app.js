const express = require('express')
const {typeDefs, resolvers} = require('./graphql')
const { ApolloServer, gql } = require('apollo-server-express');
const app = express()
const port = 8888

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
app.listen(port, () => console.log(`Hawthorn server listening on port ${port}!`))