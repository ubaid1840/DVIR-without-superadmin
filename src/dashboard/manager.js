import { useState, useEffect, useContext } from 'react';
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
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { PeopleContext } from '../store/context/PeopleContext';


const columns = [
    'Name',
    'Number',
    'Designation',
    'Company',
    'Action'
];

const ManagerPage = () => {

    const db = getFirestore(app)
    const auth = getAuth()

    const { width, height } = Dimensions.get('window')
    const storage = getStorage(app)

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
    const [fetchLoading, setFetchLoading] = useState(true)

    const {state : peopleState, setPeopleData} = useContext(PeopleContext)

    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
    }, [email])

    useEffect(() => {

        const fetchData = async () => {
            try {
                let temp = []
                await getDocs(collection(db, 'AllowedUsers'))
                    .then((snapshot) => {

                        snapshot.forEach((docs) => {
                            if (docs.data().Designation != 'Owner')
                                temp.push(docs.data())
                        })
                    })
                const sort = temp.slice().sort((a, b) => b.TimeStamp - a.TimeStamp);
                console.log(sort)
                setEmployeeNumber(sort.length == 0 ? 1 : sort[0]['Employee Number'] + 1)

                const updatedItems = sort.filter((item, i) => item.Designation !== 'Driver');

                // const sortedArray = dbData.slice().sort((a, b) => b.TimeStamp - a.TimeStamp);
                    
                setTotalManager(updatedItems.length)
                setPeopleData(updatedItems)
                setEntriesData(updatedItems)
                setloading(false)

            } catch (e) {
                console.log(e)
                setloading(false)
            }

        }


        fetchData()


    }, [fetchLoading])

    useEffect(() => {


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

    const uploadImage = async (resultimage) => {
        // convert image to blob image

        return new Promise(async (resolve, reject) => {
            const blobImage = await new Promise((resole, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resole(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", resultimage, true);
                xhr.send(null);
            });

            // Create the file metadata
            /** @type {any} */
            const metadata = {
                contentType: 'image/jpeg'
            };

            //upload image to firestore
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'ProfileImages/' + numberCode + number + '.dp');
            const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

            uploadTask.on('state_changed',
                (snapshot) => {

                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;


                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    setloading(false)
                    reject(null)
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // console.log('File available at', downloadURL)
                        if (downloadURL) {
                            resolve(downloadURL)
                        }

                    });
                }
            );
        })

    }


    const handleAddNewManager = async () => {
        const dbData = []
        let i = 0
        entriesData.map((item) => {
            if (item.Email == email) {
                i++
            }
        })

        if (i != 0) {
            console.log('email already exists')
            setAlertStatus('failed')
            setAlertIsVisible(true)
            setloading(false)
        }
        else {
            if (fileUri) {
                const dpUrl = await uploadImage(fileUri)
                if (dpUrl) {

                    await setDoc(doc(db, `AllowedUsers`, email), {
                        Name: `${firstName} ${lastName}`,
                        Company: 'netsol',
                        Email: email,
                        Number: numberCode + number,
                        Designation: role,
                        TimeStamp: serverTimestamp(),
                        'Employee Number': employeeNumber,
                        dp: dpUrl
                    });

                    setFetchLoading(!fetchLoading)
                    clearAll()
                    setCreateNewManagerIsVisible(false)
                    setAlertStatus('successful')
                    setAlertIsVisible(true)
                    console.log('added')

                }
            }
            else {
                await setDoc(doc(db, `AllowedUsers`, email), {
                    Name: `${firstName} ${lastName}`,
                    Company: 'netsol',
                    Email: email,
                    Number: numberCode + number,
                    Designation: role,
                    TimeStamp: serverTimestamp(),
                    'Employee Number': employeeNumber,
                    dp: ''
                });

                setFetchLoading(!fetchLoading)
                clearAll()
                setCreateNewManagerIsVisible(false)
                setAlertStatus('successful')
                setAlertIsVisible(true)
                console.log('added')
            }

        }
    }

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#23d3d3" size="large" />
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
                <Animated.View style={{ flex: 1, backgroundColor: '#f6f8f9'}}>

                
                    <ScrollView style={{ height: 100 }}
                    contentContainerStyle={{flex:1}}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 40, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 26, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10, borderBottomColor: '#67E9DA', paddingBottom: 5, borderBottomWidth: 5 }}>
                                Add New User
                            </Text>
                        </View>


           
                            <View style={[styles.contentCardStyle, {height:'auto'}]}>
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
                                            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Role*</Text>
                                                <DropDownComponent
                                                    options={['Manager', 'Admin', 'Mechanic (limited access)', 'Mechanic (full access)']}
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

                                            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Photo</Text>
                                                <View style={{ flexDirection: 'column', marginLeft: 100 }}>
                                                    {fileUri
                                                        ?
                                                        <TouchableOpacity onPress={() => pickDocument()}>
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
                                            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Email*</Text>
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
                                    height: 30,
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
                                }, { minWidth: 70 }]}
                                btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
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
                                    height: 30,
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
                                }, { minWidth: 70 }]}
                                btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
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
                <Animated.View style={{ flex: 1, backgroundColor: '#f6f8f9'}}>
                    <ScrollView style={{ height: 100 }}>
                        <View style={{ flexDirection: 'row', margin: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
                                    <Image style={{ width: 30, height: 30, margin: 7 }}
                                        tintColor='#FFFFFF'
                                        source={require('../../assets/manager_icon.png')}></Image>
                                </View>
                                <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                    Users
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: '#5B5B5B', fontSize: 20, fontWeight: 'bold' }}>{totalManager}</Text>
                                    <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Total</Text>
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
                        <View style={styles.newContentCardStyle}>
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
                            <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 20, elevation: 5, height: '98%', width: 300 }}>
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
                                onMouseEnter={() => setDeleteOptionHover({ [1]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [1]: false })}>
                                <TouchableOpacity
                                    onPress={() => setDeleteAlertVisible(false)}
                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[1] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[1] && { color: '#FFFFFF' }]}>No</Text>
                                </TouchableOpacity>
                            </View>

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
                                        setFetchLoading(!fetchLoading)
                                    }}

                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[0] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[0] && { color: '#FFFFFF' }]}>Yes</Text>
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
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        margin: 40,
        // flex:1,
        width: 'auto',
        height: 800,
        // overflow: 'scroll'
    },
    newContentCardStyle: {
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
    btn: {
        width: '100%',
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 0,
        shadowColor: '#575757',
        marginHorizontal: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'inter-bold'
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
        backgroundColor: '#747474A3',
    },
});

export default ManagerPage