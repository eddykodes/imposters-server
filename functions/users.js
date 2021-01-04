const users = []

const addUser = (user) => {
  const existingUser = users.find(u => u.name === user.name)

  if (existingUser) {
    return { error: 'There is already someone by that name' }
  }

  users.push(user)

  return { user }
}

module.exports = { addUser }