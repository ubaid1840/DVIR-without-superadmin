import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, TouchableWithoutFeedback } from "react-native"
import NameAvatar from "./NameAvatar"
import { useState, useRef, useEffect } from "react"
import DropDownComponent from "./DropDown"
import { useFonts } from 'expo-font';
import Notification from "./Notification";

const logoutList = ['Profile', 'Logout'];

const Header = (props) => {

   
    const handleValueChange = (value) => {
        props.onValueChange(value);
    };

    const [inputValue, setInputValue] = useState('');

    const [fontsLoaded] = useFonts({
        'futura-book': require('../assets/fonts/futura/Futura-Book-font.ttf'),
    });

   


    // Check if fonts are loaded and return null if not
    if (!fontsLoaded) {
        return null;
    }

    return (
        <TouchableWithoutFeedback onPress={() => { 
            console.log('solve auto close dropdown issue') }}>
            <View style={{ flexDirection: 'row', paddingLeft: 60, paddingRight: 60, paddingTop: 10, paddingBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF', justifyContent: 'space-between', }}>
                <View >
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#5B5B5B', fontFamily: 'futura-book' }}>
                        Welcome Ubaid Ur Rehman!
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Notification />

                    {/* <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Ubaid Arshad</Text> */}
                    <View style={{ marginHorizontal: 10, zIndex: 1 }}>
                        <DropDownComponent
                            options={logoutList}
                            onValueChange={handleValueChange}
                            title="Ubaid Arshad"
                            imageSource={require('../assets/up_arrow_icon.png')}
                            container={styles.dropdownContainer}
                            dropdownButton={styles.dropdownButton}
                            selectedValueStyle={styles.dropdownSelectedValueStyle}
                            optionsContainer={styles.dropdownOptionsContainer}
                            option={styles.dropdownOption}
                            hoveredOption={styles.dropdownHoveredOption}
                            optionText={styles.dropdownOptionText}
                            hoveredOptionText={styles.dropdownHoveredOptionText}
                        />
                    </View>
                    <TouchableOpacity style={{}}>
                        <NameAvatar title="U" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'relative',
        zIndex: 1
    },
    dropdownButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,

    },
    dropdownOptionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        width: 200,
        zIndex: 2

    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropdownHoveredOption: {
        ...(Platform.OS === 'web' && {
            backgroundColor: '#67E9DA',
            cursor: 'pointer',
            transitionDuration: '0.2s',
        }),
    },
    dropdownOptionText: {
        fontSize: 16,
    },
    dropdownHoveredOptionText: {
        ...(Platform.OS === 'web' && {
            color: '#FFFFFF',
        }),
    },
})

export default Header