import {SET } from '../action/MechanicOptionAction'

export const myMechanicOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newMechanicOptionState = { ...state }
      newMechanicOptionState.value.data = action.payload.data
      return newMechanicOptionState
      break
    default:
      return state
  }
}

