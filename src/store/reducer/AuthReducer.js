import { CLEAR_AUTH, SET_AUTH } from '../action/AuthAction'

export const myAuthReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTH:
      let newAuthState = { ...state }
      newAuthState.value.number = action.payload.number
      newAuthState.value.name = action.payload.name
      newAuthState.value.designation = action.payload.designation   
      newAuthState.value.employeeNumber = action.payload.employeeNumber  
      newAuthState.value.dp = action.payload.dp  
       
      return newAuthState
      break
    case CLEAR_AUTH:
      let newClearState = { ...state }
      newAuthState.value.number = null
      newAuthState.value.name = null
      newAuthState.value.designation = null
      newAuthState.value.employeeNumber = null
      newAuthState.value.dp = null
      return newClearState
      break
    default:
      return state
  }
}

