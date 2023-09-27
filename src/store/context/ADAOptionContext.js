import { createContext, useReducer } from "react";
import { myADAOptionReducer } from '../reducer/ADAOptionReducer.js'
import { SET } from "../action/ADAOptionAction.js";

export const ADAOptionContext = createContext()

const ADAOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myADAOptionReducer, { value: { data: false } })

    const setADAOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <ADAOptionContext.Provider
            value={{ state, setADAOption}}
        >
            {props.children}
        </ADAOptionContext.Provider>
    )
}

export default ADAOptionContextProvider