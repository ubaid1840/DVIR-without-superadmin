import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import { CSVLink } from 'react-csv';



const columns = [
    'Status',
    'Inspection ID',
    'Date Inspected',
    'Date Received',
    'Asset Name',
    'Asset VIN',
    'Asset License Plate',
    'Asset Type',
    'Asset Make',
    'Asset Model',
    'Driver Name',
    'Driver User',
    'Employee Number',
    'Defects Count'
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

const GeneralInspectionPage = () => {

    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const [dashboardHovered, setDashboardHovered] = useState(false)
    const [inspectiondHovered, setInspectionHovered] = useState(false)
    const [maintenanceHovered, setMaintenanceHovered] = useState(false)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [assetsHovered, setAssetsHovered] = useState(false)
    const [usersHovered, setUsersHovered] = useState(false)
    const [inspectionCalendarSelect, setInspectionCalendarSelect] = useState('All')
    const [totalInspections, setTotalInspections] = useState(19)
    const [totalDefects, setTotalDefects] = useState(7)
    const { width, height } = Dimensions.get('window')


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


    const handleDownloadReportBtn = () => {



    }

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    let driver = [{
        name: "Ubaid",
        company: "DVIR",
        inspection: 5
    },
    {
        name: "John",
        company: "DVIR",
        inspection: 2
    },
    {
        name: "Doe",
        company: "DVIR",
        inspection: 0
    }]

    const asset = [{
        name: "Truck1",
        company: "DVIR",
        inspection: 4,
        defects: 1
    },
    {
        name: "Truck2",
        company: "DVIR",
        inspection: 2,
        defects: 3
    }]

    const handleFormValue = (value) => {
        console.log(value)
    }

    return (

        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>

            <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden',
                height: height
            }}>
                <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
            </View>
            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
            <ScrollView style={{ height: 100 }}>
                <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, marginRight: 40, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                            <Image style={{ width: 30, height: 30, margin: 10 }}
                                tintColor='#FFFFFF'
                                source={require('../../assets/inspection_icon.png')}></Image>
                        </View>
                        <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
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
                        <CSVLink style={{ textDecorationLine: 'none'}} data={entriesData} headers={columns} filename={"general_inspection_report.csv"}>
                            <AppBtn
                                title="Download Report"
                                btnStyle={styles.btn}
                                btnTextStyle={styles.btnText}
                                onPress={handleDownloadReportBtn} />
                        </CSVLink>
                    </View>
                </View>
                <View style={styles.contentCardStyle}>
                    <Form
                        columns={columns}
                        entriesData={entriesData}
                        titleForm="General Inspection"
                        onValueChange={handleFormValue}
                        row={styles.formRowStyle}
                        cell={styles.formCellStyle}
                        entryText={styles.formEntryTextStyle}
                        columnHeaderRow={styles.formColumnHeaderRowStyle}
                        columnHeaderCell={styles.formColumnHeaderCellStyle}
                        columnHeaderText={styles.formColumnHeaderTextStyle} />
                </View>
            </ScrollView>
        </Animated.View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
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
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        margin: 40,
        flex: 1
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
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5
    },
    formCellStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    formEntryTextStyle: {
        fontWeight: 'normal',
        paddingHorizontal: 30,
        paddingVertical: 5,
        fontSize: 12
    },

    formColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        alignItems: 'center',
    },
    formColumnHeaderCellStyle: {
        flex: 1,

    },
    formColumnHeaderTextStyle: {
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 14
    },
});

export default GeneralInspectionPage