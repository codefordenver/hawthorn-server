
const routes = require('./routes')
const express = require('express')
const app = express()
const port = 3000

app.use('/api', routes)

// -----------------
// Routing
// -----------------
// var router = express.Router()

// TODO - install router specfic middleware with router.use()

// Home
// router.get('/', (req, res) => res.set('Hello hi'))

// Conversation Prompts
// app.get('/prompt', (req, res) => res.json('{"msg": "Hello prompt!"}'))

app.listen(port, () => console.log(`Hawthorn server listening on port ${port}!`))
