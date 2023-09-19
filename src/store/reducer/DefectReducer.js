import {SET_DEFECT } from '../action/DefectAction'

export const myDefectReducer = (state, action) => {
  switch (action.type) {
    case SET_DEFECT:
      let newDefectState = { ...state }
      newDefectState.value.defect = action.payload.defect
      return newDefectState
      break
    default:
      return state
  }
}

