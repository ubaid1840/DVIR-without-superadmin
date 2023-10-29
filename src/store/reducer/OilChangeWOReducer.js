import {SET_OIL_CHANGE_WO } from '../action/OilChangeWOAction'

export const myOilChangeWOReducer = (state, action) => {
  switch (action.type) {
    case SET_OIL_CHANGE_WO:
      let newOilChangeWOState = { ...state }
      newOilChangeWOState.value.data = action.payload.data
      return newOilChangeWOState
      break
    default:
      return state
  }
}

