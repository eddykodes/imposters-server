const users = []

const createUser = (user) => {
  const existingUser = users.find(u => u.name === user.name && u.room === user.room)

  if (existingUser) {
    if (existingUser.id !== user.id)
      return { error: 'There is already someone by that name' }
  } else {
    users.push(user)
  }

  return { room: user.room }
}

const getUser = (id) => {
  return users.find(user => user.id === id)
}

module.exports = { users, createUser, getUser }