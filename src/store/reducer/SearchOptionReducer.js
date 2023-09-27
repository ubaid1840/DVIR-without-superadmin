import {SET } from '../action/SearchOptionAction'

export const mySearchOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newSearchOptionState = { ...state }
      newSearchOptionState.value.data = action.payload.data
      return newSearchOptionState
      break
    default:
      return state
  }
}

