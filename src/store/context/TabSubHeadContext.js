import { createContext, useReducer } from "react";
import { myTabSubHeadReducer } from '../reducer/TabSubHeadReducer.js'
import { SET } from "../action/TabSubHeadAction.js";

export const TabSubHeadContext = createContext()

const TabSubHeadContextProvider = (props) => {

    const [state, dispatch] = useReducer(myTabSubHeadReducer, { value: { data: false } })

    const setTabSubHead = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <TabSubHeadContext.Provider
            value={{ state, setTabSubHead}}
        >
            {props.children}
        </TabSubHeadContext.Provider>
    )
}

export default TabSubHeadContextProvider