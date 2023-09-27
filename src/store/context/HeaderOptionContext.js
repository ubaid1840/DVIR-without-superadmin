import { createContext, useReducer } from "react";
import { myHeaderOptionReducer } from '../reducer/HeaderOptionReducer.js'
import { SET } from "../action/HeaderOptionAction.js";

export const HeaderOptionContext = createContext()

const HeaderOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myHeaderOptionReducer, { value: { data: false } })

    const setHeaderOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <HeaderOptionContext.Provider
            value={{ state, setHeaderOption}}
        >
            {props.children}
        </HeaderOptionContext.Provider>
    )
}

export default HeaderOptionContextProvider