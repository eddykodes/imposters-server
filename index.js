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
const cors = require('cors')

const PORT = process.env.PORT || 8000

const router = require('./routes')
app.use(router)
app.use(cors())

const { createUser } = require('./functions/users')
const { createRoom, confirmRoom, addUserToRoom, getRoomData } = require('./functions/rooms')

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
    addUserToRoom(user)
    
    console.log(user.name, 'joined', room)
    callback({ room })
  })

  socket.on('getRoomData', (room, callback) => {
    const { error, roomData } = getRoomData(room)

    if (error)
      return callback({ error })
    
    const user = roomData.users.find(user => user.id === socket.id)
    if (!user) 
      return callback({ error: 'You are trying to enter the wrong room'})
      
    console.log('on getRoomData', roomData)
    callback({ roomData })
  })
})

server.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`)
})