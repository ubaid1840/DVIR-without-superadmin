import {SET } from '../action/AirBrakesOptionAction'

export const myAirBrakesOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newAirBrakesOptionState = { ...state }
      newAirBrakesOptionState.value.data = action.payload.data
      return newAirBrakesOptionState
      break
    default:
      return state
  }
}

