import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Dimensions, ImageBackground, Modal, ActivityIndicator, TouchableWithoutFeedback, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import { CSVLink } from 'react-csv';
import { DataContext } from '../store/context/DataContext';
import { useContext } from 'react';
import moment from 'moment'
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import app from '../config/firebase';
import AlertModal from '../../components/AlertModal';
import { HeaderOptionContext } from '../store/context/HeaderOptionContext';
import { CloseAllDropDowns } from '../../components/CloseAllDropdown';
import { DatePickerContext } from '../store/context/DatePickerContext';
import { MechanicOptionContext } from '../store/context/MechanicOptionContext';
import { AssetOptionContext } from '../store/context/AssetOptionContext';
import { AssetContext } from '../store/context/AssetContext';
import { WOContext } from '../store/context/WOContext';
import { PeopleContext } from '../store/context/PeopleContext';
import DropDownComponent from '../../components/DropDown';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';



const columns = [
    'formStatus',
    'id',
    'TimeStamp',
    'assetName',
    'driverName',
    'Company name',
    'Form name',
];


const GeneralInspectionPage = (props) => {

    const windowHeight = Dimensions.get('window').height;
    const db = getFirestore(app)

    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const [dashboardHovered, setDashboardHovered] = useState(false)
    const [inspectiondHovered, setInspectionHovered] = useState(false)
    const [maintenanceHovered, setMaintenanceHovered] = useState(false)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [assetsHovered, setAssetsHovered] = useState(false)
    const [usersHovered, setUsersHovered] = useState(false)
    const [inspectionCalendarSelect, setInspectionCalendarSelect] = useState('All')
    const [totalInspections, setTotalInspections] = useState(0)
    const [totalDefects, setTotalDefects] = useState(0)
    const { width, height } = Dimensions.get('window')

    const { state: dataState, setData } = useContext(DataContext)
    const { state: headerOptionState, setHeaderOption } = useContext(HeaderOptionContext)

    const [myData, setMyData] = useState(dataState.value.data ? dataState.value.data : [])
    const [downloadHeader, setDownloadHeader] = useState([])
    const [downloadData, setDownloadData] = useState([])
    const [formValue, setFormValue] = useState(props.form)
    const [driverPicture, setDriverPicture] = useState(null)
    const [groups, setGroups] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const [loading, setLoading] = useState(false)
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')

    const [workOrderVariable, setWorkOrderVariable] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState('')
    const [prioritySelectedOption, setPrioritySelectedOption] = useState('Undefined')
    const [addTask, setAddTask] = useState('')
    const [assignedMechanic, setAssignedMechanic] = useState('')
    const [assignedMechanicId, setAssignedMechanicId] = useState(0)
    const [selectedAssetId, setSelectedAssetId] = useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date().getTime());

    const [openCustomWO, setOpenCustomWO] = useState(false)
    const { state: datePickerState, setDatePicker } = useContext(DatePickerContext)
    const { state: mechanicOptionState, setMechanicOption } = useContext(MechanicOptionContext)
    const { state: assetOptionState, setAssetOption } = useContext(AssetOptionContext)
    const { state: woState, setWO } = useContext(WOContext)
    const { state: assetState, } = useContext(AssetContext)
    const { state: peopleState } = useContext(PeopleContext)

    const fetchData = async () => {

        let list = []
        await getDocs(collection(db, 'Forms'))
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    list.push(doc.data())
                })
            })
        setData(list)
        setLoading(false)
    }

    useEffect(() => {
        if (dataState.value.data.length != 0) {
            const def = dataState.value.data.filter(item => item.formStatus === 'Failed');
            setTotalInspections(dataState.value.data.length)
            setTotalDefects(def.length)
        }
        // console.log(formValue.length)

    }, [loading])

    useEffect(() => {

        if (inspectionCalendarSelect == 'All') {
            if (dataState.value.data.length != 0) {

                const propertyNamesArray = Object.keys(dataState.value.data[0]);

                const propertiesToRemove = ["form", "signature", 'location', 'leftImage', 'rightImage', 'backImage', 'frontImage'];

                const filteredData = propertyNamesArray.filter(propertyName => !propertiesToRemove.includes(propertyName));
                //   const finalArray = filteredPropertyNamesArray.filter(propertyName => propertyName !== 'location');

                setDownloadHeader(filteredData);

                const newData = dataState.value.data.map(({ form, location, signature, ...rest }) => rest);

                //   console.log(newData)

                const newData1 = newData.map(({ TimeStamp: { seconds, ...rest }, ...obj }) => ({ ...obj, TimeStamp: ((new Date(seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })).toString() }));

                //   const newData = data.map(({ age: { current, ...rest }, ...obj }) => ({ ...obj, age: current }));

                // const finalData = newData1.map(({ duration, ...rest }) => ({ ...rest, duration: (moment.duration(duration).minutes() + ':' + moment.duration(duration).seconds() + " minutes").toString }));


                const finalData = newData1.map(obj => ({
                    ...obj,
                    duration: moment.duration(obj.duration).minutes() + ':' + moment.duration(obj.duration).seconds() + " minutes",
                }));

                setDownloadData(finalData)
            }
        }

        else if (inspectionCalendarSelect == 'Failed') {

            if (dataState.value.data.length != 0) {

                const workingData = dataState.value.data.filter(item => item.formStatus === 'Failed');

                const propertyNamesArray = Object.keys(workingData[0]);

                const propertiesToRemove = ["form", "signature", 'location', 'leftImage', 'rightImage', 'backImage', 'frontImage'];

                const filteredData = propertyNamesArray.filter(propertyName => !propertiesToRemove.includes(propertyName));
                //   const finalArray = filteredPropertyNamesArray.filter(propertyName => propertyName !== 'location');

                setDownloadHeader(filteredData);

                const newData = workingData.map(({ form, location, signature, ...rest }) => rest);

                //   console.log(newData)

                const newData1 = newData.map(({ TimeStamp: { seconds, ...rest }, ...obj }) => ({ ...obj, TimeStamp: ((new Date(seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })).toString() }));

                //   const newData = data.map(({ age: { current, ...rest }, ...obj }) => ({ ...obj, age: current }));

                // const finalData = newData1.map(({ duration, ...rest }) => ({ ...rest, duration: (moment.duration(duration).minutes() + ':' + moment.duration(duration).seconds() + " minutes").toString }));


                const finalData = newData1.map(obj => ({
                    ...obj,
                    duration: moment.duration(obj.duration).minutes() + ':' + moment.duration(obj.duration).seconds() + " minutes",
                }));

                setDownloadData(finalData)
            }
        }

        else if (inspectionCalendarSelect == 'Pass') {

            if (dataState.value.data.length != 0) {

                const workingData = dataState.value.data.filter(item => item.formStatus === 'Passed');

                const propertyNamesArray = Object.keys(workingData[0]);

                const propertiesToRemove = ["form", "signature", 'location', 'leftImage', 'rightImage', 'backImage', 'frontImage'];

                const filteredData = propertyNamesArray.filter(propertyName => !propertiesToRemove.includes(propertyName));
                //   const finalArray = filteredPropertyNamesArray.filter(propertyName => propertyName !== 'location');

                setDownloadHeader(filteredData);

                const newData = workingData.map(({ form, location, signature, ...rest }) => rest);

                //   console.log(newData)

                const newData1 = newData.map(({ TimeStamp: { seconds, ...rest }, ...obj }) => ({ ...obj, TimeStamp: ((new Date(seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })).toString() }));

                //   const newData = data.map(({ age: { current, ...rest }, ...obj }) => ({ ...obj, age: current }));

                // const finalData = newData1.map(({ duration, ...rest }) => ({ ...rest, duration: (moment.duration(duration).minutes() + ':' + moment.duration(duration).seconds() + " minutes").toString }));


                const finalData = newData1.map(obj => ({
                    ...obj,
                    duration: moment.duration(obj.duration).minutes() + ':' + moment.duration(obj.duration).seconds() + " minutes",
                }));

                setDownloadData(finalData)
            }
        }


    }, [inspectionCalendarSelect, loading])

    useEffect(() => {

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        return () => {
            fadeAnim.setValue(0);
        }
    }, [selectedPage])

    useEffect(() => {
        const groupData = (data) => {
            const groups = [];
            let currentGroup = [];
            let groupValue; // Store the group value outside the object array

            for (const item of data) {
                if (
                    currentGroup.length >= 5 ||
                    !currentGroup.length ||
                    currentGroup[0].type !== item.type
                ) {
                    if (currentGroup.length) {
                        // Determine the group value based on the presence of 'Fail' values
                        groupValue = currentGroup.some(obj => obj.value === 'Fail') ? 'Fail' : 'Pass';

                        // Add the group value to the first object in the group
                        currentGroup[0].groupValue = groupValue;

                        groups.push([...currentGroup]);
                    }
                    currentGroup = [item];
                } else {
                    currentGroup.push(item);
                }
            }

            if (currentGroup.length) {
                // Determine the group value for the last group
                groupValue = currentGroup.some(obj => obj.value === 'Fail') ? 'Fail' : 'Pass';

                // Add the group value to the first object in the last group
                currentGroup[0].groupValue = groupValue;

                groups.push([...currentGroup]);
            }

            return groups;
        };

        // Group the data
        if (formValue.length != 0) {
            const groupedData = groupData(formValue.form);
            // console.log(groupedData)
            setGroups(groupedData)
        }


    }, [formValue])


    const handleDownloadReportBtn = () => {

    }


    const handleFormValue = async (value) => {

        props.onDashboardValue(value)

    }



    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const clearAll = () => {
        setSelectedAsset('')
        setSelectedAssetId(0)
        setAssignedMechanic('')
        setAssignedMechanicId(0)
        setAddTask('')
        setSelectedDate(new Date().getTime())

    }

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

    const WorkOrderVariableTable = useCallback(({ item, index }) => {

        const [hover, setHover] = useState(false)

        const handleDeleteWorkOrderItem = (index) => {
            const temp = [...workOrderVariable]
            const updatedItems = temp.filter((item, i) => i !== index);
            setWorkOrderVariable(updatedItems)

        }

        return (
            <View style={{ flexDirection: 'row', padding: 15, borderWidth: 1, borderColor: '#cccccc', alignItems: 'center', width: '100%' }}>
                <View style={{ minWidth: 100 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>#{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.title}</Text>
                </View >
                <View style={{ minWidth: 250, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 25, width: 25 }} tintColor="#cccccc" source={require('../../assets/calendar_icon.png')}></Image>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginLeft: 10 }}>{(new Date()).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                </View>
                <TouchableOpacity style={{ height: 40, width: 60, borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, alignItems: 'center', justifyContent: 'center ' }} onPress={() => handleDeleteWorkOrderItem(index)}>
                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/delete_icon.png')} tintColor="#4D4D4D"></Image>
                </TouchableOpacity>
            </View>
        )
    }, [workOrderVariable])

    const handleDateChange = (dateString) => {

        const [year, month, day] = dateString.split("/");
        const dateObject = new Date(`${year}-${month}-${day}`);
        const milliseconds = dateObject.getTime();
        setSelectedDate(milliseconds)
        // setOpenCalendar(false)
        setDatePicker(false)
    };

    const fetchDataAndRoute = async () => {
        await getDocs(query(collection(db, 'WorkOrders'), orderBy('TimeStamp', 'desc')))
            .then((snapshot) => {
                let temp = []
                snapshot.forEach((docs) => {
                    temp.push(docs.data())
                })

                setWO([...temp])
                setLoading(false)
                props.onDashboardValueChange(temp[0])
            })
    }

    const handleSaveWorkOrder = async () => {

        try {
            let temp = []
            await getDocs(query(collection(db, 'WorkOrders'), orderBy('TimeStamp', 'desc')))
                .then((snapshot) => {
                    snapshot.forEach((docs) => {
                        temp.push(docs.data())
                    })
                })
            if (temp.length == 0) {

                await setDoc(doc(db, 'WorkOrders', '1'), {
                    id: 1,
                    'assetNumber': selectedAssetId.toString(),
                    'driverEmployeeNumber': '',
                    'driverName': '',
                    'defectID': '',
                    'defectedItems': [...workOrderVariable.map(item => ({
                        'title': item.title,
                        'TimeStamp': item.timeStamp,
                    }))],
                    'assignedMechanic': assignedMechanicId.toString(),
                    'dueDate': selectedDate,
                    'status': 'Pending',
                    'mileage': '',
                    'comments': [],
                    'completionDate': 0,
                    'severity': 'Undefined',
                    'priority': prioritySelectedOption,
                    'TimeStamp': serverTimestamp(),
                    'partsTax': '',
                    'laborTax': ''
                })

                // setAlertStatus('successful')
                // setAlertIsVisible(true)
                fetchDataAndRoute()
            }
            else {

                await setDoc(doc(db, 'WorkOrders', (temp[0].id + 1).toString()), {
                    id: (temp[0].id + 1),
                    'assetNumber': selectedAssetId.toString(),
                    'driverEmployeeNumber': '',
                    'driverName': '',
                    'defectID': '',
                    'defectedItems': [...workOrderVariable.map(item => ({
                        'title': item.title,
                        'TimeStamp': item.timeStamp,
                    }))],
                    'assignedMechanic': assignedMechanicId.toString(),
                    'dueDate': selectedDate,
                    'status': 'Pending',
                    'mileage': '',
                    'comments': [],
                    'completionDate': 0,
                    'severity': 'Undefined',
                    'priority': prioritySelectedOption,
                    'TimeStamp': serverTimestamp(),
                    'partsTax': '',
                    'laborTax': ''
                })
                fetchDataAndRoute()
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setAlertStatus('failed')
            setAlertIsVisible(true)
        }
    }



    return (

        <>
            <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#f6f8f9' }}
                onPress={() => {
                    CloseAllDropDowns()
                }}>
                <ScrollView style={{ height: 100 }}>

                    <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, marginRight: 40, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
                                <Image style={{ width: 30, height: 30, margin: 7 }}
                                    tintColor='#FFFFFF'
                                    source={require('../../assets/inspection_icon.png')}></Image>
                            </View>
                            <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                Inspection
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{totalInspections}</Text>
                            <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Inspections</Text>
                            <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 20, opacity: 0.5 }}></View>
                            <Text style={{ fontSize: 45, color: '#D60000' }}>{totalDefects}</Text>
                            <Text style={{ fontSize: 15, color: '#D60000', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Defects</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 30, paddingLeft: 40, paddingRight: 40 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', }} onPress={() => setInspectionCalendarSelect("All")}>
                                <Text style={{ color: inspectionCalendarSelect == 'All' ? 'white' : 'grey', fontFamily: 'inter-bold', fontSize: inspectionCalendarSelect == 'All' ? 16 : 14, padding: 10, backgroundColor: inspectionCalendarSelect == 'All' ? '#335a75' : null, borderWidth: inspectionCalendarSelect == 'All' ? 1 : 0, borderColor: '#335a75', borderRadius: 10 }}>
                                    All
                                </Text>
                            </TouchableOpacity >
                            <TouchableOpacity style={{ flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => setInspectionCalendarSelect("Failed")}>
                                <Text style={{ color: inspectionCalendarSelect == 'Failed' ? 'white' : 'grey', fontFamily: 'inter-bold', fontSize: inspectionCalendarSelect == 'Failed' ? 16 : 14, padding: 10, backgroundColor: inspectionCalendarSelect == 'Failed' ? '#335a75' : null, borderWidth: inspectionCalendarSelect == 'Failed' ? 1 : 0, borderColor: '#335a75', borderRadius: 10 }}>
                                    Failed
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => setInspectionCalendarSelect("Pass")}>
                                <Text style={{ color: inspectionCalendarSelect == 'Pass' ? 'white' : 'grey', fontFamily: 'inter-bold', fontSize: inspectionCalendarSelect == 'Pass' ? 16 : 14, padding: 10, backgroundColor: inspectionCalendarSelect == 'Pass' ? '#335a75' : null, borderWidth: inspectionCalendarSelect == 'Pass' ? 1 : 0, borderColor: '#335a75', borderRadius: 10 }}>
                                    Pass
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ marginRight: 10 }}>
                                <CSVLink style={{ textDecorationLine: 'none' }} data={downloadData} headers={downloadHeader} filename={"general_inspection_report.csv"}>
                                    <AppBtn
                                        title="Download Report"
                                        btnStyle={styles.btn}
                                        btnTextStyle={styles.btnText}
                                        onPress={handleDownloadReportBtn} />
                                </CSVLink>
                            </View>
                            <View >
                                <AppBtn
                                    title="Create Work Order"
                                    imgSource={require('../../assets/add_plus_btn_icon.png')}
                                    btnStyle={[styles.btn, {}]}
                                    btnTextStyle={[styles.btnText, { marginLeft: 0 }]}
                                    onPress={() => {
                                        clearAll()
                                        setAssetOption(false)
                                        setMechanicOption(false)
                                        setDatePicker(false)
                                        setOpenCustomWO(true)
                                    }} />
                            </View>

                        </View>

                    </View>
                    {
                        dataState.value.data
                            ?
                            inspectionCalendarSelect == 'All'
                                ?
                                <View style={styles.contentCardStyle}>

                                    <Form
                                        columns={columns}
                                        entriesData={dataState.value.data}
                                        titleForm="General Inspection"
                                        onValueChange={handleFormValue}
                                        row={styles.formRowStyle}
                                        cell={styles.formCellStyle}
                                        entryText={styles.formEntryTextStyle}
                                        columnHeaderRow={styles.formColumnHeaderRowStyle}
                                        columnHeaderCell={styles.formColumnHeaderCellStyle}
                                        columnHeaderText={styles.formColumnHeaderTextStyle} />



                                </View>
                                :
                                inspectionCalendarSelect == 'Failed'
                                    ?
                                    <View style={styles.contentCardStyle}>
                                        <Form
                                            columns={columns}
                                            entriesData={dataState.value.data.filter(item => item.formStatus === 'Failed')}
                                            titleForm="General Inspection"
                                            onValueChange={handleFormValue}
                                            row={styles.formRowStyle}
                                            cell={styles.formCellStyle}
                                            entryText={styles.formEntryTextStyle}
                                            columnHeaderRow={styles.formColumnHeaderRowStyle}
                                            columnHeaderCell={styles.formColumnHeaderCellStyle}
                                            columnHeaderText={styles.formColumnHeaderTextStyle} />
                                    </View>
                                    :
                                    inspectionCalendarSelect == 'Pass'
                                        ?
                                        <View style={styles.contentCardStyle}>
                                            <Form
                                                columns={columns}
                                                entriesData={dataState.value.data.filter(item => item.formStatus === 'Passed')}
                                                titleForm="General Inspection"
                                                onValueChange={handleFormValue}
                                                row={styles.formRowStyle}
                                                cell={styles.formCellStyle}
                                                entryText={styles.formEntryTextStyle}
                                                columnHeaderRow={styles.formColumnHeaderRowStyle}
                                                columnHeaderCell={styles.formColumnHeaderCellStyle}
                                                columnHeaderText={styles.formColumnHeaderTextStyle} />
                                        </View>
                                        :
                                        null

                            :
                            null}


                </ScrollView>
            </TouchableWithoutFeedback>

            <Modal
                animationType="fade"
                visible={deleteModal}
                transparent={true}>
                <View style={styles.centeredView}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.modalView}>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '400' }}>Are you sure you want to Delete ?</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 250, justifyContent: 'space-between', marginTop: 20 }}>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [0]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [0]: false })}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        setDeleteModal(false)
                                        setLoading(true)
                                        // console.log(formValue.id)
                                        await deleteDoc(doc(db, "Forms", formValue.id.toString()));
                                        console.log('deleted')
                                        setFormValue([])
                                        setAlertStatus('successful')
                                        setAlertIsVisible(true)
                                        fetchData()
                                    }}

                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[0] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[0] && { color: '#FFFFFF' }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [1]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [1]: false })}>
                                <TouchableOpacity
                                    onPress={() => setDeleteModal(false)}
                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[1] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[1] && { color: '#FFFFFF' }]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType="fade"
                visible={openCustomWO}
                transparent={true}>
                <TouchableWithoutFeedback onPress={() => {
                    CloseAllDropDowns()
                }}>
                    <ScrollView style={{ height: 100, width: '100%', backgroundColor: '#555555A0' }}
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 30 }}>
                        {/* <Blu intensity={40} tint="dark" style={StyleSheet.absoluteFill} /> */}
                        <View style={{ width: '60%', backgroundColor: '#ffffff' }}>

                            <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#C9C9C9', flexDirection: 'row' }}>
                                <View>
                                    <Text style={{ fontFamily: 'inter-bold', color: 'grey', fontSize: 18 }}>Add Items</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setWorkOrderVariable([])
                                    setOpenCustomWO(false)
                                }}>
                                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/cross_icon.png')}></Image>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20, zIndex: 1 }}>
                                <View style={{ marginVertical: 15, width: '100%', zIndex: datePickerState.value.data == true ? 2 : 3 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>Assets</Text>
                                            <View style={{ marginTop: 10, }}>
                                                <DropDownComponent
                                                    options={assetState.value.data.map(item => item)}
                                                    onValueChange={(val) => {
                                                        setSelectedAsset(val)
                                                    }}
                                                    // title="Ubaid Arshad"
                                                    info='assetSelection'
                                                    selectedValue={selectedAsset}
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
                                                    dropdownStyle={[styles.dropdown, { minWidth: 350 }]}
                                                    onAssetSelection={(val) => {
                                                        setSelectedAsset(val['Asset Name'])
                                                        setSelectedAssetId(val['Asset Number'])
                                                    }}

                                                />
                                            </View>
                                        </View>
                                        {selectedAsset != ''
                                            ?
                                            <View>
                                                <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>Priority</Text>
                                                <View style={{ marginTop: 10, }}>
                                                    <DropDownComponent
                                                        options={["High", "Medium", "Low", "Undefined"]}
                                                        onValueChange={(val) => {
                                                            setPrioritySelectedOption(val)
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
                                                        dropdownStyle={[styles.dropdown, { minWidth: 350 }]}
                                                    />
                                                </View>
                                            </View>
                                            :
                                            null}
                                    </View>

                                </View>

                                {selectedAsset != ''
                                    ?
                                    <>
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
                                        <View style={{ marginTop: 40, width: '100%', borderWidth: 1, borderColor: '#cccccc', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, zIndex: 2 }}>
                                            <View style={{ marginVertical: 15, width: '40%' }}>
                                                <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>Due Date</Text>
                                                <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: '#cccccc', marginTop: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => {
                                                    CloseAllDropDowns()
                                                    setDatePicker(!datePickerState.value.data)
                                                }}>
                                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>{!selectedDate ? '' : new Date(selectedDate).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                                                    <Image style={{ height: 25, width: 24 }} tintColor='#cccccc' source={require('../../assets/calendar_icon.png')} ></Image>
                                                </TouchableOpacity>
                                                {datePickerState.value.data
                                                    ?
                                                    <View style={{ height: 300, width: 300, position: 'absolute', bottom: 80, zIndex: 3 }}>
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
                                    </>
                                    :
                                    null}
                            </View>
                            <View style={{ backgroundColor: '#ffffff', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#C9C9C9', flexDirection: 'row', zIndex: 0 }}>
                                <View>
                                    <Text style={{ fontFamily: 'inter-medium', color: '#000000', fontSize: 14 }}>This Work will contain {workOrderVariable.length} {workOrderVariable.length < 2 ? "item" : 'items'}</Text>
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
                                                setWorkOrderVariable([])
                                                setOpenCustomWO(false)
                                                // clearAll()
                                            }} />
                                    </View>
                                    {selectedAsset != '' ?
                                        assignedMechanic != ''
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
                                                        setOpenCustomWO(false)
                                                        handleSaveWorkOrder()
                                                    }} />
                                            </View>
                                            :
                                            null
                                        :
                                        null
                                    }

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

            {loading ?
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator color="#23d3d3" size="large" />
                </View>
                : null}

        </>

    );
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
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFFFFF',
        fontFamily: 'futura-extra-black',
        alignSelf: 'center'
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
    dropdown: {
        // Custom styles for the dropdown container
        // For example:
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
    },
    dropdownProfile: {
        padding: 12,
        minWidth: 100,
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
        fontSize: 14,
        fontFamily: 'inter-semibold',
        color: '#A8A8A8',
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
        height: 800,
        // overflow: 'scroll'
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
        // marginRight: 5,
        width: 'auto',
        justifyContent: 'space-between'
    },
    formCellStyle: {
        justifyContent: 'center',
        flex: 1,
        minHeight: 50,
        maxWidth: 150

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
        width: 'auto',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    formColumnHeaderCellStyle: {
        // width: 160,
        // paddingLeft:20
        flex: 1,
        maxWidth: 150

    },
    formColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 13
    },
    selectedFormPropertyStyle: {
        fontFamily: 'inter-regular',
        fontSize: 15,
        width: 150,
        height: 25
    },
    selectedFormKeyStyle: {
        fontFamily: 'inter-semibold',
        fontSize: 15,
        // width: 150,
        height: 25
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
        minWidth: 150,
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

        // borderColor: '#23d3d3',
        backgroundColor: '#FFFFFF'
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
});

export default GeneralInspectionPage