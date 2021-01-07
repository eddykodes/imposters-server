const express = require('express')
const router = express.Router()

const { users } = require('../functions/users')
const { rooms } = require('../functions/rooms')

router.get('/', (req, res) => {
  res.render('index', { users, rooms })
})

module.exports = router