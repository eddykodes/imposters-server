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

io.on('connection', socket => { 
  console.log('new connection established')  
})

server.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`)
})