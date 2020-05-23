import React from 'react'
import Country from './Country'

const Countries = ({ countriesToShow, handleClick }) => {
  if (countriesToShow.length > 10) {
    return (
      <div>
        Too many matches, give more specific filter
      </div>
    )
  }
  else if (countriesToShow.length > 1) {
    return (
      <div>
        {countriesToShow.map(country =>
        <div key={country.name}>{`${country.name} `}
          <button onClick={() => handleClick(country.name)}>show</button>  
        </div>)}
      </div>
    )
  }
  else if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    return (
      <div>
        <Country country={country} />
      </div>
    )
  }
  else {
    return (
      <div>
        No matches
      </div>
    )
  }
    
}

export default Countries