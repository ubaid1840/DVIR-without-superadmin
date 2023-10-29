import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Dimensions, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import { CSVLink } from 'react-csv';
import { collection, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import app from '../config/firebase';
import { PeopleContext } from '../store/context/PeopleContext';
import DropDownComponent from '../../components/DropDown';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import AlertModal from '../../components/AlertModal';
import { AssetContext } from '../store/context/AssetContext';
import { InHouseWOContext } from '../store/context/InHouseWOContext';
import {OilChangeWOContext} from '../store/context/OilChangeWOContext'
import { subscribeToCollectionInHouseWorkOrder } from './inHouseWorkOrderFirebaseService';
import {subscribeToCollectionOilChangeWorkOrder} from './oilChangeWorkOrderFirebaseService'
import { DatePickerContext } from '../store/context/DatePickerContext';
import {MechanicOptionContext} from '../store/context/MechanicOptionContext'
import { HeaderOptionContext } from '../store/context/HeaderOptionContext';
import { CloseAllDropDowns } from '../../components/CloseAllDropdown';


const columns = [
    'Asset Name',
    'lastOilChange',
    'currentMileage',
    'nextOilChange',
    'Asset Type',
    'Make',
    'Model',
    'Action'
];

const entriesData = [
    {
        'Status': 'Status',
        'Asset Name': 'Asset 1',
        'Last Inspection': '2023-07-15',
        'Next Inspection': '2023-08-16',
        'Asset License Plate': 'ABC-1234',
        'Asset VIN': 'VIN-5678',
        'Asset Type': 'Truck',
        'Asset Make': 'Ford',
        'Asset Model': 'F-150',
    },
    {
        'Status': 'Status',
        'Asset Name': 'Asset 2',
        'Last Inspection': '2023-07-30',
        'Next Inspection': '2023-08-30',
        'Asset License Plate': 'DEF-5678',
        'Asset VIN': 'VIN-2345',
        'Asset Type': 'Car',
        'Asset Make': 'Toyota',
        'Asset Model': 'Corolla',
    },
    {
        'Status': 'Status',
        'Asset Name': 'Asset 3',
        'Last Inspection': '2023-06-01',
        'Next Inspection': '2023-08-08',
        'Asset License Plate': 'GHI-9012',
        'Asset VIN': 'VIN-6789',
        'Asset Type': 'Van',
        'Asset Make': 'Honda',
        'Asset Model': 'Civic',
    },
    {
        'Status': 'Status',
        'Asset Name': 'Asset 4',
        'Last Inspection': '2023-04-05',
        'Next Inspection': '2023-07-17',
        'Asset License Plate': 'JKL-3456',
        'Asset VIN': 'VIN-7890',
        'Asset Type': 'Truck',
        'Asset Make': 'Chevrolet',
        'Asset Model': 'Silverado',
    },
    {
        'Status': 'Status',
        'Asset Name': 'Asset 5',
        'Last Inspection': '2023-07-01',
        'Next Inspection': '2023-08-12',
        'Asset License Plate': 'MNO-7890',
        'Asset VIN': 'VIN-3456',
        'Asset Type': 'Car',
        'Asset Make': 'Ford',
        'Asset Model': 'F-150',
    },
];

const OilChangePage = (props) => {

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
    const [assets, setAssets] = useState([])
    const [loading, setLoading] = useState(true)
    const [openCustomWO, setOpenCustomWO] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState('')
    const [workOrderVariable, setWorkOrderVariable] = useState([]);
    const [assignedMechanic, setAssignedMechanic] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date().getTime());
    const [openCalendar, setOpenCalendar] = useState(false)
    const [addTask, setAddTask] = useState('')
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [assignedMechanicId, setAssignedMechanicId] = useState(0)

    const { state: peopleState } = useContext(PeopleContext)
    const { state: assetState, setAssetData } = useContext(AssetContext)
    const {state : oilChangeWOState} = useContext(OilChangeWOContext)
    const { state: datePickerState, setDatePicker } = useContext(DatePickerContext)
    const {state: mechanicOptionState, setMechanicOption} = useContext(MechanicOptionContext)
    const {state: headerOptionState, setHeaderOption} = useContext(HeaderOptionContext)




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

        fetchData()
        const unsubscribe = subscribeToCollectionOilChangeWorkOrder('myCollection', (newData) => {

            console.log(newData)
        });

        return () => {
            unsubscribe();
        };
    }, []);

    function calculateInspectionStatus(objects) {
        const currentDate = new Date().getTime();
        let inspectionsDueIn7Days = 0;
        let inspectionsAlreadyDue = 0;

        for (const obj of objects) {
            const lastInspectionDate = new Date(obj.lastInspection.seconds * 1000);
            const nextInspectionDate = new Date(lastInspectionDate);
            nextInspectionDate.setDate(nextInspectionDate.getDate() + 45);

            const timeDifferenceInMilliseconds = nextInspectionDate.getTime() - currentDate;
            const timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);

            if (timeDifferenceInMilliseconds < 0) {
                inspectionsAlreadyDue++;
            }

            else if (timeDifferenceInDays <= 7) {
                inspectionsDueIn7Days++;
            }


        }

        const totalInspections = objects.length;
        const totalInspectionsDue = inspectionsDueIn7Days + inspectionsAlreadyDue;

        return {
            inspectionsDueIn7Days,
            inspectionsAlreadyDue,
            totalInspectionsDue,
            totalInspections,
        };
    }


    const fetchData = async () => {

        let temp = []
        await getDocs(collection(db, 'Assets'), orderBy('TimeStamp', 'desc'))
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    temp.push(doc.data())
                })
            })
            const list = []

        if (temp.length != 0) {
            temp.map((object) => {
                const lastOil = object.LastOil
                const currentMileage = object.Mileage
                const nextOilChange = parseInt(lastOil) + parseInt(object.Frequency)

                if(currentMileage >= nextOilChange){
                    list.push(object)
                }

              
            });

            setTotalInspections(list.length)
            setAssets(temp)
            setAssetData(temp)
           
        }

        setLoading(false)

        // new Date(selectedDefect.dateCreated.seconds * 1000).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' })
    }

    const handleDownloadReportBtn = () => {

    }

    const handleOilChangeFormValue = (value) => {

        // console.log(value)
        const myWO = oilChangeWOState.value.data.filter((item) => item.assetNumber == value['Asset Number']) 
        // console.log(myWO[0])
        props.onDashboardOilChangeValueChange(myWO[0])

    }


    const handleFormValue = async (value) => {

        setSelectedAsset(value)
        setMechanicOption(false)
        setDatePicker(false)
        setAssignedMechanic('')
        setAssignedMechanicId(0)
        setSelectedDate(new Date().getTime())
        setOpenCustomWO(true)
    }

    const OilChangeValueChange = () => {
        props.onDashbordOilChangeInspection(value)
    }

    let newStatus = ''

    const entriesDataCSV = entriesData.map((entry) => {

        const today = new Date().getTime(); // Get the current timestamp in milliseconds
        const lastInspectionDate = new Date(entry['Last Inspection']).getTime(); // Convert Last Inspection date to timestamp
        const nextInspectionDate = new Date(entry['Next Inspection']).getTime(); // Convert Next Inspection date to timestamp
        const timeDifferenceInMilliseconds = nextInspectionDate - today;
        const timeDifferenceInDays = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

        if (lastInspectionDate > nextInspectionDate) {
            newStatus = 'Inspection done'
        } else if (timeDifferenceInMilliseconds < 0) {
            newStatus = 'Inspection due'
        } else if (timeDifferenceInDays <= 3) {
            newStatus = timeDifferenceInDays + ' days left'
        } else if (timeDifferenceInDays <= 7) {
            newStatus = timeDifferenceInDays + ' days left'
        } else {
            newStatus = 'Inspection done'
        }
        return {
            ...entry,
            Status: newStatus, // Update the 'Status' property with the new value
        };
    });

    // console.log(entriesDataCSV);

    const handleDateChange = (dateString) => {

        const [year, month, day] = dateString.split("/");
        const dateObject = new Date(`${year}-${month}-${day}`);
        const milliseconds = dateObject.getTime();
        setSelectedDate(milliseconds)
        // setOpenCalendar(false)
        setDatePicker(false)
    };

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const handleSaveWorkOrder = async () => {


        try {
            let temp = []
            await getDocs(query(collection(db, 'OilChangeWorkOrders'), orderBy('TimeStamp', 'desc')))
                .then((snapshot) => {
                    snapshot.forEach((docs) => {
                        temp.push(docs.data())
                    })
                })
            if (temp.length == 0) {
                setDoc(doc(db, 'OilChangeWorkOrders', '1'), {
                    id: 1,
                    'assetNumber': selectedAsset['Asset Number'].toString(),
                    'driverEmployeeNumber': '',
                    'driverName': '',
                    'defectID': '',
                    'defectedItems': [{
                        'description' : '',
                        'labor' : '',
                        'parts' : '',
                        'priority' : 'undefined',
                        'qty' : '',
                        'timeStamp' : new Date().getTime(),
                        'title' : 'Oil change',
                        'total' : ''
                    }],
                    'assignedMechanic': assignedMechanicId.toString(),
                    'dueDate': selectedDate,
                    'status': 'Pending',
                    'mileage': selectedAsset.Mileage,
                    'comments': [],
                    'completionDate': 0,
                    'severity': 'Undefined',
                    'priority': 'Undefined',
                    'TimeStamp': serverTimestamp(),
                    'partsTax': '',
                    'laborTax': ''
                })
                await updateDoc(doc(db, 'Assets', selectedAsset['Asset Number'].toString()), {
                    'oilChangeWorkOrder': 1
                })
                fetchData()
                setAlertStatus('successful')
                setAlertIsVisible(true)
            }
            else {
                setDoc(doc(db, 'OilChangeWorkOrders', (temp[0].id + 1).toString()), {
                    id: (temp[0].id + 1),
                    'assetNumber': selectedAsset['Asset Number'].toString(),
                    'driverEmployeeNumber': '',
                    'driverName': '',
                    'defectID': '',
                    'defectedItems': [{
                        'description' : '',
                        'labor' : '',
                        'parts' : '',
                        'priority' : 'undefined',
                        'qty' : '',
                        'timeStamp' : new Date().getTime(),
                        'title' : 'Oil change',
                        'total' : ''
                    }],
                    'assignedMechanic': assignedMechanicId.toString(),
                    'dueDate': selectedDate,
                    'status': 'Pending',
                    'mileage': selectedAsset.Mileage,
                    'comments': [],
                    'completionDate': 0,
                    'severity': 'Undefined',
                    'priority': 'Undefined',
                    'TimeStamp': serverTimestamp(),
                    'partsTax': '',
                    'laborTax': ''
                })
                await updateDoc(doc(db, 'Assets', selectedAsset['Asset Number'].toString()), {
                    'oilChangeWorkOrder': (temp[0].id + 1)
                })
                fetchData()
                setAlertStatus('successful')
                setAlertIsVisible(true)
            }

        } catch (error) {
            console.log(error)
            setLoading(false)
            setAlertStatus('failed')
            setAlertIsVisible(true)
        }

    }

    return (

        <View style={{ flex: 1, backgroundColor: '#f6f8f9' }}>
            {/* <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} /> */}
            <TouchableWithoutFeedback onPress={()=>{
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
                            Oil Change
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{totalInspections}</Text>
                        <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Due oil change</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 30, paddingLeft: 40, paddingRight: 40 }}>
                    {/* <CSVLink style={{ textDecorationLine: 'none' }} data={assets} headers={columns} filename={"45_days_due_report.csv"}>
                        <View >
                            <AppBtn
                                title="Download Report"
                                btnStyle={styles.btn}
                                btnTextStyle={styles.btnText}
                                onPress={handleDownloadReportBtn}></AppBtn>
                        </View>
                    </CSVLink> */}
                </View>
                <View style={styles.contentCardStyle}>
                    {!loading ?
                        <Form
                            columns={columns}
                            entriesData={assets}
                            titleForm="Oil Change"
                            onValueChange={(val) => {
                                // setLoading(true)
                                handleFormValue(val)
                            }}
                            oilChangeValueChange={(val) => { handleOilChangeFormValue(val) }}
                            row={styles.formRowStyle}
                            cell={styles.formCellStyle}
                            entryText={styles.formEntryTextStyle}
                            columnHeaderRow={styles.formColumnHeaderRowStyle}
                            columnHeaderCell={styles.formColumnHeaderCellStyle}
                            columnHeaderText={styles.formColumnHeaderTextStyle} />
                        : null}

                </View>
            </ScrollView>
            </TouchableWithoutFeedback>

            <Modal
                animationType="fade"
                visible={openCustomWO}
                transparent={true}>
                <TouchableWithoutFeedback onPress={()=> {
                    setMechanicOption(false)
                    setDatePicker(false)}}>
                    <ScrollView style={{ backgroundColor: '#555555A0' }}
                        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
                        {/* <Blu intensity={40} tint="dark" style={StyleSheet.absoluteFill} /> */}
                        <View style={{ width: '60%', backgroundColor: '#ffffff' }}>

                            <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#C9C9C9', flexDirection: 'row' }}>
                                <View>
                                    <Text style={{ fontFamily: 'inter-bold', color: 'grey', fontSize: 18 }}>Work Order</Text>
                                </View>
                                <TouchableOpacity onPress={() => setOpenCustomWO(false)}>
                                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/cross_icon.png')}></Image>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20, zIndex: 1 }}>


                                {selectedAsset != ''
                                    ?
                                    <>
                                        <View style={{ marginTop: 40, width: '100%', borderWidth: 1, borderColor: '#cccccc', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                                            <View style={{ marginVertical: 15, width: '40%' }}>
                                                <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>Due Date</Text>
                                                <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: '#cccccc', marginTop: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => {
                                                    CloseAllDropDowns()
                                                    setDatePicker(!datePickerState.value.data)}}>
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
                                    </>
                                    :
                                    null}
                            </View>
                            <View style={{ backgroundColor: '#ffffff', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#C9C9C9', flexDirection: 'row', zIndex: 0 }}>
                                <View>
                                    <Text style={{ fontFamily: 'inter-medium', color: '#000000', fontSize: 14 }}>Oil change Work Order</Text>
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
                                                setOpenCustomWO(false)
                                                // clearAll()
                                            }} />
                                    </View>
                                    {assignedMechanic != ''
                                        ?
                                        <View style={{ marginLeft: 20 }}>
                                            <AppBtn
                                                title="Issue"
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


            {loading ?
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator color="#23d3d3" size="large" />
                </View>
                : null}


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
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
        height: 800,
        // overflow: 'scroll'
    },
    btn: {
        width: '100%',
        height: 50,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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

export default OilChangePage