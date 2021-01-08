const express = require('express')
const router = express.Router()

const { users } = require('../functions/users')
const { rooms } = require('../functions/rooms')
const { games } = require('../functions/games')

router.get('/', (req, res) => {
  res.render('index', { users, rooms, games })
})

module.exports = router