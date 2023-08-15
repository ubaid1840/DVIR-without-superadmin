import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Linking, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
// import { useIsFocused } from '@react-navigation/native';
import AppBtn from '../../components/Button';
import { Link, router } from 'expo-router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebase';
import AlertModal from '../../components/AlertModal';

const loginList = [{
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Example Inc.',
    email: 'john.doe@gmail.com',
    password: 'password123',
    designation: 'Owner',
    Access: 'Full'
},
{
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'Sample Co.',
    email: 'jane.smith@gmail.com',
    password: 'myp@ssword',
    designation: 'Manager',
    Access: 'Full'
},
{
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    company: 'Tech Solutions',
    email: 'michael.johnson@gmail.com',
    password: 'pass1234',
    designation: 'Driver',
    Access: 'Limited'
},
{
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    company: 'Design Studio',
    email: 'emily.brown@gmail.com',
    password: 'securePwd',
    designation: 'Mechanic',
    Access: 'Limited'
},
{
    id: '5',
    firstName: 'David',
    lastName: 'Lee',
    company: 'Marketing Hub',
    email: 'david.lee@gmail.com',
    password: 'hello123',
    designation: 'Mechanic',
    Access: 'Full'
}]

const LoginPage = (props) => {



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

  

    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
        setIsPasswordValid(password.length > 7 && password.length < 19 ? true : false)
    }, [email, password])


    // const isFocused = useIsFocused()

    useEffect(() => {

        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                console.log('user signed in login page')
                handleLoginAlreadySignIn({ email: user.auth.currentUser.email })
                // ...
            }
        });

        setEmail("")
        setPassword("")
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();
        return () => {
            fadeAnim.setValue(0);
        }
    }, [])

    const handleLoginAlreadySignIn = (props) => {

        if (props.email === 'superadmin@gmail.com') {
            router.replace({ pathname: 'superAdminDashboard', params: { id: 'superAdminLogin' } })
        }
        else {
            router.replace('/dashboard')
        }

    }

    const handleLogin = () => {

        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoading(false)
                if (email === 'superadmin@gmail.com') {
                    router.replace({ pathname: 'superAdminDashboard', params: { id: 'superAdminLogin' } })
                    // Navigate to the dashboard when email matches
                    // window.location.href = {{pathname:'superAdminDashboard'}}; // Use your navigation method here
                }
                else {
                    router.replace('/dashboard')
                }

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorCode)
                setAlertStatus('failed')
                setAlertIsVisible(true)
                setLoading(false)
            });

    };

    const handleForgetPasswod = () => {
        // props.navigation.navigate('ForgetPassword');
    };

    const handleSignup = () => {
        // props.navigation.navigate('Signup');
    };

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };
    const closeAlert = () => {
        setAlertIsVisible(false)
    }



    return (
        <>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
                            onPress={()=>{
                                setLoading(true)
                                handleLogin()}}
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
            </Animated.View>

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
    signupText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    signupTextHover: {
        color: '#558BC1',
        textDecorationLine: 'underline',
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
