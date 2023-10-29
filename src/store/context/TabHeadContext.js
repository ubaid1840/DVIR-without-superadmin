import { createContext, useReducer } from "react";
import { myTabHeadReducer } from '../reducer/TabHeadReducer.js'
import { SET } from "../action/TabHeadAction.js";

export const TabHeadContext = createContext()

const TabHeadContextProvider = (props) => {

    const [state, dispatch] = useReducer(myTabHeadReducer, { value: { data: false } })

    const setTabHead = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <TabHeadContext.Provider
            value={{ state, setTabHead}}
        >
            {props.children}
        </TabHeadContext.Provider>
    )
}

export default TabHeadContextProvider