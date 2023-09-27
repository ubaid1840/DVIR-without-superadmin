import {SET } from '../action/AssetOptionAction'

export const myAssetOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newAssetOptionState = { ...state }
      newAssetOptionState.value.data = action.payload.data
      return newAssetOptionState
      break
    default:
      return state
  }
}

