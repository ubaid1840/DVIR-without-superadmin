import {SET } from '../action/TabHeadOptionAction'

export const myTabHeadOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newTabHeadOptionState = { ...state }
      newTabHeadOptionState.value.data = action.payload.data
      return newTabHeadOptionState
      break
    default:
      return state
  }
}

