import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Pressable, TouchableWithoutFeedback, Modal, TextInput, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import Header from '../../components/Header';
import MainDashboard from './mainDashboard';
import GeneralInspectionPage from './generalInspection';
import AssetsPage from './assets';
import DriverPage from './driver';
import MechanicPage from './mechanic';
import ManagerPage from './manager';
import Head from 'expo-router/head';
import DueDaysInspectionPage from './dueDaysInspection';
import DefectsPage from './defects';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AppBtn from '../../components/Button';
import ProfilePage from './profile';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { collection, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import app from '../config/firebase';
import { DataContext } from '../store/context/DataContext';
import FormDetail from './formDetail';
import DefectDetail from './defectDetail';
import { DefectContext } from '../store/context/DefectContext';
import { PeopleContext } from '../store/context/PeopleContext';
import MaintenancePage from './maintenance';
import WorkOrderDetail from './workOrderDetail';
import { WOContext } from '../store/context/WOContext';
import InHouseWorkOrderDetail from './inHouseWorkOrderDetail';
import { AssetDetailContext } from '../store/context/AssetDetailContext';
import { DriverDetailContext } from '../store/context/DriverDetailContext';
import { PriorityOptionContext } from '../store/context/PriorityOptionContext';
import { SeverityOptionContext } from '../store/context/SeverityOptionContext';
import { HeaderOptionContext } from '../store/context/HeaderOptionContext';
import { CloseAllDropDowns } from '../../components/CloseAllDropdown';


const DashboardPage = (props) => {

  const db = getFirestore(app)

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
  const [welcome, setWelcome] = useState('')
  // const [loginDesignation, setLoginDesignation] = useState('')

  const [fileUri, setFileUri] = useState(null)
  const [profileIsVisible, setProfileIsVisible] = useState(false)
  const [textInputBorderColor, setTextInputBorderColor] = useState('')

  const [alertIsVisible, setAlertIsVisible] = useState(false)
  const [alertStatus, setAlertStatus] = useState('')

  const [profileSelected, setProfileSelected] = useState(false)
  const [inspectionFormValue, setInspectionFormValue] = useState([])
  const [driverPicture, setDriverPicture] = useState(null)
  const [groups, setGroups] = useState([])
  const [otherSelection, setOtherSelection] = useState('nill')
  const [defectFormValue, setDefectFormValue] = useState([])
  const [workOrderFormValue, setWorkOrderFormValue] = useState([])
  const [inHouseInspectionFormValue, setInHouseInspectionFormValue] = useState([])

  const { state: woState, setWO } = useContext(WOContext)
  const {state : assetDetailState, setAssetDetail} = useContext(AssetDetailContext)
  const {state : driverDetailState, setDriverDetail} = useContext(DriverDetailContext)
  const {state : priorityOptionState, setPriorityOption} = useContext(PriorityOptionContext)
  const {state : severityOptionState, setSeverityOption} = useContext(SeverityOptionContext)
  const {state : headerOptionState, setHeaderOption} = useContext(HeaderOptionContext)



  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E3D5C', '#1E3D5C'], // Replace these with your desired colors
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
    // console.log(defectState.value.defect)
  }, [])


  useEffect(() => {

    // const auth = getAuth()
    // console.log(auth)
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/auth.user
    //     const uid = user.uid;
    //     // console.log(user)
    //     // ...
    //   } else {
    //     // User is signed out
    //     // ...
    //     // console.log('user signed out')
    //     router.replace('/')
    //   }


    // });

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

  // useEffect(()=>{

  //   if(priorityOptionState.value.data == true){
  //     setHeaderOption(false)
  //     setSeverityOption(false)
  //   }
  //   else if (severityOptionState.value.data == true){
  //     setHeaderOption(false)
  //     setPriorityOption(false)
  //   }
  //   else if (headerOptionState.value.data == true){
  //     setPriorityOption(false)
  //     setSeverityOption(false)
  //   }

  // },[headerOptionState.value.data, priorityOptionState.value.data, severityOptionState.value.data])


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



  const closeAllExpands = (value) => {
    if (value == 'Dashboard') {
      setInspectionOptionExpand(false)
      setMaintenanceOptionExpand(false)
      setUsersOptionExpand(false)
      setMaintenanceSelectedPage("")
      setInspectionSelectedPage("")
      setUsersSelectedPage("")
      // setProfileSelected(false)
      setOtherSelection('nill')
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
      // setProfileSelected(false)
      setOtherSelection('nill')
    }
    else if (value == 'Users') {
      setInspectionOptionExpand(false)
      setMaintenanceOptionExpand(false)
      // setMaintenanceSelectedPage("")
      // setInspectionSelectedPage("")
    }
  }

  const handleFormValue = async (value) => {

    setInspectionFormValue(value)
    setOtherSelection('form')

  }

  const handleDefectValue = (value) => {
    setDefectFormValue(value)
    // console.log(value)
    setOtherSelection('defect')
  }

  const handleWOValue = (value) => {
    const temp = woState.value.data.filter((item) => item.id == value.workOrder)
    // console.log(temp[0])
    // console.log(value)
    if (temp.length != 0) {
      setWorkOrderFormValue(temp[0])
      setOtherSelection('workorder')
    }

  }

  const handleWorkOrderValue = (value) => {
    // console.log(value)
    setWorkOrderFormValue(value)
    setOtherSelection('workorder')
    //start work from here
  }



  const handleInHouseInspectionValue = (value) => {
    setInHouseInspectionFormValue(value)
    setOtherSelection('inhouseinspection')
  }

  const handleReturnFormDetail = (value) => {
    setOtherSelection('nill')
  }

  const handleReturnWorkOrderDetail = () => {
    setOtherSelection('nill')
  }

  const handleInspectionFromDashboard = () => {
    setInspectionOptionExpand(!inspectionOptionExpand)
    // setMaintenanceOptionExpand(false)
    setInspectionSelectedPage('General Inspection')
    setSelectedPage("Inspection")
    // setProfileSelected(false)
    setOtherSelection('nill')
  }

  const handleDefecsFromDashboard = () => {
    setMaintenanceOptionExpand(!maintenanceOptionExpand)
    // setMaintenanceOptionExpand(false)
    setMaintenanceSelectedPage('Defects')
    setSelectedPage("Maintenance")
    // setProfileSelected(false)
    setOtherSelection('nill')
  }




  const renderPage = () => {


    if (selectedPage == 'Dashboard') {
      return (
        <MainDashboard
          openInspection={handleInspectionFromDashboard}
          openDefects={handleDefecsFromDashboard} />
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
        <AssetsPage
          onAddAssetBtn={handleAddAssetBtn}
          onDashboardValue={handleFormValue}
          onDashboardDefectValue={handleDefectValue}
          onDashboardWOValue={handleWorkOrderValue}
          onDashboardWODetailValue={handleWOValue} />
      );
    }
    else if (selectedPage == "Inspection") {
      if (inspectionSelectedPage == 'General Inspection') {
        const temp = []
        return (
          <GeneralInspectionPage
            form={temp}
            onDashboardValue={handleFormValue} />
        )
      }
      else if (inspectionSelectedPage == '45 days Inspection') {
        return (
          <DueDaysInspectionPage
          onDashboardInHouseValueChange={handleInHouseInspectionValue}
          onDashboardDueDaysInspection={handleReturn} />
        )
      }
    }
    else if (selectedPage == "Maintenance") {
      if (maintenanceSelectedPage == 'Defects') {
        return (
          <DefectsPage
            onDashboardValueChange={handleDefectValue}
            onDashboardWOValue={handleWOValue}
             />
        )
      }
      else if (maintenanceSelectedPage == 'Work Order') {
        return (
          <MaintenancePage
            onDashboardValueChange={handleWorkOrderValue}
            onDashboardInHouseValueChange={handleInHouseInspectionValue} />
        )
      }
    }
    else if (selectedPage == "Users") {
      if (usersSelectedPage == 'Driver') {
        return (
          <DriverPage
            onDashboardValue={handleFormValue}
            onDashboardDefectValue={handleDefectValue}
            onDashboardWOValue={handleWorkOrderValue} />

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
      // console.log(result)
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

    if (value == 'Profile') {
      // setProfileIsVisible(true)
      setOtherSelection('profile')
      // setProfileSelected(true)
      // setSelectedPage('')
    }

    if (value == 'Logout') {
      const auth = getAuth()
      signOut(auth).then(() => {
        // Sign-out successful.
        router.replace('/')
      }).catch((error) => {
        // An error happened.
      });
    }
  }

  const closeProfile = () => {
    setProfileSelected(false)
  }

  const handleAddAssetBtn = () => {
    // props.navigation.navigate('CreateNewAsset')
  }

  const handleProfileDashboard = () => {
    setOtherSelection('nill')
  }

  const handleReturn = () => {
    setOtherSelection('nill')
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Driver vehicle inspection report application dashboard" />
      </Head>
      <View style={[styles.container]}>
        <TouchableWithoutFeedback style={[styles.leftSide,{ width: animateLeftSide}]} 
         onPress={()=>{
          CloseAllDropDowns()
        }}>
        <Animated.View style={[styles.leftSide, { width: animateLeftSide },]}
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
          }}
          >
            
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
                    CloseAllDropDowns()
                    fadeAnim.setValue(0);
                    setSelectedPage('Dashboard')
                    closeAllExpands('Dashboard')
                  }}
                >
                  <Text style={selectedPage == 'Dashboard' ? [styles.navText, styles.navTextHover] : [styles.navText, dashboardHovered && styles.navTextHover]}>Dashboard</Text>
                </TouchableOpacity> : null}
            </View>

            <View style={inspectionOptionExpand == true ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, inspectiondHovered && styles.hoverNavItem]}
              onMouseEnter={() => { setInspectionHovered(true) }}
              onMouseLeave={() => { setInspectionHovered(false) }}>
              <Image style={inspectionOptionExpand == true ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, inspectiondHovered && styles.iconStyleHover]} source={require('../../assets/inspection_icon.png')}></Image>

              {openLeftSide ? <TouchableOpacity
                style={{ paddingLeft: 20, flexDirection: 'row' }}
                onPress={() => {
                  CloseAllDropDowns()
                  setInspectionOptionExpand(!inspectionOptionExpand)
                  // setMaintenanceOptionExpand(false)
                  closeAllExpands('Inspection')
                }}>

                <Text style={inspectionOptionExpand == true ? [styles.navText, styles.navTextHover] : [styles.navText, inspectiondHovered && styles.navTextHover]}>Inspection</Text>
                <Image style={selectedPage == 'Inspection' ? [styles.iconStyle, styles.iconStyleHover, { marginHorizontal: 10 }] : [styles.iconStyle, inspectiondHovered && styles.iconStyleHover, { marginHorizontal: 10 }]} source={inspectionOptionExpand ? require('../../assets/up_arrow_icon.png') : require('../../assets/down_arrow_icon.png')}></Image>
              </TouchableOpacity> : null}
            </View>

            {inspectionOptionExpand == true ?
              <View style={{ marginLeft: 30, alignSelf: 'flex-start' }}>
                <View style={inspectionSelectedPage == 'General Inspection' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setGeneralInspectionHovered(true) }}
                  onMouseLeave={() => { setGeneralInspectionHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      CloseAllDropDowns()
                      setInspectionSelectedPage('General Inspection')
                      setSelectedPage("Inspection")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                    }}
                  >
                    <Text style={inspectionSelectedPage == 'General Inspection' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1, }] : [styles.navTextSub, generalInspectionHovered && { color: '#FFFFFF', opacity: 1 }]}>General Inspection</Text>
                  </TouchableOpacity>
                </View>

                <View style={inspectionSelectedPage == '45 days Inspection' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setDaysInspectionHovered(true) }}
                  onMouseLeave={() => { setDaysInspectionHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      CloseAllDropDowns()
                      setInspectionSelectedPage('45 days Inspection')
                      setSelectedPage("Inspection")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                    }}
                  >
                    <Text style={inspectionSelectedPage == '45 days Inspection' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1 }] : [styles.navTextSub, daysInspectionhovered && { color: '#FFFFFF', opacity: 1 }]}>In house Inspection</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null}

            <View style={maintenanceOptionExpand == true ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, maintenanceHovered && styles.hoverNavItem]}
              onMouseEnter={() => { setMaintenanceHovered(true) }}
              onMouseLeave={() => { setMaintenanceHovered(false) }}>
              <Image style={maintenanceOptionExpand == true ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, maintenanceHovered && styles.iconStyleHover]} source={require('../../assets/maintenance_icon.png')}></Image>

              {openLeftSide ? <TouchableOpacity
                style={{ paddingLeft: 20, flexDirection: 'row' }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  CloseAllDropDowns()
                  setMaintenanceOptionExpand(!maintenanceOptionExpand)
                  // setInspectionOptionExpand(false)
                  closeAllExpands('Maintenance')
                }}>

                <Text style={maintenanceOptionExpand == true ? [styles.navText, styles.navTextHover] : [styles.navText, maintenanceHovered && styles.navTextHover]}>Maintenance</Text>
                <Image style={selectedPage == 'Maintenance' ? [styles.iconStyle, styles.iconStyleHover, { marginHorizontal: 10 }] : [styles.iconStyle, maintenanceHovered && styles.iconStyleHover, { marginHorizontal: 10 }]} source={maintenanceOptionExpand ? require('../../assets/up_arrow_icon.png') : require('../../assets/down_arrow_icon.png')}></Image>
              </TouchableOpacity> : null}
            </View>

            {maintenanceOptionExpand == true ?
              <View style={{ marginLeft: 30, alignSelf: 'flex-start' }}>
                <View style={maintenanceSelectedPage == 'Defects' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setDefectsHovered(true) }}
                  onMouseLeave={() => { setDefectsHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      CloseAllDropDowns()
                      setMaintenanceSelectedPage('Defects')
                      setSelectedPage("Maintenance")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                    }}
                  >
                    <Text style={maintenanceSelectedPage == 'Defects' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1, }] : [styles.navTextSub, defectsHovered && { color: '#FFFFFF', opacity: 1 }]}>Defects</Text>
                  </TouchableOpacity>
                </View>

                <View style={maintenanceSelectedPage == 'Work Order' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setWorkOrderHovered(true) }}
                  onMouseLeave={() => { setWorkOrderHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      CloseAllDropDowns()
                      setMaintenanceSelectedPage('Work Order')
                      setSelectedPage("Maintenance")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                    }}
                  >
                    <Text style={maintenanceSelectedPage == 'Work Order' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1 }] : [styles.navTextSub, workOrderHovered && { color: '#FFFFFF', opacity: 1 }]}>Work Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null}

            <View style={selectedPage == 'Assets' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, assetsHovered && styles.hoverNavItem]}
              onMouseEnter={() => { setAssetsHovered(true) }}
              onMouseLeave={() => { setAssetsHovered(false) }}>
              <Image style={selectedPage == 'Assets' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, assetsHovered && styles.iconStyleHover]} source={require('../../assets/vehicle_icon.png')}></Image>
              {openLeftSide ? <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  CloseAllDropDowns()
                  setSelectedPage('Assets')
                  // setInspectionOptionExpand(false)
                  // setInspectionSelectedPage("")
                  closeAllExpands('Assets')
                  setAssetDetail(false)
                }}>
                <Text style={selectedPage == 'Assets' ? [styles.navText, styles.navTextHover] : [styles.navText, assetsHovered && styles.navTextHover]}>Assets</Text>
              </TouchableOpacity> : null}
            </View>

            <View style={usersOptionExpand == true ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, usersHovered && styles.hoverNavItem]}
              onMouseEnter={() => { setUsersHovered(true) }}
              onMouseLeave={() => { setUsersHovered(false) }}>
              <Image style={usersOptionExpand == true ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, usersHovered && styles.iconStyleHover]} source={require('../../assets/user_icon.png')}></Image>
              {openLeftSide ?
                <TouchableOpacity
                  style={{ paddingLeft: 20, flexDirection: 'row' }}
                  onPress={() => {
                    // fadeAnim.setValue(0);
                    CloseAllDropDowns()
                    setUsersOptionExpand(!usersOptionExpand)
                    // setInspectionOptionExpand(false)
                    // setMaintenanceOptionExpand(false)
                    closeAllExpands('Users')
                  }}>

                  <Text style={usersOptionExpand == true ? [styles.navText, styles.navTextHover] : [styles.navText, usersHovered && styles.navTextHover]}>Users</Text>
                  <Image style={selectedPage == 'Users' ? [styles.iconStyle, styles.iconStyleHover, { marginHorizontal: 10 }] : [styles.iconStyle, usersHovered && styles.iconStyleHover, { marginHorizontal: 10 }]} source={usersOptionExpand ? require('../../assets/up_arrow_icon.png') : require('../../assets/down_arrow_icon.png')}></Image>
                </TouchableOpacity> : null}
            </View>

            {usersOptionExpand == true ?
              <View style={{ marginLeft: 30, alignSelf: 'flex-start' }}>
                <View style={usersSelectedPage == 'Driver' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setDriverHovered(true) }}
                  onMouseLeave={() => { setDriverHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      CloseAllDropDowns()
                      setUsersSelectedPage('Driver')
                      setSelectedPage("Users")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                      setDriverDetail(false)
                      console.log('ubaid')
                    }}
                  >
                    <Text style={usersSelectedPage == 'Driver' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1, }] : [styles.navTextSub, driverHovered && { color: '#FFFFFF', opacity: 1 }]}>Drivers</Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={usersSelectedPage == 'Mechanic' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setMechanicHovered(true) }}
                  onMouseLeave={() => { setMechanicHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      setUsersSelectedPage('Mechanic')
                      setSelectedPage("Users")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                    }}
                  >
                    <Text style={usersSelectedPage == 'Mechanic' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1 }] : [styles.navTextSub, mechanicHovered && { color: '#FFFFFF', opacity: 1 }]}>Mechanic</Text>
                  </TouchableOpacity>
                </View> */}

                <View style={usersSelectedPage == 'Manager' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
                  onMouseEnter={() => { setManagerHovered(true) }}
                  onMouseLeave={() => { setManagerHovered(false) }}>
                  <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => {
                      // fadeAnim.setValue(0);
                      CloseAllDropDowns()
                      setUsersSelectedPage('Manager')
                      setSelectedPage("Users")
                      // setProfileSelected(false)
                      setOtherSelection('nill')
                    }}
                  >
                    <Text style={usersSelectedPage == 'Manager' ? [styles.navTextSub, { color: '#FFFFFF', opacity: 1 }] : [styles.navTextSub, managerHovered && { color: '#FFFFFF', opacity: 1 }]}>People</Text>
                  </TouchableOpacity>
                </View>

              </View>
              :
              null}
            <TouchableOpacity style={{ position: 'absolute', bottom: 30, left: 15, flexDirection: 'row' }} onPress={() => {
              CloseAllDropDowns()
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
        </TouchableWithoutFeedback>
        <View style={{ flexDirection: 'column', flex: 1, }}>
          <View style={{ zIndex: 1 }}>
            <Header
              onValueChange={handleHeaderValue} />
          </View>
          {otherSelection == 'profile' ?
            <ProfilePage
              profileHandle={handleProfileDashboard} />
            :
            otherSelection == 'form'
              ?
              inspectionFormValue.length != 0
                ?
                <FormDetail
                  formValue={inspectionFormValue}
                  returnFormDetail={handleReturnFormDetail}
                  onDashboardGeneralInspection={handleReturn} />
                :
                null
              :
              otherSelection == 'defect'
                ?
                defectFormValue.length != 0
                  ?
                  <DefectDetail
                    value={defectFormValue}
                    onDashboardDefect={handleReturn}
                    onDashboardOpenWO={(item)=>{
                      const temp = [...woState.value.data.filter((value) => value.id == item.workOrder)]
                      if (temp.length != 0) {
                        setWorkOrderFormValue(temp[0])
                        setOtherSelection('workorder')
                      }
                    }} />
                  : null
                :
                otherSelection == 'workorder'
                  ?
                  workOrderFormValue.length != 0
                    ?
                    <WorkOrderDetail
                      value={workOrderFormValue}
                      returnWorkOrderDetail={handleReturnWorkOrderDetail}
                      onDashboardWorkOrder={handleReturn} />
                    :
                    null
                    :
                    otherSelection == 'inhouseinspection'
                      ?
                      inHouseInspectionFormValue.length != 0
                        ?
                        <InHouseWorkOrderDetail
                          value={inHouseInspectionFormValue}
                          returnWorkOrderDetail={handleReturnWorkOrderDetail}
                          onDashboardDueDaysInspection={handleReturn}
                        />
                        : null
                      :
                      renderPage()
          }

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
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFFFFF',
    fontFamily: 'futura-extra-black',
    alignSelf: 'center'
  },
  leftSide: {
    width: 260,
    backgroundColor: '#003152',
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
    fontSize: 14,
    color: '#67E9DA',
    fontFamily: 'inter-semibold',
    opacity: 1,
    // fontFamily: 'futura-heavy-font'

  },
  navTextSub: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'inter-regular',
    opacity: 1,
    // fontFamily: 'futura-heavy-font'

  },
  navTextHover: {
    color: '#FFFFFF',
    // fontWeight: 'bold',
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
    backgroundColor: '#004b91',

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
    // fontFamily:'inter'
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

export default DashboardPage;
