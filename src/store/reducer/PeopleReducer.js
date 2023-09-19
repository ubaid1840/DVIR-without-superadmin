import {SET_PEOPLE } from '../action/PeopleAction'

export const myPeopleReducer = (state, action) => {
  switch (action.type) {
    case SET_PEOPLE:
      let newDataState = { ...state }
      newDataState.value.data = action.payload.data
      return newDataState
      break
    default:
      return state
  }
}

