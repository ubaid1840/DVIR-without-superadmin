import { createContext, useReducer } from "react";
import { myEngineTypeOptionReducer } from '../reducer/EngineTypeOptionReducer.js'
import { SET } from "../action/EngineTypeOptionAction.js";

export const EngineTypeOptionContext = createContext()

const EngineTypeOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myEngineTypeOptionReducer, { value: { data: false } })

    const setEngineTypeOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <EngineTypeOptionContext.Provider
            value={{ state, setEngineTypeOption}}
        >
            {props.children}
        </EngineTypeOptionContext.Provider>
    )
}

export default EngineTypeOptionContextProvider