import { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, Animated, Dimensions, TextInput, Modal, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import * as DocumentPicker from 'expo-document-picker';
import AlertModal from '../../components/AlertModal';
import DropDownComponent from '../../components/DropDown';

const columns = [
    'Name',
    'Number',
    'Email',
    'Company',
    'Role',
    'Action'
];

const entries = [
    {
        'Name': 'Brian',
        'Number': '001002003',
        'Email': 'abc@gmail.com',
        'Company': 'Octa Soft',
        'Role': 'Limited',
        'Action': 'Button'
    },
    // Add more entries
    {
        'Name': 'DJ',
        'Number': '123456',
        'Email': 'xyz@gmail.com',
        'Company': 'Octa Soft',
        'Role': 'Full Access',
        'Action': 'Button'
    },
];

const MechanicPage = () => {

    const { width, height } = Dimensions.get('window')
    const [fadeAnim] = useState(new Animated.Value(0));
    const [totalMechanic, setTotalMechanic] = useState(0)
    const [entriesData, setEntriesData] = useState([
        {
            'Name': 'Brian',
            'Number': '001002003',
            'Email': 'abc@gmail.com',
            'Company': 'Octa Soft',
            'Role': 'Limited',
            'Action': 'Button'
        },
        // Add more entries
        {
            'Name': 'DJ',
            'Number': '123456',
            'Email': 'xyz@gmail.com',
            'Company': 'Octa Soft',
            'Role': 'Full Access',
            'Action': 'Button'
        },
    ])

    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [createNewMechanicIsVisible, setCreateNewMechanicIsVisible] = useState(false)
    const [employeeNumber, setEmployeeNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [number, setNumber] = useState('')
    const [workPhone, setWorkPhone] = useState('')
    const [role, setRole] = useState('')
    const [dob, setDob] = useState('')
    const [textInputBorderColor, setTextInputBorderColor] = useState("")
    const [fileUri, setFileUri] = useState(null)

    useEffect(() => {

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        return () => {
            fadeAnim.setValue(0);
        }

    }, [])

    useEffect(() => {
        setTotalMechanic(entriesData.length)
    }, [])

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

    const closeCreateNewMechanic = () => {
        setCreateNewMechanicIsVisible(false)
    }

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const clearAllValues = () => {
        setEmployeeNumber("")
        setFirstName('')
        setLastName('')
        setEmail('')
        setCompany('')
        setNumber('')
        setWorkPhone('')
        setRole('')
        setDob('')
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

    return (
        <> {createNewMechanicIsVisible ?
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
                            Create New Mechanic
                        </Text>

                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <AppBtn
                                    title="Close"
                                    btnStyle={[styles.btn, { minWidth: 100 }]}
                                    btnTextStyle={styles.btnText}
                                    onPress={() => {
                                        setCreateNewMechanicIsVisible(false)
                                        clearAllValues()
                                    }} />
                            </View>
                            <View style={{ marginLeft: 20 }}>
                                <AppBtn
                                    title="Save"
                                    btnStyle={[styles.btn, { minWidth: 100 }]}
                                    btnTextStyle={styles.btnText}
                                    onPress={() => {
                                        const temp = entriesData
                                        let i = 0
                                        temp.map((val) => {
                                            if (val.Number == number || val.Email == email) {
                                                i++
                                                setAlertStatus('failed')
                                                setCreateNewMechanicIsVisible(false)
                                                setAlertIsVisible(true)
                                                clearAllValues()
                                            }
                                        })
                                        if (i == 0 && number != "" && email != '') {
                                            temp.push({
                                                'Name': `${firstName}  ${lastName}`,
                                                'Number': number,
                                                'Email': email,
                                                'Company': company,
                                                'Role': role,
                                                'Action': 'Button'
                                            })
                                            setTotalMechanic(totalMechanic + 1)
                                            setEntriesData(temp)
                                            setCreateNewMechanicIsVisible(false)
                                            setAlertStatus('successful')
                                            setAlertIsVisible(true)
                                            clearAllValues()
                                        }
                                        else {
                                            setCreateNewMechanicIsVisible(false)
                                            clearAllValues()
                                        }

                                    }} />
                            </View>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 0 }}>
                        <View style={styles.contentCardStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#67E9DA' }}></View>
                                <Text style={{ color: '#1E3D5C', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                    Personal details
                                </Text>
                            </View>
                            <ScrollView horizontal>
                                <View style={{ flexDirection: 'row', }}>

                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Employee Number*</Text>
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'Employee Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={employeeNumber}
                                                onChangeText={(val) => { setEmployeeNumber(val) }}
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
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'Email' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={email}
                                                onChangeText={(val) => { setEmail(val) }}
                                                onFocus={() => { setTextInputBorderColor('Email') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>

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
                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Mobile Phone*</Text>
                                            <TextInput
                                                style={[styles.input, textInputBorderColor == 'Mobile Phone' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={number}
                                                onChangeText={(val) => { setNumber(val) }}
                                                onFocus={() => { setTextInputBorderColor('Mobile Phone') }}
                                                onBlur={() => { setTextInputBorderColor('') }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column', marginLeft: 80, }}>

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
                                        <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex:1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500' }}>Role</Text>
                                            <DropDownComponent
                                                options={['Limited', 'Full access']}
                                                onValueChange={handleRoleValueChange}
                                                // title="Ubaid Arshad"
                                                selectedValue={role}
                                                imageSource={require('../../assets/up_arrow_icon.png')}
                                                container={[styles.dropdownContainer]}
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
                                                style={[styles.input, textInputBorderColor == 'Date of Birth' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                placeholderTextColor="#868383DC"
                                                value={dob}
                                                onChangeText={(val) => { setDob(val) }}
                                                onFocus={() => { setTextInputBorderColor('Date of Birth') }}
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
                                setCreateNewMechanicIsVisible(false)
                                clearAllValues()
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
                                const temp = entriesData
                                let i = 0
                                temp.map((val) => {
                                    if (val.Number == number || val.Email == email) {
                                        i++
                                        setAlertStatus('failed')
                                        setCreateNewMechanicIsVisible(false)
                                        setAlertIsVisible(true)
                                        clearAllValues()
                                    }
                                })
                                if (i == 0 && number != "" && email != '') {
                                    temp.push({
                                        'Name': `${firstName}  ${lastName}`,
                                        'Number': number,
                                        'Email': email,
                                        'Company': company,
                                        'Role': role,
                                        'Action': 'Button'
                                    })
                                    setTotalMechanic(totalMechanic + 1)
                                    setEntriesData(temp)
                                    setCreateNewMechanicIsVisible(false)
                                    setAlertStatus('successful')
                                    setAlertIsVisible(true)
                                    clearAllValues()
                                }
                                else {
                                    setCreateNewMechanicIsVisible(false)
                                    clearAllValues()
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
                                    source={require('../../assets/mechanic_icon.png')}></Image>
                            </View>
                            <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                                Mechanic
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: '#5B5B5B', fontSize: 20, fontWeight: 'bold' }}>{totalMechanic}</Text>
                                <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Mechanic</Text>
                            </View>
                            <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 60, opacity: 0.5 }}></View>
                            <View >
                                <AppBtn
                                    title="Mechanic"
                                    imgSource={require('../../assets/add_plus_btn_icon.png')}
                                    btnStyle={styles.btn}
                                    btnTextStyle={styles.btnText}
                                    onPress={() => setCreateNewMechanicIsVisible(true)} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentCardStyle}>
                        <Form
                            columns={columns}
                            entriesData={entriesData}
                            titleForm="Mechanic"
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
        width: 250,

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
});

export default MechanicPage