import { createContext, useReducer } from "react";
import { myDriverDetailReducer } from '../reducer/DriverDetailReducer.js'
import { SET_DRIVER_DETAIL } from "../action/DriverDetailAction.js";

export const DriverDetailContext = createContext()

const DriverDetailContextProvider = (props) => {

    const [state, dispatch] = useReducer(myDriverDetailReducer, { value: { data: false } })

    const setDriverDetail = (data) => {
        dispatch({ type: SET_DRIVER_DETAIL, payload: { data: data} })
    }

    return (
        <DriverDetailContext.Provider
            value={{ state, setDriverDetail}}
        >
            {props.children}
        </DriverDetailContext.Provider>
    )
}

export default DriverDetailContextProvider