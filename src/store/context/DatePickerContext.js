import { createContext, useReducer } from "react";
import { myDatePickerReducer } from '../reducer/DatePickerReducer.js'
import { SET_DATEPICKER } from "../action/DatePickerAction.js";

export const DatePickerContext = createContext()

const DatePickerContextProvider = (props) => {

    const [state, dispatch] = useReducer(myDatePickerReducer, { value: { data: false } })

    const setDatePicker = (data) => {
        dispatch({ type: SET_DATEPICKER, payload: { data: data} })
    }

    return (
        <DatePickerContext.Provider
            value={{ state, setDatePicker}}
        >
            {props.children}
        </DatePickerContext.Provider>
    )
}

export default DatePickerContextProvider