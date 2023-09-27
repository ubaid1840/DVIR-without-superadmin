import { createContext, useReducer } from "react";
import { myAssetTypeOptionReducer } from '../reducer/AssetTypeOptionReducer.js'
import { SET } from "../action/AssetTypeOptionAction.js";

export const AssetTypeOptionContext = createContext()

const AssetTypeOptionContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAssetTypeOptionReducer, { value: { data: false } })

    const setAssetTypeOption = (data) => {
        dispatch({ type: SET, payload: { data: data} })
    }

    return (
        <AssetTypeOptionContext.Provider
            value={{ state, setAssetTypeOption}}
        >
            {props.children}
        </AssetTypeOptionContext.Provider>
    )
}

export default AssetTypeOptionContextProvider