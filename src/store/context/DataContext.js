import { createContext, useReducer } from "react";
import { myDataReducer } from '../reducer/DataReducer'
import { SET_DATA } from "../action/DataAction";

export const DataContext = createContext()

const DataContextProvider = (props) => {

    const [state, dispatch] = useReducer(myDataReducer, { value: { data: null } })

    const setData = (data) => {
        dispatch({ type: SET_DATA, payload: { data: data} })
    }

    return (
        <DataContext.Provider
            value={{ state, setData}}
        >
            {props.children}
        </DataContext.Provider>
    )
}

export default DataContextProvider