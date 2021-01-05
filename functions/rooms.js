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
  }

  rooms.push(room)
  return { newUser }
}

module.exports = { createRoom }