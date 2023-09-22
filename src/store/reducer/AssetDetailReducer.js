import { SET_ASSET_DETAIL } from '../action/AssetDetailAction'

export const myAssetDetailReducer = (state, action) => {
  switch (action.type) {
    case SET_ASSET_DETAIL:
      let newAssetDetailState = { ...state }
      newAssetDetailState.value.data = action.payload.data
      return newAssetDetailState
      break
    default:
      return state
  }
}

