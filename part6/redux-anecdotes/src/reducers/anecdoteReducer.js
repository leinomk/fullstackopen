import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {

  switch(action.type) {
    case 'VOTE':
      const newState = state.reduce((anecdotes, anecdote) => {
        const likes = (anecdote.id === action.data) ?
          anecdote.votes += 1 : anecdote.votes
        anecdote.votes = likes
        anecdotes.push(anecdote)
        return anecdotes
      }, [])
      return newState
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
    default: return state
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    await anecdoteService.voteAnecdote(anecdote)
    dispatch({
      type: 'VOTE',
      data: anecdote.id
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export default anecdoteReducer