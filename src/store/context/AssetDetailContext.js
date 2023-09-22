import { createContext, useReducer } from "react";
import { myAssetDetailReducer } from '../reducer/AssetDetailReducer.js'
import { SET_ASSET_DETAIL } from "../action/AssetDetailAction.js";

export const AssetDetailContext = createContext()

const AssetDetailContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAssetDetailReducer, { value: { data: false } })

    const setAssetDetail = (data) => {
        dispatch({ type: SET_ASSET_DETAIL, payload: { data: data} })
    }

    return (
        <AssetDetailContext.Provider
            value={{ state, setAssetDetail}}
        >
            {props.children}
        </AssetDetailContext.Provider>
    )
}

export default AssetDetailContextProvider