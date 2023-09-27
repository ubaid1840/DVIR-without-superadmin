import { createContext, useReducer } from "react";
import { myAirBrakesOptionReducer } from '../reducer/AirBrakesOptionReducer.js'
import { SET } from "../action/AirBrakesOptionAction.js";

export const AirBrakesOptionContext = createContext()

const AirBrakesOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAirBrakesOptionReducer, { value: { data: false } })

    const setAirBrakesOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <AirBrakesOptionContext.Provider
            value={{ state, setAirBrakesOption}}
        >
            {props.children}
        </AirBrakesOptionContext.Provider>
    )
}

export default AirBrakesOptionContextProvider