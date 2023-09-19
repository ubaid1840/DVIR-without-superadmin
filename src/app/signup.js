import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Modal, TouchableWithoutFeedback, ScrollView, FlatList, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import AppBtn from '../../components/Button';
import { Link, useRouter } from 'expo-router';
import app from '../../src/config/firebase'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, onAuthStateChanged } from 'firebase/auth'
import AlertModal from '../../components/AlertModal';
import { countrycodelist } from '../../components/codelist';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { AuthContext } from '../store/context/AuthContext';

const SignupPage = (props) => {

    const db = getFirestore(app)
    const auth = getAuth()

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [company, setCompany] = useState('')
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [loginHovered, setLoginHovered] = useState(false);
    const [signupHovered, setSignupHovered] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [emailTextInputBorderColor, setEmailTextInputBorderColor] = useState(false)
    const [passwordTextInputBorderColor, setPasswordTextInputBorderColor] = useState(false)
    const [firstNameTextInputBorderColor, setFirstNameTextInputBorderColor] = useState(false)
    const [lastNameTextInputBorderColor, setLastNameTextInputBorderColor] = useState(false)
    const [numberTextInputBorderColor, setNumberTextInputBorderColor] = useState(false)
    const [alertIsVisible, setAlertIsVisible] = useState(true)
    const [user, setUser] = useState(null)
    const [alertStatus, setAlertStatus] = useState('')
    const [numberCode, setNumberCode] = useState('Select')
    const [searchNumber, setSearchNumber] = useState('')
    const [number, setNumber] = useState('')
    const [code, setCode] = useState('')
    const [mobileModalVisible, setMobileModalVisible] = useState(false)
    const [mobileItemHovered, setMobileItemHovered] = useState({})
    const [loading, setLoading] = useState(false)

    const { state: authState, setAuth } = useContext(AuthContext)



    const router = useRouter()

    const clearAll = () => {
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
        setCode('Select')
        setNumber('')
    }

    useEffect(() => {
        // Animated.timing(fadeAnim, {
        //     toValue: 1,
        //     duration: 1000,
        //     useNativeDriver: false,
        // }).start();
        clearAll()
        return () => clearAll()
    }, []);

    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
        setIsPasswordValid(password.length > 7 && password.length < 19 ? true : false)
    }, [email, password])

    useEffect(() => {

        if (!authState.value.email) {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    if(user.emailVerified){
                        await getDocs(query(collection(db, "AllowedUsers"), where('Email', '==', auth.currentUser.email)))
                        .then((snapshot) => {
                            console.log(snapshot)
                            snapshot.forEach((doc) => {
                                setAuth(doc.data().Number, doc.data().Name, doc.data().Designation, doc.data()['Employee Number'], doc.data().dp)
                                // router.replace('/dashboardLogin')
                                router.replace('/dashboardLogin')
                            })
                        })
                    }
                  
                }
            });
        }

    }, [])

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const handleSignup = async () => {

        let i = 0
        const db = getFirestore(app)
        const auth = getAuth(app)

        await getDocs(collection(db, 'AllowedUsers'))
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().Email == email) {
                        i++
                    }
                })
            })

        if (i == 0) {
            setAlertStatus('Not Allowed')
            setAlertIsVisible(true)
            setLoading(false)
        }
        else {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    setUser(userCredential.user)
                    await sendEmailVerification(auth.currentUser)
                        .then(() => {
                            // Email verification sent!
                            // ...
                            setAlertStatus('successful')
                            setAlertIsVisible(true)
                            clearAll()
                            setLoading(false)
                        });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    setUser(error.message.replace('auth/', ""))
                    setAlertStatus('failed')
                    setAlertIsVisible(true)
                    setLoading(false)

                    // ..
                });
        }

    };

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
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

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#23d3d3" size="large" />
            </View>
        );
    };


    return (
        <>


            <ScrollView style={{}}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
                <View style={{ flexDirection: 'row', width: '100%', height: '100%', margin: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#eaedf5' }}>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ height: 55, width: 55 }} source={require('../../assets/applogo.png')}></Image>
                            <Text style={{ fontFamily: 'inter-extrablack', fontSize: 40, color: '#000000', marginLeft: 10 }}>D V I R</Text>
                        </View>
                        <Text style={{ fontFamily: 'inter-bold', fontSize: 22, marginVertical: 30, color: 'grey' }}>Sign up to your DVIR account</Text>
                        <TextInput
                            style={[styles.input, emailTextInputBorderColor && styles.withBorderInputContainer]}
                            placeholder="Email"
                            placeholderTextColor="#868383DC"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => { setEmailTextInputBorderColor(true) }}
                            onBlur={() => { setEmailTextInputBorderColor(false) }}
                        />
                        <View style={{ width: 350, marginBottom: 10 }}>
                            {!isEmailValid ? <Text style={{ color: 'red', paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
                        </View>
                        <TextInput
                            style={[styles.input, passwordTextInputBorderColor && styles.withBorderInputContainer]}
                            placeholder="Password"
                            placeholderTextColor="#868383DC"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={() => { setPasswordTextInputBorderColor(true) }}
                            onBlur={() => { setPasswordTextInputBorderColor(false) }}
                        />
                        <View style={{ width: 350, marginBottom: 10 }}>
                            {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}
                        </View>
                        <View style={{ width: 350 }}>
                            <AppBtn
                                title="SIGN UP"
                                btnStyle={styles.btn}
                                btnTextStyle={styles.btnText}
                                onPress={() => {
                                    if (isEmailValid == true && isPasswordValid == true) {
                                        setLoading(true)
                                        handleSignup()
                                    }
                                }}
                            >
                            </AppBtn>
                        </View>


                        <View style={styles.signupContainer}>
                            <Text style={{ fontFamily: 'inter-regular', fontSize: 13, color: 'grey' }}>Already have an account? </Text>
                            <View
                                onMouseEnter={() => setLoginHovered(true)}
                                onMouseLeave={() => setLoginHovered(false)}>
                                <TouchableOpacity
                                    onPress={() => router.replace('/')}
                                >
                                    <Text style={[styles.signupText, loginHovered && styles.signupTextHover]}
                                        activeOpacity={0.7}>Log in</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* <View style={[styles.container]}>
                <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
                <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={styles.content}>
                    <Text style={styles.title}>D V I R</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, emailTextInputBorderColor && styles.withBorderInputContainer]}
                            placeholder="Email"
                            placeholderTextColor="#868383DC"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => { setEmailTextInputBorderColor(true) }}
                            onBlur={() => { setEmailTextInputBorderColor(false) }}
                        />
                    </View>
                    {!isEmailValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, passwordTextInputBorderColor && styles.withBorderInputContainer]}
                            placeholder="Password"
                            placeholderTextColor="#868383DC"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={() => { setPasswordTextInputBorderColor(true) }}
                            onBlur={() => { setPasswordTextInputBorderColor(false) }}
                        />
                    </View>
                    {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}

                    <AppBtn
                        title="Sign Up"
                        btnStyle={styles.btn}
                        btnTextStyle={styles.btnText}
                        onPress={async () => {
                            if (isEmailValid == true && isPasswordValid == true) {
                                setLoading(true)
                                handleSignup()
                                // else{
                                //     setLoading(false)
                                // }
                            }

                        }}
                    />
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14 }}>Already have an account? </Text>
                        <View style={{ color: '#333', fontSize: 14, fontWeight: 'bold', }}>
                            <View
                                onMouseEnter={() => setLoginHovered(true)}
                                onMouseLeave={() => setLoginHovered(false)}>
                                <TouchableOpacity onPress={() => router.replace('/')}>
                                    <Text
                                        style={[styles.loginText, loginHovered && styles.loginTextHover]}
                                        activeOpacity={0.7}>Login</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </BlurView>
            </View> */}
            {alertStatus == 'successful'
                ?
                <AlertModal
                    centeredViewStyle={styles.centeredView}
                    modalViewStyle={styles.modalView}
                    isVisible={alertIsVisible}
                    onClose={closeAlert}
                    img={require('../../assets/successful_icon.png')}
                    txt='Check your email to verify'
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
                        txt={user}
                        txtStyle={{ fontFamily: 'futura', fontSize: 20, marginLeft: 10 }}
                        tintColor='red'>
                    </AlertModal>
                    :
                    alertStatus == 'Not Allowed'
                        ?
                        <AlertModal
                            centeredViewStyle={styles.centeredView}
                            modalViewStyle={styles.modalView}
                            isVisible={alertIsVisible}
                            onClose={closeAlert}
                            img={require('../../assets/failed_icon.png')}
                            txt='Contact sales team to register'
                            txtStyle={{ fontFamily: 'futura', fontSize: 20, marginLeft: 10 }}
                            tintColor='red'>
                        </AlertModal>
                        :
                        null}

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

            {loading ? CustomActivityIndicator() : null}

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
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
    content: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        borderRadius: 10,
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#FFFFFF',
        borderColor: '#336699',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#1E4163',
        fontFamily: 'futura-extra-black',
    },
    inputContainer: {
        width: '100%',
        marginTop: 10,

    },
    input: {
        width: 350,
        height: 60,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none',
        marginBottom: 10
    },
    withBorderInputContainer: {
        borderColor: '#008dff',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    loginButtonHover: {
        backgroundColor: '#001E3D',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgetPasswordButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    forgetPasswordText: {
        color: '#008dff',
        fontSize: 14,
        fontFamily: 'inter-regular',
    },
    forgetPasswordTextHover: {
        color: '#000000',
        textDecorationLine: 'underline',
    },
    signupContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    signupText: {
        color: '#008dff',
        fontSize: 14,
        fontFamily: 'inter-regular',
    },
    signupTextHover: {
        color: '#000000',
        textDecorationLine: 'underline',
    },
    btn: {
        width: '100%',
        height: 60,
        backgroundColor: '#0078ff',
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
        backgroundColor: '#788C9A95'
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

export default SignupPage;
