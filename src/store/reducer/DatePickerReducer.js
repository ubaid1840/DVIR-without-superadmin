import { SET_DATEPICKER } from '../action/DatePickerAction'

export const myDatePickerReducer = (state, action) => {
  switch (action.type) {
    case SET_DATEPICKER:
      let newDatePickerState = { ...state }
      newDatePickerState.value.data = action.payload.data
      return newDatePickerState
      break
    default:
      return state
  }
}

