import {SET_WO } from '../action/WOAction'

export const myWOReducer = (state, action) => {
  switch (action.type) {
    case SET_WO:
      let newWOState = { ...state }
      newWOState.value.data = action.payload.data
      return newWOState
      break
    default:
      return state
  }
}

