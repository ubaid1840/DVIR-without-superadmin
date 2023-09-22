import { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Linking, ActivityIndicator, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
// import { useIsFocused } from '@react-navigation/native';
import AppBtn from '../../components/Button';
import { Link, router } from 'expo-router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebase';
import AlertModal from '../../components/AlertModal';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { AuthContext } from '../store/context/AuthContext';
import Head from 'expo-router/head';


const LoginPage = (props) => {

    const db = getFirestore(app)
    const auth = getAuth(app);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgetPasswordHovered, setForgetPasswordHovered] = useState(false);
    const [signupHovered, setSignupHovered] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [emailTextInputBorderColor, setEmailTextInputBorderColor] = useState(false)
    const [passwordTextInputBorderColor, setPasswordTextInputBorderColor] = useState(false)
    const [alertIsVisible, setAlertIsVisible] = useState(true)
    const [error, setError] = useState(null)
    const [alertStatus, setAlertStatus] = useState('')
    const [loading, setLoading] = useState(false)

    const { state: authState, setAuth } = useContext(AuthContext)



    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
        setIsPasswordValid(password.length > 7 && password.length < 19 ? true : false)
    }, [email, password])

    useEffect(() => {

        if (!authState.value.email) {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    if (user.emailVerified) {
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


    const handleLogin = async () => {


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoading(false)
                if (user.emailVerified == true) {
                    router.replace('/dashboardLogin')
                }
                else if (user.emailVerified == false) {
                    setAlertStatus('not verified')
                    setAlertIsVisible(true)
                    setLoading(false)
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorCode.replace('auth/', ""))
                setAlertStatus('failed')
                setAlertIsVisible(true)
                setLoading(false)
            });

    };

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#23d3d3" size="large" />
            </View>
        );
    };
    const closeAlert = () => {
        setAlertIsVisible(false)
    }



    return (
        <>
            <Head>
                <title>DVIR</title>
                <meta name="description" content="Driver vehicle inspection report application" />
            </Head>
            <ScrollView style={{}}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
                <View style={{ flexDirection: 'row', width: '100%', height: '100%', margin: 10 }}>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ height: 55, width: 55 }} source={require('../../assets/applogo.png')}></Image>
                            <Text style={{ fontFamily: 'inter-extrablack', fontSize: 40, color: '#000000', marginLeft: 10 }}>D V I R</Text>
                        </View>
                        <Text style={{ fontFamily: 'inter-bold', fontSize: 22, marginVertical: 30, color: 'grey' }}>Log in to your DVIR account</Text>
                        <TextInput
                            style={[styles.input, emailTextInputBorderColor && styles.withBorderInputContainer]}
                            placeholder="Email"
                            placeholderTextColor="#868383DC"
                            value={email}
                            onChangeText={(val) => { setEmail(val) }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => { setEmailTextInputBorderColor(true) }}
                            onBlur={() => { setEmailTextInputBorderColor(false) }}
                            // onBlur={()=> {
                            //     console.log('ubaid')}}
                        />
                        <View style={{ width: 350, marginBottom: 10 }}>
                            {!isEmailValid ? <Text style={{ color: 'red', paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
                        </View>
                        <TextInput
                            style={[styles.input, passwordTextInputBorderColor && styles.withBorderInputContainer]}
                            placeholder="Password"
                            placeholderTextColor="#868383DC"
                            value={password}
                            onChangeText={(val) => { setPassword(val) }}
                            secureTextEntry
                            onFocus={() => { setPasswordTextInputBorderColor(true) }}
                            onBlur={() => { setPasswordTextInputBorderColor(false) }}
                        // onSubmitEditing={handleLogin}
                        />
                        <View style={{ width: 350, marginBottom: 10 }}>
                            {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}
                        </View>
                        <View style={{ width: 350 }}>
                            <AppBtn
                                title="LOG IN"
                                btnStyle={styles.btn}
                                btnTextStyle={styles.btnText}
                                onPress={() => {
                                    setLoading(true)
                                    handleLogin()
                                }}
                            >
                            </AppBtn>
                        </View>
                        <View style={{ width: 350 }}>
                            <View style={styles.forgetPasswordButton}>
                                <View
                                    onMouseEnter={() => setForgetPasswordHovered(true)}
                                    onMouseLeave={() => setForgetPasswordHovered(false)}>
                                    <TouchableOpacity
                                        onPress={() => router.replace('/forgetpassword')}
                                    >
                                        <Text
                                            style={[styles.forgetPasswordText, forgetPasswordHovered && styles.forgetPasswordTextHover]}
                                            activeOpacity={0.7}>Forget Password?
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.signupContainer}>
                            <Text style={{ fontFamily: 'inter-regular', fontSize: 13, color: 'grey' }}>Don't have an account? </Text>
                            <View
                                onMouseEnter={() => setSignupHovered(true)}
                                onMouseLeave={() => setSignupHovered(false)}>
                                <TouchableOpacity
                                    onPress={() => router.replace('/signup')}
                                >
                                    <Text style={[styles.signupText, signupHovered && styles.signupTextHover]}
                                        activeOpacity={0.7}>Sign Up</Text></TouchableOpacity>
                            </View>


                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#eaedf5', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ height: 350 }} source={require('../../assets/webapp_mockup_login.png')} resizeMode='contain'></Image>
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
                            onChangeText={(val) => { setEmail(val) }}
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
                            onChangeText={(val) => { setPassword(val) }}
                            secureTextEntry
                            onFocus={() => { setPasswordTextInputBorderColor(true) }}
                            onBlur={() => { setPasswordTextInputBorderColor(false) }}
                        // onSubmitEditing={handleLogin}
                        />
                    </View>
                    {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}
                    <View style={{ width: '100%' }}>
                        <AppBtn
                            title="Login"
                            btnStyle={styles.btn}
                            btnTextStyle={styles.btnText}
                            onPress={() => {
                                setLoading(true)
                                handleLogin()
                            }}
                        >
                        </AppBtn>
                    </View>
                    <View style={styles.forgetPasswordButton}>
                        <View
                            onMouseEnter={() => setForgetPasswordHovered(true)}
                            onMouseLeave={() => setForgetPasswordHovered(false)}>
                            <TouchableOpacity
                                onPress={() => router.replace('/forgetpassword')}
                            >
                                <Text
                                    style={[styles.forgetPasswordText, forgetPasswordHovered && styles.forgetPasswordTextHover]}
                                    activeOpacity={0.7}>Forget Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.signupContainer}>
                        <Text style={{}}>Don't have an account? </Text>
                        <View
                            onMouseEnter={() => setSignupHovered(true)}
                            onMouseLeave={() => setSignupHovered(false)}>
                            <TouchableOpacity
                                onPress={() => router.replace('/signup')}
                            >
                                <Text style={[styles.signupText, signupHovered && styles.signupTextHover]}
                                    activeOpacity={0.7}>Sign Up</Text></TouchableOpacity>
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
                        txt={error}
                        txtStyle={{ fontFamily: 'futura', fontSize: 20, marginLeft: 10 }}
                        tintColor='red'>
                    </AlertModal>
                    : alertStatus == 'not verified'
                        ?
                        <AlertModal
                            centeredViewStyle={styles.centeredView}
                            modalViewStyle={styles.modalView}
                            isVisible={alertIsVisible}
                            onClose={closeAlert}
                            img={require('../../assets/failed_icon.png')}
                            txt={'Please verify your email to login'}
                            txtStyle={{ fontFamily: 'futura', fontSize: 20, marginLeft: 10 }}
                            tintColor='red'>
                        </AlertModal>
                        : alertStatus == 'Not Allowed'
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

export default LoginPage;
