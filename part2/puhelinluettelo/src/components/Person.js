import React from 'react'

const Persons = ({ person, deletePerson }) => {
  return (
    <p style={{margin: 1}}>
      {`${person.name} ${person.number} `}
      <button onClick={deletePerson}>delete</button>
    </p>
  )
}

export default Persons