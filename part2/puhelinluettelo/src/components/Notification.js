import React from 'react'

const Notification = ({ message }) => {
  if (message.type === undefined) {
    return null
  }
  else if (message.type === 'notificationMessage') {
    return (
      <div className="notification">
        {message.text}
      </div>
    )
  }
  else {
    return (
      <div className="error">
        {message.text}
      </div>
    )
  }
}

export default Notification