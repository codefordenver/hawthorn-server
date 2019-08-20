const promptService = require("../services/prompt")

// Handle middleware and business logic in the actions
exports.retrieve = promptService.get

exports.create = promptService.create 