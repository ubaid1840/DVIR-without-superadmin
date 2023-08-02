import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native"
import { useFonts } from "expo-font"



const Notification = () => {

    const [showNotification, setShowNotification] = useState(false)

    const [fontsLoaded] = useFonts({
        'futura-book': require('../assets/fonts/futura/Futura-Book-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ zIndex: 1, }}>


            <TouchableOpacity style={{}} onPress={() => {
                setShowNotification(!showNotification)

            }}>
                <Image style={{ height: 30, width: 30 }} source={require('../assets/notification_icon.png')}
                tintColor= '#5B5B5B'></Image>
            </TouchableOpacity>

            {showNotification && (

                <View style={styles.container}>

                    <Image style={{ width: 100, height: 100, transform: [{ rotate: '325deg' }] }} source={require('../assets/notification_icon.png')}
                    tintColor= '#B8B8B8'></Image>

                    <Text style={{ fontFamily: 'futura-book', color: '#5B5B5B', fontSize: 24 }}>No Notifications Yet</Text>
                </View>

            )}

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '100%', // Adjust this value to control the vertical position of the container relative to the notification icon
        right: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        minWidth: 400,
        maxWidth: 500,
        minHeight: 400,
        maxHeight: 500,
        // zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Notification