import { createContext, useReducer } from "react";
import { mySeverityOptionReducer } from '../reducer/SeverityOptionReducer.js'
import { SET } from "../action/SeverityOptionAction.js";

export const SeverityOptionContext = createContext()

const SeverityOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(mySeverityOptionReducer, { value: { data: false } })

    const setSeverityOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <SeverityOptionContext.Provider
            value={{ state, setSeverityOption}}
        >
            {props.children}
        </SeverityOptionContext.Provider>
    )
}

export default SeverityOptionContextProvider