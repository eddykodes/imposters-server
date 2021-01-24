const app = require('express')()
const server = require('http').createServer(app)
const options = { 
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
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

const { confirmRoom, addUserToRoom, removeUserFromRoom, getRoomData, setGame } = require('./functions/rooms')
const { createGame, nextPhase, updateAnswers, updateVotes, getGameData } = require('./functions/games')

io.on('connection', socket => { 
  console.log('new connection established', socket.id)

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
    // const user = getUser(socket.id)

    // if (user && user.room) {
    //   const { users } = removeUserFromRoom(user)
    //   io.to(user.room).emit('usersUpdate', { users })
    // }
  })

  socket.on('confirmRoom', (room, callback) => {
    const { error, valid } = confirmRoom(room)

    if (error)
      return callback({ error })
    
    callback({ valid })
  })

  socket.on('joinRoom', (user, callback) => {
    const { error, roomData } = addUserToRoom(user)

    if (error) 
      return callback({ error })
    
    socket.join(roomData.id)
    io.to(roomData.id).emit('usersUpdate', { users: roomData.users })
    console.log(user.name, 'joined', roomData.id)
    callback({ room: roomData.id })
  })

  socket.on('leaveRoom', (user, callback) => {
    const { users } = removeUserFromRoom(user)
    socket.leave(user.room)
    io.to(user.room).emit('usersUpdate', { users })
    callback()
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

  socket.on('sendAnswer', (gameId, user, answer) => {
    const { gameData } = updateAnswers(gameId, user, answer)
    console.log('gameData sent', { gameData })
    io.to(user.room).emit('gameData', { gameData })
  })

  socket.on('sendVote', (gameId, user, vote) => {
    const { gameData } = updateVotes(gameId, user, vote)
    console.log('gameData sent', { gameData })
    io.to(user.room).emit('gameData', { gameData })

    if (gameData.waitingOn.length === 0) {
      setTimeout(() => {
        nextPhase(gameId)
        const { gameData } = getGameData(gameId)
        console.log('getGameData', { gameData })
        io.to(user.room).emit('gameData', { gameData })

        setTimeout(() => {
          nextPhase(gameId)
          const { gameData } = getGameData(gameId)
          console.log('getGameData', { gameData })
          io.to(user.room).emit('gameData', { gameData })

          if (gameData.phase === 5) {
            setGame(null, user.room)
            removeUserFromRoom(user)
            socket.leave(user.room)
          }
        }, 5000)
      }, 5000)
    }
  })
})

server.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`)
})