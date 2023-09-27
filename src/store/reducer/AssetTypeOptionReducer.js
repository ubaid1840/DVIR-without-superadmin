import {SET } from '../action/AssetTypeOptionAction'

export const myAssetTypeOptionReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newAssetTypeOptionState = { ...state }
      newAssetTypeOptionState.value.data = action.payload.data
      return newAssetTypeOptionState
      break
    default:
      return state
  }
}

