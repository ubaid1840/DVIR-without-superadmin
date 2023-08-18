import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Modal, TouchableWithoutFeedback, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import AppBtn from '../../components/Button';
import { Link, useRouter } from 'expo-router';
import app from '../../src/config/firebase'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import AlertModal from '../../components/AlertModal';
import { countrycodelist } from '../../components/codelist';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';

const SignupPage = (props) => {
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

    const handleLogin = () => {
        // TODO: Implement login logic
        // props.navigation.navigate('Login');
    };

    const handleForgetPasswod = () => {
        // props.navigation.navigate('ForgetPassword');
    };
    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const handleSignup = async () => {

        const db = getFirestore(app)
        const auth = getAuth(app)

        // const querySnapshot = await getDocs(query(collection(db, 'DVIR'), orderBy("TimeStamp", 'desc')));
        // const dbData = []
        // let i = 0
        // querySnapshot.forEach((doc) => {
        //     if (email == doc.data().Email) {
        //         i++
        //     }
        // });
        let i = 0
        let j = 0
        let l = 0
        let data = []
        // await getDocs(collection(db, 'DVIR'))
        //     .then((querySnapshotUsers) => {
        //         querySnapshotUsers.forEach(async (doc) => {
        //             data.push({ Email: doc.data().Email })
        //             if (email == doc.data().Email) {
        //                 j++
        //                 await createUserWithEmailAndPassword(auth, email, password)
        //                     .then(async (userCredential) => {
        //                         setUser(userCredential.user)
        //                         await sendEmailVerification(auth.currentUser)
        //                             .then(() => {
        //                                 l++
        //                                 // Email verification sent!
        //                                 // ...
        //                                 setAlertStatus('successful')
        //                                 setAlertIsVisible(true)
        //                                 clearAll()
        //                                 setLoading(false)
        //                             });
        //                     })
        //                     .catch((error) => {
        //                         const errorCode = error.code;
        //                         setUser(error.message.replace('auth/', ""))
        //                         setAlertStatus('failed')
        //                         setAlertIsVisible(true)
        //                         setLoading(false)

        //                         // ..
        //                     });
        //             }

        //             if (l == 0) {
        //                 data.map(async (val) => {
        //                     await getDocs(collection(db, `DVIR/${val.Email}/users`))
        //                         .then((newQuery) => {
        //                             newQuery.forEach(async (docx) => {
        //                                 if (email == docx.data().Email) {
        //                                     console.log('email found')
        //                                     j++
        //                                     await createUserWithEmailAndPassword(auth, email, password)
        //                                         .then(async (userCredential) => {
        //                                             setUser(userCredential.user)
        //                                             await sendEmailVerification(auth.currentUser)
        //                                                 .then(() => {
        //                                                     // Email verification sent!
        //                                                     // ...
        //                                                     setAlertStatus('successful')
        //                                                     setAlertIsVisible(true)
        //                                                     clearAll()
        //                                                     setLoading(false)
        //                                                 });
        //                                         })
        //                                         .catch((error) => {
        //                                             const errorCode = error.code;
        //                                             setUser(error.message.replace('auth/', ""))
        //                                             setAlertStatus('failed')
        //                                             setAlertIsVisible(true)
        //                                             setLoading(false)

        //                                             // ..
        //                                         });
        //                                 }
        //                             })
        //                         })

        //                 })
        //             }
        //             // if (email == doc.data().Email) {
        //             //     i++
        //             // }
        //         });
        //     })

        //     if(j == 0){
        //         setAlertStatus('Not Allowed')
        //         setAlertIsVisible(true)
        //         setLoading(false)
        //     }


        // return j
        // await getDocs(collection(db, 'AllowedUsers'))
        //     .then((querySnapshotUsers) => {
        //         querySnapshotUsers.forEach(async (doc) => {
        //             // console.log(doc.id)
        //             if (doc.id == email) {
        //                 l++
        //                 await createUserWithEmailAndPassword(auth, email, password)
        //                     .then(async (userCredential) => {
        //                         setUser(userCredential.user)
        //                         await sendEmailVerification(auth.currentUser)
        //                             .then(() => {
        //                                 // Email verification sent!
        //                                 // ...
        //                                 setAlertStatus('successful')
        //                                 setAlertIsVisible(true)
        //                                 clearAll()
        //                                 setLoading(false)
        //                             });
        //                     })
        //                     .catch((error) => {
        //                         const errorCode = error.code;
        //                         setUser(error.message.replace('auth/', ""))
        //                         setAlertStatus('failed')
        //                         setAlertIsVisible(true)
        //                         setLoading(false)

        //                         // ..
        //                     });
        //             }
        //         })
        //     })

        //     if (l == 0)
        //     {
        //         setAlertStatus('Not Allowed')
        //         setAlertIsVisible(true)
        //         setLoading(false)  
        //     }
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
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };


    return (
        <>
            <View style={[styles.container]}>
                <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
                <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
                <BlurView intensity={100} style={styles.content}>
                    <Text style={styles.title}>D V I R</Text>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.inputContainer, { width: '45%' }]}>
                            <TextInput
                                style={[styles.input, firstNameTextInputBorderColor && styles.withBorderInputContainer]}
                                placeholder="First Name"
                                placeholderTextColor="#868383DC"
                                value={firstName}
                                onChangeText={setFirstName}
                                onFocus={() => { setFirstNameTextInputBorderColor(true) }}
                                onBlur={() => { setFirstNameTextInputBorderColor(false) }}
                            />
                        </View>
                        <View style={[styles.inputContainer, { width: '45%' }]}>
                            <TextInput
                                style={[styles.input, lastNameTextInputBorderColor && styles.withBorderInputContainer]}
                                placeholder="Last Name"
                                placeholderTextColor="#868383DC"
                                value={lastName}
                                onChangeText={setLastName}
                                onFocus={() => { setLastNameTextInputBorderColor(true) }}
                                onBlur={() => { setLastNameTextInputBorderColor(false) }}
                            />
                        </View>
                    </View> */}
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
            </View>
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
        width: '100%',
        height: 50,
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
    signupButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    signupButtonHover: {
        backgroundColor: '#558BC1',
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
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    forgetPasswordTextHover: {
        color: '#558BC1',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    signupContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    loginText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold'
    },
    loginTextHover: {
        color: '#558BC1',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
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
        backgroundColor: '#555555DD'
    },
});

export default SignupPage;
