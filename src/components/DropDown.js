import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Animated } from 'react-native';

const DropDownComponent = ({ options, onValueChange, title, imageSource, selectedValue, container, dropdownButton, selectedValueStyle, optionsContainer, option, hoveredOption, optionText, hoveredOptionText, dropdownButtonSelect, dropdownStyle }) => {

    const [showOptions, setShowOptions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [arrowAnimate] = useState(new Animated.Value(0));
    const [dropdownSelect, setDropdownSelect] = useState(false)

    const animation = () => {
        Animated.timing(arrowAnimate, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationBAck = () => {
        Animated.timing(arrowAnimate, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const handleDropdownToggle = () => {
        setShowOptions(!showOptions);
        setDropdownSelect(!dropdownSelect)
    };

    useEffect(() => {
        if (showOptions == false) {
            animation();
        } else {
            animationBAck();
        }
    }, [showOptions]);

    const handleOptionSelect = (value) => {
        onValueChange(value);
        handleDropdownToggle();
        handleOptionHover(-1);
    };

    const handleOptionHover = (index) => {
        setHoveredIndex(index);
    };

    const rotateInterpolation = arrowAnimate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={container}>
            <TouchableOpacity
                style={[dropdownStyle, dropdownSelect && dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                onPress={()=>handleDropdownToggle()}
            >
                 <Text style={[selectedValueStyle]}>
                    {selectedValue}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>{title}</Text>
                <Animated.Image
                    style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolation }], alignSelf: 'center' }}
                    source={imageSource}
                ></Animated.Image>
            </TouchableOpacity>
            {showOptions && (
                <View style={[optionsContainer, { right: 20 }]}>
                    {options.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                option,
                                hoveredIndex === index && hoveredOption, // Apply the hoveredOption style conditionally
                            ]}
                            onPress={() => {
                                handleOptionSelect(item);
                            }}
                            onMouseEnter={() => handleOptionHover(index)}
                            onMouseLeave={() => handleOptionHover(-1)}
                        >
                            <Text style={[optionText, hoveredIndex === index && hoveredOptionText]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         position: 'relative',
//         zIndex: 1

//     },
//     dropdownButton: {
//         padding: 12,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         minWidth: 150,
//     },
//     optionsContainer: {
//         position: 'absolute',
//         top: '100%',
//         left: 0,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         backgroundColor: '#fff',
//         marginTop: 4,
//         ...Platform.select({
//             web: {
//                 boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
//             },
//         }),
//         width: 100,
//         zIndex: 2
//     },
//     option: {
//         padding: 12,
//         borderBottomWidth: 1,
//         borderColor: '#ccc',
//     },
//     hoveredOption: {
//         ...(Platform.OS === 'web' && {
//             backgroundColor: '#67E9DA',
//             cursor: 'pointer',
//             transitionDuration: '0.2s',
//         }),
//     },
//     optionText: {
//         fontSize: 16,
//     },
//     hoveredOptionText: {
//         ...(Platform.OS === 'web' && {
//             color: '#FFFFFF',
//         }),
//     },
// });

export default DropDownComponent;
