import { createContext, useReducer } from "react";
import { myTabHeadOptionReducer } from '../reducer/TabHeadOptionReducer.js'
import { SET } from "../action/TabHeadOptionAction.js";

export const TabHeadOptionContext = createContext()

const TabHeadOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myTabHeadOptionReducer, { value: { data: false } })

    const setTabHeadOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <TabHeadOptionContext.Provider
            value={{ state, setTabHeadOption}}
        >
            {props.children}
        </TabHeadOptionContext.Provider>
    )
}

export default TabHeadOptionContextProvider