const rooms = []

const createRoom = (user) => {
  const str = user.id
  const roomId = str.replace(/_|-/gi, '')

  const newUser = {
    ...user,
    room: roomId
  }

  const room = {
    id: roomId,
    leader: newUser.id,
    started: false,
    gameId: '',
    users: [newUser],
  }

  rooms.push(room)
  
  return rooms.length-1
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
  let roomData

  if (roomIndex === -1) {
    createRoom(user)
    roomData = rooms[rooms.length-1]
  } else {
    roomData = rooms[roomIndex]

    const existingUser = roomData.users.find(u => u.id === user.id)

    if (!existingUser) {
      roomData.users.push(user)
    } else if ( existingUser && existingUser.id !== user.id) {
      return { error: 'There is already someone by that name' }
    }
  }

  return { roomData }
}

const removeUserFromRoom = (user) => {
  const roomIndex = rooms.findIndex(r => r.id === user.room)
  const roomData = rooms[roomIndex]

  if (!roomData)
    return { error: 'no room' }

  const userIndex = roomData.users.findIndex(u => u.id === user.id)

  if (userIndex === -1)
    return { error: 'no user exists'}
    
  roomData.users.splice(userIndex, 1)

  if (roomData.users.length === 0)
    rooms.splice(roomIndex, 1)

  return { users: roomData.users }
}

const getRoomData = (user) => {
  const roomIndex = rooms.findIndex(r => r.id === user.room)

  if (roomIndex === -1)
    return { error: 'Room not found' }
  
  const roomData = rooms[roomIndex]

  const userIndex = roomData.users.findIndex(u => u.id === user.id)
  
  if (userIndex === -1) 
    return { error: 'You are trying to enter the wrong room'}
  
  return { roomData }
}

const setGame = (gameId, roomId) => {
  const roomIndex = rooms.findIndex(r => r.id === roomId)
  const roomData = rooms[roomIndex]
  
  if (gameId === null) {
    roomData.started = false
    roomData.gameId = ''
  } else {
    roomData.started = true
    roomData.gameId = gameId
  }
}

module.exports = { rooms, createRoom, confirmRoom, addUserToRoom, removeUserFromRoom, getRoomData, setGame }