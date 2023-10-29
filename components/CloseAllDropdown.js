import { useContext } from "react"
import { HeaderOptionContext } from "../src/store/context/HeaderOptionContext"
import { MechanicOptionContext } from "../src/store/context/MechanicOptionContext"
import { AssetOptionContext } from "../src/store/context/AssetOptionContext"
import { PriorityOptionContext } from "../src/store/context/PriorityOptionContext"
import { SeverityOptionContext } from "../src/store/context/SeverityOptionContext"
import { SearchOptionContext } from "../src/store/context/SearchOptionContext"

import {ADAOptionContext} from '../src/store/context/ADAOptionContext'
import {EngineTypeOptionContext} from '../src/store/context/EngineTypeOptionContext'
import {AssetTypeOptionContext} from '../src/store/context/AssetTypeOptionContext'
import {AirBrakesOptionContext} from '../src/store/context/AirBrakesOptionContext'
import { DatePickerContext } from "../src/store/context/DatePickerContext"

import { TabHeadContext } from "../src/store/context/TabHeadContext"
import { TabSubHeadContext } from "../src/store/context/TabSubHeadContext"
import { TabHeadOptionContext } from "../src/store/context/TabHeadOptionContext"

const {setHeaderOption} = useContext(HeaderOptionContext)
const {setMechanicOption} = useContext(MechanicOptionContext)
const {setAssetOption} = useContext(AssetOptionContext)
const {setPriorityOption} = useContext(PriorityOptionContext)
const {setSeverityOption} = useContext(SeverityOptionContext)
const {setSearchOption} = useContext(SearchOptionContext)

const {setADAOption} = useContext(ADAOptionContext)
const {setAirBrakesOption} = useContext(AirBrakesOptionContext)
const {setEngineTypeOption} = useContext(EngineTypeOptionContext)
const {setAssetTypeOption} = useContext(AssetTypeOptionContext)

const {setTabHead} = useContext(TabHeadContext)
const {setTabSubHead} = useContext(TabSubHeadContext)
const {setDatePicker} = useContext(DatePickerContext)
const {setTabHeadOption} = useContext(TabHeadOptionContext)



export function CloseAllDropDowns () {

   
    setDatePicker(false)
    setHeaderOption(false)
    setMechanicOption(false)
    setAssetOption(false)
    setPriorityOption(false)
    setSeverityOption(false)
    setSearchOption(false)

    setEngineTypeOption(false)
    setAssetTypeOption(false)
    setADAOption(false)
    setAirBrakesOption(false)

    setTabHead(false)
    setTabSubHead(false)
    setTabHeadOption(false)

    
}
