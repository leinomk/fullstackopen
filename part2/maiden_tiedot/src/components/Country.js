import React from 'react'
import Weather from './Weather'

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>{"capital "}{country.capital}</div>
      <div>{"population "}{country.population}</div>
      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map(language => 
        <li key={language.name}>{language.name}</li>)}
      </ul>
      <div>
        <img src={country.flag} alt={`${country.name} flag`}
        width="150" height="100" />
      </div>
      <Weather city={country.capital} />
    </div>
  )
}    

export default Country