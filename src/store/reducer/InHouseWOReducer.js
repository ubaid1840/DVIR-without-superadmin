import {SET_IN_HOUSE_WO } from '../action/InHouseWOAction'

export const myInHouseWOReducer = (state, action) => {
  switch (action.type) {
    case SET_IN_HOUSE_WO:
      let newInHouseWOState = { ...state }
      newInHouseWOState.value.data = action.payload.data
      return newInHouseWOState
      break
    default:
      return state
  }
}

