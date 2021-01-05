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

const { addUser } = require('./functions/users')

io.on('connection', socket => { 
  console.log('new connection established')
  
  socket.on('joinRoom', (user, callback) => {
    const { error, room } = addUser(user)

    if (error) {
      console.log('error', error)
      return callback({ error })
    }

    socket.join(room)
    console.log('user joined room', room)
    
    callback({ room })
  })
})

server.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`)
})