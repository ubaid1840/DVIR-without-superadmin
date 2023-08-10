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
    'Asset Name',
    'Last Inspection',
    'Next Inspection',
    'Asset License Plate',
    'Asset VIN',
    'Asset Type',
    'Asset Make',
    'Asset Model',
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

const DueDaysInspectionPage = () => {

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
                            45 Days Inspection
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{totalInspections}</Text>
                        <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Due in 7 days</Text>
                        <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 20, opacity: 0.5 }}></View>
                        <Text style={{ fontSize: 45, color: '#D60000' }}>{totalDefects}</Text>
                        <Text style={{ fontSize: 15, color: '#D60000', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Inspection due</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 30, paddingLeft: 40, paddingRight: 40 }}>
                    <CSVLink style={{ textDecorationLine: 'none' }} data={entriesDataCSV} headers={columns} filename={"45_days_due_report.csv"}>
                        <View >
                            <AppBtn
                                title="Download Report"
                                btnStyle={styles.btn}
                                btnTextStyle={styles.btnText}
                                onPress={handleDownloadReportBtn}></AppBtn>
                        </View>
                    </CSVLink>
                </View>
                <View style={styles.contentCardStyle}>
                    <Form
                        columns={columns}
                        entriesData={entriesDataCSV}
                        titleForm="45 days Inspection"
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
        height: 40,
    },
    formEntryTextStyle: {
        fontWeight: 'normal',
        paddingHorizontal: 0,
        // paddingVertical: 5,
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

export default DueDaysInspectionPage