import { createContext, useReducer } from "react";
import { myPeopleReducer } from '../reducer/PeopleReducer'
import { SET_PEOPLE } from "../action/PeopleAction";

export const PeopleContext = createContext()

const PeopleContextProvider = (props) => {

    const [state, dispatch] = useReducer(myPeopleReducer, { value: { data: [] } })

    const setPeopleData = (data) => {
        dispatch({ type: SET_PEOPLE, payload: { data: data} })
    }

    return (
        <PeopleContext.Provider
            value={{ state, setPeopleData}}
        >
            {props.children}
        </PeopleContext.Provider>
    )
}

export default PeopleContextProvider