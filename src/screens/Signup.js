import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';


const SignupPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginHovered, setLoginHovered] = useState(false);
    const [signupHovered, setSignupHovered] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = () => {
        // TODO: Implement login logic
        props.navigation.navigate('Login');
    };

    const handleForgetPasswod = () => {
        props.navigation.navigate('ForgetPassword');
    };

    const handleSignup = () => {
        props.navigation.navigate('Login');
    };

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
      });
      
      if (!fontsLoaded) {
        return null; // Render nothing until the fonts are loaded
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.inputContainer, { width: '45%' }]}>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor="#868383DC"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={[styles.inputContainer, { width: '45%' }]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            placeholderTextColor="#868383DC"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#868383DC"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#868383DC"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Company"
                        placeholderTextColor="#868383DC"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.signupButton, signupHovered && styles.signupButtonHover]}
                    onPress={handleSignup}
                    activeOpacity={0.7}
                    onMouseEnter={() => setSignupHovered(true)}
                    onMouseLeave={() => setSignupHovered(false)}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: 14 }}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.7} onMouseEnter={() => setLoginHovered(true)} onMouseLeave={() => setLoginHovered(false)}>
                        <Text style={[styles.loginText, loginHovered && styles.loginTextHover]}>Login</Text>
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
        marginBottom: 10,
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
    }
});

export default SignupPage;
