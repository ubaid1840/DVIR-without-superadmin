import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Animated, Platform, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import CircularProgressBar from '../../components/CircleProgress'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import NameAvatar from '../../components/NameAvatar';
import Header from '../../components/Header';
import DropDownComponent from '../../components/DropDown';
import { Dimensions } from 'react-native';
import { DataContext } from '../store/context/DataContext';
import moment from 'moment'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../config/firebase';

const driverOptionList = ['Inspection'];
const assetOptionList = ['Inspection', 'Defects'];

const MainDashboard = (props) => {

  const db = getFirestore(app)

  const { state: dataState, setData } = useContext(DataContext)
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
  const { height, width } = Dimensions.get('window');
  const [totalInspection, setTotalInspection] = useState(dataState.value.data ? dataState.value.data.filter(item => item.TimeStamp.toDate() >= new Date()) : [])
  const [averageDuration, setAverageDuration] = useState('0:0')
  const [defectsReported, setDefectsReported] = useState(0)
  const [passedInspection, setPassedInspection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [myData, setMyData] = useState(dataState.value.data.length == 0 ? [] : dataState.value.data)
  const [inspectedAsset, setInspectedAsset] = useState(0)
  const [driverNumbers, setDriverNumbers] = useState(0)
  const [inspectingDrivers, setInspectingDrivers] = useState(0)
  const [defectedAssets, setDefectedAssets] = useState(0)
  const [assetWithMostDefects, setAssetWithMostDefects] = useState([])
  const [assetLeaderboard, setAssetLeaderboard] = useState([])
  const [assetLeaderboardwithDefects, setAssetLeaderboardWithDefects] = useState([])
  const [allDrivers, setAllDrivers] = useState([])


  useEffect(() => {

    const fetchDriver = async () => {

      const driverEmployeeNumberCounts = {};
      myData.forEach((obj) => {
        const driverNumber = obj.driverEmployeeNumber;
        driverEmployeeNumberCounts[driverNumber] = (driverEmployeeNumberCounts[driverNumber] || 0) + 1;
      });

      // Sort the driverEmployeeNumbers based on the counts in descending order
      const sortedDriverEmployeeNumbers = Object.keys(driverEmployeeNumberCounts).sort((a, b) => {
        return driverEmployeeNumberCounts[b] - driverEmployeeNumberCounts[a];
      });

      // Create a new array with unique driverEmployeeNumbers and their occurrence counts
      const uniqueDriverArray = sortedDriverEmployeeNumbers.map((driverNumber) => ({
        driverEmployeeNumber: driverNumber,
        occurrenceCount: driverEmployeeNumberCounts[driverNumber],
      }));

      // console.log(uniqueDriverArray);

      const assetNumberCounts = {};
      const failedCounts = {};

      myData.forEach((obj) => {
        const assetNumber = obj.assetNumber;
        const formStatus = obj.formStatus;

        assetNumberCounts[assetNumber] = (assetNumberCounts[assetNumber] || 0) + 1;

        if (formStatus === 'Failed') {
          failedCounts[assetNumber] = (failedCounts[assetNumber] || 0) + 1;
        }
      });

      // Sort the array based on the counts in descending order
      const sortedArray = myData.sort((a, b) => {
        return assetNumberCounts[b.assetNumber] - assetNumberCounts[a.assetNumber];
      });

      // Create a new array with unique entries, counts, and failed counts
      const uniqueArray = [];
      const seenAssetNumbers = new Set();

      sortedArray.forEach((obj) => {
        const assetNumber = obj.assetNumber;
        if (!seenAssetNumbers.has(assetNumber)) {
          seenAssetNumbers.add(assetNumber);
          uniqueArray.push({
            ...obj, // Copy all properties from the original object
            count: assetNumberCounts[assetNumber], // Add the count property
            failedCount: failedCounts[assetNumber] || 0, // Add the failedCount property
          });
        }
      });

      setAssetLeaderboard(uniqueArray)

      const sortedByFailedCount = uniqueArray.slice().sort((a, b) => {
        return b.failedCount - a.failedCount;
      });
      setAssetLeaderboardWithDefects(sortedByFailedCount)

      const countAssetNumbers = (array) => {
        const counts = {};
        let mostCommonAssetNumber = null;
        let maxCount = 0;

        // Count occurrences of assetNumbers
        for (const obj of array) {
          const assetNumber = obj.assetNumber;
          counts[assetNumber] = (counts[assetNumber] || 0) + 1;

          if (counts[assetNumber] > maxCount) {
            mostCommonAssetNumber = assetNumber;
            maxCount = counts[assetNumber];
          }
        }

        return { mostCommonAssetNumber, maxCount };
      };

      const { mostCommonAssetNumber, maxCount } = countAssetNumbers(myData);
      // console.log(mostCommonAssetNumber)
      try {
        const assetDetail = []
        await getDocs(collection(db, 'Assets'))
          .then((snapshot) => {
            snapshot.forEach((docs) => {
              if (docs.data()['Asset Number'] == mostCommonAssetNumber) {
                assetDetail.push(docs.data())
              }
            })
          })
        setAssetWithMostDefects(assetDetail)

        // console.log(assetDetail[0]['Asset Name'].charAt(0))

      } catch (error) {
        console.log(error)
      }

      try {
        const driverNumber = [];
        const driversList = []

        await getDocs(query(collection(db, 'AllowedUsers'), where('Designation', '==', 'Driver')))
          .then((snapshot) => {
            snapshot.forEach((docs) => {
              uniqueDriverArray.map((item) => {
                if (item.driverEmployeeNumber == docs.data()['Employee Number'].toString()) {
                  driversList.push({ ...docs.data(), 'count': item.occurrenceCount })
                }
              })
              driverNumber.push(docs.data()['Employee Number'])

            })
          })

        setAllDrivers(driversList)
        setDriverNumbers(driverNumber)
        setLoading(false)

      } catch (error) {
        console.log('error')
      }



      // console.log(driverNumbersArray)
    }

    fetchDriver()
  }, [])

  useEffect(() => {

    if (loading == false) {


      const filterArrayByDateRange = (array, range) => {
        const currentDate = new Date();
        const filteredArray = array.filter((obj) => {
          const objDate = obj.TimeStamp.toDate(); // Assuming timestamp is a Firestore ServerTimestamp
          switch (range) {
            case "today":
              return isSameDate(objDate, currentDate);
            case "yesterday":
              const yesterday = new Date(currentDate);
              yesterday.setDate(currentDate.getDate() - 1);
              return isSameDate(objDate, yesterday);
            case "last7days":
              const sevenDaysAgo = new Date(currentDate);
              sevenDaysAgo.setDate(currentDate.getDate() - 6);
              return objDate >= sevenDaysAgo && objDate <= currentDate;
            case "last30days":
              const thirtyDaysAgo = new Date(currentDate);
              thirtyDaysAgo.setDate(currentDate.getDate() - 29);
              return objDate >= thirtyDaysAgo && objDate <= currentDate;
            case "last365days":
              const last365DaysAgo = new Date(currentDate);
              last365DaysAgo.setDate(currentDate.getDate() - 364);
              return objDate >= last365DaysAgo && objDate <= currentDate;
            default:
              return false;
          }
        });
        return filteredArray;
      };

      // Function to compare two dates, ignoring the time part
      const isSameDate = (date1, date2) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };


      if (myData.length != 0) {



        const uniqueDriverNumbers = new Set();
        const count = myData.length

        let durationFound = 0
        let total = 0
        let totalDuration = 0
        let defects = 0

        if (dashboardCalendarSelect == 'Month') {

          const temp = filterArrayByDateRange(myData, "last30days");
          setTotalInspection(temp)

          if (temp.length == 0) {
            setPassedInspection(0)
            setInspectedAsset(0)
            setInspectingDrivers(0)
            setDefectsReported(0)
            setDefectedAssets(0)
          }
          else {
            setDefectedAssets(Math.round(temp.filter(item => item.formStatus == 'Failed').length * 100 / myData.length))
            setInspectedAsset(Math.round(temp.length * 100 / count))
            temp.map((item) => {
              uniqueDriverNumbers.add(item.driverEmployeeNumber)
              let i = 0
              if (item.duration) {
                totalDuration = totalDuration + item.duration
                durationFound++
              }
              item.form.map((doc, index) => {
                if (index != 0 && doc.value == 'Fail') {
                  i++
                  defects++
                }
              })
              if (i == 0) {
                total++
              }
            })
            const driverNumbersArray = Array.from(uniqueDriverNumbers);
            setInspectingDrivers(Math.round(driverNumbersArray.length * 100 / driverNumbers.length))
            // console.log(temp.length)
            setPassedInspection(Math.round((total * 100) / temp.length))
            setDefectsReported(defects)
          }
          if (totalDuration != 0) {
            const avgDuration = totalDuration / durationFound
            const elapsedDuration = moment.duration(avgDuration);
            const hours = Math.floor(elapsedDuration.asHours());
            const minutes = Math.floor(elapsedDuration.minutes());
            const seconds = Math.floor(elapsedDuration.seconds());
            setAverageDuration(`${minutes}:${seconds}`)
          }
          else {
            setAverageDuration('0:0')
          }

          //setLoading(false)
        }

        else if (dashboardCalendarSelect == 'Week') {
          const temp = filterArrayByDateRange(myData, "last7days");
          setTotalInspection(temp)

          let total = 0
          if (temp.length == 0) {
            setPassedInspection(0)
            setInspectedAsset(0)
            setInspectingDrivers(0)
            setDefectsReported(0)
            setDefectedAssets(0)
          }
          else {
            setDefectedAssets(Math.round(temp.filter(item => item.formStatus == 'Failed').length * 100 / myData.length))
            setInspectedAsset(Math.round(temp.length * 100 / count))
            temp.map((item) => {
              uniqueDriverNumbers.add(item.driverEmployeeNumber)
              let i = 0
              if (item.duration) {
                totalDuration = totalDuration + item.duration
                durationFound++
              }
              item.form.map((doc, index) => {
                if (index != 0 && doc.value == 'Fail') {
                  i++
                  defects++
                }
              })
              if (i == 0) {
                total++
              }
            })
            // console.log(temp.length)
            const driverNumbersArray = Array.from(uniqueDriverNumbers);
            setInspectingDrivers(Math.round(driverNumbersArray.length * 100 / driverNumbers.length))
            setPassedInspection(Math.round((total * 100) / temp.length))
            setDefectsReported(defects)
          }
          if (totalDuration != 0) {
            const avgDuration = totalDuration / durationFound
            const elapsedDuration = moment.duration(avgDuration);
            const hours = Math.floor(elapsedDuration.asHours());
            const minutes = Math.floor(elapsedDuration.minutes());
            const seconds = Math.floor(elapsedDuration.seconds());
            setAverageDuration(`${minutes}:${seconds}`)
          }
          else {
            setAverageDuration('0:0')
          }
          //setLoading(false)
        }

        else if (dashboardCalendarSelect == 'Yesterday') {
          const temp = filterArrayByDateRange(myData, "yesterday");
          setTotalInspection(temp)

          let total = 0
          if (temp.length == 0) {
            setPassedInspection(0)
            setInspectedAsset(0)
            setInspectingDrivers(0)
            setDefectsReported(0)
            setDefectedAssets(0)
          }
          else {
            setDefectedAssets(Math.round(temp.filter(item => item.formStatus == 'Failed').length * 100 / myData.length))
            setInspectedAsset(Math.round(temp.length * 100 / count))
            temp.map((item) => {
              uniqueDriverNumbers.add(item.driverEmployeeNumber)
              let i = 0
              if (item.duration) {
                totalDuration = totalDuration + item.duration
                durationFound++
              }
              item.form.map((doc, index) => {
                if (index != 0 && doc.value == 'Fail') {
                  i++
                  defects++
                }
              })
              if (i == 0) {
                total++
              }
            })
            // console.log(temp.length)
            const driverNumbersArray = Array.from(uniqueDriverNumbers);
            setInspectingDrivers(Math.round(driverNumbersArray.length * 100 / driverNumbers.length))
            setPassedInspection(Math.round((total * 100) / temp.length))
            setDefectsReported(defects)
          }
          // console.log(totalDuration)
          if (totalDuration != 0) {
            const avgDuration = totalDuration / durationFound
            const elapsedDuration = moment.duration(avgDuration);
            const hours = Math.floor(elapsedDuration.asHours());
            const minutes = Math.floor(elapsedDuration.minutes());
            const seconds = Math.floor(elapsedDuration.seconds());
            setAverageDuration(`${minutes}:${seconds}`)
          }
          else {
            setAverageDuration('0:0')
          }

        }

        else if (dashboardCalendarSelect == 'Today') {
          const temp = filterArrayByDateRange(myData, "today");
          setTotalInspection(temp)

          let total = 0
          if (temp.length == 0) {
            setPassedInspection(0)
            setInspectedAsset(0)
            setInspectingDrivers(0)
            setDefectsReported(0)
            setDefectedAssets(0)
          }
          else {
            setDefectedAssets(Math.round(temp.filter(item => item.formStatus == 'Failed').length * 100 / myData.length))
            setInspectedAsset(Math.round(temp.length * 100 / count))

            temp.map((item) => {
              uniqueDriverNumbers.add(item.driverEmployeeNumber)
              let i = 0
              if (item.duration) {
                totalDuration = totalDuration + item.duration
                durationFound++
              }
              item.form.map((doc, index) => {
                if (index != 0 && doc.value == 'Fail') {
                  i++
                  defects++
                }
              })
              if (i == 0) {
                total++
              }
            })

            // console.log(uniqueDriverNumbers)
            const driverNumbersArray = Array.from(uniqueDriverNumbers);
            const val = (driverNumbersArray.length * 100) / driverNumbers.length
            setInspectingDrivers(val)
            setPassedInspection(Math.round((total * 100) / temp.length))
            setDefectsReported(defects)
          }
          if (totalDuration != 0) {
            const avgDuration = totalDuration / durationFound
            const elapsedDuration = moment.duration(avgDuration);
            const hours = Math.floor(elapsedDuration.asHours());
            const minutes = Math.floor(elapsedDuration.minutes());
            const seconds = Math.floor(elapsedDuration.seconds());
            setAverageDuration(`${minutes}:${seconds}`)
          }
          else {
            setAverageDuration('0:0')
          }
          // setLoading(false)
        }

        else if (dashboardCalendarSelect == 'Year') {
          const temp = filterArrayByDateRange(myData, "last365days");
          setTotalInspection(temp)

          let total = 0
          if (temp.length == 0) {
            setPassedInspection(0)
            setInspectedAsset(0)
            setInspectingDrivers(0)
            setDefectsReported(0)
            setDefectedAssets(0)
          }
          else {
            setDefectedAssets(Math.round(temp.filter(item => item.formStatus == 'Failed').length * 100 / myData.length))
            setInspectedAsset(Math.round(temp.length * 100 / count))
            temp.map((item) => {
              uniqueDriverNumbers.add(item.driverEmployeeNumber)
              let i = 0
              if (item.duration) {
                totalDuration = totalDuration + item.duration
                durationFound++

              }
              item.form.map((doc, index) => {
                if (index != 0 && doc.value == 'Fail') {
                  i++
                  defects++
                }
              })
              if (i == 0) {
                total++
              }
            })
            // console.log(temp.length)
            const driverNumbersArray = Array.from(uniqueDriverNumbers);
            setInspectingDrivers(Math.round(driverNumbersArray.length * 100 / driverNumbers.length))
            setPassedInspection(Math.round((total * 100) / temp.length))
            setDefectsReported(defects)

          }
          if (totalDuration != 0) {
            const avgDuration = totalDuration / durationFound
            const elapsedDuration = moment.duration(avgDuration);
            const hours = Math.floor(elapsedDuration.asHours());
            const minutes = Math.floor(elapsedDuration.minutes());
            const seconds = Math.floor(elapsedDuration.seconds());
            setAverageDuration(`${minutes}:${seconds}`)
          }
          else {
            setAverageDuration('0:0')
          }
          //setLoading(false)
        }
        //setLoading(false)
      }

    }

  }, [dashboardCalendarSelect, loading])





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

  const handleDownloadReportBtn = () => {

  }


  return (
    <>
      <Animated.View style={{ flex: 1, backgroundColor: '#f6f8f9'}}>
        <ScrollView style={{ height: 100 }}>
          <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, alignItems: 'center' }}>
            <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
              <Image style={{ width: 30, height: 30, margin: 7 }}
                tintColor='#FFFFFF'
                source={require('../../assets/dashboard_speed_icon.png')}></Image>
            </View>
            <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
              Dashboard
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 30, paddingLeft: 40, paddingRight: 40 }}>
            <View style={{ flexDirection: 'row', paddingLeft: 30 }}>
              <TouchableOpacity style={{ marginRight: 40 }} onPress={() => {
                //setLoading(true)
                setDashboardCalendarSelect("Yesterday")
              }}>
                <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Yesterday" && styles.calenderSortSelectedText]}>
                  Yesterday
                </Text>
              </TouchableOpacity >
              <TouchableOpacity style={{ marginRight: 40 }} onPress={() => {
                //setLoading(true)
                setDashboardCalendarSelect("Today")
              }}>
                <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Today" && styles.calenderSortSelectedText]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 40 }} onPress={() => {
                //setLoading(true)
                setDashboardCalendarSelect("Week")
              }}>
                <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Week" && styles.calenderSortSelectedText]}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 40 }} onPress={() => {
                //setLoading(true)
                setDashboardCalendarSelect("Month")
              }}>
                <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Month" && styles.calenderSortSelectedText]}>
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 40 }} onPress={() => {
                //setLoading(true)
                setDashboardCalendarSelect("Year")
              }}>
                <Text style={[styles.calenderSortText, dashboardCalendarSelect == "Year" && styles.calenderSortSelectedText]}>
                  Year
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View>
              <AppBtn
                title="Download Report"
                btnStyle={styles.btn}
                btnTextStyle={styles.btnText}
                onPress={handleDownloadReportBtn} />
            </View> */}
          </View>
          <View style={styles.contentCardStyle}>
            <ScrollView style={{ flex: 1, width: '100%' }}
              contentContainerStyle={{ flexGrow: 1 }}
              horizontal>
              <View style={{ width: '100%' }}>
                <Text style={{ color: '#335a75', fontSize: 24, fontFamily: 'inter-extrablack', paddingBottom: 30 }}>
                  Inspection & Defects
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 15, width: '100%' }}>

                  <View style={{ flexDirection: 'column', borderRightWidth: 2, paddingRight: 60, borderRightColor: '#D2D2D2' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'inter-regular', fontSize: 55, color: '#23d3d3' }}>{totalInspection.length}</Text>
                      <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 10 }}>
                        <Text style={{ color: '#23d3d3', fontFamily: 'inter-medium', fontSize: 15 }}>inspections</Text>
                        <Text style={{ color: '#23d3d3', fontFamily: 'inter-thin', fontSize: 15 }}>({passedInspection}% Pass) </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={props.openInspection}>
                      <Text style={{ color: '#A8A8A8', fontFamily: 'inter-regular', fontSize: 12 }}>View inspections</Text>
                      <Image style={{ height: 15, width: 15, marginLeft: 5 }} source={require('../../assets/arrow_right_icon.png')} tintColor='#A8A8A8'></Image>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'column', borderRightWidth: 2, paddingHorizontal: 60, borderRightColor: '#D2D2D2' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'inter-regular', fontSize: 55, color: '#23d3d3' }}>{averageDuration}</Text>
                      <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 10 }}>
                        <Text style={{ color: '#23d3d3', fontFamily: 'inter-medium', fontSize: 15 }}>mins per</Text>
                        <Text style={{ color: '#23d3d3', fontFamily: 'inter-medium', fontSize: 15 }}>inspection</Text>
                        <Text style={{ color: '#23d3d3', fontFamily: 'inter-thin', fontSize: 15 }}>(avg) </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={props.openInspection}>
                      <Text style={{ color: '#A8A8A8', fontFamily: 'inter-regular', fontSize: 12 }}>View inspections</Text>
                      <Image style={{ height: 15, width: 15, marginLeft: 5 }} source={require('../../assets/arrow_right_icon.png')} tintColor='#A8A8A8'></Image>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'column', marginLeft: 60 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'inter-regular', fontSize: 55, color: 'red' }}>{defectsReported}</Text>
                      <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ color: 'red', fontFamily: 'inter-medium', fontSize: 15 }}>defects</Text>
                        <Text style={{ color: 'red', fontFamily: 'inter-medium', fontSize: 15 }}>reported</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={props.openDefects}>
                      <Text style={{ color: '#A8A8A8', fontFamily: 'inter-regular', fontSize: 12 }}>View defects</Text>
                      <Image style={{ height: 15, width: 15, marginLeft: 5 }} source={require('../../assets/arrow_right_icon.png')} tintColor='#A8A8A8'></Image>
                    </TouchableOpacity>
                  </View>

                </View>





                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15 }}>
                  <View style={{ marginLeft: 10, marginRight: 10, }}>
                    <Text style={styles.subHeadingText}>
                      Inspected assets
                    </Text>
                    <CircularProgressBar percentage={inspectedAsset.toString()} />

                  </View>
                  <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={styles.subHeadingText}>
                      Inspecting drivers
                    </Text>
                    <CircularProgressBar percentage={inspectingDrivers.toString()} />

                  </View>
                  <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={styles.subHeadingText}>
                      Assets with defects
                    </Text>
                    <CircularProgressBar percentage={defectedAssets.toString()} />

                  </View>
                </View>

                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 30 }}>
                  {/* <View style={{ alignItems: 'center' }}>
                    <View style={styles.driverAndAssetAvatar}>
                      <View style={{}}>{sortDriver()}</View>
                    </View>
                    <Text style={styles.subHeadingText}>
                      Driver with least inspections
                    </Text>
                  </View> */}
                  <View>
                    {assetWithMostDefects.length != 0 ?
                      <View style={{ alignItems: 'center' }}>
                        <View style={styles.driverAndAssetAvatar}>
                          <Text style={{ fontSize: 25, color: 'grey' }}>{assetWithMostDefects[0]['Asset Name'].charAt(0)}</Text>
                        </View>
                        <Text style={styles.subHeadingText}>
                          Asset with most defects
                        </Text>
                      </View>
                      : null}
                  </View>

                </View>
              </View>
            </ScrollView>
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
                data={allDrivers}
                renderItem={({ item, index }) => {
                  if (index < 3 && item)
                    return (
                      <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <NameAvatar title={item.Name.split(' ')[0].charAt(0).toUpperCase()} />
                          <View style={{ paddingLeft: 20 }}>
                            <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.Name.split(' ')[0]}</Text>
                            <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>Form 1</Text>
                          </View>
                          <View style={{ right: 0, position: 'absolute' }}>
                            {driverSelectedOption == "Inspection" ?
                              <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.count} Inspection</Text>
                              :
                              // <Text style={{ fontSize: 15, color: 'black', fontWeight: '600' }}>{item.defects} Defects</Text>
                              null
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


              {assetSelectedOption == "Inspection"
                ?
                <FlatList
                  data={assetLeaderboard}
                  renderItem={({ item, index }) => {
                    if (index < 3 && item)
                      return (
                        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <NameAvatar title={item.assetName.charAt(0).toUpperCase()} />
                            <View style={{ paddingLeft: 20 }}>
                              <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.assetName}</Text>
                              <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>Form 1</Text>
                            </View>
                            <View style={{ right: 0, position: 'absolute' }}>
                              {assetSelectedOption == "Inspection" ?
                                <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.count} Inspection</Text>
                                :
                                <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.failedCount} Defects</Text>
                              }

                            </View>
                          </View>
                        </View>
                      )
                  }} />
                :
                <FlatList
                  data={assetLeaderboardwithDefects}
                  renderItem={({ item, index }) => {
                    if (index < 3 && item)
                      return (
                        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#CAC8C8' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <NameAvatar title={item.assetName.charAt(0).toUpperCase()} />
                            <View style={{ paddingLeft: 20 }}>
                              <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.assetName}</Text>
                              <Text style={{ fontSize: 15, color: 'grey', marginTop: 15 }}>Form 1</Text>
                            </View>
                            <View style={{ right: 0, position: 'absolute' }}>
                              {assetSelectedOption == "Inspection" ?
                                <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.failedCount} Inspection</Text>
                                :
                                <Text style={{ fontSize: 15, color: '#6C6C6C', fontFamily: 'inter-semibold' }}>{item.failedCount} Defects</Text>
                              }

                            </View>
                          </View>
                        </View>
                      )
                  }} />}




            </View>

          </View>
        </ScrollView>
      </Animated.View>

      {loading ?
        <View style={styles.activityIndicatorStyle}>
          <ActivityIndicator color="#23d3d3" size="large" />
        </View> : null}
    </>
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
    color: '#335a75',
    fontSize: 16,
    fontFamily: 'inter-bold',
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
    flex: 1,

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