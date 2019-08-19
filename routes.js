const prompt = require('./action/prompt.js')

const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log(Date.now() + ': ' + req.method + ' ' + req.path)
  next()
})

// prompt
router.get('/prompt', prompt.get)

module.exports = router