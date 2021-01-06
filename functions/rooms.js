const rooms = []

const createRoom = (user) => {
  const existingRoomIndex = rooms.findIndex(room => room.leader.id === user.id)
  
  if (existingRoomIndex > -1) {
    rooms.splice(existingRoomIndex, 1)
  }

  let str = user.id
  let roomId = str.replace(/_|-/gi, '')

  const newUser = {
    ...user,
    room: roomId
  }

  const room = {
    id: roomId,
    leader: newUser,
    started: false,
    users: [],
  }

  rooms.push(room)
  return { newUser }
}

const confirmRoom = (room) => {
  const roomStr = room.trim()
  const existingRoomIndex = rooms.findIndex(room => room.id === roomStr)
  
  if (existingRoomIndex === -1) 
    return { error: 'Room not found' }
  
  return { valid: true }
}

const addUserToRoom = (user) => {
  const roomIndex = rooms.findIndex(r => r.id === user.room)
  const roomData = rooms[roomIndex]

  roomData.users.push(user)

  return { roomData }
}

const getRoomData = (room) => {
  const roomIndex = rooms.findIndex(r => r.id === room)

  if (roomIndex === -1)
    return { error: 'Room not found' }
  
  const roomData = rooms[roomIndex]

  return { roomData }
}

module.exports = { createRoom, confirmRoom, addUserToRoom, getRoomData }