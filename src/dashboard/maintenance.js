import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, Animated, Dimensions, ActivityIndicator, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import { TextInput } from 'react-native-gesture-handler';
import DropDownComponent from '../../components/DropDown';
import { CSVLink } from 'react-csv';
import { DataContext } from '../store/context/DataContext';
import { collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import app from '../config/firebase';
import { AuthContext } from '../store/context/AuthContext';
import { DefectContext } from '../store/context/DefectContext';
import { subscribeToCollection } from './defectFirebaseService';
import { WOContext } from '../store/context/WOContext';
import { PeopleContext } from '../store/context/PeopleContext';
import { AssetContext } from '../store/context/AssetContext';
import { InHouseWOContext } from '../store/context/InHouseWOContext'
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import AlertModal from '../../components/AlertModal';

const columns = [
  'id',
  'assetName',
  'defectedItems',
  'dueDate',
  'assignedMechanic',
  'Action',
];


const MaintenancePage = (props) => {

  const db = getFirestore(app)

  const [search, setSearch] = useState('')
  const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [workOrderArray, setWorkOrderArray] = useState([])
  const [overDue, setOverDue] = useState(0)
  const [pending, setPending] = useState(0)
  const [completed, setCompleted] = useState(0)

  const [inHouseoverDue, setInHouseOverDue] = useState(0)
  const [inHousepending, setInHousePending] = useState(0)
  const [inHousecompleted, setInHouseCompleted] = useState(0)


  const [searchWorkOrderSelectedOption, setSearchWorkOrderSelectedOption] = useState('Select')
  const [openCustomWO, setOpenCustomWO] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState('')
  const [workOrderVariable, setWorkOrderVariable] = useState([]);
  const [inHouseWOArray , setInHouseWOArray] = useState([])
  const [inHouseWOVariable, setInHouseWOVariable] = useState([])
  const [assignedMechanic, setAssignedMechanic] = useState('')
  const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`);
  const [openCalendar, setOpenCalendar] = useState(false)
  const [addTask, setAddTask] = useState('')
  const [alertIsVisible, setAlertIsVisible] = useState(false)
  const [alertStatus, setAlertStatus] = useState('')
  const [options, setOptions] = useState('1')

  const { state: woState, setWO } = useContext(WOContext)
  const { state: assetState, } = useContext(AssetContext)
  const { state: peopleState } = useContext(PeopleContext)
  const { state: inHouseWOState, setInHouseWO } = useContext(InHouseWOContext)

  useEffect(() => {
    fetchData()
    fetchInHouseData()
  }, [])


  const fetchInHouseData = async() => {
    await getDocs(collection(db, 'InHouseWorkOrders'))
      .then((snapshot) => {
        let temp = []
        snapshot.forEach((docs) => {
          temp.push(docs.data())
        })
        setInHouseWOArray(temp)
        setInHouseWO(temp)
        let i = 0
        let j = 0
        let k = 0
        temp.map((item) => {
          if (item.status == 'Pending') {
            i++
          }
          if (item.status == 'Completed') {
            k++
          }
          const currentDate = new Date().getTime
          const diff = currentDate - item.dueDate
          if (diff < 0) {
            j++
          }
          setInHouseOverDue(j)
          setInHousePending(i)
          setInHouseCompleted(k)
        })
        setLoading(false)
      })
  }
  const fetchData = async () => {
    await getDocs(collection(db, 'WorkOrders'))
      .then((snapshot) => {
        let temp = []
        snapshot.forEach((docs) => {
          temp.push(docs.data())
        })
        setWorkOrderArray(temp)
        setWO(temp)
        let i = 0
        let j = 0
        let k = 0
        temp.map((item) => {
          if (item.status == 'Pending') {
            i++
          }
          if (item.status == 'Completed') {
            k++
          }
          const currentDate = new Date().getTime
          const diff = currentDate - item.dueDate
          if (diff < 0) {
            j++
          }
          setOverDue(j)
          setPending(i)
          setCompleted(k)
        })
        setLoading(false)
      })
  }

  const handleSearchWorkOrderValueChange = (value) => {
    setSearchWorkOrderSelectedOption(value)
  }

  const handleWorkOrderFormValueChange = (value) => {
    // console.log(value)
    // setSelectedDefect(value)
    props.onDashboardValueChange(value)
    // setDefect(value)


  }

  const handleInHouseWOFormValueChange = (value) => {
    props.onDashboardInHouseValueChange(value)
  }

  const WorkOrderVariableTable = useCallback(({ item, index }) => {

    const [hover, setHover] = useState(false)

    const handleDeleteWorkOrderItem = (index) => {
      const temp = [...workOrderVariable]
      const updatedItems = temp.filter((item, i) => i !== index);
      setWorkOrderVariable(updatedItems)

    }

    return (
      <View style={{ flexDirection: 'row', padding: 15, borderWidth: 1, borderColor: '#cccccc', alignItems: 'center' }}>
        <View style={{ minWidth: 100 }}>
          <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>#{index + 1}</Text>
        </View>
        <View style={{ minWidth: 250 }}>
          <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.title}</Text>
        </View >
        <View style={{ minWidth: 250, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ height: 25, width: 25 }} tintColor="#cccccc" source={require('../../assets/calendar_icon.png')}></Image>
          <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginLeft: 10 }}>{(new Date()).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
        </View>
        <TouchableOpacity style={{ paddingVertical: 4, paddingHorizontal: 15, borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, position: 'absolute', top: 10, bottom: 10, right: 15 }} onPress={() => handleDeleteWorkOrderItem(index)}>
          <Image style={{ height: 25, width: 25 }} source={require('../../assets/delete_icon.png')} tintColor="#4D4D4D"></Image>
        </TouchableOpacity>
      </View>
    )
  }, [workOrderVariable])

  const InHouseWorkOrderVariableTable = useCallback(({ item, index }) => {

    const [hover, setHover] = useState(false)

    const handleDeleteWorkOrderItem = (index) => {
      const temp = [...inHouseWOVariable]
      const updatedItems = temp.filter((item, i) => i !== index);
      setInHouseWOVariable(updatedItems)

    }

    return (
      <View style={{ flexDirection: 'row', padding: 15, borderWidth: 1, borderColor: '#cccccc', alignItems: 'center' }}>
        <View style={{ minWidth: 100 }}>
          <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>#{index + 1}</Text>
        </View>
        <View style={{ minWidth: 250 }}>
          <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.title}</Text>
        </View >
        <View style={{ minWidth: 250, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ height: 25, width: 25 }} tintColor="#cccccc" source={require('../../assets/calendar_icon.png')}></Image>
          <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginLeft: 10 }}>{(new Date()).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
        </View>
        <TouchableOpacity style={{ paddingVertical: 4, paddingHorizontal: 15, borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, position: 'absolute', top: 10, bottom: 10, right: 15 }} onPress={() => handleDeleteWorkOrderItem(index)}>
          <Image style={{ height: 25, width: 25 }} source={require('../../assets/delete_icon.png')} tintColor="#4D4D4D"></Image>
        </TouchableOpacity>
      </View>
    )
  }, [inHouseWOVariable])


  const handleSaveWorkOrder = async () => {

    try {
      const myAsset = [...assetState.value.data.filter((item) => item['Asset Name'].toString() === selectedAsset)]
      let temp = []
      await getDocs(query(collection(db, 'WorkOrders'), orderBy('TimeStamp', 'desc')))
        .then((snapshot) => {
          snapshot.forEach((docs) => {
            temp.push(docs.data())
          })
        })
      if (temp.length == 0) {

        setDoc(doc(db, 'WorkOrders', '1'), {
          id: 1,
          'assetName': myAsset[0]['Asset Name'],
          'assetNumber': myAsset[0]['Asset Number'].toString(),
          'driverEmployeeNumber': '',
          'driverName': '',
          'defectID': '',
          'defectedItems': [...workOrderVariable.map(item => ({
            'title': item.title,
            'TimeStamp': item.timeStamp,
          }))],
          'assignedMechanic': assignedMechanic,
          'dueDate': selectedDate,
          'status': 'Pending',
          'assetMake': myAsset[0].Make,
          'assetModel': myAsset[0].Model,
          'assetYear': myAsset[0].Year,
          'mileage': '',
          'comments': [],
          'completionDate': 0,
          'severity': 'Undefined',
          'priority': 'Undefined',
          'TimeStamp': serverTimestamp()
        })

        setLoading(false)
        setAlertStatus('successful')
        setAlertIsVisible(true)
      }
      else {

        setDoc(doc(db, 'WorkOrders', (temp[0].id + 1).toString()), {
          id: (temp[0].id + 1),
          'assetName': myAsset[0]['Asset Name'],
          'assetNumber': myAsset[0]['Asset Number'].toString(),
          'driverEmployeeNumber': '',
          'driverName': '',
          'defectID': '',
          'defectedItems': [...workOrderVariable.map(item => ({
            'title': item.title,
            'TimeStamp': item.timeStamp,
          }))],
          'assignedMechanic': assignedMechanic,
          'dueDate': selectedDate,
          'status': 'Pending',
          'assetMake': myAsset[0].Make,
          'assetModel': myAsset[0].Model,
          'assetYear': myAsset[0].Year,
          'mileage': '',
          'comments': [],
          'completionDate': 0,
          'severity': 'Undefined',
          'priority': 'Undefined',
          'TimeStamp': serverTimestamp()
        })

        setLoading(false)
        setAlertStatus('successful')
        setAlertIsVisible(true)
      }
    } catch (error) {
      setLoading(false)
      setAlertStatus('failed')
      setAlertIsVisible(true)
    }
  }

  const handleSave = () => {
    setWorkOrderVariable((prevState) => {
      const newState = [...prevState]
      newState.push({
        title: addTask,
        timeStamp: new Date().getTime()
      })
      return newState
    })
    setAddTask('')
  }

  const handleDateChange = (dateString) => {

    const [year, month, day] = dateString.split("/");
    const dateObject = new Date(`${year}-${month}-${day}`);
    const milliseconds = dateObject.getTime();
    setSelectedDate(milliseconds)
    setOpenCalendar(false)
  };

  const closeAlert = () => {
    setAlertIsVisible(false)
  }

  return (
    <Animated.View style={{ flex: 1, backgroundColor: '#f6f8f9' }}>
      <ScrollView style={{ height: 100 }}>
        <View style={{ flexDirection: 'row', marginLeft: 40, marginVertical: 40, marginRight: 40, justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
              <Image style={{ width: 30, height: 30, margin: 7 }}
                tintColor="#FFFFFF"
                source={require('../../assets/workorder_icon.png')}></Image>
            </View>
            <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
              Work Orders
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'red', fontSize: 20, fontFamily: 'inter-medium' }}>{options == '2' ? inHouseoverDue : overDue}</Text>
              <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Overdue</Text>
            </View>
            <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 25, opacity: 0.5, }}></View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#5B5B5B', fontSize: 20, fontFamily: 'inter-medium' }}>{options == '2' ? inHousepending : pending}</Text>
              <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Pending</Text>
            </View>
            <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 25, opacity: 0.5 }}></View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#5B5B5B', fontSize: 20, fontFamily: 'inter-medium' }}>{options == '2' ? inHousecompleted : completed}</Text>
              <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Completed</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 40, paddingRight: 40, zIndex: 1, }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ marginRight: 10 }}>
              <TextInput
                style={[styles.input, { marginTop: 0 }, searchTextInputBorderColor && styles.withBorderInputContainer]}
                placeholder="Type to search"
                placeholderTextColor="#868383DC"
                value={search}
                onChangeText={(val) => { setSearch(val) }}
                onFocus={() => { setSearchTextInputBorderColor(true) }}
                onBlur={() => { setSearchTextInputBorderColor(false) }}
              />
            </View>
            <View style={{ marginRight: 10 }}>
              <DropDownComponent
                options={['Select', 'Asset', 'Mechanic']}
                onValueChange={handleSearchWorkOrderValueChange}
                // title="Ubaid Arshad"
                selectedValue={searchWorkOrderSelectedOption}
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
            </View>
            <View >
              <AppBtn
                title="Create Work Order"
                imgSource={require('../../assets/add_plus_btn_icon.png')}
                btnStyle={[styles.btn, { marginHorizontal: 10 }]}
                btnTextStyle={[styles.btnText, { marginLeft: 0, marginRight: 10 }]}
                onPress={() => { setOpenCustomWO(true) }} />
            </View>
            {/* <View style={{ marginRight: 10 }}>
                                    <TouchableOpacity
                                        onMouseEnter={() => setSearchBtnHover(true)}
                                        onMouseLeave={() => setSearchBtnHover(false)}
                                        onPress={() => {
                                            setSearchAssetSelectedOption('Select')
                                            setSearch('')
                                        }}
                                    >
                                        <Image style={[{ width: 40, height: 40 }]}
                                            tintColor={searchBtnHover ? '#67E9DA' : '#336699'}
                                            source={require('../../assets/search_icon.png')}></Image>
                                    </TouchableOpacity>
                                </View> */}
            {/* <CSVLink style={{ textDecorationLine: 'none' }} data={[]} headers={[]} filename={"defects_report.csv"}>
                    <AppBtn
                        title="Download Report"
                        btnStyle={styles.btn}
                        btnTextStyle={styles.btnText}
                        onPress={handleDownloadReportBtn} />
                </CSVLink> */}
          </View>

        </View>
        <View style={{ flexDirection: 'row', margin: 10 }}>
          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }} onPress={() => setOptions('1')}>
            <Text style={{ color: options == '1' ? '#335a75' : 'grey', fontFamily: 'inter-bold', fontSize: options == '1' ? 16 : 14 }}>General WO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }} onPress={() => setOptions('2')}>
            <Text style={{ color: options == '2' ? '#335a75' : 'grey', fontFamily: 'inter-bold', fontSize: options == '2' ? 16 : 14 }}>In House WO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentCardStyle}>
          {options == '1'
            ?
            <Form
              columns={columns}
              entriesData={searchWorkOrderSelectedOption == 'Asset' ? workOrderArray.filter((item) => item.assetName.toLowerCase().includes(search.toLowerCase())) : searchWorkOrderSelectedOption == 'Mechanic' ? workOrderArray.filter((item) => item.assignedMechanic.toLowerCase().includes(search.toLowerCase())) : workOrderArray}
              // entriesData={workOrderArray}
              titleForm="Work Order"
              onValueChange={handleWorkOrderFormValueChange}
              row={styles.formRowStyle}
              cell={styles.formCellStyle}
              entryText={styles.formEntryTextStyle}
              columnHeaderRow={styles.formColumnHeaderRowStyle}
              columnHeaderCell={styles.formColumnHeaderCellStyle}
              columnHeaderText={styles.formColumnHeaderTextStyle}
            />
            :
            <Form
              columns={columns}
              entriesData={searchWorkOrderSelectedOption == 'Asset' ? inHouseWOArray.filter((item) => item.assetName.toLowerCase().includes(search.toLowerCase())) : searchWorkOrderSelectedOption == 'Mechanic' ? inHouseWOArray.filter((item) => item.assignedMechanic.toLowerCase().includes(search.toLowerCase())) : inHouseWOArray}
              // entriesData={workOrderArray}
              titleForm="Work Order"
              onValueChange={handleInHouseWOFormValueChange}
              row={styles.formRowStyle}
              cell={styles.formCellStyle}
              entryText={styles.formEntryTextStyle}
              columnHeaderRow={styles.formColumnHeaderRowStyle}
              columnHeaderCell={styles.formColumnHeaderCellStyle}
              columnHeaderText={styles.formColumnHeaderTextStyle}
            />}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        visible={openCustomWO}
        transparent={true}>

        <ScrollView style={{ height: 100, width: '100%', backgroundColor: '#555555A0' }}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 30 }}>
          {/* <Blu intensity={40} tint="dark" style={StyleSheet.absoluteFill} /> */}
          <View style={{ width: '60%', backgroundColor: '#ffffff' }}>

            <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#C9C9C9', flexDirection: 'row' }}>
              <View>
                <Text style={{ fontFamily: 'inter-bold', color: 'grey', fontSize: 18 }}>Add Items</Text>
              </View>
              <TouchableOpacity onPress={() => setOpenCustomWO(false)}>
                <Image style={{ height: 25, width: 25 }} source={require('../../assets/cross_icon.png')}></Image>
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20, zIndex: 1 }}>
              <View style={{ marginVertical: 15, width: '40%', }}>
                <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>Assets</Text>
                <View style={{ marginTop: 10, }}>
                  <DropDownComponent
                    options={assetState.value.data.map(item => item['Asset Name'])}
                    onValueChange={(val) => {
                      setSelectedAsset(val)
                    }}
                    // title="Ubaid Arshad"
                    selectedValue={selectedAsset}
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
                </View>
              </View>

              {selectedAsset != ''
                ?
                <>
                  <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginBottom: 10 }}>Items</Text>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderColor: '#cccccc', }}>
                      <Image style={{ height: 20, width: 20 }} source={require('../../assets/add_plus_btn_icon.png')} tintColor='#cccccc'></Image>
                    </View>
                    <TextInput
                      style={[styles.input, { borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                      placeholderTextColor="#868383DC"
                      placeholder="Add or Create Service Task"
                      value={addTask}
                      onChangeText={setAddTask}
                      onSubmitEditing={handleSave}
                    />
                  </View>
                  <View style={{ marginTop: 15, width: '100%', borderColor: '#6B6B6B' }}>
                    {workOrderVariable.map((item, index) => {
                      return (
                        <WorkOrderVariableTable
                          key={index.toString()}
                          item={item}
                          index={index} />
                      )
                    })}
                  </View>
                  <View style={{ marginTop: 40, width: '100%', borderWidth: 1, borderColor: '#cccccc', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                    <View style={{ marginVertical: 15, width: '40%' }}>
                      <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>Due Date</Text>
                      <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: '#cccccc', marginTop: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setOpenCalendar(true)}>
                        <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>{!selectedDate ? '' : new Date(selectedDate).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                        <Image style={{ height: 25, width: 24 }} tintColor='#cccccc' source={require('../../assets/calendar_icon.png')} ></Image>
                      </TouchableOpacity>
                      {openCalendar
                        ?
                        <View style={{ height: 300, width: 300, position: 'absolute', bottom: 80 }}>
                          <DatePicker
                            options={{
                              backgroundColor: '#FFFFFF',
                              textHeaderColor: '#539097',
                              textDefaultColor: '#000000',
                              selectedTextColor: '#fff',
                              mainColor: '#539097',
                              textSecondaryColor: '#000000',
                              borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            current={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`}
                            selected={`${new Date(selectedDate).getFullYear()}-${String(new Date(selectedDate).getMonth() + 1).padStart(2, '0')}-${String(new Date(selectedDate).getDate()).padStart(2, '0')}`}
                            mode="calendar"
                            minuteInterval={30}
                            style={{ borderRadius: 10 }}
                            onDateChange={handleDateChange}
                          />
                        </View>
                        :
                        null}

                    </View>

                    <View style={{ marginVertical: 15, width: '40%', }}>
                      <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>Assignee</Text>
                      <View style={{ marginTop: 10, }}>
                        <DropDownComponent
                          options={peopleState.value.data.map(item => item.Name)}
                          onValueChange={(val) => {
                            setAssignedMechanic(val)
                          }}
                          // title="Ubaid Arshad"
                          selectedValue={assignedMechanic}
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
                      </View>


                    </View>
                  </View>
                </>
                :
                null}
            </View>
            <View style={{ backgroundColor: '#ffffff', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#C9C9C9', flexDirection: 'row', zIndex: 0 }}>
              <View>
                <Text style={{ fontFamily: 'inter-medium', color: '#000000', fontSize: 14 }}>This Work will contain {workOrderVariable.length} {workOrderVariable.length < 10 ? "item" : 'items'}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <AppBtn
                    title="Close"
                    btnStyle={[{
                      width: '100%',
                      height: 30,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.6,
                      shadowRadius: 3,
                      elevation: 0,
                      shadowColor: '#575757',

                    }, { minWidth: 70 }]}
                    btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                    onPress={() => {
                      setOpenCustomWO(false)
                      // clearAll()
                    }} />
                </View>
                {selectedAsset != '' ?
                  assignedMechanic != ''
                  ?
                  <View style={{ marginLeft: 20 }}>
                  <AppBtn
                    title="Save"
                    btnStyle={[{
                      width: '100%',
                      height: 30,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.6,
                      shadowRadius: 3,
                      elevation: 0,
                      shadowColor: '#575757',

                    }, { minWidth: 70 }]}
                    btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                    onPress={() => {
                      setLoading(true)
                      setOpenCustomWO(false)
                      handleSaveWorkOrder()
                    }} />
                </View>
                  :
                  null
                :
                null
                }
               
              </View>
            </View>
          </View>
        </ScrollView>

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



    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
  input: {
    width: '100%',
    height: 40,
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
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    margin: 40,
    // flex:1,
    width: 'auto',
    height: 800
  },
  newContentCardStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    width: '50%'
  },
  btn: {
    width: '100%',
    height: 40,
    backgroundColor: '#336699',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },
  btnText: {
    color: '#fff',
    fontSize: 16,
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
  dropdownContainer: {
    position: 'relative',


  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 150,
  },
  dropdown: {
    // Custom styles for the dropdown container
    // For example:
    // padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    height: 40,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',


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

    backgroundColor: '#FFFFFF'
  },
});

export default MaintenancePage;