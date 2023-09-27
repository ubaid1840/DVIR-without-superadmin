import { createContext, useReducer } from "react";
import { mySearchOptionReducer } from '../reducer/SearchOptionReducer.js'
import { SET } from "../action/SearchOptionAction.js";

export const SearchOptionContext = createContext()

const SearchOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(mySearchOptionReducer, { value: { data: false } })

    const setSearchOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <SearchOptionContext.Provider
            value={{ state, setSearchOption}}
        >
            {props.children}
        </SearchOptionContext.Provider>
    )
}

export default SearchOptionContextProvider