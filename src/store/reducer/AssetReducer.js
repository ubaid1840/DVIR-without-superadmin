import {SET_ASSET_DATA } from '../action/AssetAction'

export const myAssetReducer = (state, action) => {
  switch (action.type) {
    case SET_ASSET_DATA:
      let newDataState = { ...state }
      newDataState.value.data = action.payload.data
      return newDataState
      break
    default:
      return state
  }
}

