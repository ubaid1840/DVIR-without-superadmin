import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import NameAvatar from "./NameAvatar"
import { useState } from "react"
import DropDownComponent from "./DropDown"
import { useFonts } from 'expo-font';


const Header = (props) => {

    const logoutList = ['Profile', 'Logout']
    const handleValueChange = (value) => {
        props.onValueChange(value)
    };

    const [inputValue, setInputValue] = useState('');

    const [fontsLoaded] = useFonts({
        'futura-book': require('../../assets/fonts/futura/Futura-Book-font.ttf'),
      });
    
      if (!fontsLoaded) {
        return null;
      }

    return (
        <View style={{ flexDirection: 'row', paddingLeft: 60, paddingRight: 60, paddingTop: 10, paddingBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF', justifyContent: 'space-between',  }}>
            <View >
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#5B5B5B', fontFamily:'futura-book' }}>
                    Welcome Ubaid Ur Rehman!
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Ubaid Arshad</Text> */}
                <View style={{ marginHorizontal: 10, }}>
                    <DropDownComponent
                        options={logoutList}
                        onValueChange={handleValueChange}
                        title="Ubaid Arshad"
                        imageSource={require('../../assets/up_arrow_icon.png')}
                        container = {styles.dropdownContainer}
                        dropdownButton = {styles.dropdownButton}
                        selectedValueStyle={styles.dropdownSelectedValueStyle}
                        optionsContainer = {styles.dropdownOptionsContainer}
                        option={styles.dropdownOption}
                        hoveredOption = {styles.dropdownHoveredOption}
                        optionText = {styles.dropdownOptionText}
                        hoveredOptionText={styles.dropdownHoveredOptionText}
                    />
                </View>
                <TouchableOpacity style={{}}>
                    <NameAvatar title="U" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
    dropdownContainer: {
        position: 'relative',
        zIndex:1
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
         top:'100%',
        left:0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
        }),
        width: 100,
        zIndex:2

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