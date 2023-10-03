import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Dimensions, ImageBackground, Modal, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import { CSVLink } from 'react-csv';
import { DataContext } from '../store/context/DataContext';
import { useContext } from 'react';
import moment from 'moment'
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../config/firebase';
import AlertModal from '../../components/AlertModal';
import { HeaderOptionContext } from '../store/context/HeaderOptionContext';
import { CloseAllDropDowns } from '../../components/CloseAllDropdown';



const columns = [
    'formStatus',
    'id',
    'TimeStamp',
    'assetName',
    'driverName',
    'Company name',
    'Form name',
];

const entriesData = [
    {
        'Status': 'Passed',
        'Inspection ID': '12345',
        'Date Inspected': '2023-07-20',
        'Date Received': '2023-07-21',
        'Asset Name': 'Asset A',
        'Asset VIN': 'VIN123',
        'Asset License Plate': 'ABC123',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandX',
        'Asset Model': 'ModelY',
        'Driver Name': 'John Doe',
        'Driver User': 'john.doe',
        'Employee Number': 'EMP001',
        'Defects Count': '3',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '67890',
        'Date Inspected': '2023-07-22',
        'Date Received': '2023-07-23',
        'Asset Name': 'Asset B',
        'Asset VIN': 'VIN456',
        'Asset License Plate': 'XYZ789',
        'Asset Type': 'Car',
        'Asset Make': 'BrandY',
        'Asset Model': 'ModelZ',
        'Driver Name': 'Jane Smith',
        'Driver User': 'jane.smith',
        'Employee Number': 'EMP002',
        'Defects Count': '0',
    },
    {
        'Status': 'Failed',
        'Inspection ID': '54321',
        'Date Inspected': '2023-07-23',
        'Date Received': '2023-07-24',
        'Asset Name': 'Asset C',
        'Asset VIN': 'VIN789',
        'Asset License Plate': 'PQR123',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandZ',
        'Asset Model': 'ModelX',
        'Driver Name': 'Robert Johnson',
        'Driver User': 'robert.johnson',
        'Employee Number': 'EMP003',
        'Defects Count': '5',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '98765',
        'Date Inspected': '2023-07-25',
        'Date Received': '2023-07-26',
        'Asset Name': 'Asset D',
        'Asset VIN': 'VIN111',
        'Asset License Plate': 'LMN456',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandA',
        'Asset Model': 'ModelB',
        'Driver Name': 'Sarah Johnson',
        'Driver User': 'sarah.johnson',
        'Employee Number': 'EMP004',
        'Defects Count': '1',
    },
    // Add more entries
    {
        'Status': 'Failed',
        'Inspection ID': '23456',
        'Date Inspected': '2023-07-27',
        'Date Received': '2023-07-28',
        'Asset Name': 'Asset E',
        'Asset VIN': 'VIN222',
        'Asset License Plate': 'OPQ789',
        'Asset Type': 'Car',
        'Asset Make': 'BrandC',
        'Asset Model': 'ModelD',
        'Driver Name': 'Michael Smith',
        'Driver User': 'michael.smith',
        'Employee Number': 'EMP005',
        'Defects Count': '2',
    },
    // Add more entries
    {
        'Status': 'Failed',
        'Inspection ID': '87654',
        'Date Inspected': '2023-07-29',
        'Date Received': '2023-07-30',
        'Asset Name': 'Asset F',
        'Asset VIN': 'VIN333',
        'Asset License Plate': 'RST012',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandE',
        'Asset Model': 'ModelF',
        'Driver Name': 'Emily Brown',
        'Driver User': 'emily.brown',
        'Employee Number': 'EMP006',
        'Defects Count': '4',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '34567',
        'Date Inspected': '2023-07-31',
        'Date Received': '2023-08-01',
        'Asset Name': 'Asset G',
        'Asset VIN': 'VIN444',
        'Asset License Plate': 'UVW345',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandB',
        'Asset Model': 'ModelC',
        'Driver Name': 'David Johnson',
        'Driver User': 'david.johnson',
        'Employee Number': 'EMP007',
        'Defects Count': '0',
    },
    // Add more entries
    {
        'Status': 'Failed',
        'Inspection ID': '65432',
        'Date Inspected': '2023-08-02',
        'Date Received': '2023-08-03',
        'Asset Name': 'Asset H',
        'Asset VIN': 'VIN555',
        'Asset License Plate': 'XYZ678',
        'Asset Type': 'Car',
        'Asset Make': 'BrandD',
        'Asset Model': 'ModelE',
        'Driver Name': 'Sophia Brown',
        'Driver User': 'sophia.brown',
        'Employee Number': 'EMP008',
        'Defects Count': '3',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '12345',
        'Date Inspected': '2023-08-04',
        'Date Received': '2023-08-05',
        'Asset Name': 'Asset I',
        'Asset VIN': 'VIN666',
        'Asset License Plate': 'ABC987',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandF',
        'Asset Model': 'ModelG',
        'Driver Name': 'Oliver Johnson',
        'Driver User': 'oliver.johnson',
        'Employee Number': 'EMP009',
        'Defects Count': '1',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '23456',
        'Date Inspected': '2023-08-06',
        'Date Received': '2023-08-07',
        'Asset Name': 'Asset J',
        'Asset VIN': 'VIN777',
        'Asset License Plate': 'LMN654',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandA',
        'Asset Model': 'ModelB',
        'Driver Name': 'Emma Davis',
        'Driver User': 'emma.davis',
        'Employee Number': 'EMP010',
        'Defects Count': '0',
    },
    // Add more entries
    {
        'Status': 'Failed',
        'Inspection ID': '54321',
        'Date Inspected': '2023-08-08',
        'Date Received': '2023-08-09',
        'Asset Name': 'Asset K',
        'Asset VIN': 'VIN888',
        'Asset License Plate': 'OPQ987',
        'Asset Type': 'Car',
        'Asset Make': 'BrandC',
        'Asset Model': 'ModelD',
        'Driver Name': 'William Miller',
        'Driver User': 'william.miller',
        'Employee Number': 'EMP011',
        'Defects Count': '2',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '87654',
        'Date Inspected': '2023-08-10',
        'Date Received': '2023-08-11',
        'Asset Name': 'Asset L',
        'Asset VIN': 'VIN999',
        'Asset License Plate': 'RST321',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandE',
        'Asset Model': 'ModelF',
        'Driver Name': 'Noah Davis',
        'Driver User': 'noah.davis',
        'Employee Number': 'EMP012',
        'Defects Count': '4',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '34567',
        'Date Inspected': '2023-08-12',
        'Date Received': '2023-08-13',
        'Asset Name': 'Asset M',
        'Asset VIN': 'VIN000',
        'Asset License Plate': 'UVW012',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandB',
        'Asset Model': 'ModelC',
        'Driver Name': 'Ava Johnson',
        'Driver User': 'ava.johnson',
        'Employee Number': 'EMP013',
        'Defects Count': '0',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '65432',
        'Date Inspected': '2023-08-14',
        'Date Received': '2023-08-15',
        'Asset Name': 'Asset N',
        'Asset VIN': 'VIN111',
        'Asset License Plate': 'XYZ222',
        'Asset Type': 'Car',
        'Asset Make': 'BrandD',
        'Asset Model': 'ModelE',
        'Driver Name': 'James Brown',
        'Driver User': 'james.brown',
        'Employee Number': 'EMP014',
        'Defects Count': '3',
    },
    // Add more entries
    {
        'Status': 'Passed',
        'Inspection ID': '12345',
        'Date Inspected': '2023-08-16',
        'Date Received': '2023-08-17',
        'Asset Name': 'Asset O',
        'Asset VIN': 'VIN222',
        'Asset License Plate': 'ABC333',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandF',
        'Asset Model': 'ModelG',
        'Driver Name': 'Ella Johnson',
        'Driver User': 'ella.johnson',
        'Employee Number': 'EMP015',
        'Defects Count': '1',
    },
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
    const {state: headerOptionState, setHeaderOption} = useContext(HeaderOptionContext)

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

                const propertiesToRemove = ["form", "signature", 'location'];

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

                const propertiesToRemove = ["form", "signature", 'location'];

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

                const propertiesToRemove = ["form", "signature", 'location'];

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

    return (

        <>
        <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#f6f8f9' }}
        onPress={()=>{
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
                    <View style={{ flexDirection: 'row', paddingLeft: 30 }}>
                        <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setInspectionCalendarSelect("All")}>
                            <Text style={[styles.calenderSortText, inspectionCalendarSelect == "All" && styles.calenderSortSelectedText]}>
                                All
                            </Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setInspectionCalendarSelect("Failed")}>
                            <Text style={[styles.calenderSortText, inspectionCalendarSelect == "Failed" && styles.calenderSortSelectedText]}>
                                Failed
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setInspectionCalendarSelect("Pass")}>
                            <Text style={[styles.calenderSortText, inspectionCalendarSelect == "Pass" && styles.calenderSortSelectedText]}>
                                Pass
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View >
                        <CSVLink style={{ textDecorationLine: 'none' }} data={downloadData} headers={downloadHeader} filename={"general_inspection_report.csv"}>
                            <AppBtn
                                title="Download Report"
                                btnStyle={styles.btn}
                                btnTextStyle={styles.btnText}
                                onPress={handleDownloadReportBtn} />
                        </CSVLink>
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
        maxWidth:150

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
        maxWidth:150

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
    }
});

export default GeneralInspectionPage