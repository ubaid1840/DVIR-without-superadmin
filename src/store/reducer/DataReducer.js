import {SET_DATA } from '../action/DataAction'

export const myDataReducer = (state, action) => {
  switch (action.type) {
    case SET_DATA:
      let newDataState = { ...state }
      newDataState.value.data = action.payload.data
      return newDataState
      break
    default:
      return state
  }
}

