import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';

const LoginPage = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginHovered, setLoginHovered] = useState(false);
    const [forgetPasswordHovered, setForgetPasswordHovered] = useState(false);
    const [signupHovered, setSignupHovered] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [emailTextInputBorderColor, setEmailTextInputBorderColor] = useState(false)
    const [passwordTextInputBorderColor, setPasswordTextInputBorderColor] = useState(false)
     

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start();
    }, []);

    

    useEffect(() => {
        setIsEmailValid(email.includes('.com') && email.includes('@') ? true : false)
        setIsPasswordValid(password.length > 7 && password.length < 19 ? true : false)
    }, [email, password])

    const handleLogin = () => {
        // TODO: Implement login logic
        props.navigation.navigate('Dashboard');
    };

    const handleForgetPasswod = () => {
        props.navigation.navigate('ForgetPassword');
    };

    const handleSignup = () => {
        props.navigation.navigate('Signup');
    };

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
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
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={()=>{setEmailTextInputBorderColor(true)}}
                        onBlur={()=>{setEmailTextInputBorderColor(false)}}
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
                        onFocus={()=>{setPasswordTextInputBorderColor(true)}}
                        onBlur={()=>{setPasswordTextInputBorderColor(false)}}
                    />
                </View>
                {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 5, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}
                <TouchableOpacity
                    style={[styles.loginButton, loginHovered && styles.loginButtonHover]}
                    onPress={handleLogin}
                    activeOpacity={0.7}
                    onMouseEnter={() => setLoginHovered(true)}
                    onMouseLeave={() => setLoginHovered(false)}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.forgetPasswordButton}
                    onPress={handleForgetPasswod}
                    activeOpacity={0.7}
                    onMouseEnter={() => setForgetPasswordHovered(true)}
                    onMouseLeave={() => setForgetPasswordHovered(false)}
                >
                    <Text style={[styles.forgetPasswordText, forgetPasswordHovered && styles.forgetPasswordTextHover]}>
                        Forget Password?
                    </Text>
                </TouchableOpacity>
                <View style={styles.signupContainer}>
                    <Text style={{}}>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={handleSignup}
                        activeOpacity={0.7}
                        onMouseEnter={() => setSignupHovered(true)}
                        onMouseLeave={() => setSignupHovered(false)}
                    >
                        <Text style={[styles.signupText, signupHovered && styles.signupTextHover]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
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
        borderRadius: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        outlineStyle: 'none'
    },
    withBorderInputContainer:{
        borderColor:'#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height:  0},
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
});

export default LoginPage;
