import { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, Animated, Dimensions, TextInput, Modal, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import * as DocumentPicker from 'expo-document-picker';
import AlertModal from '../../components/AlertModal';
import DropDownComponent from '../../components/DropDown';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getCountFromServer, getDocs, getFirestore, or, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import app from '../config/firebase';
import { countrycodelist } from '../../components/codelist';

const columns = [
    'Name',
    'Number',
    'Email',
    'Role',
    'Action'
];

const ManagerPage = () => {

    const db = getFirestore(app)
    const auth = getAuth()

    const { width, height } = Dimensions.get('window')

    const [fadeAnim] = useState(new Animated.Value(0));

    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [createNewManagerIsVisible, setCreateNewManagerIsVisible] = useState(false)
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
    const [mobileModalVisible, setMobileModalVisible] = useState(false)
    const [mobileItemHovered, setMobileItemHovered] = useState({})
    const [searchNumber, setSearchNumber] = useState('')
    const [textInputBorderColor, setTextInputBorderColor] = useState("")
    const [fileUri, setFileUri] = useState(null)
    const [totalManager, setTotalManager] = useState(0)
    const [entriesData, setEntriesData] = useState([])
    const [deleteAlertVisible, setDeleteAlertVisible] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const [numberCode, setNumberCode] = useState('Select')
    const [loading, setloading] = useState(true)
    const [deleteUser, setDeleteUser] = useState('')
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [dbReference, setDbReference] = useState(null)

    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
    }, [email])

    const fetchData = async () => {
        let dbreference = null
        try {
            await getDocs(collection(db, 'AllowedUsers'))
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (auth.currentUser.email == doc.data().Email)
                            dbreference = doc.data().dbRef
                        setDbReference(doc.data().dbRef)
                        setCompany(doc.data().Company)
                    })
                })
            if (dbreference == null) { }
            else {
                // console.log('ubaid')
                // console.log(dbReference)
                const coll = collection(db, `${dbreference}/users`);
                const snapshot = await getCountFromServer(coll);
                console.log()
                if (snapshot.data().count == 0) {
                    setEmployeeNumber(1)
                }
                // setTotalManager(snapshot.data().count)

                const dbRef = collection(db, `${dbreference}/users`)
                const q = query(dbRef, where('Designation', '==', 'Manager'))
                const querysnapshot = await getDocs(q)
                const dbData = []
                querysnapshot.forEach((doc) => {
                    dbData.push(doc.data())
                })




                const sortedArray = dbData.slice().sort((a, b) => b.TimeStamp - a.TimeStamp);

                // const querySnapshot = await getDocs(query(collection(db, `DVIR/${auth.currentUser.email}/users`), where('Designation', '==', 'Manager'), orderBy("TimeStamp")));
                // const dbData = []
                // querySnapshot.forEach((doc) => {
                //     dbData.push(doc.data())
                // });

                let employeeRef = []
                const querySnapshot = await getDocs(query(collection(db, `${dbreference}/users`), orderBy("TimeStamp", 'desc')));
                querySnapshot.forEach((doc) => {
                    employeeRef.push(doc.data())
                });

                if (employeeRef.length === 0) { }
                else {
                    setEmployeeNumber(employeeRef[0].EmployeeNumber + 1)
                }
                setTotalManager(dbData.length)
                setEntriesData(sortedArray)
                setloading(false)
            }


        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {

        fetchData()

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        return () => {
            fadeAnim.setValue(0);
            setCreateNewManagerIsVisible(false)
        }
    }, [])


    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleFormValueChange = (value) => {
        setDeleteUser(value)
        setDeleteAlertVisible(true)
    }

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

    const closeCreateNewManager = () => {
        setCreateNewManagerIsVisible(false)
    }

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const handleRoleValueChange = (val) => {
        setRole(val)
    }

    const handleAddNewManager = async () => {   
        const dbData = []
        let i = 0
        await getDocs(query(collection(db, `${dbReference}/users`)))
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (email == doc.data().Email) {
                        i++
                    }
                    else if (doc.data().Number == numberCode+number) {
                        i++
                    }
                });
            })

        if (i == 0) {
            await setDoc(doc(db, `${dbReference}/users`, email), {
                FirstName: firstName,
                LastName: lastName,
                Name: `${firstName} ${lastName}`,
                Company: company,
                Email: email,
                Number: numberCode+number,
                WorkPhone: workPhone,
                dob: dobDay + "-" + dobMonth + "-" + dobYear,
                dobDay: dobDay,
                dobMonth: dobMonth,
                dobYear: dobYear,
                Role: role,
                Designation: 'Manager',
                Action: 'Button',
                TimeStamp: serverTimestamp(),
                EmployeeNumber: employeeNumber,
            });

            await setDoc(doc(db, 'AllowedUsers', email), {
                Email: email,
                Number: numberCode+number,
                Company: company,
                Designation: 'Manager',
                TimeStamp: serverTimestamp(),
                dbRef: dbReference
            });

            setCreateNewManagerIsVisible(false)
            setAlertStatus('successful')
            setAlertIsVisible(true)
            console.log('added')
            fetchData()
            clearAll()
            setloading(false)
        }
        else {
            setCreateNewManagerIsVisible(false)
            setAlertStatus('failed')
            setAlertIsVisible(true)
            clearAll()
            setloading(false)
        }
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
        setNumberCode('Select')
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

            {createNewManagerIsVisible
                ?
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
                                Create New Manager
                            </Text>
                        </View>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.contentCardStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#67E9DA' }}></View>
                                    <Text style={{ color: '#1E3D5C', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                        Personal details
                                    </Text>
                                </View>
                                <ScrollView horizontal style={{ paddingBottom: 10 }} >
                                    <View style={{ flexDirection: 'row', }}>

                                        <View style={{ flexDirection: 'column' }}>
                                            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Employee Number*</Text>
                                                <TextInput
                                                    style={[styles.input, textInputBorderColor == 'Employee Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                    placeholderTextColor="#868383DC"
                                                    value={employeeNumber}
                                                    // onChangeText={(val)=>setEmployeeNumber(val)}
                                                    onFocus={() => { setTextInputBorderColor('Employee Number') }}
                                                    onBlur={() => { setTextInputBorderColor('') }}
                                                />
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
                                                    keyboardType='numeric'
                                                    value={number}
                                                    onChangeText={(val) => { setNumber(val.replace(/[^0-9]/g, '')) }}
                                                    onFocus={() => { setTextInputBorderColor('Mobile Phone') }}
                                                    onBlur={() => { setTextInputBorderColor('') }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'column', marginLeft: 80 }}>

                                            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Photo</Text>
                                                <View style={{ flexDirection: 'column', marginLeft: 100 }}>
                                                    {fileUri
                                                        ?
                                                        <TouchableOpacity onPress={pickDocument}>
                                                            <Image style={{ height: 100, width: 100, borderRadius: 50 }} source={{ uri: fileUri }} />
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 50, borderColor: '#cccccc', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }} onPress={pickDocument}>

                                                            <Image style={{ height: 20, width: 20 }}
                                                                source={require('../../assets/add_photo_icon.png')}
                                                                tintColor='#67E9DA'></Image>
                                                            <Text style={{ color: '#30E0CB' }}>Add Photo</Text>

                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Role</Text>
                                                <DropDownComponent
                                                    options={['Manager', 'Admin']}
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
                                                    keyboardType='numeric'
                                                    value={dobDay}
                                                    placeholder='DD'
                                                    onChangeText={(val) => setDobDay(val.replace(/[^0-9]/g, ''))}
                                                    onFocus={() => { setTextInputBorderColor('day') }}
                                                    onBlur={() => { setTextInputBorderColor('') }}
                                                />
                                                <TextInput
                                                    style={[styles.input, { width: 50 }, textInputBorderColor == 'month' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                    placeholderTextColor="#868383DC"
                                                    keyboardType='numeric'
                                                    value={dobMonth}
                                                    placeholder='MM'
                                                    onChangeText={(val) => setDobMonth(val.replace(/[^0-9]/g, ''))}
                                                    onFocus={() => { setTextInputBorderColor('month') }}
                                                    onBlur={() => { setTextInputBorderColor('') }}
                                                />
                                                <TextInput
                                                    style={[styles.input, { width: 80 }, textInputBorderColor == 'year' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                    placeholderTextColor="#868383DC"
                                                    keyboardType='numeric'
                                                    value={dobYear}
                                                    placeholder='YYYYY'
                                                    onChangeText={(val) => setDobYear(val.replace(/[^0-9]/g, ''))}
                                                    onFocus={() => { setTextInputBorderColor('year') }}
                                                    onBlur={() => { setTextInputBorderColor('') }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
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
                                    setCreateNewManagerIsVisible(false)
                                    clearAll()
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
                                    if (firstName == '' || lastName == '' || role == '' || number == '' || numberCode == 'Select') { }
                                    else {
                                        if (isEmailValid) {
                                            setloading(true)
                                            handleAddNewManager()
                                        }
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
                        <View style={{ flexDirection: 'row', margin: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                                    <Image style={{ width: 30, height: 30, margin: 10 }}
                                        tintColor='#FFFFFF'
                                        source={require('../../assets/manager_icon.png')}></Image>
                                </View>
                                <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                                    Manager
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: '#5B5B5B', fontSize: 20, fontWeight: 'bold' }}>{totalManager}</Text>
                                    <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Manager</Text>
                                </View>
                                <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 60, opacity: 0.5 }}></View>
                                <View >
                                    <AppBtn
                                        title="Manager"
                                        imgSource={require('../../assets/add_plus_btn_icon.png')}
                                        btnStyle={styles.btn}
                                        btnTextStyle={styles.btnText}
                                        onPress={() => setCreateNewManagerIsVisible(true)} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.contentCardStyle}>
                            <Form
                                columns={columns}
                                entriesData={entriesData}
                                titleForm="Manager"
                                onValueChange={handleFormValueChange}
                                row={styles.formRowStyle}
                                cell={styles.formCellStyle}
                                entryText={styles.formEntryTextStyle}
                                columnHeaderRow={styles.formColumnHeaderRowStyle}
                                columnHeaderCell={styles.formColumnHeaderCellStyle}
                                columnHeaderText={styles.formColumnHeaderTextStyle}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>}

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
                                        await deleteDoc(doc(db, `${dbReference}/users`, deleteUser));
                                        await deleteDoc(doc(db, `AllowedUsers`, deleteUser));
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
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web
        width: 250

    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropdownHoveredOption: {

        backgroundColor: '#67E9DA',
        cursor: 'pointer',
        transitionDuration: '0.2s',

    },
    dropdownOptionText: {
        fontSize: 16,
    },
    dropdownHoveredOptionText: {

        color: '#FFFFFF',
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

export default ManagerPage