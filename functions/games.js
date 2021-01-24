
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
      waitingOn: users.map(u => ({...u})),
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
    waitingOn: users,
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

const updateWaitingOn = (gameId, userId, votesData) => {
  const game = getGame(gameId)
  const roundWaitingOn = game.rounds[game.round-1].waitingOn
  const index = roundWaitingOn.findIndex(u => u.id === userId)
  roundWaitingOn.splice(index, 1)

  if (roundWaitingOn.length === 0) {
    if (game.phase === 1) {
      const resetUsers = game.users.map(user => ({...user}))
      roundWaitingOn.push.apply(roundWaitingOn, resetUsers)
    } else {
      calculateScores(game, votesData)
    }
    nextPhase(game.id)
  }
}

const updateAnswers = (gameId, user, answer) => {
  const game = getGame(gameId)
  const roundData = game.rounds[game.round-1]
  const roundAnswers = roundData.answers

  const answerEntry = {
    id: roundAnswers.length,
    user,
    answer,
  }
  roundAnswers.push(answerEntry)
  
  const answersData = roundAnswers.map(answer => answer.answer)

  updateWaitingOn(gameId, user.id)
  
  const gameData = {
    waitingOn: roundData.waitingOn,
    answers: answersData,
    phase: game.phase,
    round: game.round,
  }

  return { gameData }  
}

function updateVotes(gameId, user, vote) {
  const game = getGame(gameId)
  const roundData = game.rounds[game.round-1]
  const roundVotes = roundData.votes
  const roundAnswers = roundData.answers

  const voteEntry = {
    user,
    vote,
  }
  roundVotes.push(voteEntry)

  const votesData = []

  roundAnswers.forEach(answer => {
    const votesArray = roundVotes.filter(vote => vote.vote === answer.id)
    answer.votes = votesArray
    votesData.push(answer)
  })

  updateWaitingOn(gameId, user.id, votesData)

  const gameData = {
    waitingOn: roundData.waitingOn,
    votes: votesData,
    phase: game.phase,
    round: game.round,
  }

  return { gameData }
}

const calculateScores = (game, votesData) => {
  votesData.forEach(vote => {
    const userIndex = game.users.findIndex(user => user.name === vote.user.name)
    game.users[userIndex].score = game.users[userIndex].score + vote.votes.length*5
  })
}

const getGameData = (gameId) => {
  const game = getGame(gameId)
  const roundData = game.rounds[game.round-1]
  const scoresData = game.users.sort((a, b) => b.score - a.score)

  const gameData = {
    id: game.id,
    phase: game.phase,
    round: game.round,
    waitingOn: roundData.waitingOn,
    question: roundData.question,
    target: roundData.target,
    scores: scoresData
  }

  if (roundData.answers.length < game.users.length || roundData.votes.length < game.users.length) {
    const answersData = roundData.answers.map(answer => answer.answer)
    gameData.answers = answersData
  }

  if (game.phase === 3) {
    const roundVotes = roundData.votes
    const roundAnswers = roundData.answers
  
    const votesData = []
  
    roundAnswers.forEach(answer => {
      const votesArray = roundVotes.filter(vote => vote.vote === answer.id)
      answer.votes = votesArray
      votesData.push(answer)
    })

    gameData.votes = votesData
  }
  
  return { gameData }
}

module.exports = { games, createGame, nextPhase, updateAnswers, updateVotes, getGameData }