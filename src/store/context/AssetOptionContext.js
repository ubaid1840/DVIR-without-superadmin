import { createContext, useReducer } from "react";
import { myAssetOptionReducer } from '../reducer/AssetOptionReducer.js'
import { SET } from "../action/AssetOptionAction.js";

export const AssetOptionContext = createContext()

const AssetOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAssetOptionReducer, { value: { data: false } })

    const setAssetOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <AssetOptionContext.Provider
            value={{ state, setAssetOption}}
        >
            {props.children}
        </AssetOptionContext.Provider>
    )
}

export default AssetOptionContextProvider