const app = require('express')()
const server = require('http').createServer(app)
const options = { /* ... */ }
const io = require('socket.io')(server, options)

const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('Server is running')
})

io.on('connection', socket => { 
  console.log('new connection established')  
})

server.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`)
})