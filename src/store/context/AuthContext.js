import { createContext, useReducer } from "react";
import { CLEAR_AUTH, SET_AUTH} from '../action/AuthAction'
import { myAuthReducer } from '../reducer/AuthReducer'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAuthReducer, { value: { number: null, name: null, designation: null, employeeNumber :null, dp : null } })

    const setAuth = (number, name, designation, employeeNumber, dp) => {
        dispatch({ type: SET_AUTH, payload: { number: number, name: name, designation: designation, employeeNumber: employeeNumber, dp:dp } })
    }

    const clearAuth = () => {
        dispatch({ type: CLEAR_AUTH })
    }



    return (
        <AuthContext.Provider
            value={{ state, setAuth, clearAuth }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider