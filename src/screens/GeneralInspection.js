import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../components/Button';
import Form from '../components/Form';
import Header from '../components/Header';
import MainDashboard from './MainDashboard';


const GeneralInspection = () => {

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

                <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, marginRight: 40, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                            <Image style={{ width: 30, height: 30, tintColor: "#FFFFFF", margin: 10 }}
                                source={require('../../assets/inspection_icon.png')}></Image>
                        </View>
                        <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                            Inspection
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 50, color: '#1E3D5C' }}>{totalInspections}</Text>
                        <Text style={{ fontSize: 20, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Inspections</Text>
                        <View style={{ borderRightWidth: 2, borderRightColor: '#5B5B5B', marginHorizontal: 20, opacity: 0.5 }}></View>
                        <Text style={{ fontSize: 50, color: '#D60000' }}>{totalDefects}</Text>
                        <Text style={{ fontSize: 20, color: '#D60000', marginHorizontal: 10, marginTop: 10, fontWeight: '500' }}>Defects</Text>
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
                            btnStyle={styles.btn}
                            btnTextStyle={styles.btnText}
                            onPress={handleDownloadReportBtn}></AppBtn>
                    </View>
                </View>
                <View style={styles.contentCardStyle}>
                    <Form />
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

export default GeneralInspection