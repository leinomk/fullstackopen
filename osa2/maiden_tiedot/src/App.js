import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => 
      setCountries(response.data)
      )
  }, [])

  const handleFilterChange = (event) => setFilter(event.target.value)

  const autoFillFilter = (countryName) => setFilter(countryName)

  const countriesToShow = (filter.trim() === "")
    ? countries
    : countries.filter(country => country.name
                               .toLowerCase()
                               .indexOf(filter
                               .trim()
                               .toLowerCase()) !== -1)

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countriesToShow={countriesToShow}
                 handleClick={autoFillFilter} />
    </div>
  )
}

export default App;
