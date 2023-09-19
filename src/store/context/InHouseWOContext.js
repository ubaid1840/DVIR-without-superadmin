import { createContext, useReducer } from "react";
import { myInHouseWOReducer } from '../reducer/InHouseWOReducer.js'
import { SET_IN_HOUSE_WO } from "../action/InHouseWOAction.js";

export const InHouseWOContext = createContext()

const InHouseWOContextProvider = (props) => {

    const [state, dispatch] = useReducer(myInHouseWOReducer, { value: { data: [] } })

    const setInHouseWO = (data) => {
        dispatch({ type: SET_IN_HOUSE_WO, payload: { data: data} })
    }

    return (
        <InHouseWOContext.Provider
            value={{ state, setInHouseWO}}
        >
            {props.children}
        </InHouseWOContext.Provider>
    )
}

export default InHouseWOContextProvider