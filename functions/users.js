const users = []

const createUser = (user) => {
  const existingUser = users.find(u => u.id === user.id)

  if (!existingUser) {
    users.push(user)
  }
}

const getUser = (id) => {
  return users.find(user => user.id === id)
}

module.exports = { users, createUser, getUser }