import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const IndexOfMax = ( array ) => {
  var max = array[0]
  var maxIndex = 0

  for (var index = 1; index < array.length; index++) {
    if (array[index] > max) {
      maxIndex = index
      max = array[index]
    }
  }

  return maxIndex
}

const GetRandomInteger = ( min, max ) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return (
    Math.floor(Math.random() * (max - min))
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)

  const [points, setPoints] = useState(new Array(6).fill(0))

  const nextAnecdote = () => {
    var randomInt = GetRandomInteger( 0, 6 )
    while((randomInt === selected) || (randomInt === 6)){
      randomInt = GetRandomInteger( 0, 6 )
    }
    setSelected(randomInt)
  }

  const voteAnecdote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>
        <p>{props.anecdotes[selected]}</p>
        has {points[selected]} points
      </div>
      <div>
        <Button onClick={voteAnecdote} text="vote" />
        <Button onClick={nextAnecdote} text="next anecdote" />
      </div>
      <h1>Anecdote with most votes</h1>
      <div>
        <p>{props.anecdotes[IndexOfMax(points)]}</p>
        has {points[IndexOfMax(points)]} points
      </div>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)