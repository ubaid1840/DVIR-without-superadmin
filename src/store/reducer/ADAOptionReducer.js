import {SET } from '../action/ADAOptionAction'

export const myADAOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newADAOptionState = { ...state }
      newADAOptionState.value.data = action.payload.data
      return newADAOptionState
      break
    default:
      return state
  }
}

