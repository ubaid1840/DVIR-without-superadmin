import {SET } from '../action/TabSubHeadAction'

export const myTabSubHeadReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newTabSubHeadState = { ...state }
      newTabSubHeadState.value.data = action.payload.data
      return newTabSubHeadState
      break
    default:
      return state
  }
}

