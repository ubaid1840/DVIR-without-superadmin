import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Animated, ScrollView } from 'react-native';
import AddBtn from './Button';
import { v4 as uuidv4 } from 'uuid';
import { Link, useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';

const DropDownComponent = (props) => {

    const { options, onValueChange, title, imageSource, selectedValue, container, dropdownButton, selectedValueStyle, optionsContainer, option, hoveredOption, optionText, hoveredOptionText, dropdownButtonSelect, dropdownStyle, info, onMechanicSelection, onAssetSelection } = props

    const [showOptions, setShowOptions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [arrowAnimate] = useState(new Animated.Value(0));
    const [dropdownSelect, setDropdownSelect] = useState(false)

    const router = useRouter()

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

    const handleCloseDropdown = () => {
        setShowOptions(false);
    };

    useEffect(() => {
        if (showOptions == false) {
            animation();
        } else {
            animationBAck();
        }
    }, [showOptions]);

    const handleOptionSelect = (value) => {
        // console.log(value)
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

    const handleLogout = () => {
        const auth = getAuth()
        signOut(auth).then(() => {
            // Sign-out successful.
            router.replace('/')
        }).catch((error) => {
            // An error happened.
        });

    }

    const handleMechanicSelection = (value) => {
        onMechanicSelection(value)
        handleDropdownToggle();
        handleOptionHover(-1);
    }

    const handleAssetSelection = (value) => {
        onAssetSelection(value)
        handleDropdownToggle();
        handleOptionHover(-1);
    }

    return (
        <>
            {info == 'mobile'
                ?
                <View style={container}>

                    <TouchableOpacity
                        style={[dropdownStyle, { width: 100, height: 40 }, dropdownSelect && dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                        onPress={() => handleDropdownToggle()}
                    >
                        <Text style={[selectedValueStyle]}>
                            {selectedValue}
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>{title}</Text>
                        {/* <Animated.Image
                            style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolation }], alignSelf: 'center' }}
                            source={imageSource}
                        ></Animated.Image> */}
                    </TouchableOpacity>
                    {showOptions && (
                        <ScrollView style={[optionsContainer, { width: 250 }, { right: 20, maxHeight: 140 }]}>

                            {options.map((item, index) => (
                                <TouchableOpacity
                                    key={index.toString()}
                                    style={[{ flexDirection: 'row' },
                                        option,
                                    hoveredIndex === index && hoveredOption, // Apply the hoveredOption style conditionally
                                    ]}
                                    onPress={() => {
                                        handleOptionSelect(item.code);
                                    }}
                                    onMouseEnter={() => handleOptionHover(index)}
                                    onMouseLeave={() => handleOptionHover(-1)}
                                >
                                    <Text style={[optionText, hoveredIndex === index && hoveredOptionText]}>{item.code} {item.name}</Text>
                                </TouchableOpacity>
                            ))}


                        </ScrollView>
                    )}
                </View>
                :
                info == 'mechanicSelection'
                    ?
                    <View style={container}>

                        <TouchableOpacity
                            style={[dropdownStyle, dropdownSelect && dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                            onPress={() => handleDropdownToggle()}
                        >
                            <Text style={[selectedValueStyle]}>
                                {selectedValue}
                            </Text>
                            <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                            <Animated.Image
                                style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolation }], alignSelf: 'center' }}
                                source={imageSource}
                            ></Animated.Image>
                        </TouchableOpacity>
                        {showOptions && (
                            <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                {options.map((item, index) => (
                                        <TouchableOpacity
                                            key={index.toString()}
                                            style={[
                                                option,
                                                hoveredIndex === index && hoveredOption, // Apply the hoveredOption style conditionally
                                            ]}
                                            onPress={() => {
                                                handleMechanicSelection(item);
                                            }}
                                            onMouseEnter={() => handleOptionHover(index)}
                                            onMouseLeave={() => handleOptionHover(-1)}
                                        >
                                            <Text style={[optionText, hoveredIndex === index && hoveredOptionText]}>
                                                {item.Name}
                                            </Text>
                                        </TouchableOpacity>
                                ))}


                            </ScrollView>
                        )}
                    </View>
                    :
                    info == 'assetSelection'
                    ?
                    <View style={container}>

                        <TouchableOpacity
                            style={[dropdownStyle, dropdownSelect && dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                            onPress={() => handleDropdownToggle()}
                        >
                            <Text style={[selectedValueStyle]}>
                                {selectedValue}
                            </Text>
                            <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                            <Animated.Image
                                style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolation }], alignSelf: 'center' }}
                                source={imageSource}
                            ></Animated.Image>
                        </TouchableOpacity>
                        {showOptions && (
                            <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                {options.map((item, index) => (
                                        <TouchableOpacity
                                            key={index.toString()}
                                            style={[
                                                option,
                                                hoveredIndex === index && hoveredOption, // Apply the hoveredOption style conditionally
                                            ]}
                                            onPress={() => {
                                                handleAssetSelection(item);
                                            }}
                                            onMouseEnter={() => handleOptionHover(index)}
                                            onMouseLeave={() => handleOptionHover(-1)}
                                        >
                                            <Text style={[optionText, hoveredIndex === index && hoveredOptionText]}>
                                                {item['Asset Name']}
                                            </Text>
                                        </TouchableOpacity>
                                ))}


                            </ScrollView>
                        )}
                    </View>
                    :
                    <View style={container}>

                        <TouchableOpacity
                            style={[dropdownStyle, dropdownSelect && dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                            onPress={() => handleDropdownToggle()}
                        >
                            <Text style={[selectedValueStyle]}>
                                {selectedValue}
                            </Text>
                            <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                            <Animated.Image
                                style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolation }], alignSelf: 'center' }}
                                source={imageSource}
                            ></Animated.Image>
                        </TouchableOpacity>
                        {showOptions && (
                            <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                {options.map((item, index) => (
                                    item == 'Logout'
                                        ?
                                        <View key={index.toString()} style={{ justifyContent: 'center', alignItems: 'center' }}>

                                            <View style={{ width: '90%', marginVertical: 10 }}>
                                                <AddBtn
                                                    title="Logout"
                                                    imgSource={require('../assets/logout_icon.png')}
                                                    btnStyle={styles.btn}
                                                    btnTextStyle={styles.btnText}
                                                    onPress={() => {
                                                        // console.log('logout')    
                                                        handleOptionSelect('Logout')
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            key={index.toString()}
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


                            </ScrollView>
                        )}
                    </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',

    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
})

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
