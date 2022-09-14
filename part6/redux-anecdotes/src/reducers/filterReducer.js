const filterReducer = (state = '', action) => {

  switch(action.type) {
    case 'CHANGE_FILTER':
      return action.data
    default: return ''
  }
}

export const updateFilter = (newFilter) => {
  return {
    type: 'CHANGE_FILTER',
    data: newFilter
  }
}

export default filterReducer