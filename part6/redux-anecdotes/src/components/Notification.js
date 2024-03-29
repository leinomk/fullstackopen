import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(store => store.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    notification === null ?
      <div></div> :
      <div style={style}>
        {notification}
      </div>
  )
}

export { Notification }