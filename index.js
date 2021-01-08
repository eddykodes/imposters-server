const app = require('express')()
const server = require('http').createServer(app)
const options = { 
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["http://localhost:3000"],
    credentials: true
  }
}
const io = require('socket.io')(server, options)
const ejs = require('ejs')
const cors = require('cors')

const PORT = process.env.PORT || 8000

const router = require('./routes')
app.use(router)
app.set('view engine', 'ejs')
app.use(cors())

const { createUser } = require('./functions/users')
const { createRoom, confirmRoom, addUserToRoom, getRoomData, setGame } = require('./functions/rooms')
const { createGame, updateAnswers } = require('./functions/games')

io.on('connection', socket => { 
  console.log('new connection established')
  
  socket.on('createRoom', (user, callback) => {
    const { error, newUser } = createRoom(user)

    if (error)
      return callback({ error })

    console.log(newUser.room, 'created')
    callback({ newUser })
  })

  socket.on('confirmRoom', (room, callback) => {
    const { error, valid } = confirmRoom(room)

    if (error)
      return callback({ error })
    
    callback({ valid })
  })

  socket.on('joinRoom', (user, callback) => {
    const { error, room } = createUser(user)

    if (error) 
      return callback({ error })
    
    socket.join(room)
    const { users } = addUserToRoom(user)
    io.to(room).emit('userJoin', { users })

    console.log(user.name, 'joined', room)
    callback({ room })
  })

  socket.on('getRoomData', (user, callback) => {
    const { error, roomData } = getRoomData(user)

    if (error)
      return callback({ error })
    
    console.log('roomData retrieved by', user.name)
    callback({ roomData })
  })

  socket.on('startGame', (user) => {
    const { roomData } = getRoomData(user)
    const { gameData } = createGame(roomData.users)
    setGame(gameData.id, roomData.id)

    console.log('gameData sent', gameData)
    io.to(roomData.id).emit('gameData', { gameData })
  })

  socket.on('sendAnswer', (gameId, user, answer, callback) => {
    const { gameData } = updateAnswers(gameId, user, answer)
    console.log('gameData sent', { gameData })
    io.to(user.room).emit('gameData', { gameData })
    callback()
  })
})

server.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`)
})