import { SET_DRIVER_DETAIL } from "../action/DriverDetailAction"


export const myDriverDetailReducer = (state, action) => {
  switch (action.type) {
    case SET_DRIVER_DETAIL:
      let newDriverDetailState = { ...state }
      newDriverDetailState.value.data = action.payload.data
      return newDriverDetailState
      break
    default:
      return state
  }
}

