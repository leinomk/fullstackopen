const notificationReducer = (state = null, action) => {

  switch(action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR':
      return null
    default: return state
  }
}

var timeOutID

export const setNotification = (notification, timeout) => {
  return async dispatch => {
    if (timeOutID !== undefined){
      clearTimeout(timeOutID)
    }
    await dispatch({
      type: 'SET_NOTIFICATION',
      data: notification
    })
    timeOutID = setTimeout(() => {
      dispatch({
        type: 'CLEAR'
      })
    }, timeout * 1000)
  }
}


export default notificationReducer