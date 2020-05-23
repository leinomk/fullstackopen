import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState({})

  const YOUR_ACCESS_KEY = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
    .get(`http://api.weatherstack.com/current?access_key=${YOUR_ACCESS_KEY}&query=${city}`)
    .then(response => {
      const weatherObject = response.data.current
      setWeather(weatherObject)
    })
  }, [YOUR_ACCESS_KEY, city])

  return(
    <div>
      <h3>{`Weather in ${city}`}</h3>
        <div>
        {`Temperature: ${weather.temperature} Celsius`}
        </div>
        <img src={weather.weather_icons} alt="weather icon"/>
      <div>{`Wind: ${weather.wind_speed}mps, direction ${weather.wind_dir}`}</div>
    </div>
  )
}

export default Weather
      