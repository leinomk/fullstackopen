import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({ text,  value }) => (
  <div>
    <table>
      <colgroup>
        <col width="60" />
      </colgroup>
      <tbody>
       <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr> 
      </tbody>
    </table>
  </div>
)

const Statistics = ({ good, neutral, bad}) => {
  if (good + neutral + bad === 0) {
    return (
      <div>No feedbacks given</div>
    )
  }

  const average = (good - bad)/(good + neutral + bad)
  const positive = 100 * good /(good + neutral + bad)

  return (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={good + neutral + bad} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={`${positive}%`} />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }
  const increaseNeutral = () => {
    setNeutral(neutral + 1)
  }
  const increaseBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <div> <h1>give feedback</h1> </div>
      <div>
        <Button handleClick={increaseGood} text='good' />
        <Button handleClick={increaseNeutral} text='neutral' />
        <Button handleClick={increaseBad} text='bad' />
      </div>
        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)