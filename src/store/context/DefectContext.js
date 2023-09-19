import { createContext, useReducer } from "react";
import { myDefectReducer } from '../reducer/DefectReducer.js'
import { SET_DEFECT } from "../action/DefectAction";

export const DefectContext = createContext()

const DefectContextProvider = (props) => {

    const [state, dispatch] = useReducer(myDefectReducer, { value: { defect: [] } })

    const setDefect = (defect) => {
        dispatch({ type: SET_DEFECT, payload: { defect: defect} })
    }

    return (
        <DefectContext.Provider
            value={{ state, setDefect}}
        >
            {props.children}
        </DefectContext.Provider>
    )
}

export default DefectContextProvider