import {SET } from '../action/PriorityOptionAction'

export const myPriorityOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newPriorityOptionState = { ...state }
      newPriorityOptionState.value.data = action.payload.data
      return newPriorityOptionState
      break
    default:
      return state
  }
}

