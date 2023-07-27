import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import CircularProgressBar from '../components/CircleProgress'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../components/Button';
import NameAvatar from '../components/NameAvatar';
import Form from '../components/Form';
import Header from '../components/Header';
import MainDashboard from './MainDashboard';
import GeneralInspectionPage from './GeneralInspection';
import CustomDropdownLeftSide from '../components/DropDownComponentLeftSide';
import AssetsPage from './Assets';


const driverOptionList = ['Inspection'];
const assetOptionList = ['Inspection', 'Defects'];


const DashboardPage = (props) => {

  const [selectedPage, setSelectedPage] = useState('Assets');
  const [dashboardHovered, setDashboardHovered] = useState(false)
  const [inspectiondHovered, setInspectionHovered] = useState(false)
  const [maintenanceHovered, setMaintenanceHovered] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0));
  const [assetsHovered, setAssetsHovered] = useState(false)
  const [usersHovered, setUsersHovered] = useState(false)
  const [driverSelectedOption, setDriverSelectedOption] = useState('Inspection');
  const [assetSelectedOption, setAssetSelectedOption] = useState('Inspection');
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
    if(selectedPage == 'Inspection') {
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

  const closeAllExpands =(value) => {
    if (value == 'Dashboard'){
      setInspectionOptionExpand(false)
      setMaintenanceOptionExpand(false)
      setUsersOptionExpand(false)
      setMaintenanceSelectedPage("")
      setInspectionSelectedPage("")
      setUsersSelectedPage("")
    }
    else if (value == 'Inspection') {
      setMaintenanceOptionExpand(false)
      setUsersOptionExpand(false)
      // setMaintenanceSelectedPage("")
      // setUsersSelectedPage("")
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
        <MainDashboard />
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
       <AssetsPage onAddAssetBtn={handleAddAssetBtn}/>
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
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>45 days inspection</Text>
          </View>
        )
      }
    }
    else if (selectedPage == "Maintenance") {
      if (maintenanceSelectedPage == 'Defects') {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Defects</Text>
          </View>
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
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Driver</Text>
          </View>
        )
      }
      else if (usersSelectedPage == 'Mechanic') {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Mechanic</Text>
          </View>
        )
      }
      else if (usersSelectedPage == 'Manager') {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Manager</Text>
          </View>
        )
      }
    }
  };


  const handleHeaderValue = (value) => {
    if(value == 'Logout')
    props.navigation.navigate('Login')
  };

  const handleAddAssetBtn = () => {
  props.navigation.navigate('CreateNewAsset')
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Text style={styles.title}>D V I R</Text>
        <View style={selectedPage == 'Dashboard' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, dashboardHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setDashboardHovered(true) }}
          onMouseLeave={() => { setDashboardHovered(false) }}>
          <Image style={selectedPage == 'Dashboard' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, dashboardHovered && styles.iconStyleHover]} source={require('../../assets/dashboard_speed_icon.png')}></Image>
          <TouchableOpacity
            style={{ paddingLeft: 20 }}
            onPress={() => {
              fadeAnim.setValue(0);
              setSelectedPage('Dashboard')
              closeAllExpands('Dashboard')
            }}
          >
            <Text style={selectedPage == 'Dashboard' ? [styles.navText, styles.navTextHover] : [styles.navText, dashboardHovered && styles.navTextHover]}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={inspectionOptionExpand == true ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, inspectiondHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setInspectionHovered(true) }}
          onMouseLeave={() => { setInspectionHovered(false) }}>
          <Image style={inspectionOptionExpand == true ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, inspectiondHovered && styles.iconStyleHover]} source={require('../../assets/inspection_icon.png')}></Image>

          <TouchableOpacity
            style={{ paddingLeft: 20, flexDirection: 'row' }}
            onPress={() => {
              
              setInspectionOptionExpand(!inspectionOptionExpand)
              // setMaintenanceOptionExpand(false)
              closeAllExpands('Inspection')
            }}>

            <Text style={inspectionOptionExpand == true ? [styles.navText, styles.navTextHover] : [styles.navText, inspectiondHovered && styles.navTextHover]}>Inspection</Text>
            <Image style={selectedPage == 'Inspection' ? [styles.iconStyle, styles.iconStyleHover, { marginHorizontal: 10 }] : [styles.iconStyle, inspectiondHovered && styles.iconStyleHover, { marginHorizontal: 10 }]} source={require('../../assets/down_arrow_icon.png')}></Image>
          </TouchableOpacity>
        </View>

        {inspectionOptionExpand == true ?
          <View style={{ marginLeft: 20 }}>
            <View style={inspectionSelectedPage == 'General Inspection' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setGeneralInspectionHovered(true) }}
              onMouseLeave={() => { setGeneralInspectionHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setInspectionSelectedPage('General Inspection')
                  setSelectedPage("Inspection")
                }}
              >
                <Text style={inspectionSelectedPage == 'General Inspection' ? [styles.navText, { color: '#FFFFFF', opacity: 1, }] : [styles.navText, generalInspectionHovered && { color: '#FFFFFF', opacity: 1 }]}>General Inspection</Text>
              </TouchableOpacity>
            </View>

            <View style={inspectionSelectedPage == '45 days Inspection' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setDaysInspectionHovered(true) }}
              onMouseLeave={() => { setDaysInspectionHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setInspectionSelectedPage('45 days Inspection')
                  setSelectedPage("Inspection")
                }}
              >
                <Text style={inspectionSelectedPage == '45 days Inspection' ? [styles.navText, { color: '#FFFFFF', opacity: 1 }] : [styles.navText, daysInspectionhovered && { color: '#FFFFFF', opacity: 1 }]}>45 days Inspection</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          null}

        <View style={maintenanceOptionExpand == true ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, maintenanceHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setMaintenanceHovered(true) }}
          onMouseLeave={() => { setMaintenanceHovered(false) }}>
          <Image style={maintenanceOptionExpand == true ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, maintenanceHovered && styles.iconStyleHover]} source={require('../../assets/maintenance_icon.png')}></Image>

          <TouchableOpacity
            style={{ paddingLeft: 20, flexDirection: 'row' }}
            onPress={() => {
              // fadeAnim.setValue(0);
              setMaintenanceOptionExpand(!maintenanceOptionExpand)
              // setInspectionOptionExpand(false)
              closeAllExpands('Maintenance')
            }}>

            <Text style={maintenanceOptionExpand == true ? [styles.navText, styles.navTextHover] : [styles.navText, maintenanceHovered && styles.navTextHover]}>Maintenance</Text>
            <Image style={selectedPage == 'Maintenance' ? [styles.iconStyle, styles.iconStyleHover, { marginHorizontal: 10 }] : [styles.iconStyle, maintenanceHovered && styles.iconStyleHover, { marginHorizontal: 10 }]} source={require('../../assets/down_arrow_icon.png')}></Image>
          </TouchableOpacity>
        </View>

        {maintenanceOptionExpand == true ?
          <View style={{ marginLeft: 20 }}>
            <View style={maintenanceSelectedPage == 'Defects' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setDefectsHovered(true) }}
              onMouseLeave={() => { setDefectsHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setMaintenanceSelectedPage('Defects')
                  setSelectedPage("Maintenance")
                }}
              >
                <Text style={maintenanceSelectedPage == 'Defects' ? [styles.navText, { color: '#FFFFFF', opacity: 1, }] : [styles.navText, defectsHovered && { color: '#FFFFFF', opacity: 1 }]}>Defects</Text>
              </TouchableOpacity>
            </View>

            <View style={maintenanceSelectedPage == 'Work Order' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setWorkOrderHovered(true) }}
              onMouseLeave={() => { setWorkOrderHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setMaintenanceSelectedPage('Work Order')
                  setSelectedPage("Maintenance")
                }}
              >
                <Text style={maintenanceSelectedPage == 'Work Order' ? [styles.navText, { color: '#FFFFFF', opacity: 1 }] : [styles.navText, workOrderHovered && { color: '#FFFFFF', opacity: 1 }]}>Work Order</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          null}

        <View style={selectedPage == 'Assets' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, assetsHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setAssetsHovered(true) }}
          onMouseLeave={() => { setAssetsHovered(false) }}>
          <Image style={selectedPage == 'Assets' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, assetsHovered && styles.iconStyleHover]} source={require('../../assets/vehicle_icon.png')}></Image>
          <TouchableOpacity
            style={{ paddingLeft: 20 }}
            onPress={() => {
              // fadeAnim.setValue(0);
              setSelectedPage('Assets')
              // setInspectionOptionExpand(false)
              // setInspectionSelectedPage("")
              closeAllExpands('Assets')
            }}>
            <Text style={selectedPage == 'Assets' ? [styles.navText, styles.navTextHover] : [styles.navText, assetsHovered && styles.navTextHover]}>Assets</Text>
          </TouchableOpacity>
        </View>

        <View style={usersOptionExpand == true ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, usersHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setUsersHovered(true) }}
          onMouseLeave={() => { setUsersHovered(false) }}>
          <Image style={usersOptionExpand == true ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, usersHovered && styles.iconStyleHover]} source={require('../../assets/user_icon.png')}></Image>

          <TouchableOpacity
            style={{ paddingLeft: 20, flexDirection: 'row' }}
            onPress={() => {
              // fadeAnim.setValue(0);
              setUsersOptionExpand(!usersOptionExpand)
              // setInspectionOptionExpand(false)
              // setMaintenanceOptionExpand(false)
              closeAllExpands('Users')
            }}>

            <Text style={usersOptionExpand == true ? [styles.navText, styles.navTextHover] : [styles.navText, usersHovered && styles.navTextHover]}>Users</Text>
            <Image style={selectedPage == 'Users' ? [styles.iconStyle, styles.iconStyleHover, { marginHorizontal: 10 }] : [styles.iconStyle, usersHovered && styles.iconStyleHover, { marginHorizontal: 10 }]} source={require('../../assets/down_arrow_icon.png')}></Image>
          </TouchableOpacity>
        </View>

        {usersOptionExpand == true ?
          <View style={{ marginLeft: 20 }}>
            <View style={usersSelectedPage == 'Driver' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setDriverHovered(true) }}
              onMouseLeave={() => { setDriverHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setUsersSelectedPage('Driver')
                  setSelectedPage("Users")
                }}
              >
                <Text style={usersSelectedPage == 'Driver' ? [styles.navText, { color: '#FFFFFF', opacity: 1, }] : [styles.navText, driverHovered && { color: '#FFFFFF', opacity: 1 }]}>Driver</Text>
              </TouchableOpacity>
            </View>

            <View style={usersSelectedPage == 'Mechanic' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setMechanicHovered(true) }}
              onMouseLeave={() => { setMechanicHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setUsersSelectedPage('Mechanic')
                  setSelectedPage("Users")
                }}
              >
                <Text style={usersSelectedPage == 'Mechanic' ? [styles.navText, { color: '#FFFFFF', opacity: 1 }] : [styles.navText, mechanicHovered && { color: '#FFFFFF', opacity: 1 }]}>Mechanic</Text>
              </TouchableOpacity>
            </View>

            <View style={usersSelectedPage == 'Manager' ? [styles.navItem, { height: 30 }] : [styles.navItem, { height: 30 }]}
              onMouseEnter={() => { setManagerHovered(true) }}
              onMouseLeave={() => { setManagerHovered(false) }}>
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => {
                  // fadeAnim.setValue(0);
                  setUsersSelectedPage('Manager')
                  setSelectedPage("Users")
                }}
              >
                <Text style={usersSelectedPage == 'Manager' ? [styles.navText, { color: '#FFFFFF', opacity: 1 }] : [styles.navText, managerHovered && { color: '#FFFFFF', opacity: 1 }]}>Manager</Text>
              </TouchableOpacity>
            </View>

          </View>
          :
          null}

      </View>
      <View style={{ flexDirection: 'column', flex: 1, }}>
        <View style={{ zIndex: 1 }}>
          <Header onValueChange={handleHeaderValue}/>
        </View>
        {renderPage()}

      </View>

    </View>
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
  iconStyle: {
    height: 18,
    width: 18,
    tintColor: '#67E9DA'
  },
  iconStyleHover: {
    height: 20,
    width: 20,
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
});

export default DashboardPage;
