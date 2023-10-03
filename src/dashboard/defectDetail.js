import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, TextInput, Dimensions, ActivityIndicator, Modal, TouchableWithoutFeedback } from "react-native"
import AppBtn from "../../components/Button";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { collection, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import app from "../config/firebase";
import { DataContext } from "../store/context/DataContext";
import { AuthContext } from "../store/context/AuthContext";
import { DefectContext } from "../store/context/DefectContext";
import { subscribeToCollection } from "./defectFirebaseService";
import DropDownComponent from "../../components/DropDown";
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { PeopleContext } from "../store/context/PeopleContext";
import { AssetContext } from "../store/context/AssetContext";
import AlertModal from "../../components/AlertModal";
import { WOContext } from "../store/context/WOContext";
import { DatePickerContext } from '../store/context/DatePickerContext'
import { MechanicOptionContext } from "../store/context/MechanicOptionContext";
import { PriorityOptionContext } from "../store/context/PriorityOptionContext";
import { SeverityOptionContext } from "../store/context/SeverityOptionContext";
import { CloseAllDropDowns } from "../../components/CloseAllDropdown";

const DefectDetail = ({ value, onDashboardOpenWO, onDashboardDefect }) => {
    const today = new Date()
    const startData = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD')
    const db = getFirestore(app)

    const flatlistRef = useRef()
    const [comment, setComment] = useState('')
    const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)

    const { state: dataState, setData } = useContext(DataContext)
    const { state: authState, setAuth } = useContext(AuthContext)
    const { state: defectState, setDefect } = useContext(DefectContext)
    const { state: peopleState, setPeople } = useContext(PeopleContext)
    const { state: assetState, setAssetData } = useContext(AssetContext)
    const { state: woState, setWO } = useContext(WOContext)
    const { state: datePickerState, setDatePicker } = useContext(DatePickerContext)
    const { state: mechanicOptionState, setMechanicOption } = useContext(MechanicOptionContext)
    const { state: priorityOptionState, setPriorityOption } = useContext(PriorityOptionContext)
    const { state: severityOptionState, setSeverityOption } = useContext(SeverityOptionContext)


    const [selectedDefect, setSelectedDefect] = useState(value)
    const [loading, setLoading] = useState(false)
    const [statusLoading, setStatusLoading] = useState(false)
    const [priorityLoading, setPriorityLoading] = useState(false)
    const [severityLoading, setSeverityLoading] = useState(false)
    const [prioritySelectedOption, setPrioritySelectedOption] = useState(value.priority)
    const [severitySelectedOption, setSeveritySelectedOption] = useState(value.severity)
    const [openCreateWOModal, setOpenCreateWOModal] = useState(false)
    const [workOrderVariable, setWorkOrderVariable] = useState([value]);
    const [addTask, setAddTask] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date().getTime());
    const [openCalendar, setOpenCalendar] = useState(false)
    const [assignedMechanic, setAssignedMechanic] = useState(null)
    const [mileage, setMileage] = useState(null)
    const [workOrderID, setWorkOrderID] = useState(1)
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [assignedMechanicId, setAssignedMechanicId] = useState(0)

    const handleDateChange = (dateString) => {

        const [year, month, day] = dateString.split("/");
        const dateObject = new Date(`${year}-${month}-${day}`);
        const milliseconds = dateObject.getTime();
        setSelectedDate(milliseconds)
        // setOpenCalendar(false)
        setDatePicker(false)
    };

    useEffect(() => {

        const unsubscribe = subscribeToCollection('myCollection', (newData) => {
            // console.log(newData)
            // console.log(selectedDefect)
            // const updatedWorkorders = updateWorkOrdersWithAssetInfo(newData, assetState.value.data);
            // const workOrdersWithNames = replaceMechanicIdsWithNames([...updatedWorkorders], [...peopleState.value.data]);
            const updatedSelectedDefect = newData.find((defect) => defect.id === selectedDefect.id);

            if (updatedSelectedDefect) {
                // console.log('found')
                setSelectedDefect(updatedSelectedDefect); // Update the selectedDefect state with the latest data
            }
            // setDefectedArray(newData)
            setDefect(newData)
            setLoading(false)
        });

        return () => {
            // Unsubscribe when the component unmounts
            unsubscribe();
        };
    }, []);

    const replaceMechanicIdsWithNames = (workOrders, mechanics) => {
        const workOrdersWithNames = workOrders.map(order => {
            const mechanic = mechanics.find(m => m['Employee Number'].toString() === order.assignedMechanic);
            const mechanicName = mechanic ? mechanic.Name : 'Unknown Mechanic';
            console.log(mechanicName)
            return { ...order, 'assignedMechanic': mechanicName };
        });
        return workOrdersWithNames;
    };

    const updateWorkOrdersWithAssetInfo = (workorders, assets) => {
        return workorders.map(order => {
            const asset = assets.find(asset => asset['Asset Number'].toString() === order.assetNumber);
            if (asset) {
                return {
                    ...order,
                    assetName: asset['Asset Name'],
                    assetMake: asset.Make,
                    assetModel: asset.Model,
                    assetYear: asset.Year
                };
            } else {
                return order; // Asset not found for this work order
            }
        });
    };

    useEffect(() => {
        if (selectedDefect) {
            const insID = selectedDefect.inspectionId
            const newArray = [...dataState.value.data.filter((item) => item.id === insID)]
            setMileage(newArray[0].form[0].value)
        }
    }, [selectedDefect])

    const updateComment = async () => {

        const currentDate = new Date();
        const currentTimeInMillis = currentDate.getTime();
        let oldComments = [...selectedDefect.comments]

        // console.log(oldComments)
        oldComments.push({
            sendBy: authState.value.name,
            msg: comment,
            timeStamp: currentTimeInMillis
        })
        // console.log(oldComments)

        const dbRef = doc(db, 'Defects1', selectedDefect.id.toString())
        await updateDoc(dbRef, {
            comments: oldComments
        })
    }

    const openWorkOrder = (item) => {
        console.log(item)
        onDashboardOpenWO(item)
    }

    const updateStatus = async (value) => {
        try {
            await updateDoc(doc(db, "Defects1", selectedDefect.id.toString()), {
                status: value
            })
            setStatusLoading(false)
        } catch (error) {
            console.log(error)
            setStatusLoading(false)
        }

    }

    const handleSeverityValueChange = async (value) => {
        try {
            await updateDoc(doc(db, "Defects1", selectedDefect.id.toString()), {
                severity: value
            })
            setSeveritySelectedOption(value)
            setSeverityLoading(false)
        } catch (error) {
            console.log(error)
            setSeverityLoading(false)
        }
    }

    const handlePriorityValueChange = async (value) => {
        try {
            await updateDoc(doc(db, "Defects1", selectedDefect.id.toString()), {
                priority: value
            })
            setPrioritySelectedOption(value)
            setPriorityLoading(false)
        } catch (error) {
            console.log(error)
            setPriorityLoading(false)
        }
    }

    const WorkOrderVariableTable = useCallback(({ item, index }) => {

        const [hover, setHover] = useState(false)

        const handleDeleteWorkOrderItem = (index) => {
            const temp = [...workOrderVariable]
            const updatedItems = temp.filter((item, i) => i !== index);
            setWorkOrderVariable(updatedItems)

        }

        return (
            <View style={{ flexDirection: 'row', padding: 15, borderWidth: 1, borderColor: '#cccccc', alignItems: 'center' }}>
                <View style={{ minWidth: 100 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>#{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.title}</Text>
                </View >
                <View style={{ minWidth: 250, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 25, width: 25 }} tintColor="#cccccc" source={require('../../assets/calendar_icon.png')}></Image>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginLeft: 10 }}>{item.dateCreated ? (new Date(item.dateCreated.seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString() : new Date(item.timeStamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                </View>
                <TouchableOpacity style={{ height: 40, width: 60, borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, alignItems: 'center', justifyContent: 'center ' }} onPress={() => handleDeleteWorkOrderItem(index)}>
                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/delete_icon.png')} tintColor="#4D4D4D"></Image>
                </TouchableOpacity>
            </View>
        )
    }, [workOrderVariable])

    const handleSave = () => {
        setWorkOrderVariable((prevState) => {
            const newState = [...prevState]
            newState.push({
                title: addTask,
                timeStamp: new Date().getTime()
            })
            return newState
        })
        setAddTask('')
    }

    const handleSaveWorkOrder = async () => {

        try {
            let temp = []
            await getDocs(query(collection(db, 'WorkOrders1'), orderBy('TimeStamp', 'desc')))
                .then((snapshot) => {
                    snapshot.forEach((docs) => {
                        temp.push(docs.data())
                    })
                })
            if (temp.length == 0) {

                setDoc(doc(db, 'WorkOrders1', '1'), {
                    id: 1,
                    'assetNumber': selectedDefect.assetNumber,
                    'driverEmployeeNumber': selectedDefect.driverEmployeeNumber,
                    'driverName': selectedDefect.driverName,
                    'defectID': selectedDefect.id,
                    'defectedItems': [...workOrderVariable.map(item => ({
                        'title': item.title,
                        'TimeStamp': item.dateCreated ? item.dateCreated.seconds * 1000 : item.timeStamp,
                    }))],
                    'assignedMechanic': assignedMechanicId.toString(),
                    'dueDate': selectedDate,
                    'status': 'Pending',
                    'mileage': mileage,
                    'comments': [],
                    'completionDate': 0,
                    'severity': severitySelectedOption,
                    'priority': prioritySelectedOption,
                    'TimeStamp': serverTimestamp(),
                    'partsTax': '',
                    'laborTax': ''
                })


                await updateDoc(doc(db, 'Defects1', selectedDefect.id.toString()), {
                    'workOrder': 1,
                    'assignedMechanic': assignedMechanicId.toString(),
                    'status': 'In Progress',
                })

                await updateWorkOrders()
                setAlertStatus('successful')
                setAlertIsVisible(true)
            }
            else {

                setDoc(doc(db, 'WorkOrders1', (temp[0].id + 1).toString()), {
                    id: (temp[0].id + 1),
                    'assetNumber': selectedDefect.assetNumber,
                    'defectID': selectedDefect.id,
                    'driverEmployeeNumber': selectedDefect.driverEmployeeNumber,
                    'driverName': selectedDefect.driverName,
                    'defectedItems': [...workOrderVariable.map(item => ({
                        'title': item.title,
                        'TimeStamp': item.dateCreated ? item.dateCreated.seconds * 1000 : item.timeStamp,
                    }))],
                    'assignedMechanic': assignedMechanicId.toString(),
                    'dueDate': selectedDate,
                    'status': 'Pending',
                    'mileage': mileage,
                    'comments': [],
                    'completionDate': 0,
                    'severity': severitySelectedOption,
                    'priority': prioritySelectedOption,
                    'TimeStamp': serverTimestamp(),
                    'partsTax': '',
                    'laborTax': ''
                })

                await updateDoc(doc(db, 'Defects1', selectedDefect.id.toString()), {
                    'workOrder': (temp[0].id + 1),
                    'assignedMechanic': assignedMechanicId.toString(),
                    'status': 'In Progress',
                })

                await updateWorkOrders()
                setAlertStatus('successful')
                setAlertIsVisible(true)
            }
        } catch (error) {
            setLoading(false)
            setAlertStatus('failed')
            setAlertIsVisible(true)
        }
    }

    const updateWorkOrders = async () => {
        await getDocs(query(collection(db, 'WorkOrders1'), orderBy('TimeStamp', 'desc')))
            .then((snapshot) => {
                let temp = []
                snapshot.forEach((docs) => {
                    temp.push(docs.data())
                })
                setWO(temp)
            })
        setLoading(false)

    }

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    if (selectedDefect.length != 0) {
        return (
            <>
                <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#f6f8f9' }}
                    onPress={() => {
                        CloseAllDropDowns()
                    }}>

                    <ScrollView style={{ height: 100 }}>
                        <View style={{ marginTop: 30, marginLeft: 40, paddingBottom: 10 }}>
                            <AppBtn
                                title="Back"
                                btnStyle={[{
                                    width: 100,
                                    height: 40,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 3,
                                    elevation: 0,
                                    shadowColor: '#575757',
                                    marginRight: 50
                                }, { minWidth: 70 }]}
                                btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                onPress={() => {
                                    onDashboardDefect()
                                    // clearAll()
                                }} />
                        </View>
                        <View style={{ flexDirection: 'row', padding: 40, paddingTop: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                                <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                    {selectedDefect.title}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                    <AppBtn
                                        title="Mark as In Progress"
                                        btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ADADAD' }]}
                                        btnTextStyle={[styles.btnText, { fontFamily: 'inter-regular', color: '#000000', fontSize: 13 }]}
                                        onPress={() => {
                                            setStatusLoading(true)
                                            updateStatus('In Progress')
                                        }} />
                                </View>
                                <View style={{ marginLeft: 5 }}>
                                    <AppBtn
                                        title="Mark as Corrected"
                                        btnStyle={[styles.btn, { backgroundColor: '#23d3d3' }]}
                                        btnTextStyle={[styles.btnText, { fontFamily: 'inter-regular', fontSize: 14 }]}
                                        onPress={() => {
                                            setStatusLoading(true)
                                            updateStatus('Corrected')
                                        }} />
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 40 }}>
                            <View style={[styles.newContentCardStyle, { paddingVertical: 25, marginRight: 20 }]}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingBottom: 25 }}>
                                    <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Details</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center', marginTop: 25 }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Defect ID</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.id}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Status</Text>
                                    {statusLoading
                                        ?
                                        <ActivityIndicator color="#23d3d3" size="small" />
                                        :
                                        <Text style={{ fontFamily: 'inter-regular', fontSize: 15, padding: 7, backgroundColor: '#539097', color: '#FFFFFF', borderRadius: 5 }}>{selectedDefect.status}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Asset</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{assetState.value.data.find(asset => asset["Asset Number"].toString() === selectedDefect.assetNumber)?.['Asset Name'] || 'Unknown Asset'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Driver</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{peopleState.value.data.filter(d => d.Designation === 'Driver').find(driver => driver["Employee Number"].toString() === selectedDefect.driverEmployeeNumber)?.Name || 'Unknown Driver'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginHorizontal: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Driver Comment</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15, flex: 1, }}>{selectedDefect.defect.Note}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center', zIndex: 2 }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Severity</Text>
                                    {severityLoading ? <ActivityIndicator color="#23d3d3" size="small" />
                                        : <DropDownComponent
                                            options={["High", "Medium", "Low", "Undefined"]}
                                            onValueChange={(val) => {
                                                setSeverityLoading(true)
                                                handleSeverityValueChange(val)
                                            }}
                                            // title="Ubaid Arshad"
                                            info='severitySelection'
                                            selectedValue={severitySelectedOption}
                                            imageSource={require('../../assets/up_arrow_icon.png')}
                                            container={styles.dropdownContainer}
                                            dropdownButton={styles.dropdownButton}
                                            selectedValueStyle={styles.dropdownSelectedValueStyle}
                                            optionsContainer={styles.dropdownOptionsContainer}
                                            option={styles.dropdownOption}
                                            hoveredOption={styles.dropdownHoveredOption}
                                            optionText={styles.dropdownOptionText}
                                            hoveredOptionText={styles.dropdownHoveredOptionText}
                                            dropdownButtonSelect={styles.dropdownButtonSelect}
                                            dropdownStyle={styles.dropdown}
                                        />}
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center', zIndex: 1 }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Priority</Text>
                                    {priorityLoading ? <ActivityIndicator color="#23d3d3" size="small" />
                                        : <DropDownComponent
                                            options={["High", "Medium", "Low", "Undefined"]}
                                            onValueChange={(val) => {
                                                setPriorityLoading(true)
                                                handlePriorityValueChange(val)
                                            }}
                                            // title="Ubaid Arshad"
                                            info='prioritySelection'
                                            selectedValue={prioritySelectedOption}
                                            imageSource={require('../../assets/up_arrow_icon.png')}
                                            container={styles.dropdownContainer}
                                            dropdownButton={styles.dropdownButton}
                                            selectedValueStyle={styles.dropdownSelectedValueStyle}
                                            optionsContainer={styles.dropdownOptionsContainer}
                                            option={styles.dropdownOption}
                                            hoveredOption={styles.dropdownHoveredOption}
                                            optionText={styles.dropdownOptionText}
                                            hoveredOptionText={styles.dropdownHoveredOptionText}
                                            dropdownButtonSelect={styles.dropdownButtonSelect}
                                            dropdownStyle={styles.dropdown}
                                        />}

                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Assigned Mechanic</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.assignedMechanic ? peopleState.value.data.find(mechanic => mechanic["Employee Number"].toString() === selectedDefect.assignedMechanic)?.Name || 'Unknown Mechanic' : 'n/a'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Work Order</Text>
                                    {selectedDefect.workOrder == 'not issued'
                                        ?
                                        <View>
                                            <AppBtn
                                                title="Create WO"
                                                btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#8C8C8C', height: 40 }]}
                                                btnTextStyle={[styles.btnText, { color: '#000000', fontFamily: 'inter-regular', fontSize: 13 }]}
                                                onPress={() => {
                                                    setAssignedMechanic('')
                                                    setAssignedMechanicId(0)
                                                    setMechanicOption(false)
                                                    setDatePicker(false)
                                                    setOpenCreateWOModal(true)
                                                }} />
                                        </View>
                                        :
                                        <TouchableOpacity onPress={() => { openWorkOrder(selectedDefect) }}>
                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 15, color: '#67E9DA' }}>WO-{selectedDefect.workOrder}</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Date Created</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{new Date(selectedDefect.dateCreated.seconds * 1000).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + new Date(selectedDefect.dateCreated.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Company</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>Octa Soft</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Inspection Form</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>eDVIR</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Defect Card</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.type}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Inspection ID</Text>
                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.inspectionId}</Text>
                                </View>

                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={[styles.newContentCardStyle, { width: '100%' }]}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', padding: 25 }}>
                                        <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Attachments</Text>
                                    </View>
                                    <View style={{ margin: 25, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#23d3d3' }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 15, color: '#23d3d3' }}>Photos</Text>
                                    </View>
                                    <TouchableOpacity style={{ marginLeft: 25, marginBottom: 25 }} onPress={() => {
                                        window.open(selectedDefect.defect.Image, '_blank');
                                    }}>
                                        <Image style={{ height: 150, width: 150 }} source={{ uri: selectedDefect.defect.Image }}></Image>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.newContentCardStyle, { marginTop: 20, width: '100%' }]}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', padding: 25 }}>
                                        <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Activity</Text>
                                    </View>

                                    <View style={{ margin: 25, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#23d3d3' }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 15, color: '#23d3d3' }}>Comments</Text>
                                    </View>
                                    {selectedDefect.comments.length == 0
                                        ?
                                        <View style={{ borderWidth: 1, padding: 35, margin: 25, borderColor: '#C6C6C6' }}>
                                            <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>There are no comments</Text>
                                        </View>
                                        :
                                        <FlatList
                                            style={{ maxHeight: 200 }}
                                            data={selectedDefect.comments}
                                            ref={flatlistRef}
                                            onContentSizeChange={() => {
                                                if (selectedDefect.comments.length != 0) {
                                                    flatlistRef.current.scrollToEnd({ animated: true })
                                                }
                                            }}
                                            onLayout={() => {
                                                if (selectedDefect.comments.length != 0) {
                                                    flatlistRef.current.scrollToEnd()
                                                }
                                            }}
                                            renderItem={({ item, index }) => {

                                                if (item.sendBy == authState.value.name) {
                                                    return (
                                                        <View key={index} style={{ width: '70%', marginVertical: 10, paddingHorizontal: 20, alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                                                            <Text style={{ fontFamily: 'inter-semibold', fontSize: 13 }}>{item.sendBy}</Text>
                                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 12, marginVertical: 5, color: '#AAAAAA' }}>{new Date(item.timeStamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + new Date(item.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 13 }}>{item.msg}</Text>
                                                        </View>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <View key={index} style={{ width: '70%', marginVertical: 10, paddingHorizontal: 20, alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                                                            <Text style={{ fontFamily: 'inter-semibold', fontSize: 13 }}>{item.sendBy}</Text>
                                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 12, marginVertical: 5, color: '#AAAAAA' }}>{new Date(item.timeStamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + new Date(item.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 13 }}>{item.msg}</Text>
                                                        </View>
                                                    )
                                                }

                                            }} />
                                    }

                                    <View style={{ flexDirection: 'row', marginHorizontal: 25, alignItems: 'center' }}>
                                        <Image style={{ height: 30, width: 30 }} source={require('../../assets/profile_icon.png')} tintColor="#8C8C8C" resizeMode='contain'></Image>
                                        <TextInput
                                            style={[styles.input, { marginLeft: 5 }, searchTextInputBorderColor && styles.withBorderInputContainer]}
                                            placeholder=""
                                            placeholderTextColor="#868383DC"
                                            value={comment}
                                            onChangeText={(val) => { setComment(val) }}
                                            onFocus={() => { setSearchTextInputBorderColor(true) }}
                                            onBlur={() => { setSearchTextInputBorderColor(false) }}
                                        />
                                    </View>
                                    <View style={{ width: 130, marginTop: 20, marginBottom: 25, marginLeft: 25 }}>
                                        <AppBtn
                                            title="Add Comment"
                                            btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#8C8C8C', height: 40 }]}
                                            btnTextStyle={[styles.btnText, { color: '#000000', fontFamily: 'inter-regular', fontSize: 13 }]}
                                            onPress={() => {
                                                if (comment == null || comment == '') { }
                                                else {
                                                    setComment("")
                                                    updateComment()
                                                }

                                            }} />
                                    </View>

                                </View>

                            </View>
                        </View>

                    </ScrollView>

                </TouchableWithoutFeedback>

                <Modal
                    animationType="fade"
                    visible={openCreateWOModal}
                    transparent={true}>
                    <TouchableWithoutFeedback onPress={() => {
                        setMechanicOption(false)
                        setDatePicker(false)
                    }}>
                        <ScrollView style={{ height: 100, width: '100%', backgroundColor: '#555555A0' }}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 30 }}>
                            {/* <Blu intensity={40} tint="dark" style={StyleSheet.absoluteFill} /> */}
                            <View style={{ width: '60%', backgroundColor: '#ffffff' }}>

                                <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#C9C9C9', flexDirection: 'row' }}>
                                    <View>
                                        <Text style={{ fontFamily: 'inter-bold', color: 'grey', fontSize: 18 }}>Create Work Order</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setOpenCreateWOModal(false)}>
                                        <Image style={{ height: 25, width: 25 }} source={require('../../assets/cross_icon.png')}></Image>
                                    </TouchableOpacity>
                                </View>


                                <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20, zIndex: 1 }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 14, marginTop: 20, marginBottom: 20 }}>Asset : {selectedDefect.assetName}</Text>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 14, marginTop: 20, marginBottom: 20 }}>Mileage : {mileage ? mileage : 'n/a'}</Text>
                                    </View>


                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginBottom: 10 }}>Items</Text>
                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                        <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderColor: '#cccccc', }}>
                                            <Image style={{ height: 20, width: 20 }} source={require('../../assets/add_plus_btn_icon.png')} tintColor='#cccccc'></Image>
                                        </View>
                                        <TextInput
                                            style={[styles.input, { borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                                            placeholderTextColor="#868383DC"
                                            placeholder="Add or Create Service Task"
                                            value={addTask}
                                            onChangeText={setAddTask}
                                            onSubmitEditing={handleSave}
                                        />
                                    </View>
                                    <View style={{ marginTop: 15, width: '100%', borderColor: '#6B6B6B' }}>
                                        {workOrderVariable.map((item, index) => {
                                            return (
                                                <WorkOrderVariableTable
                                                    key={index.toString()}
                                                    item={item}
                                                    index={index} />
                                            )
                                        })}
                                    </View>

                                    <View style={{ marginTop: 40, width: '100%', borderWidth: 1, borderColor: '#cccccc', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                                        <View style={{ marginVertical: 15, width: '40%' }}>
                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>Due Date</Text>
                                            <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: '#cccccc', marginTop: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setDatePicker(!datePickerState.value.data)}>
                                                <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>{!selectedDate ? '' : new Date(selectedDate).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                                                <Image style={{ height: 25, width: 24 }} tintColor='#cccccc' source={require('../../assets/calendar_icon.png')} ></Image>
                                            </TouchableOpacity>
                                            {datePickerState.value.data
                                                ?
                                                <View style={{ height: 300, width: 300, position: 'absolute', bottom: 80 }}>
                                                    <DatePicker
                                                        options={{
                                                            backgroundColor: '#FFFFFF',
                                                            textHeaderColor: '#539097',
                                                            textDefaultColor: '#000000',
                                                            selectedTextColor: '#fff',
                                                            mainColor: '#539097',
                                                            textSecondaryColor: '#000000',
                                                            borderColor: 'rgba(122, 146, 165, 0.1)',
                                                        }}
                                                        current={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`}
                                                        selected={`${new Date(selectedDate).getFullYear()}-${String(new Date(selectedDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(selectedDate).getDate()).padStart(2, '0')}`}
                                                        mode="calendar"
                                                        minuteInterval={30}
                                                        style={{ borderRadius: 10 }}
                                                        onDateChange={handleDateChange}
                                                        minimumDate={getFormatedDate(new Date(), 'YYYY/MM/DD')}

                                                    />
                                                </View>
                                                :
                                                null}

                                        </View>

                                        <View style={{ marginVertical: 15, width: '40%', }}>
                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>Assignee</Text>
                                            <View style={{ marginTop: 10, }}>
                                                <DropDownComponent
                                                    options={peopleState.value.data.filter(item => item.Designation.includes('Mechanic')).map(item => item)}
                                                    onValueChange={(val) => {
                                                        setAssignedMechanic(val)
                                                    }}
                                                    // title="Ubaid Arshad"
                                                    info='mechanicSelection'
                                                    selectedValue={assignedMechanic}
                                                    imageSource={require('../../assets/up_arrow_icon.png')}
                                                    container={styles.dropdownContainer}
                                                    dropdownButton={styles.dropdownButton}
                                                    selectedValueStyle={styles.dropdownSelectedValueStyle}
                                                    optionsContainer={styles.dropdownOptionsContainer}
                                                    option={styles.dropdownOption}
                                                    hoveredOption={styles.dropdownHoveredOption}
                                                    optionText={styles.dropdownOptionText}
                                                    hoveredOptionText={styles.dropdownHoveredOptionText}
                                                    dropdownButtonSelect={styles.dropdownButtonSelect}
                                                    dropdownStyle={styles.dropdown}
                                                    onMechanicSelection={(val) => {
                                                        setAssignedMechanic(val.Name)
                                                        setAssignedMechanicId(val['Employee Number'])
                                                    }}
                                                />
                                            </View>


                                        </View>
                                    </View>

                                </View>

                                <View style={{ backgroundColor: '#ffffff', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#C9C9C9', flexDirection: 'row', zIndex: 0 }}>
                                    <View>
                                        <Text style={{ fontFamily: 'inter-medium', color: '#000000', fontSize: 14 }}>This Work will contain {workOrderVariable.length} {workOrderVariable.length < 10 ? "item" : 'items'}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <AppBtn
                                                title="Close"
                                                btnStyle={[{
                                                    width: '100%',
                                                    height: 30,
                                                    backgroundColor: '#FFFFFF',
                                                    borderRadius: 5,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    shadowOffset: { width: 1, height: 1 },
                                                    shadowOpacity: 0.6,
                                                    shadowRadius: 3,
                                                    elevation: 0,
                                                    shadowColor: '#575757',

                                                }, { minWidth: 70 }]}
                                                btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                                onPress={() => {
                                                    setOpenCreateWOModal(false)
                                                    // clearAll()
                                                }} />
                                        </View>
                                        {assignedMechanic != ''
                                            ?
                                            <View style={{ marginLeft: 20 }}>
                                                <AppBtn
                                                    title="Save"
                                                    btnStyle={[{
                                                        width: '100%',
                                                        height: 30,
                                                        backgroundColor: '#FFFFFF',
                                                        borderRadius: 5,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        shadowOffset: { width: 1, height: 1 },
                                                        shadowOpacity: 0.6,
                                                        shadowRadius: 3,
                                                        elevation: 0,
                                                        shadowColor: '#575757',

                                                    }, { minWidth: 70 }]}
                                                    btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                                    onPress={() => {
                                                        setLoading(true)
                                                        setOpenCreateWOModal(false)
                                                        handleSaveWorkOrder()
                                                    }} />
                                            </View>
                                            :
                                            null}

                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>

                </Modal>

                {alertStatus == 'successful'
                    ?

                    <AlertModal
                        centeredViewStyle={styles.centeredView}
                        modalViewStyle={styles.modalView}
                        isVisible={alertIsVisible}
                        onClose={closeAlert}
                        img={require('../../assets/successful_icon.png')}
                        txt='Successful'
                        txtStyle={{ fontWeight: '500', fontSize: 20, marginLeft: 10 }}
                        tintColor='green'>

                    </AlertModal>
                    :
                    alertStatus == 'failed'
                        ?
                        <AlertModal
                            centeredViewStyle={styles.centeredView}
                            modalViewStyle={styles.modalView}
                            isVisible={alertIsVisible}
                            onClose={closeAlert}
                            img={require('../../assets/failed_icon.png')}
                            txt='Failed'
                            txtStyle={{ fontFamily: 'futura', fontSize: 20, marginLeft: 10 }}
                            tintColor='red'>
                        </AlertModal>
                        : null
                }
                {loading
                    ?
                    <View style={styles.activityIndicatorStyle}>
                        <ActivityIndicator color="#23d3d3" size="large" />
                    </View>
                    : null}

            </>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    activityIndicatorStyle: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        backgroundColor: '#555555DD',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        maxHeight: '98%',
        maxWidth: '95%'
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none'
    },
    withBorderInputContainer: {
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFFFFF',
        fontFamily: 'futura-extra-black',
        alignSelf: 'center'
    },
    leftSide: {
        width: 270,
        backgroundColor: '#1E3D5C',
        paddingTop: 50,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    navItem: {
        height: 50,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        alignItems: 'center',
        paddingLeft: 20,
        flexDirection: 'row',
        marginBottom: 10

        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    selectedNavItem: {
        // backgroundColor: '#ccc',
        height: 50,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        alignItems: 'center',
        paddingLeft: 20,
        backgroundColor: '#1383B4',

    },
    navText: {
        fontSize: 14,
        color: '#67E9DA',
        fontWeight: '700',
        opacity: 0.6
    },
    navTextHover: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        opacity: 1,
        fontSize: 16
    },

    contentContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    hoverNavItem: {
        backgroundColor: '#1383B4',

    },

    text: {
        // Custom styles for the text inside dropdown and selected value
        // For example:
        color: '#000000',
    },
    gradient1: {
        ...StyleSheet.absoluteFill,
        opacity: 0.8,
    },
    gradient2: {
        ...StyleSheet.absoluteFill,
        opacity: 0.6,
        transform: [{ rotate: '45deg' }],
    },
    gradient3: {
        ...StyleSheet.absoluteFill,
        opacity: 0.4,
        transform: [{ rotate: '90deg' }],
    },
    gradient4: {
        ...StyleSheet.absoluteFill,
        opacity: 0.2,
        transform: [{ rotate: '135deg' }],
    },
    driverAndAssetAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calenderSortText: {
        fontSize: 17,
        fontWeight: '400',
        color: '#5B5B5B',
    },
    calenderSortSelectedText: {
        color: '#000000',
        borderBottomWidth: 4,
        borderBottomColor: '#67E9DA',
        paddingBottom: 10
    },
    subHeadingText: {
        color: '#1E3D5C',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 10
    },
    contentCardStyle: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        margin: 40,
        // flex:1,
        width: 'auto',
        height: 800
    },
    newContentCardStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        width: '50%'
    },
    btn: {
        width: '100%',
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',

    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10
    },
    formRowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomColor: '#ccc',

        marginTop: 8,
        shadowColor: '#BADBFB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 0,
        // borderRadius: 20,
        // marginLeft: 5,
        // marginRight: 5
    },
    formCellStyle: {
        justifyContent: 'center',
        width: 140,


        // paddingLeft: 20
    },
    formEntryTextStyle: {
        fontFamily: 'inter-regular',
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontSize: 13,
        color: '#000000'
    },

    formColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        // alignItems: 'center',
    },
    formColumnHeaderCellStyle: {
        width: 140,
        // paddingLeft:20

    },
    formColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 13
    },
    dropdownContainer: {
        position: 'relative',


    },
    dropdownButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
    },
    dropdown: {
        // Custom styles for the dropdown container
        // For example:
        // padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
        backgroundColor: '#FFFFFF',
        height: 40,
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',


    },
    dropdownSelectedValueStyle: {
        fontSize: 16,
    },
    dropdownOptionsContainer: {
        position: 'absolute',
        top: '100%',
        right: 0,
        left: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web
            },
        }),

    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropdownHoveredOption: {
        ...(Platform.OS === 'web' && {
            backgroundColor: '#67E9DA',
            cursor: 'pointer',
            transitionDuration: '0.2s',
        }),
    },
    dropdownOptionText: {
        fontSize: 16,
    },
    dropdownHoveredOptionText: {
        ...(Platform.OS === 'web' && {
            color: '#FFFFFF',
        }),
    },
    dropdownButtonSelect: {
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,

        backgroundColor: '#FFFFFF'
    },
});

export default DefectDetail