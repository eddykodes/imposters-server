const users = []

const createUser = (user) => {
  const existingUser = users.find(u => u.name === user.name && u.room === user.room)

  if (existingUser) {
    if (existingUser.id === user.id || existingUser.id === user.prevId)
      return { room: user.room }

    return { error: 'There is already someone by that name' }
  }

  users.push(user)
  return { room: user.room }
}

module.exports = { users, createUser }