import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import CircularProgressBar from '../components/CircleProgress'
import DropdownComponent from '../components/DropDownComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../components/Button';
import NameAvatar from '../components/NameAvatar';
import Form from '../components/Form';


const driverOptionList = ['Inspection'];
const assetOptionList = ['Inspection', 'Defects'];
const logoutList = ['Profile', 'Logout']

const DashboardPage = () => {

  const [selectedPage, setSelectedPage] = useState('Dashboard');
  const [dashboardHovered, setDashboardHovered] = useState(false)
  const [inspectiondHovered, setInspectionHovered] = useState(false)
  const [maintenanceHovered, setMaintenanceHovered] = useState(false)
  const [assetsHovered, setAssetsHovered] = useState(false)
  const [usersHovered, setUsersHovered] = useState(false)
  const [driverSelectedOption, setDriverSelectedOption] = useState('Inspection');
  const [assetSelectedOption, setAssetSelectedOption] = useState('Inspection');
  const [dashboardCalendarSelect, setDashboardCalendarSelect] = useState('Today')
  const [inspectionCalendarSelect, setInspectionCalendarSelect] = useState('All')
  const [totalInspections, setTotalInspections] = useState(19)
  const [totalDefects, setTotalDefects] = useState(7)

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

  const handleUserChange = () => {

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

  const renderPage = () => {
    switch (selectedPage) {
      case 'Dashboard':
        return (
          <View style={styles.contentContainer}>
            <ScrollView>
              <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}>
                <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
              </View>
              <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />


              <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, alignItems: 'center' }}>
                <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                  <Image style={{ width: 30, height: 30, tintColor: "#FFFFFF", margin: 10 }}
                    source={require('../../assets/dashboard_speed_icon.png')}></Image>
                </View>
                <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                  Dashboard
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 30, paddingLeft: 40, paddingRight: 40 }}>
                <View style={{ flexDirection: 'row', paddingLeft: 30 }}>
                  <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setDashboardCalendarSelect("Yesterday")}>
                    <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Yesterday" && styles.calenderSortSelectedText]}>
                      Yesterday
                    </Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setDashboardCalendarSelect("Today")}>
                    <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Today" && styles.calenderSortSelectedText]}>
                      Today
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setDashboardCalendarSelect("Week")}>
                    <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Week" && styles.calenderSortSelectedText]}>
                      Week
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setDashboardCalendarSelect("Month")}>
                    <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Month" && styles.calenderSortSelectedText]}>
                      Month
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setDashboardCalendarSelect("Year")}>
                    <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Year" && styles.calenderSortSelectedText]}>
                      Year
                    </Text>
                  </TouchableOpacity>
                </View>
                <View >
                  <AppBtn
                    title="Download Report"
                    onPress={handleDownloadReportBtn}></AppBtn>
                </View>
              </View>
              <View style={styles.contentCardStyle}>
                <Text style={{ color: '#1E3D5C', fontSize: 24, fontWeight: 'bold', paddingBottom: 30 }}>
                  Inspection & Defects
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <CircularProgressBar percentage='60' />
                    <Text style={styles.subHeadingText}>
                      Inspected assets
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <CircularProgressBar percentage='43' />
                    <Text style={styles.subHeadingText}>
                      Inspecting drivers
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <CircularProgressBar percentage='87' />
                    <Text style={styles.subHeadingText}>
                      Assets with defects
                    </Text>
                  </View>
                </View>

                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 30 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={styles.driverAndAssetAvatar}>
                      <View style={{}}>{sortDriver()}</View>
                    </View>
                    <Text style={styles.subHeadingText}>
                      Driver with least inspections
                    </Text>
                  </View>
                  <View>
                    <View style={{ alignItems: 'center' }}>
                      <View style={styles.driverAndAssetAvatar}>
                        <View style={{}}>{sortAsset()}</View>
                      </View>
                      <Text style={styles.subHeadingText}>
                        Asset with most defects
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 40 }}>
                <View style={styles.contentCardStyle}>
                  <Text style={{ color: '#1E3D5C', fontSize: 24, fontWeight: 'bold', paddingBottom: 30 }}>
                    Driver Leaderboard
                  </Text>
                  <DropdownComponent
                    options={driverOptionList}
                    selectedValue={driverSelectedOption}
                    onValueChange={handleDriverValueChange}
                    dropdownStyle={styles.dropdown}
                  />

                  <FlatList
                    data={driver}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <NameAvatar title={item.name[0]} />
                            <View style={{ paddingLeft: 20 }}>
                              <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.name}</Text>
                              <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>{item.company}</Text>
                            </View>
                            <View style={{ right: 0, position: 'absolute' }}>
                              {driverSelectedOption == "Inspection" ?
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.inspection} Inspection</Text>
                                :
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.defects} Defects</Text>
                              }

                            </View>
                          </View>
                        </View>
                      )
                    }} />
                </View>

                <View style={styles.contentCardStyle}>
                  <Text style={{ color: '#1E3D5C', fontSize: 24, fontWeight: 'bold', paddingBottom: 30 }}>
                    Asset Leaderboard
                  </Text>
                  <DropdownComponent
                    options={assetOptionList}
                    selectedValue={assetSelectedOption}
                    onValueChange={handleAssetValueChange}
                    dropdownStyle={styles.dropdown}
                    textStyle={styles.text} />

                  <FlatList
                    data={asset}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <NameAvatar title={item.name[0]} />
                            <View style={{ paddingLeft: 20 }}>
                              <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.name}</Text>
                              <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>{item.company}</Text>
                            </View>
                            <View style={{ right: 0, position: 'absolute' }}>
                              {assetSelectedOption == "Inspection" ?
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.inspection} Inspection</Text>
                                :
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.defects} Defects</Text>
                              }

                            </View>
                          </View>
                        </View>
                      )
                    }} />

                </View>

              </View>
            </ScrollView>
          </View>

        );
      case 'Inspection':
        return (
          <View style={styles.contentContainer}>
            <ScrollView>
              <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}>
                <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
              </View>
              <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />

              <View style={{flexDirection:'row',marginLeft: 40, marginTop: 40,marginRight:40, justifyContent:'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                    <Image style={{ width: 30, height: 30, tintColor: "#FFFFFF", margin: 10 }}
                      source={require('../../assets/inspection_icon.png')}></Image>
                  </View>
                  <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                    Inspection
                  </Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontSize:50, color:'#1E3D5C'}}>{totalInspections}</Text>
                  <Text style={{fontSize:20, color:'#5B5B5B', marginHorizontal:10, marginTop:10}}>Inspections</Text>
                  <View style={{borderRightWidth:2, borderRightColor:'#5B5B5B' ,marginHorizontal:20, opacity:0.5}}></View>
                  <Text style={{fontSize:50, color:'#1E3D5C'}}>{totalDefects}</Text>
                  <Text style={{fontSize:20, color:'#5B5B5B', marginHorizontal:10, marginTop:10}}>Defects</Text>
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
                  <AppBtn
                    title="Download Report"
                    onPress={handleDownloadReportBtn}></AppBtn>
                </View>
              </View>
              <View style={styles.contentCardStyle}>
                <Form />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 40 }}>
                <View style={styles.contentCardStyle}>
                  <Text style={{ color: '#1E3D5C', fontSize: 24, fontWeight: 'bold', paddingBottom: 30 }}>
                    Driver Leaderboard
                  </Text>
                  <DropdownComponent
                    options={driverOptionList}
                    selectedValue={driverSelectedOption}
                    onValueChange={handleDriverValueChange}
                    dropdownStyle={styles.dropdown}
                  />

                  <FlatList
                    data={driver}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <NameAvatar title={item.name[0]} />
                            <View style={{ paddingLeft: 20 }}>
                              <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.name}</Text>
                              <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>{item.company}</Text>
                            </View>
                            <View style={{ right: 0, position: 'absolute' }}>
                              {driverSelectedOption == "Inspection" ?
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.inspection} Inspection</Text>
                                :
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.defects} Defects</Text>
                              }

                            </View>
                          </View>
                        </View>
                      )
                    }} />
                </View>

                <View style={styles.contentCardStyle}>
                  <Text style={{ color: '#1E3D5C', fontSize: 24, fontWeight: 'bold', paddingBottom: 30 }}>
                    Asset Leaderboard
                  </Text>
                  <DropdownComponent
                    options={assetOptionList}
                    selectedValue={assetSelectedOption}
                    onValueChange={handleAssetValueChange}
                    dropdownStyle={styles.dropdown}
                    textStyle={styles.text} />

                  <FlatList
                    data={asset}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <NameAvatar title={item.name[0]} />
                            <View style={{ paddingLeft: 20 }}>
                              <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.name}</Text>
                              <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>{item.company}</Text>
                            </View>
                            <View style={{ right: 0, position: 'absolute' }}>
                              {assetSelectedOption == "Inspection" ?
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.inspection} Inspection</Text>
                                :
                                <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.defects} Defects</Text>
                              }

                            </View>
                          </View>
                        </View>
                      )
                    }} />

                </View>

              </View>
            </ScrollView>
          </View>

        );
      case 'Maintenance':
        return (
          <View style={styles.contentContainer}>
            {/* Add your Maintenance content here */}
            <Text style={styles.screenTitle}>Maintenance Content</Text>
          </View>
        );
      case 'Assets':
        return (
          <View style={styles.contentContainer}>
            {/* Add your Assets content here */}
            <Text style={styles.screenTitle}>Assets Content</Text>
          </View>
        );
      case 'Users':
        return (
          <View style={styles.contentContainer}>
            {/* Add your Users content here */}
            <Text style={styles.screenTitle}>Users Content</Text>
          </View>
        );
      default:
        return null;
    }
  };

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
            onPress={() => setSelectedPage('Dashboard')}
          >
            <Text style={selectedPage == 'Dashboard' ? [styles.navText, styles.navTextHover] : [styles.navText, dashboardHovered && styles.navTextHover]}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={selectedPage == 'Inspection' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, inspectiondHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setInspectionHovered(true) }}
          onMouseLeave={() => { setInspectionHovered(false) }}>
          <Image style={selectedPage == 'Inspection' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, inspectiondHovered && styles.iconStyleHover]} source={require('../../assets/inspection_icon.png')}></Image>
          <TouchableOpacity
            style={{ paddingLeft: 20 }}
            onPress={() => setSelectedPage('Inspection')}
          >
            <Text style={selectedPage == 'Inspection' ? [styles.navText, styles.navTextHover] : [styles.navText, inspectiondHovered && styles.navTextHover]}>Inspection</Text>
          </TouchableOpacity>
        </View>

        <View style={selectedPage == 'Maintenance' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, maintenanceHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setMaintenanceHovered(true) }}
          onMouseLeave={() => { setMaintenanceHovered(false) }}>
          <Image style={selectedPage == 'Maintenance' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, maintenanceHovered && styles.iconStyleHover]} source={require('../../assets/maintenance_icon.png')}></Image>
          <TouchableOpacity
            style={{ paddingLeft: 20 }}
            onPress={() => setSelectedPage('Maintenance')}
          >
            <Text style={selectedPage == 'Maintenance' ? [styles.navText, styles.navTextHover] : [styles.navText, maintenanceHovered && styles.navTextHover]}>Maintenance</Text>
          </TouchableOpacity>
        </View>
        <View style={selectedPage == 'Assets' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, assetsHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setAssetsHovered(true) }}
          onMouseLeave={() => { setAssetsHovered(false) }}>
          <Image style={selectedPage == 'Assets' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, assetsHovered && styles.iconStyleHover]} source={require('../../assets/vehicle_icon.png')}></Image>
          <TouchableOpacity
            style={{ paddingLeft: 20 }}
            onPress={() => setSelectedPage('Assets')}
          >
            <Text style={selectedPage == 'Assets' ? [styles.navText, styles.navTextHover] : [styles.navText, assetsHovered && styles.navTextHover]}>Assets</Text>
          </TouchableOpacity>
        </View>
        <View style={selectedPage == 'Users' ? [styles.navItem, styles.hoverNavItem] : [styles.navItem, usersHovered && styles.hoverNavItem]}
          onMouseEnter={() => { setUsersHovered(true) }}
          onMouseLeave={() => { setUsersHovered(false) }}>
          <Image style={selectedPage == 'Users' ? [styles.iconStyle, styles.iconStyleHover] : [styles.iconStyle, usersHovered && styles.iconStyleHover]} source={require('../../assets/user_icon.png')}></Image>
          <TouchableOpacity
            style={{ paddingLeft: 20 }}
            onPress={() => setSelectedPage('Users')}
          >
            <Text style={selectedPage == 'Users' ? [styles.navText, styles.navTextHover] : [styles.navText, usersHovered && styles.navTextHover]}>Users</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ flexDirection: 'row', paddingLeft: 60, paddingRight: 60, justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 16, fontWeight: '400', color: '#5B5B5B' }}>
            Welcome Ubaid Ur Rehman!
          </Text>
          <View style={{ flexDirection: 'row', width: 150, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Ubaid</Text>
            <TouchableOpacity style={{ marginLeft: 20 }}>
              <NameAvatar title="U" />
            </TouchableOpacity>
          </View>
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
    overflow: 'hidden'
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 150,
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
  }
});

export default DashboardPage;