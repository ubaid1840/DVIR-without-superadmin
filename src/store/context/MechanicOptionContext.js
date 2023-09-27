import { createContext, useReducer } from "react";
import { myMechanicOptionReducer } from '../reducer/MechanicOptionReducer.js'
import { SET } from "../action/MechanicOptionAction.js";

export const MechanicOptionContext = createContext()

const MechanicOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myMechanicOptionReducer, { value: { data: false } })

    const setMechanicOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <MechanicOptionContext.Provider
            value={{ state, setMechanicOption}}
        >
            {props.children}
        </MechanicOptionContext.Provider>
    )
}

export default MechanicOptionContextProvider