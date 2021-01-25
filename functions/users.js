const users = []

const createUser = (user, id) => {
  const existingUser = users.find(u => u.socketId === id)

  if (!existingUser) {
    users.push({...user, socketId: id})
  }
}

const getUser = (id) => {
  return users.find(user => user.socketId === id)
}

const removeUser = (user) => {
  const userIndex = users.findIndex(u => u.id === user.id)
  users.splice(userIndex, 1)
}

module.exports = { users, createUser, getUser, removeUser }