
const { v4: uuidv4} = require('uuid')
const { shuffle } = require('../utils/helper')
const questionBank = require('../utils/questionBank')
const games = []

const createGame = (users) => {
  const id = uuidv4()
  const rounds = []
  const targets = shuffle(users)
  const questions = shuffle(questionBank).slice(0, users.length)
  let round = 1
  let phase = 1

  users.forEach((user, i) => {
    let roundEntry = { 
      question: questions[i],
      target: targets[i],
      answers: [],
      votes: []
    }
    user.score = 0
    rounds.push(roundEntry)
  })

  const game = { 
    id,
    users, 
    rounds,
    round,
    phase,
  }
  
  games.push(game)
  
  const gameData = {
    rounds: users.length,
    target: targets[game.round-1],
    question: questions[game.round-1],
    waitingOn: game.users,
    round,
    phase
  }

  return { id, gameData }
}

module.exports = { games, createGame }