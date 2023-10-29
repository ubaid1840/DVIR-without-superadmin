import {SET } from '../action/TabHeadAction'

export const myTabHeadReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newTabHeadState = { ...state }
      newTabHeadState.value.data = action.payload.data
      return newTabHeadState
      break
    default:
      return state
  }
}

