import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import CircularProgressBar from '../components/CircleProgress'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../components/Button';
import NameAvatar from '../components/NameAvatar';
import Header from '../components/Header';
import DropDownComponent from '../components/DropDown';

const driverOptionList = ['Inspection'];
const assetOptionList = ['Inspection', 'Defects'];

const MainDashboard = (props) => {

  const [selectedPage, setSelectedPage] = useState('Inspection');
  const [dashboardHovered, setDashboardHovered] = useState(false)
  const [inspectiondHovered, setInspectionHovered] = useState(false)
  const [maintenanceHovered, setMaintenanceHovered] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0));
  const [assetsHovered, setAssetsHovered] = useState(false)
  const [usersHovered, setUsersHovered] = useState(false)
  const [driverSelectedOption, setDriverSelectedOption] = useState('Inspection');
  const [assetSelectedOption, setAssetSelectedOption] = useState('Inspection');
  const [dashboardCalendarSelect, setDashboardCalendarSelect] = useState('Today')

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


  return (
    <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
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
            <Image style={{ width: 30, height: 30, margin: 10 }}
            tintColor='#FFFFFF'
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
          <View>
            <AppBtn
              title="Download Report"
              btnStyle={styles.btn}
              btnTextStyle={styles.btnText}
              onPress={handleDownloadReportBtn} />
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
              <CircularProgressBar percentage='100' />
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

            <DropDownComponent
              options={driverOptionList}
              onValueChange={handleDriverValueChange}
              // title="Ubaid Arshad"
              selectedValue={driverSelectedOption}
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

            <DropDownComponent
              options={assetOptionList}
              onValueChange={handleAssetValueChange}
              selectedValue={assetSelectedOption}
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
            />

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
  dropdownContainer: {
    position: 'relative',
    zIndex: 1
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 150,

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
  }
});

export default MainDashboard