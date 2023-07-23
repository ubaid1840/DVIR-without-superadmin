import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Animated, TouchableWithoutFeedback } from 'react-native';

const CustomDropdownProfile = ({ options, selectedValue, onValueChange, dropdownStyle, textStyle, title }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [dropdownSelect, setDropdownSelect] = useState(false)
    const [arrowAnimate] = useState(new Animated.Value(0))

    const animation = () => {
        Animated.timing(arrowAnimate, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start();
    }

    const animationBAck = () => {
        Animated.timing(arrowAnimate, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start();

    }

    const handleDropdownToggle = () => {
        setShowOptions(!showOptions);
        // setDropdownSelect(!dropdownSelect)
        if (showOptions == false) {
          
            animation()
        }
        else {
           
            animationBAck()
        }
    };

    const handleOptionSelect = (value) => {
        // console.log(value)
        onValueChange(value)
        handleDropdownToggle()
        handleOptionHover(-1)

    };

    const handleOptionHover = (index) => {
        setHoveredIndex(index);
    };

    const rotateInterpolation = arrowAnimate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[dropdownStyle, dropdownSelect && styles.dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                onPress={handleDropdownToggle}
                onMouseEnter={() => {
                    handleDropdownToggle()
                }}
            >
                {/* <Text style={[styles.selectedValue, textStyle]}>
                    {selectedValue}
                </Text> */}
                <Text style={{fontSize: 18, fontWeight: '700', color: '#5B5B5B'}}>{title}</Text>
                <Animated.Image style={{marginLeft:10, width: 20, height: 20, transform: [{ rotate: rotateInterpolation }] }} source={require('../../assets/up_arrow_icon.png')}></Animated.Image>
            </TouchableOpacity>
            {showOptions && (
                <View style={[styles.optionsContainer]}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                hoveredIndex === index && styles.hoveredOption, // Apply the hoveredOption style conditionally
                            ]}
                            onPress={() => {
                                handleOptionSelect(option)
                            }}
                            onMouseEnter={() => handleOptionHover(index)}
                            onMouseLeave={() => handleOptionHover(-1)}
                        >
                            <Text style={[styles.optionText, hoveredIndex === index && styles.hoveredOptionText]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1,
    },
    dropdownButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,

    },
    selectedValue: {
        fontSize: 16,
    },
    optionsContainer: {
        position: 'absolute',
        top: '100%',
        right: 0,
        //  left: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web
            },
        }),
        width: 100,
        zIndex:1
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    hoveredOption: {
        ...(Platform.OS === 'web' && {
            backgroundColor: '#67E9DA', // Add hover background color for web
            cursor: 'pointer',
            transitionDuration: '0.2s',
        }),
    },
    optionText: {
        fontSize: 16,
    },
    hoveredOptionText: {
        ...(Platform.OS === 'web' && {
            color: '#FFFFFF', // Add hover background color for web
        }),
    },
    dropdownButtonSelect: {
    }
});

export default CustomDropdownProfile;
