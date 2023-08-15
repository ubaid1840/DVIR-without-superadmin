import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Platform, TextInput, Dimensions, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import DropDownComponent from '../../components/DropDown';
import AlertModal from '../../components/AlertModal';
import * as DocumentPicker from 'expo-document-picker';
import { doc, getFirestore, setDoc, collection, onSnapshot, query, getCountFromServer, orderBy, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import app from '../config/firebase';
import { countrycodelist } from '../../components/codelist';
import { Calendar } from 'react-native-calendars';


const columns = [
    'Company',
    'Name',
    'Email',
    'Industry',
    'Number',
    'Action'

];

const entries = [
    {
        'Name': 'Truck 1',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '14-01-2017',
        'License Plate': 'ABC-123',
        'Action': 'Button',
        'Hover': '#558BC1'
    },
    // Add more entries
    {
        'Name': 'Truck 2',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '22-10-2022',
        'License Plate': 'LEV-875',
        'Action': 'Button'
    },
    {
        'Name': 'Truck 3',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '15-04-2023',
        'License Plate': 'AA-567',
        'Action': 'Button'
    },
    // Add more entries
    {
        'Name': 'Truck 4',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '1-5-2021',
        'License Plate': 'ZRYU-9458',
        'Action': 'Button'
    },
    // Add more entries
    {
        'Name': 'Truck 5',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '14-07-2022',
        'License Plate': 'LKG-7654',
        'Action': 'Button'
    },
];


const SuperAdminRegisterPage = (props) => {

    const db = getFirestore(app)

    const [employeeNumber, setEmployeeNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [number, setNumber] = useState('')
    const [workPhone, setWorkPhone] = useState('')
    const [role, setRole] = useState('')
    const [dobMonth, setDobMonth] = useState('')
    const [dobDay, setDobDay] = useState('')
    const [dobYear, setDobYear] = useState('')
    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const [dashboardHovered, setDashboardHovered] = useState(false)
    const [inspectiondHovered, setInspectionHovered] = useState(false)
    const [maintenanceHovered, setMaintenanceHovered] = useState(false)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [assetsHovered, setAssetsHovered] = useState(false)
    const [usersHovered, setUsersHovered] = useState(false)
    const [inspectionCalendarSelect, setInspectionCalendarSelect] = useState('All')
    const [totalAssets, setTotalAssets] = useState(19)
    const [totalAssetsInspected, setTotalAssetsInspected] = useState(2)
    const [assetsWithDefects, setAssetsWithDefects] = useState(1)
    const [search, setSearch] = useState('')
    const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)
    const [searchAssetSelectedOption, setSearchAssetSelectedOption] = useState("Select")
    const [searchBtnHover, setSearchBtnHover] = useState(false)
    const [createNewAssetModalVisible, setCreateNewAssetModalVisible] = useState(false);
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [entriesData, setEntriesData] = useState([])
    const [countDoc, setCountDoc] = useState(0)
    const [loading, setloading] = useState(true)
    const [code, setCode] = useState('')
    const [mobileModalVisible, setMobileModalVisible] = useState(false)
    const [mobileItemHovered, setMobileItemHovered] = useState({})
    const [numberCode, setNumberCode] = useState('Select')
    const [searchNumber, setSearchNumber] = useState('')
    const [deleteCompany, setDeleteCompany] = useState('')

    const { width, height } = Dimensions.get('window')
    const [fileUri, setFileUri] = useState(null);
    const [textInputBorderColor, setTextInputBorderColor] = useState('')
    const [deleteAlertVisible, setDeleteAlertVisible] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const [isEmailValid, setIsEmailValid] = useState(false)


    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
    }, [email])

    const fetchData = async () => {
        try {
            const coll = collection(db, "DVIR");
            const snapshot = await getCountFromServer(coll);
            setCountDoc(snapshot.data().count)

            const querySnapshot = await getDocs(query(collection(db, 'DVIR'), orderBy("TimeStamp", 'desc')));
            const dbData = []
            querySnapshot.forEach((doc) => {
                dbData.push(doc.data())
            });
            setEntriesData(dbData)
            setloading(false)
        } catch (e) {
            console.log(e)
        }

    }

    const showCreateNewAssetModal = () => {
        setCreateNewAssetModalVisible(true);
    };

    const closeCreateNewAssetModal = () => {
        setCreateNewAssetModalVisible(false);
    };


    useEffect(() => {


        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        fetchData()

        return () => {
            fadeAnim.setValue(0);
            setCreateNewAssetModalVisible(false)
        }

    }, [])

    const handleDownloadReportBtn = () => {

    }

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleFormValueChange = (value) => {
        console.log(value)
    }

    const handleRoleValueChange = (val) => {
        setRole(val)
    }

    const handleCodeValueChange = (val) => {
        setCode(val)
    }


    const handleAssetsAppBtn = () => {
        // props.onAddAssetBtn('CreateNewAsset')
        setCreateNewAssetModalVisible(true)
    }

    const handleFormValue = async (value) => {

        setDeleteCompany(value)
        setDeleteAlertVisible(true)
    }

    const handleSearchAssetValueChange = (value) => {
        setSearchAssetSelectedOption(value)
    }

    const searchAssetOptionList = ["Company", "Owner",]

    const handleNewRegisterCompany = async () => {

        const querySnapshot = await getDocs(query(collection(db, 'DVIR'), orderBy("TimeStamp", 'desc')));
        const dbData = []
        let i = 0
        querySnapshot.forEach((doc) => {
            if (email == doc.data().Email) {
                i++
            }
            else if (doc.data().Number == `${numberCode}${number}`) {
                i++
            }
        });

        if (i == 0) {
            await setDoc(doc(db, "DVIR", email), {
                Name: `${firstName} ${lastName}`,
                Email: email,
                Company: company,
                Number: `${numberCode}${number}`,
                WorkPhone: workPhone,
                dob: dobDay + "-" + dobMonth + "-" + dobYear,
                Industry: role,
                Action: 'Button',
                TimeStamp: serverTimestamp()
            });
            setCreateNewAssetModalVisible(false)
            setAlertStatus('successful')
            setAlertIsVisible(true)
            console.log('added')
            fetchData()
            clearAll()
            setloading(false)
        }
        else {
            setCreateNewAssetModalVisible(false)
            setAlertStatus('failed')
            setAlertIsVisible(true)
            clearAll()
            setloading(false)
        }



    }

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    const clearAll = () => {
        setFirstName('')
        setLastName('')
        setEmail('')
        setCompany('')
        setNumber('')
        setRole('')
        setWorkPhone('')
        setDobDay('')
        setDobMonth('')
        setDobYear('')
    }

    const handleSearchFilter = () => {
        let val = []
        if (searchAssetSelectedOption == 'Company') {
            entriesData.map((item) => {
                if (item.Company.toLowerCase().includes(search.toLowerCase())) {
                    console.log(item)

                    val.push(item)

                    console.log('item searched')
                }
            })
        }
        else if (searchAssetSelectedOption == 'Owner') {
            entriesData.map((item) => {
                if (item.Name.toLowerCase().includes(search.toLowerCase())) {
                    console.log(item)
                    val.push(item)
                    console.log('item searched')
                }
            })

        }
        else {
            fetchData()
        }
        setEntriesData([])
        setEntriesData(val)
        setloading(false)
    }

    const closeMobileModal = () => {
        setMobileModalVisible(false)
    }

    const formattedCountryCodeList = countrycodelist.map(item => {
        return {
            ...item,
            code: item.code.split(' ').join(''),
        };
    });



    return (

        <>

            {createNewAssetModalVisible ?
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, }]}>

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
                        <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 40, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 30, color: '#1E3D5C', fontWeight: '900', marginLeft: 10, borderBottomColor: '#67E9DA', paddingBottom: 5, borderBottomWidth: 5 }}>
                                Register New Company
                            </Text>
                        </View>

                        <View style={styles.contentCardStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#67E9DA' }}></View>
                                <Text style={{ color: '#1E3D5C', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                    Company Details
                                </Text>
                            </View>
                            <ScrollView horizontal style={{ paddingBottom: 20 }}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View style={{ flexDirection: 'column' }}>


                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Company</Text>
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'Company' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={company}
                                                onChangeText={(val) => { setCompany(val) }}
                                                onFocus={() => { setTextInputBorderColor('Company') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Mobile Phone*</Text>
                                            <View style={{ marginLeft: 10 }}>
                                                <TouchableOpacity style={[styles.input, { width: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 }]} onPress={() => setMobileModalVisible(true)}>
                                                    <Text>{numberCode}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                style={[styles.input, { width: 150 }, textInputBorderColor == 'Mobile Phone' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={number}
                                                onChangeText={(val) => { setNumber(val) }}
                                                onFocus={() => { setTextInputBorderColor('Mobile Phone') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Email</Text>
                                            <View>


                                                <TextInput
                                                    style={[styles.input, textInputBorderColor == 'Email' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                    placeholderTextColor="#868383DC"
                                                    value={email}
                                                    onChangeText={(val) => { setEmail(val) }}
                                                    onFocus={() => { setTextInputBorderColor('Email') }}
                                                    onBlur={() => { setTextInputBorderColor('') }}
                                                />
                                                {!isEmailValid ? <Text style={{ color: 'red', paddingTop: 5, marginLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
                                            </View>
                                        </View>



                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>First Name*</Text>
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'First Name' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={firstName}
                                                onChangeText={(val) => { setFirstName(val) }}
                                                onFocus={() => { setTextInputBorderColor('First Name') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Last Name*</Text>
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'Last Name' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={lastName}
                                                onChangeText={(val) => { setLastName(val) }}
                                                onFocus={() => { setTextInputBorderColor('Last Name') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>


                                    </View>
                                    <View style={{ flexDirection: 'column', marginLeft: 80 }}>

                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Industry</Text>
                                            <DropDownComponent
                                                options={['IT', 'Services', 'Manpower', 'Other']}
                                                onValueChange={handleRoleValueChange}
                                                // title="Ubaid Arshad"
                                                selectedValue={role}
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

                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Work Phone</Text>
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'Work Phone' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={workPhone}
                                                onChangeText={(val) => { setWorkPhone(val) }}
                                                onFocus={() => { setTextInputBorderColor('Work Phone') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Date of Birth</Text>
                                            <TextInput
                                                style={[styles.input, { width: 50 }, textInputBorderColor == 'day' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={dobDay}
                                                placeholder='DD'
                                                onChangeText={setDobDay}
                                                onFocus={() => { setTextInputBorderColor('day') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                            <TextInput
                                                style={[styles.input, { width: 50 }, textInputBorderColor == 'month' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={dobMonth}
                                                placeholder='MM'
                                                onChangeText={setDobMonth}
                                                onFocus={() => { setTextInputBorderColor('month') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                            <TextInput
                                                style={[styles.input, { width: 80 }, textInputBorderColor == 'year' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={dobYear}
                                                placeholder='YYYYY'
                                                onChangeText={setDobYear}
                                                onFocus={() => { setTextInputBorderColor('year') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                    </ScrollView>
                    <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#67E9DA', paddingVertical: 20, justifyContent: 'flex-end', paddingRight: 80 }}>
                        <View>
                            <AppBtn
                                title="Close"
                                btnStyle={[{
                                    width: '100%',
                                    height: 40,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 0.9,
                                    shadowRadius: 5,
                                    elevation: 0,
                                    shadowColor: '#575757',
                                    marginHorizontal: 10
                                }, { minWidth: 100 }]}
                                btnTextStyle={{ fontSize: 17, fontWeight: '400', color: '#000000' }}
                                onPress={() => {
                                    clearAll()
                                    setCreateNewAssetModalVisible(false)

                                }} />
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <AppBtn
                                title="Save"
                                btnStyle={[{
                                    width: '100%',
                                    height: 40,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 0.9,
                                    shadowRadius: 5,
                                    elevation: 0,
                                    shadowColor: '#575757',
                                    marginHorizontal: 10
                                }, { minWidth: 100 }]}
                                btnTextStyle={{ fontSize: 17, fontWeight: '400', color: '#000000' }}
                                onPress={() => {
                                    if (isEmailValid) {
                                        setloading(true)
                                        handleNewRegisterCompany()
                                    }
                                }} />
                        </View>
                    </View>
                </Animated.View>
                :
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, }]}>

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
                                        source={require('../../assets/register_company_icon.png')}></Image>
                                </View>
                                <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                                    Register Company
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{countDoc}</Text>
                                <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '700' }}>Total Companies</Text>

                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 40, paddingRight: 40, zIndex: 1, }}>
                            <View style={{ marginRight: 10 }}>
                                <TextInput
                                    style={[styles.input, { height: 50 }, searchTextInputBorderColor && styles.withBorderInputContainer]}
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
                                    options={searchAssetOptionList}
                                    onValueChange={handleSearchAssetValueChange}
                                    // title="Ubaid Arshad"
                                    selectedValue={searchAssetSelectedOption}
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
                            <View style={{ marginRight: 10 }}>
                                <TouchableOpacity
                                    onMouseEnter={() => setSearchBtnHover(true)}
                                    onMouseLeave={() => setSearchBtnHover(false)}
                                    onPress={() => {
                                        setloading(true)
                                        handleSearchFilter()
                                        setSearchAssetSelectedOption('Select')
                                        setSearch('')
                                    }}
                                >
                                    <Image style={[{ width: 40, height: 40 }]}
                                        tintColor={searchBtnHover ? '#67E9DA' : '#336699'}
                                        source={require('../../assets/search_icon.png')}></Image>
                                </TouchableOpacity>
                            </View>

                            <View >
                                <AppBtn
                                    title="Company"
                                    imgSource={require('../../assets/add_plus_btn_icon.png')}
                                    btnStyle={styles.btn}
                                    btnTextStyle={styles.btnText}
                                    onPress={() => { handleAssetsAppBtn() }} />
                            </View>
                        </View>
                        <View style={styles.contentCardStyle}>
                            <Form
                                columns={columns}
                                entriesData={entriesData}
                                titleForm="RegisterCompany"
                                onValueChange={handleFormValue}
                                row={styles.formRowStyle}
                                cell={styles.formCellStyle}
                                entryText={styles.formEntryTextStyle}
                                columnHeaderRow={styles.formColumnHeaderRowStyle}
                                columnHeaderCell={styles.formColumnHeaderCellStyle}
                                columnHeaderText={styles.formColumnHeaderTextStyle}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>
            }
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
            <Modal
                animationType="fade"
                visible={mobileModalVisible}
                transparent={true}>
                <TouchableWithoutFeedback onPress={() => closeMobileModal()}>
                    <View style={styles.centeredView}>
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 20, elevation: 5, maxHeight: '98%', width: 300 }}>
                                <TextInput
                                    style={[styles.input, { height: 50, marginVertical: 20 }]}
                                    placeholder='Search'
                                    value={searchNumber}
                                    onChangeText={(val) => {
                                        setSearchNumber(val.replace(/ /g, ''))


                                    }}
                                />
                                <ScrollView style={{ height: 200, paddingRight: 10 }}>
                                    <FlatList
                                        data={formattedCountryCodeList}
                                        renderItem={({ item, index }) => {

                                            // const formattedSearchNumber = searchNumber.replace(/ /g, '');
                                            if (searchNumber === "" || item.code.includes(searchNumber)) {
                                                return (
                                                    <View
                                                        onMouseEnter={() => setMobileItemHovered({ [index]: true })}
                                                        onMouseLeave={() => setMobileItemHovered({ [index]: false })}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setNumberCode(item.code.replace(/ /g, ''))
                                                                closeMobileModal()
                                                            }}
                                                            style={[
                                                                {
                                                                    marginTop: 15,
                                                                    borderWidth: 1,
                                                                    borderColor: '#cccccc',
                                                                    outlineStyle: 'none',
                                                                    padding: 10,
                                                                    borderRadius: 5,
                                                                },
                                                                mobileItemHovered[index] && {
                                                                    backgroundColor: '#67E9DA',
                                                                    borderColor: '#67E9DA',
                                                                },
                                                            ]}
                                                        >
                                                            <Text>{item.code} {item.name}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }

                                            else if (item.name.toLowerCase().includes(searchNumber.toLowerCase())) {
                                                return (
                                                    <View
                                                        onMouseEnter={() => setMobileItemHovered({ [index]: true })}
                                                        onMouseLeave={() => setMobileItemHovered({ [index]: false })}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setNumberCode(item.code.replace(/ /g, ''))
                                                                closeMobileModal()
                                                            }}
                                                            style={[
                                                                {
                                                                    marginTop: 15,
                                                                    borderWidth: 1,
                                                                    borderColor: '#cccccc',
                                                                    outlineStyle: 'none',
                                                                    padding: 10,
                                                                    borderRadius: 5,
                                                                },
                                                                mobileItemHovered[index] && {
                                                                    backgroundColor: '#67E9DA',
                                                                    borderColor: '#67E9DA',
                                                                },
                                                            ]}
                                                        >
                                                            <Text>{item.code} {item.name}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }

                                        }} />
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                animationType="fade"
                visible={deleteAlertVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.modalView}>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '400' }}>Are you sure you want to Delete ?</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 250, justifyContent: 'space-between', marginTop: 20 }}>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [0]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [0]: false })}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        setDeleteAlertVisible(false)
                                        setloading(true)
                                        await deleteDoc(doc(db, "DVIR", deleteCompany));
                                        console.log('deleted')
                                        setAlertStatus('successful')
                                        setAlertIsVisible(true)
                                        fetchData()
                                    }}

                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[0] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[0] && { color: '#FFFFFF' }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [1]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [1]: false })}>
                                <TouchableOpacity
                                    onPress={() => setDeleteAlertVisible(false)}
                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[1] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[1] && { color: '#FFFFFF' }]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>
            {loading ? CustomActivityIndicator() : null}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    input: {
        width: 250,
        height: 40,
        marginLeft: 10,
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
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 0,
        shadowColor: '#575757',
        marginHorizontal: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    formRowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        //  borderBottomColor: '#ccc',
        marginBottom: 4,
        shadowColor: '#BADBFB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        marginLeft: 5,
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#BADBFB',
    },
    formCellStyle: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },
    formEntryTextStyle: {
        fontWeight: 'normal',
        fontSize: 13,
    },

    formColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        // paddingVertical: 15,
        alignItems: 'center',

    },
    formColumnHeaderCellStyle: {
        flex: 1,

    },
    formColumnHeaderTextStyle: {
        fontWeight: 'bold',
        marginBottom: 5,
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 14
    },
    dropdownContainer: {
        position: 'relative',
        zIndex: 1,
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
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: 250,
        backgroundColor: '#FFFFFF',
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
});

export default SuperAdminRegisterPage