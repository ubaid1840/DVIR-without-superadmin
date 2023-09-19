import { createContext, useReducer } from "react";
import { myAssetReducer } from '../reducer/AssetReducer'
import { SET_ASSET_DATA } from "../action/AssetAction";

export const AssetContext = createContext()

const AssetContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAssetReducer, { value: { data: null } })

    const setAssetData = (data) => {
        dispatch({ type: SET_ASSET_DATA, payload: { data: data} })
    }

    return (
        <AssetContext.Provider
            value={{ state, setAssetData}}
        >
            {props.children}
        </AssetContext.Provider>
    )
}

export default AssetContextProvider