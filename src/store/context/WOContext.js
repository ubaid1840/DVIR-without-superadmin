import { createContext, useReducer } from "react";
import { myWOReducer } from '../reducer/WOReducer.js'
import { SET_WO } from "../action/WOAction";

export const WOContext = createContext()

const WOContextProvider = (props) => {

    const [state, dispatch] = useReducer(myWOReducer, { value: { data: [] } })

    const setWO = (data) => {
        dispatch({ type: SET_WO, payload: { data: data} })
    }

    return (
        <WOContext.Provider
            value={{ state, setWO}}
        >
            {props.children}
        </WOContext.Provider>
    )
}

export default WOContextProvider