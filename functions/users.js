const users = []

const createUser = (user, id) => {
  const existingUser = users.find(u => u.socketId === id)

  if (!existingUser) {
    users.push(user)
  }
}

const getUser = (id) => {
  return users.find(user => user.socketId === id)
}

module.exports = { users, createUser, getUser }