import { createContext, useReducer } from "react";
import { myOilChangeWOReducer } from '../reducer/OilChangeWOReducer.js'
import { SET_OIL_CHANGE_WO } from "../action/OilChangeWOAction.js";

export const OilChangeWOContext = createContext()

const OilChangeWOContextProvider = (props) => {

    const [state, dispatch] = useReducer(myOilChangeWOReducer, { value: { data: [] } })

    const setOilChangeWO = (data) => {
        dispatch({ type: SET_OIL_CHANGE_WO, payload: { data: data} })
    }

    return (
        <OilChangeWOContext.Provider
            value={{ state, setOilChangeWO}}
        >
            {props.children}
        </OilChangeWOContext.Provider>
    )
}

export default OilChangeWOContextProvider