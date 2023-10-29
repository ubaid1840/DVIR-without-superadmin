import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Animated, ScrollView } from 'react-native';
import AddBtn from './Button';
import { v4 as uuidv4 } from 'uuid';
import { Link, useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { HeaderOptionContext } from '../src/store/context/HeaderOptionContext'
import { AssetOptionContext } from '../src/store/context/AssetOptionContext'
import { MechanicOptionContext } from '../src/store/context/MechanicOptionContext'
import { PriorityOptionContext } from '../src/store/context/PriorityOptionContext'
import { SeverityOptionContext } from '../src/store/context/SeverityOptionContext'
import { SearchOptionContext } from '../src/store/context/SearchOptionContext'
import { CloseAllDropDowns } from './CloseAllDropdown';
import { ADAOptionContext } from '../src/store/context/ADAOptionContext';
import { EngineTypeOptionContext } from '../src/store/context/EngineTypeOptionContext';
import { AirBrakesOptionContext } from '../src/store/context/AirBrakesOptionContext';
import { AssetTypeOptionContext } from '../src/store/context/AssetTypeOptionContext';
import { DatePickerContext } from '../src/store/context/DatePickerContext';
import { TabHeadContext } from '../src/store/context/TabHeadContext'
import { TabSubHeadContext } from '../src/store/context/TabSubHeadContext'
import {TabHeadOptionContext} from '../src/store/context/TabHeadOptionContext'

const DropDownComponent = (props) => {

    const { options, onValueChange, title, imageSource, selectedValue, container, dropdownButton, selectedValueStyle, optionsContainer, option, hoveredOption, optionText, hoveredOptionText, dropdownButtonSelect, dropdownStyle, info, onMechanicSelection, onAssetSelection } = props


    const [showOptions, setShowOptions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [arrowAnimate] = useState(new Animated.Value(0));
    const [arrowAnimateMechanic] = useState(new Animated.Value(0));
    const [arrowAnimateAsset] = useState(new Animated.Value(0));
    const [arrowAnimatePriority] = useState(new Animated.Value(0));
    const [arrowAnimateSeverity] = useState(new Animated.Value(0));
    const [arrowAnimateSearch] = useState(new Animated.Value(0));
    const [arrowAnimateHeader] = useState(new Animated.Value(0));

    const [arrowAnimateAssetType] = useState(new Animated.Value(0));
    const [arrowAnimateEngineType] = useState(new Animated.Value(0));
    const [arrowAnimateADA] = useState(new Animated.Value(0));
    const [arrowAnimateAirBrakes] = useState(new Animated.Value(0));

    const [arrowAnimateTabHead] = useState(new Animated.Value(0));
    const [arrowAnimateTabSubHead] = useState(new Animated.Value(0));
    const [arrowAnimateTabHeadOption] = useState(new Animated.Value(0));

    const [dropdownSelect, setDropdownSelect] = useState(false)

    const { state: headerOptionState, setHeaderOption } = useContext(HeaderOptionContext)
    const { state: assetOptionState, setAssetOption } = useContext(AssetOptionContext)
    const { state: mechanicOptionState, setMechanicOption } = useContext(MechanicOptionContext)
    const { state: priorityOptionState, setPriorityOption } = useContext(PriorityOptionContext)
    const { state: severityOptionState, setSeverityOption } = useContext(SeverityOptionContext)
    const { state: searchOptionState, setSearchOption } = useContext(SearchOptionContext)

    const { state: ADAOptionState, setADAOption } = useContext(ADAOptionContext)
    const { state: engineTypeOptionState, setEngineTypeOption } = useContext(EngineTypeOptionContext)
    const { state: airBrakesOptionState, setAirBrakesOption } = useContext(AirBrakesOptionContext)
    const { state: assetTypeOptionState, setAssetTypeOption } = useContext(AssetTypeOptionContext)

    const { state: datePickerState, setDatePicker } = useContext(DatePickerContext)

    const { state: tabHeadState, setTabHead } = useContext(TabHeadContext)
    const { state: tabSubHeadState, setTabSubHead } = useContext(TabSubHeadContext)
    const {state : tabHeadOptionState, setTabHeadOption} = useContext(TabHeadOptionContext)



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

    const animationAsset = () => {
        Animated.timing(arrowAnimateAsset, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationAssetBAck = () => {
        Animated.timing(arrowAnimateAsset, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationMechanic = () => {
        Animated.timing(arrowAnimateMechanic, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationMechanicBAck = () => {
        Animated.timing(arrowAnimateMechanic, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationSeverity = () => {
        Animated.timing(arrowAnimateSeverity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationSeverityBAck = () => {
        Animated.timing(arrowAnimateSeverity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationPriority = () => {
        Animated.timing(arrowAnimatePriority, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationPriorityBAck = () => {
        Animated.timing(arrowAnimatePriority, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationSearch = () => {
        Animated.timing(arrowAnimateSearch, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationSearchBAck = () => {
        Animated.timing(arrowAnimateSearch, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationHeader = () => {
        Animated.timing(arrowAnimateHeader, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationHeaderBAck = () => {
        Animated.timing(arrowAnimateHeader, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationAirBrakes = () => {
        Animated.timing(arrowAnimateAirBrakes, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationAirBrakesBAck = () => {
        Animated.timing(arrowAnimateAirBrakes, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationAssetType = () => {
        Animated.timing(arrowAnimateAssetType, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationAssetTypeBAck = () => {
        Animated.timing(arrowAnimateAssetType, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationEngineType = () => {
        Animated.timing(arrowAnimateEngineType, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationEngineTypeBAck = () => {
        Animated.timing(arrowAnimateEngineType, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationADA = () => {
        Animated.timing(arrowAnimateADA, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationADABAck = () => {
        Animated.timing(arrowAnimateADA, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationTabHead = () => {
        Animated.timing(arrowAnimateTabHead, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationTabHeadBack = () => {
        Animated.timing(arrowAnimateTabHead, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationTabSubHead = () => {
        Animated.timing(arrowAnimateTabSubHead, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationTabSubHeadBack = () => {
        Animated.timing(arrowAnimateTabSubHead, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationTabHeadOption = () => {
        Animated.timing(arrowAnimateTabHeadOption, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const animationTabHeadOptionBack = () => {
        Animated.timing(arrowAnimateTabHeadOption, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const handleDropdownToggle = () => {
        if (info == 'mechanicSelection') {
            setMechanicOption(!mechanicOptionState.value.data)
            setDropdownSelect(!dropdownSelect)
        }
        if (info == 'assetSelection') {
            setAssetOption(!assetOptionState.value.data)
            setDropdownSelect(!dropdownSelect)
        }
        if (info == 'prioritySelection') {
            setPriorityOption(!priorityOptionState.value.data)

        }
        if (info == 'severitySelection') {
            setSeverityOption(!severityOptionState.value.data)

        }
        if (info == 'headerSelection') {

            setHeaderOption(!headerOptionState.value.data)
        }
        if (info == 'searchSelection') {

            setSearchOption(!searchOptionState.value.data)
        }

        if (info == 'airBrakesSelection') {

            setAirBrakesOption(!airBrakesOptionState.value.data)
        }

        if (info == 'assetTypeSelection') {
            setAssetTypeOption(!assetTypeOptionState.value.data)
        }

        if (info == 'ADASelection') {

            setADAOption(!ADAOptionState.value.data)
        }

        if (info == 'engineTypeSelection') {
            setEngineTypeOption(!engineTypeOptionState.value.data)
        }

        if (info == 'tabHeadSelection') {
            setTabHead(!tabHeadState.value.data)
        }

        if (info == 'tabSubHeadSelection') {
            setTabSubHead(!tabSubHeadState.value.data)
        }

        if (info == 'tabHeadOptionSelection') {
            setTabHeadOption(!tabHeadOptionState.value.data)
        }

    };

    const handleCloseDropdown = () => {
        setShowOptions(false);
    };

    useEffect(() => {
        if (mechanicOptionState.value.data == false) {
            animationMechanic();
        } else {
            animationMechanicBAck();
        }

    }, [mechanicOptionState.value.data,]);

    useEffect(() => {
        if (assetOptionState.value.data == false) {
            animationAsset();
        } else {
            animationAssetBAck();
        }
    }, [assetOptionState.value.data])

    useEffect(() => {
        if (severityOptionState.value.data == false) {
            animationSeverity();
        } else {
            animationSeverityBAck();
        }
    }, [severityOptionState.value.data])

    useEffect(() => {
        if (priorityOptionState.value.data == false) {
            animationPriority();
        } else {
            animationPriorityBAck();
        }
    }, [priorityOptionState.value.data])

    useEffect(() => {
        if (searchOptionState.value.data == false) {
            animationSearch();
        } else {
            animationSearchBAck();
        }
    }, [searchOptionState.value.data])

    useEffect(() => {
        if (headerOptionState.value.data == false) {
            animationHeader();
        } else {
            animationHeaderBAck();
        }
    }, [headerOptionState.value.data])

    useEffect(() => {
        if (airBrakesOptionState.value.data == false) {
            animationAirBrakes();
        } else {
            animationAirBrakesBAck();
        }
    }, [airBrakesOptionState.value.data])

    useEffect(() => {
        if (engineTypeOptionState.value.data == false) {
            animationEngineType();
        } else {
            animationEngineTypeBAck();
        }
    }, [engineTypeOptionState.value.data])

    useEffect(() => {
        if (assetTypeOptionState.value.data == false) {
            animationAssetType();
        } else {
            animationAssetTypeBAck();
        }
    }, [assetTypeOptionState.value.data])

    useEffect(() => {
        if (ADAOptionState.value.data == false) {
            animationADA();
        } else {
            animationADABAck();
        }
    }, [ADAOptionState.value.data])

    useEffect(() => {
        if (tabHeadState.value.data == false) {
            animationTabHead();
        } else {
            animationTabHeadBack();
        }
    }, [tabHeadState.value.data])

    useEffect(() => {
        if (tabSubHeadState.value.data == false) {
            animationTabSubHead();
        } else {
            animationTabSubHeadBack();
        }
    }, [tabSubHeadState.value.data])

    useEffect(() => {
        if (tabHeadOptionState.value.data == false) {
            animationTabHeadOption();
        } else {
            animationTabHeadOptionBack();
        }
    }, [tabHeadOptionState.value.data])


    const rotateInterpolation = arrowAnimate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationAsset = arrowAnimateAsset.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationMechanic = arrowAnimateMechanic.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationSeverity = arrowAnimateSeverity.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationPriority = arrowAnimatePriority.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationSearch = arrowAnimateSearch.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationHeader = arrowAnimateHeader.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationAssetType = arrowAnimateAssetType.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationAirBrakes = arrowAnimateAirBrakes.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationEngineType = arrowAnimateEngineType.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationADA = arrowAnimateADA.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationTabHead = arrowAnimateTabHead.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationTabSubHead = arrowAnimateTabSubHead.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const rotateInterpolationTabHeadOption = arrowAnimateTabHeadOption.interpolate({
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

    const handleOptionSelect = (value) => {
        // console.log(value)
        onValueChange(value);
        handleDropdownToggle();
        handleOptionHover(-1);
    };

    const handleOptionHover = (index) => {
        setHoveredIndex(index);
    };

    const handleHeaderOptionSelect = (value) => {

    }

    const handleSearchOptionSelect = (value) => {

    }

    const handlePriorityOptionSelect = (value) => {

    }

    const handleSeverityOptionSelect = (value) => {

    }

    const handleMechanicOptionSelect = (value) => {

    }

    const handleAssetOptionSelect = (value) => {

    }

    return (
        <>
            {info == 'mobile'
                ?
                <View style={container}>

                    <TouchableOpacity
                        style={[dropdownStyle, { width: 100, height: 40 }, { flexDirection: 'row', justifyContent: 'space-between' }]}
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
                            style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                            onPress={() => {
                                CloseAllDropDowns()
                                handleDropdownToggle()
                            }}
                        >
                            <Text style={[selectedValueStyle]}>
                                {selectedValue}
                            </Text>
                            <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                            <Animated.Image
                                style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationMechanic }], alignSelf: 'center' }}
                                source={imageSource}
                            ></Animated.Image>
                        </TouchableOpacity>
                        {mechanicOptionState.value.data && (
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
                                style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                onPress={() => {
                                    CloseAllDropDowns()
                                    handleDropdownToggle()
                                }}
                            >
                                <Text style={[selectedValueStyle]}>
                                    {selectedValue}
                                </Text>
                                <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                <Animated.Image
                                    style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationAsset }], alignSelf: 'center' }}
                                    source={imageSource}
                                ></Animated.Image>
                            </TouchableOpacity>
                            {assetOptionState.value.data && (
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
                        info == 'prioritySelection'
                            ?
                            <View style={container}>

                                <TouchableOpacity
                                    style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                    onPress={() => {
                                        CloseAllDropDowns()
                                        handleDropdownToggle()
                                    }}
                                >
                                    <Text style={[selectedValueStyle]}>
                                        {selectedValue}
                                    </Text>
                                    <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                    <Animated.Image
                                        style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationPriority }], alignSelf: 'center' }}
                                        source={imageSource}
                                    ></Animated.Image>
                                </TouchableOpacity>
                                {priorityOptionState.value.data && (
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
                            :
                            info == 'severitySelection'
                                ?
                                <View style={container}>

                                    <TouchableOpacity
                                        style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                        onPress={() => {
                                            CloseAllDropDowns()
                                            handleDropdownToggle()
                                        }}
                                    >
                                        <Text style={[selectedValueStyle]}>
                                            {selectedValue}
                                        </Text>
                                        <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                        <Animated.Image
                                            style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationSeverity }], alignSelf: 'center' }}
                                            source={imageSource}
                                        ></Animated.Image>
                                    </TouchableOpacity>
                                    {severityOptionState.value.data && (
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
                                :
                                info == 'headerSelection'
                                    ?
                                    <View style={container}>

                                        <TouchableOpacity
                                            style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                            onPress={() => {
                                                CloseAllDropDowns()
                                                handleDropdownToggle()
                                            }}
                                        >
                                            <Text style={[selectedValueStyle]}>
                                                {selectedValue}
                                            </Text>
                                            <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                            <Animated.Image
                                                style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationHeader }], alignSelf: 'center' }}
                                                source={imageSource}
                                            ></Animated.Image>
                                        </TouchableOpacity>
                                        {headerOptionState.value.data && (
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
                                    :
                                    info == 'searchSelection'
                                        ?
                                        <View style={container}>

                                            <TouchableOpacity
                                                style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                onPress={() => {
                                                    CloseAllDropDowns()
                                                    handleDropdownToggle()
                                                }}
                                            >
                                                <Text style={[selectedValueStyle]}>
                                                    {selectedValue}
                                                </Text>
                                                <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                <Animated.Image
                                                    style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationSearch }], alignSelf: 'center' }}
                                                    source={imageSource}
                                                ></Animated.Image>
                                            </TouchableOpacity>

                                            {searchOptionState.value.data && (
                                                <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                    {options.map((item, index) => (

                                                        <TouchableOpacity
                                                            key={index.toString()}
                                                            style={[
                                                                option,
                                                                hoveredIndex === index && hoveredOption, // Apply the hoveredOption style conditionally
                                                            ]}
                                                            onPress={() => {
                                                                console.log('1')
                                                                console.log(item)
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
                                        :
                                        info == 'airBrakesSelection'
                                            ?
                                            <View style={container}>

                                                <TouchableOpacity
                                                    style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                    onPress={() => {
                                                        CloseAllDropDowns()
                                                        handleDropdownToggle()
                                                    }}
                                                >
                                                    <Text style={[selectedValueStyle]}>
                                                        {selectedValue}
                                                    </Text>
                                                    <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                    <Animated.Image
                                                        style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationAirBrakes }], alignSelf: 'center' }}
                                                        source={imageSource}
                                                    ></Animated.Image>
                                                </TouchableOpacity>

                                                {airBrakesOptionState.value.data && (
                                                    <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                        {options.map((item, index) => (

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
                                            :
                                            info == 'assetTypeSelection'
                                                ?
                                                <View style={container}>

                                                    <TouchableOpacity
                                                        style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                        onPress={() => {
                                                            CloseAllDropDowns()
                                                            handleDropdownToggle()
                                                        }}
                                                    >
                                                        <Text style={[selectedValueStyle]}>
                                                            {selectedValue}
                                                        </Text>
                                                        <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                        <Animated.Image
                                                            style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationAssetType }], alignSelf: 'center' }}
                                                            source={imageSource}
                                                        ></Animated.Image>
                                                    </TouchableOpacity>

                                                    {assetTypeOptionState.value.data && (
                                                        <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                            {options.map((item, index) => (

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
                                                :
                                                info == 'ADASelection'
                                                    ?
                                                    <View style={container}>

                                                        <TouchableOpacity
                                                            style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                            onPress={() => {
                                                                CloseAllDropDowns()
                                                                handleDropdownToggle()
                                                            }}
                                                        >
                                                            <Text style={[selectedValueStyle]}>
                                                                {selectedValue}
                                                            </Text>
                                                            <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                            <Animated.Image
                                                                style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationADA }], alignSelf: 'center' }}
                                                                source={imageSource}
                                                            ></Animated.Image>
                                                        </TouchableOpacity>

                                                        {ADAOptionState.value.data && (
                                                            <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                                {options.map((item, index) => (

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
                                                    :
                                                    info == 'engineTypeSelection'
                                                        ?
                                                        <View style={container}>

                                                            <TouchableOpacity
                                                                style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                                onPress={() => {
                                                                    CloseAllDropDowns()
                                                                    handleDropdownToggle()
                                                                }}
                                                            >
                                                                <Text style={[selectedValueStyle]}>
                                                                    {selectedValue}
                                                                </Text>
                                                                <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                                <Animated.Image
                                                                    style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationEngineType }], alignSelf: 'center' }}
                                                                    source={imageSource}
                                                                ></Animated.Image>
                                                            </TouchableOpacity>

                                                            {engineTypeOptionState.value.data && (
                                                                <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                                    {options.map((item, index) => (

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
                                                        :
                                                        info == 'tabHeadSelection'
                                                            ?
                                                            <View style={container}>

                                                                <TouchableOpacity
                                                                    style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                                    onPress={() => {
                                                                        CloseAllDropDowns()
                                                                        handleDropdownToggle()
                                                                    }}
                                                                >
                                                                    <Text style={[selectedValueStyle]}>
                                                                        {selectedValue}
                                                                    </Text>
                                                                    <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                                    <Animated.Image
                                                                        style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationTabHead }], alignSelf: 'center' }}
                                                                        source={imageSource}
                                                                    ></Animated.Image>
                                                                </TouchableOpacity>

                                                                {tabHeadState.value.data && (
                                                                    <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                                        {options.map((item, index) => (

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
                                                            :
                                                            info == 'tabSubHeadSelection'
                                                                ?
                                                                <View style={container}>

                                                                    <TouchableOpacity
                                                                        style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                                        onPress={() => {
                                                                            CloseAllDropDowns()
                                                                            handleDropdownToggle()
                                                                        }}
                                                                    >
                                                                        <Text style={[selectedValueStyle]}>
                                                                            {selectedValue}
                                                                        </Text>
                                                                        <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                                        <Animated.Image
                                                                            style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationTabSubHead }], alignSelf: 'center' }}
                                                                            source={imageSource}
                                                                        ></Animated.Image>
                                                                    </TouchableOpacity>

                                                                    {tabSubHeadState.value.data && (
                                                                        <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>

                                                                            {options.map((item, index) => (

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
                                                                :
                                                                info == 'tabHeadOptionSelection'
                                                                ?
                                                                <View style={container}>
    
                                                                    <TouchableOpacity
                                                                        style={[dropdownStyle, { flexDirection: 'row', justifyContent: 'space-between' }]}
                                                                        onPress={() => {
                                                                            CloseAllDropDowns()
                                                                            handleDropdownToggle()
                                                                        }}
                                                                    >
                                                                        <Text style={[selectedValueStyle]}>
                                                                            {selectedValue}
                                                                        </Text>
                                                                        <Text style={{ fontSize: 15, fontFamily: 'inter-semibold', color: '#5B5B5B' }}>{title}</Text>
                                                                        <Animated.Image
                                                                            style={{ marginLeft: 10, width: 20, height: 20, transform: [{ rotate: rotateInterpolationTabHeadOption }], alignSelf: 'center' }}
                                                                            source={imageSource}
                                                                        ></Animated.Image>
                                                                    </TouchableOpacity>
    
                                                                    {tabHeadOptionState.value.data && (
                                                                        <ScrollView style={[optionsContainer, { right: 20, maxHeight: 150 }]}>
    
                                                                            {options.map((item, index) => (
    
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
                                                                :
                                                                null
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
