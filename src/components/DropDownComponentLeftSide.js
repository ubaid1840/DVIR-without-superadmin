import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';

const CustomDropdownLeftSide = ({ options, selectedValue, onValueChange, dropdownStyle, textStyle }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [dropdownSelect, setDropdownSelect] = useState(false)

    const handleDropdownToggle = () => {
        setShowOptions(!showOptions);
        setDropdownSelect(!dropdownSelect)
    };

    const handleOptionSelect = (value) => {
        setShowOptions(false);
        onValueChange(value);
        setDropdownSelect(!dropdownSelect)
    };

    const handleOptionHover = (index) => {
        setHoveredIndex(index);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[dropdownStyle, dropdownSelect && styles.dropdownButtonSelect, { flexDirection: 'row', justifyContent: 'space-between' }]}
                onPress={handleDropdownToggle}
            >
                <Text style={[styles.selectedValue, textStyle]}>
                    {selectedValue}
                </Text>
                <Image style={{ width: 20, height: 20 }} source={require(showOptions ? '../../assets/up_arrow_icon.png' : '../../assets/down_arrow_icon.png')}></Image>
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
        left: 0,
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
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,
    }
});

export default CustomDropdownLeftSide;
