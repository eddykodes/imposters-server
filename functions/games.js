
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
    id,
    rounds: users.length,
    target: targets[game.round-1],
    question: questions[game.round-1],
    waitingOn: game.users,
    round,
    phase
  }

  return { gameData }
}

const getGame = (gameId) => {
  const gameIndex = games.findIndex(game => game.id === gameId)
  const game = games[gameIndex]

  return game
}

const nextPhase = (gameId) => {
  const game = getGame(gameId)

  if (game.phase === 4 && game.round !== game.rounds.length) {
    game.phase = 1
    game.round = game.round + 1
  } else {
    game.phase = game.phase + 1
  }
}

const updateAnswers = (gameId, user, answer) => {
  const game = getGame(gameId)
  const roundAnswers = game.rounds[game.round-1].answers

  const answerEntry = {
    id: roundAnswers.length,
    user,
    answer,
  }
  roundAnswers.push(answerEntry)
  
  const answerData = roundAnswers.map(answer => answer.answer)

  let waitingOn
  if (roundAnswers.length === game.users.length) {
    waitingOn = game.users
    nextPhase(gameId)
  } else {
    waitingOn = game.users.filter(user => {
      let found = false
      roundAnswers.forEach(answer => {
        if (answer.user.name === user.name)
          return found = true
      })
      return !found
    })
  }
  
  const gameData = {
    waitingOn,
    answers: answerData,
    phase: game.phase,
    round: game.round,
  }

  return { gameData }  
}

module.exports = { games, createGame, updateAnswers }