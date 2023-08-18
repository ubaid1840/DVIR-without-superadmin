import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Pressable, TouchableWithoutFeedback, Modal, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import Header from '../../components/Header';
import GeneralInspectionPage from '../dashboard/generalInspection';
import AssetsPage from '../dashboard/assets';
import DriverPage from '../dashboard/driver';
import MechanicPage from '../dashboard/mechanic';
import ManagerPage from '../dashboard/manager';
import Head from 'expo-router/head';
import DueDaysInspectionPage from '../dashboard/dueDaysInspection';
import DefectsPage from '../dashboard/defects';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AppBtn from '../../components/Button';
import ProfilePage from '../dashboard/profile';
import SuperAdminDashboardPage from '../SuperAdmin/superAdminDashboard'
import SuperAdminRegisterPage from './superAdminRegister';
import { getAuth, signOut } from 'firebase/auth';
import app from '../config/firebase';
import { router } from 'expo-router';



const SuperAdminPage = (props) => {

    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const [dashboardHovered, setDashboardHovered] = useState(false)
    const [inspectiondHovered, setInspectionHovered] = useState(false)
    const [maintenanceHovered, setMaintenanceHovered] = useState(false)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [assetsHovered, setAssetsHovered] = useState(false)
    const [usersHovered, setUsersHovered] = useState(false)
    const [driverSelectedOption, setDriverSelectedOption] = useState('');
    const [assetSelectedOption, setAssetSelectedOption] = useState('');
    const [dashboardCalendarSelect, setDashboardCalendarSelect] = useState('Today')
    const [inspectionCalendarSelect, setInspectionCalendarSelect] = useState('All')
    const [totalInspections, setTotalInspections] = useState(19)
    const [totalDefects, setTotalDefects] = useState(7)
    const [InspectionSelectedOption, setInspectionSelectedOption] = useState('')
    const [inspectionOptionExpand, setInspectionOptionExpand] = useState(false)
    const [generalInspectionHovered, setGeneralInspectionHovered] = useState(false)
    const [daysInspectionhovered, setDaysInspectionHovered] = useState(false)
    const [inspectionSelectedPage, setInspectionSelectedPage] = useState('')
    const [maintenanceOptionExpand, setMaintenanceOptionExpand] = useState(false)
    const [defectsHovered, setDefectsHovered] = useState(false)
    const [workOrderHovered, setWorkOrderHovered] = useState(false)
    const [maintenanceSelectedPage, setMaintenanceSelectedPage] = useState('')
    const [usersOptionExpand, setUsersOptionExpand] = useState(false)
    const [driverHovered, setDriverHovered] = useState(false)
    const [mechanicHovered, setMechanicHovered] = useState(false)
    const [managerHovered, setManagerHovered] = useState(false)
    const [usersSelectedPage, setUsersSelectedPage] = useState('')
    const [animateLeftSide] = useState(new Animated.Value(260))
    const [openLeftSide, setOpenLeftSide] = useState(true)
    const [collapseHovered, setCollapseHovered] = useState(false)
    const [collapseBtnClick, setCollapseBtnClick] = useState(false)
    const [collapseAndHoverLeftSide, setCollapseAndHoverLeftSide] = useState(false)
    const colorAnimation = new Animated.Value(0);

    const [fileUri, setFileUri] = useState(null)
    const [profileIsVisible, setProfileIsVisible] = useState(false)
    const [textInputBorderColor, setTextInputBorderColor] = useState('')

    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')

    const [profileSelected, setProfileSelected] = useState(false)



    const backgroundColor = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#1E3D5C', '#173048'], // Replace these with your desired colors
    });

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnimation, {
                    toValue: 1,
                    duration: 2000, // Duration for each color change (in milliseconds)
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimation, {
                    toValue: 0,
                    duration: 2000, // Duration for each color change (in milliseconds)
                    useNativeDriver: false,
                }),
            ]),
        ).start();
    }, [colorAnimation]);

    const animationLeftSide = (value) => {
        Animated.timing(animateLeftSide, {
            toValue: value,
            duration: 0,
            useNativeDriver: false
        }).start()
    }

    useEffect(() => {

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();


        return () => {
            // fadeAnim.setValue(0);
        }

    }, [selectedPage])

    useEffect(() => {
        if (selectedPage != "Inspection" && selectedPage != "Maintenance") {
            setInspectionOptionExpand(false)
            setInspectionSelectedPage("")
            setMaintenanceOptionExpand(false)
            setMaintenanceSelectedPage("")
        }
        if (selectedPage == "Maintenance") {
            setInspectionHovered(false)
        }
        if (selectedPage == 'Inspection') {
            setMaintenanceHovered(false)
        }
    }, [selectedPage])


    const handleDriverValueChange = (value) => {
        setDriverSelectedOption(value);
    };

    const handleAssetValueChange = (value) => {
        setAssetSelectedOption(value);
    };


    const sortDriver = () => {
        // Sort the data based on age in ascending order
        const sortedData = driver.slice().sort((a, b) => a.inspection - b.inspection);

        return (
            <Text style={{ fontSize: 25, color: 'grey' }}>{sortedData[0].name[0]}</Text>

        );
    };

    const sortAsset = () => {
        // Sort the data based on age in ascending order
        const sortedData = asset.slice().sort((a, b) => b.defects - a.defects);

        return (
            <Text style={{ fontSize: 25, color: 'grey' }}>{sortedData[0].name[0]}</Text>

        );
    };

    const handleDownloadReportBtn = () => {

    }

    const handleInspectionValueChange = (value) => {
        if (value === 'Inspection') {
            setInspectionSelectedPage(''); // If 'Inspection' is selected, reset the inspectionSelectedPage
        } else if (value === 'General Inspection') {
            setInspectionSelectedPage('General Inspection');
        } else if (value === '45 days Inspection') {
            setInspectionSelectedPage('45 days Inspection');
        }
    }


    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
        'futura-book': require('../../assets/fonts/futura/Futura-Book-font.ttf'),
        'futura-heavy-font': require('../../assets/fonts/futura/Futura-Heavy-font.ttf')
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

    const assetReport = [{
        Status: "Pass",
        InspectionID: "123",
        DateInspected: "17-05-2021",
        DateReceived: "17-05-2021",
        AssetName: "Truck1",
        AssetVIN: "qwe123",
        AssetLicensePlate: "LE-14-1234",
        AssetType: "Truck",
        AssetMake: "2015",
        AssetModel: "Colorado",
        DriverName: "UB",
        DriverUser: "123456789",
        EmployeeNumber: "22",
        DefectsCount: "1",
    }]

    const closeAllExpands = (value) => {
        if (value == 'Dashboard') {
            setInspectionOptionExpand(false)
            setMaintenanceOptionExpand(false)
            setUsersOptionExpand(false)
            setMaintenanceSelectedPage("")
            setInspectionSelectedPage("")
            setUsersSelectedPage("")
            setProfileSelected(false)
        }
        else if (value == 'Inspection') {
            setMaintenanceOptionExpand(false)
            setUsersOptionExpand(false)
            //   setMaintenanceSelectedPage("")
            //   setUsersSelectedPage("")
        }
        else if (value == 'Maintenance') {
            setInspectionOptionExpand(false)
            setUsersOptionExpand(false)
            // setInspectionSelectedPage("")
            // setUsersSelectedPage("")
        }
        else if (value == 'Assets') {
            setInspectionOptionExpand(false)
            setMaintenanceOptionExpand(false)
            setUsersOptionExpand(false)
            setMaintenanceSelectedPage("")
            setInspectionSelectedPage("")
            setUsersSelectedPage("")
            setProfileSelected(false)
        }
        else if (value == 'Users') {
            setInspectionOptionExpand(false)
            setMaintenanceOptionExpand(false)
            // setMaintenanceSelectedPage("")
            // setInspectionSelectedPage("")
        }
    }
    const renderPage = () => {


        if (selectedPage == 'Dashboard') {
            return (
                <SuperAdminDashboardPage />
            )
        }
        // else if (selectedPage == 'Maintenance') {
        //   return (
        //     <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        //       {/* Add your Maintenance content here */}
        //       <Text style={styles.screenTitle}>Maintenance Content</Text>
        //     </Animated.View>
        //   )
        // }
        else if (selectedPage == 'Assets') {
            return (
                <SuperAdminRegisterPage onAddAssetBtn={handleAddAssetBtn} />
            );
        }
        else if (selectedPage == "Inspection") {
            if (inspectionSelectedPage == 'General Inspection') {
                return (
                    <GeneralInspectionPage />
                )
            }
            else if (inspectionSelectedPage == '45 days Inspection') {
                return (
                    <DueDaysInspectionPage />
                )
            }
        }
        else if (selectedPage == "Maintenance") {
            if (maintenanceSelectedPage == 'Defects') {
                return (
                    <DefectsPage />
                )
            }
            else if (maintenanceSelectedPage == 'Work Order') {
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text>Work Order</Text>
                    </View>
                )
            }
        }
        else if (selectedPage == "Users") {
            if (usersSelectedPage == 'Driver') {
                return (
                    <DriverPage />

                )
            }
            else if (usersSelectedPage == 'Mechanic') {
                return (
                    <MechanicPage />
                )
            }
            else if (usersSelectedPage == 'Manager') {
                return (
                    <ManagerPage />
                )
            }
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*', // Change the MIME type to specify the type of files you want to allow
            });
            console.log(result)
            if (result.assets[0].uri) {
                setFileUri(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    const clearAllValues = () => {

    }


    const handleHeaderValue = (value) => {
        if (value == 'Logout') {
            // props.navigation.navigate('Login')
        }

        if (value == 'Profile') {
            // setProfileIsVisible(true)
            setProfileSelected(true)
            setSelectedPage('')
        }
    }

    const closeProfile = () => {
        setProfileSelected(false)
    }

    const handleAddAssetBtn = () => {
        // props.navigation.navigate('CreateNewAsset')
    }

    const handleLogout = () => {
        const auth = getAuth(app)
        signOut(auth).then(() => {
            // Sign-out successful.
            router.replace('/')
          }).catch((error) => {
            // An error happened.
          });
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Driver vehicle inspection report application dashboard" />
            </Head>
            <View style={styles.container}>
                <Animated.View style={[styles.leftSide, { width: animateLeftSide }, { backgroundColor }]}
                    onMouseEnter={() => {
                        if (collapseBtnClick == true) {
                            setOpenLeftSide(true)
                            animationLeftSide(260)
                            setCollapseAndHoverLeftSide(true)
                        }
                        if (selectedPage == 'Maintenance') {
                            setMaintenanceOptionExpand(true)
                        }
                        if (selectedPage == "Inspection") {
                            setInspectionOptionExpand(true)
                        }
                        if (selectedPage == 'Users') {
                            setUsersOptionExpand(true)
                        }
                    }}
                    onMouseLeave={() => {
                        if (collapseBtnClick == true) {
                            setOpenLeftSide(false)
                            animationLeftSide(60)
                            setCollapseAndHoverLeftSide(false)
                        }
                        if (selectedPage == 'Maintenance' && collapseBtnClick == true) {
                            setMaintenanceOptionExpand(false)
                        }
                        if (selectedPage == "Inspection" && collapseBtnClick == true) {
                            setInspectionOptionExpand(false)
                        }
                        if (selectedPage == 'Users' && collapseBtnClick == true) {
                            setUsersOptionExpand(false)
                        }
                    }}>
                    <>
                        <Text style={styles.title}>{openLeftSide ? 'D V I R' : 'D'}</Text>
                        <View style={selectedPage == 'Dashboard' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, dashboardHovered && styles.hoverNavItem]}
                            onMouseEnter={() => {
                                setDashboardHovered(true)
                            }}
                            onMouseLeave={() => {
                                setDashboardHovered(false)
                            }}>
                            <Image style={selectedPage == 'Dashboard' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, dashboardHovered && styles.iconStyleHover]} source={require('../../assets/dashboard_speed_icon.png')}></Image>
                            {openLeftSide ?
                                <TouchableOpacity
                                    style={{ paddingLeft: 20 }}
                                    onPress={() => {
                                        fadeAnim.setValue(0);
                                        setSelectedPage('Dashboard')
                                        closeAllExpands('Dashboard')
                                    }}
                                >
                                    <Text style={selectedPage == 'Dashboard' ? [styles.navText, styles.navTextHover] : [styles.navText, dashboardHovered && styles.navTextHover]}>Dashboard</Text>
                                </TouchableOpacity> : null}
                        </View>

                        <View style={selectedPage == 'Assets' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, assetsHovered && styles.hoverNavItem]}
                            onMouseEnter={() => { setAssetsHovered(true) }}
                            onMouseLeave={() => { setAssetsHovered(false) }}>
                            <Image style={selectedPage == 'Assets' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, assetsHovered && styles.iconStyleHover]} source={require('../../assets/register_company_icon.png')}></Image>
                            {openLeftSide ? <TouchableOpacity
                                style={{ paddingLeft: 20 }}
                                onPress={() => {
                                    // fadeAnim.setValue(0);
                                    setSelectedPage('Assets')
                                    // setInspectionOptionExpand(false)
                                    // setInspectionSelectedPage("")
                                    closeAllExpands('Assets')
                                }}>
                                <Text style={selectedPage == 'Assets' ? [styles.navText, styles.navTextHover] : [styles.navText, assetsHovered && styles.navTextHover]}>Register Company</Text>
                            </TouchableOpacity> : null}
                        </View>


                        <TouchableOpacity style={{ position: 'absolute', bottom: 30, left: 15, flexDirection: 'row' }} onPress={() => {
                            if (collapseAndHoverLeftSide == true) {
                                setCollapseBtnClick(false)
                                setCollapseAndHoverLeftSide(false)
                                return
                            }
                            if (openLeftSide == true) {
                                animationLeftSide(60)
                                setMaintenanceOptionExpand(false)
                                setInspectionOptionExpand(false)
                                setUsersOptionExpand(false)
                            }
                            if (openLeftSide == false) {
                                animationLeftSide(260)
                            }
                            setOpenLeftSide(!openLeftSide)
                            setCollapseBtnClick(!collapseBtnClick)


                        }}>
                            <View style={{ flexDirection: 'row' }}
                                onMouseEnter={() => setCollapseHovered(true)}
                                onMouseLeave={() => setCollapseHovered(false)
                                }>
                                <Image style={{ height: 30, width: 30 }}
                                    tintColor={collapseHovered ? '#67E9DA' : '#FFFFFF'}
                                    source={require('../../assets/left_right_arrow_icon.png')}
                                ></Image>

                                {openLeftSide ?
                                    <Text style={[{ color: '#FFFFFF', fontSize: 16, marginLeft: 10, }, collapseHovered && { color: '#67E9DA' }]}>Collapse Menu</Text> : null}
                            </View>
                        </TouchableOpacity>
                    </>
                </Animated.View>
                <View style={{ flexDirection: 'column', flex: 1, }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 60, paddingRight: 60, paddingVertical: 20, alignItems: 'center', backgroundColor: '#FFFFFF', justifyContent: 'space-between', }}>
                        <View >
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#5B5B5B', fontFamily: 'futura-book' }}>
                                Welcome Super Admin!
                            </Text>
                        </View>
                        <View>
                        <AppBtn
                            title="Logout"
                            btnStyle={styles.btn}
                            btnTextStyle={styles.btnText}
                            onPress={handleLogout}
                        />
                        </View>
                    </View>
                    {renderPage()}
                </View>
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backdropFilter: 'blur(10px)'

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
        width: 260,
        backgroundColor: '#1E3D5C',
        paddingTop: 50,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        // position:'absolute',
        zIndex: 1,
        // height:'100%'
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        // borderTopRightRadius: 10,
        // borderBottomRightRadius: 10
    },
    navItem: {
        height: 40,
        width: '100%',
        // marginLeft: 10,
        // marginRight: 10,
        borderRadius: 15,
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
        marginBottom: 10

        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    selectedNavItem: {
        // backgroundColor: '#ccc',
        // height: 50,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        alignItems: 'center',
        paddingLeft: 20,
        backgroundColor: '#1383B4',

    },
    navText: {
        fontSize: 15,
        color: '#67E9DA',
        fontWeight: 'bold',
        opacity: 1,
        fontFamily: 'futura-heavy-font'

    },
    navTextHover: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        opacity: 1,

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
        backgroundColor: '#3A71A9',

    },
    iconStyle: {
        height: 18,
        width: 18,
        tintColor: '#67E9DA'
    },
    iconStyleHover: {
        // height: 20,
        // width: 20,
        tintColor: '#FFFFFF'
    },
    dropdown: {
        // Custom styles for the dropdown container
        // For example:
        padding: 12,

        minWidth: 200,
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
        Color: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacishadowty: 0.25,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        maxHeight: '98%',
        maxWidth: '90%',
    },
    input: {
        width: 250,
        height: 40,
        marginLeft: 25,
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
});

export default SuperAdminPage;