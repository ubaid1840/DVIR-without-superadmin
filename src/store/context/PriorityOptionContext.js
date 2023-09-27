import { createContext, useReducer } from "react";
import { myPriorityOptionReducer } from '../reducer/PriorityOptionReducer.js'
import { SET } from "../action/PriorityOptionAction.js";

export const PriorityOptionContext = createContext()

const PriorityOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myPriorityOptionReducer, { value: { data: false } })

    const setPriorityOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <PriorityOptionContext.Provider
            value={{ state, setPriorityOption}}
        >
            {props.children}
        </PriorityOptionContext.Provider>
    )
}

export default PriorityOptionContextProvider