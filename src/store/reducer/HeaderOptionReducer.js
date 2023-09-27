import {SET } from '../action/HeaderOptionAction'

export const myHeaderOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newHeaderOptionState = { ...state }
      newHeaderOptionState.value.data = action.payload.data
      return newHeaderOptionState
      break
    default:
      return state
  }
}

