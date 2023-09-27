import {SET } from '../action/SeverityOptionAction'

export const mySeverityOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newSeverityOptionState = { ...state }
      newSeverityOptionState.value.data = action.payload.data
      return newSeverityOptionState
      break
    default:
      return state
  }
}

