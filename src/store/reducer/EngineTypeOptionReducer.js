import {SET } from '../action/EngineTypeOptionAction'

export const myEngineTypeOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newEngineTypeOptionState = { ...state }
      newEngineTypeOptionState.value.data = action.payload.data
      return newEngineTypeOptionState
      break
    default:
      return state
  }
}

