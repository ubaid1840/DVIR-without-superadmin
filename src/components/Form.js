import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, Image, Platform, Animated } from 'react-native';
import Checkbox from 'expo-checkbox';
import AppBtn from './Button';
import DropDownComponent from './DropDown';

const Form = ({ columns, entriesData, row, cell, entryText, columnHeaderRow, columnHeaderCell, columnHeaderText, titleForm, onValueChange }) => {


    const [isChecked, setChecked] = useState(false);
    const [imageHovered, setImageHovered] = useState({});
    const [isCheckedSelected, setIsCheckedSelected] = useState(entriesData.map(() => false));
    const [selectedRows, setSelectedRows] = useState([]);
  
    const [density, setDensity] = useState(15);
    const densityAnim = useRef(new Animated.Value(density)).current;


    const handleMouseEnter = (column) => {
        setImageHovered(prevState => ({ ...prevState, [column]: true }));
    };

    const handleMouseLeave = (column) => {
        setImageHovered(prevState => ({ ...prevState, [column]: false }));
    };

    const handleValueChange = (value) => {
        onValueChange(value)

    }

    const handleCheck = (value, column, index) => {
        setIsCheckedSelected(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });

        setSelectedRows((prevState) => {
            const newSelectedRows = [...prevState];
            if (prevState.includes(index)) {
                // If the row was already selected, remove it from the selectedRows
                const selectedIndex = prevState.indexOf(index);
                newSelectedRows.splice(selectedIndex, 1);
            } else {
                // If the row was not selected, add it to the selectedRows
                newSelectedRows.push(index);
            }
            return newSelectedRows;
        });
    };

    const handleDelete = (index) => {
        // Remove the selected rows from the entriesData array
        const filteredEntries = entriesData.filter((item, i) => i !== index);

        // Clear the selectedRows state
        setSelectedRows([]);

        console.log(filteredEntries)

        // Update the entriesData with the filtered entries (excluding the selected rows)
        // onValueChange(filteredEntries);
    };

    const handleDropdownValueChange = (value) => {
        if (value === "Compact") {
          setDensity(10);
        } else if (value === "Standard") {
          setDensity(15);
        } else if (value === "Comfortable") {
          setDensity(20);
        }
      };
      

      useEffect(() => {
        // Create an animation configuration
        const config = {
          toValue: density,
          duration: 500,
          useNativeDriver: false,
        };
      
        // Create the animation
        const animation = Animated.timing(densityAnim, config);
      
        // Start the animation
        animation.start();
      }, [density]);
      


    if (titleForm == "General Inspection") {
        const renderRow = ({ item }) => {
            return (
                <View style={row}>
                    {columns.map((column) => {
                        return (
                            item[column] == undefined ? null :
                                <TouchableOpacity key={column} style={cell}
                                    onPress={() => handleValueChange(item)}>
                                    <Text style={entryText}>{item[column]}</Text>
                                </TouchableOpacity>
                        )
                    })}
                </View>
            );
        };
        return (
            <ScrollView horizontal>
                <View>
                    <View style={columnHeaderRow}>
                        {columns.map((column) => (

                            <View key={column} style={columnHeaderCell}>
                                <Text style={columnHeaderText}>{column}</Text>
                            </View>
                        ))}
                        {/* <Text style={styles.columnHeaderText}>Action</Text> */}
                    </View>
                    <FlatList
                        data={entriesData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRow}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        );
    }

    else if (titleForm == "Assets") {
        const renderRow = ({ item, index }) => {
            return (
                <Animated.View style={[row, {paddingVertical:(densityAnim)}]}>
                    {columns.map((column) => {
                        return (
                            item[column] == undefined ? null :
                                column === "Action" ?

                                    <TouchableOpacity
                                        onPress={() => handleValueChange(item)}
                                        key={column}
                                        style={[cell, {}]}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={() => handleMouseLeave(index)}
                                    >
                                        <Image
                                            style={[styles.btn, imageHovered[index] && styles.btnHover]}
                                            source={require('../../assets/action_icon.png')}
                                        />
                                    </TouchableOpacity>

                                    :
                                    <View
                                        key={column}
                                        style={[cell, column === "Name" && { minWidth: 300 }, column === "Forms" && { minWidth: 100 }, column === "Team Name" && { minWidth: 200 }, column === "Last Ins." && { minWidth: 150 }, column === "License Plate" && { minWidth: 200 }]}
                                    >
                                        {column == "Name" ?
                                            <View style={styles.cell}>
                                                <View style={styles.section}>
                                                    <Checkbox
                                                        style={styles.checkbox}
                                                        value={isCheckedSelected[index]}
                                                        onValueChange={() => handleCheck(item, column, index)} // Pass the index to handleCheck function
                                                        color={isCheckedSelected[index] ? '#67E9DA' : undefined}
                                                    />
                                                    <Text style={entryText}>{item[column]}</Text>
                                                </View>
                                            </View>
                                            :
                                            <Text style={entryText}>{item[column]}</Text>
                                        }
                                    </View>
                        )
                    })}
                </Animated.View>
            );
        };
        return (
            <ScrollView horizontal>
                <View>
                    <View style={{ flexDirection: 'row', zIndex: 1, marginBottom: 20 }}>

                        <DropDownComponent
                            title="Density"
                            options={["Compact", "Standard", "Comfortable"]}
                            imageSource={require('../../assets/density_icon.png')}
                            onValueChange={handleDropdownValueChange}
                            container={styles.dropdownContainer}
                            dropdownButton={styles.dropdownButton}
                            selectedValueStyle={styles.dropdownSelectedValueStyle}
                            optionsContainer={styles.dropdownOptionsContainer}
                            option={styles.dropdownOption}
                            hoveredOption={styles.dropdownHoveredOption}
                            optionText={styles.dropdownOptionText}
                            hoveredOptionText={styles.dropdownHoveredOptionText}
                            dropdownButtonSelect={styles.dropdownButtonSelect}
                            dropdownStyle={styles.dropdown} />

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Export</Text>
                            <Image style={{ height: 15, width: 15, marginLeft: 10 }} source={require('../../assets/export_icon.png')}></Image>
                        </TouchableOpacity>
                        {selectedRows.length > 0 && (
                            <TouchableOpacity onPress={() => { handleDelete(index) }} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: 'red' }}>Delete</Text>
                                <Image style={{ height: 20, width: 20, tintColor: 'red', marginLeft: 10 }} source={require('../../assets/trash_icon.png')}></Image>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Animated.View style={[columnHeaderRow, {paddingVertical : densityAnim}]}>
                        {columns.map((column) => (
                            <View key={column} style={[columnHeaderCell, column == 'Name' && { minWidth: 300 }, column == 'Forms' && { minWidth: 100 }, column == 'Team Name' && { minWidth: 200 }, column == 'Last Ins.' && { minWidth: 150 }, column == 'License Plate' && { minWidth: 200 }]}>
                                <Text style={columnHeaderText}>{column}</Text>
                            </View>
                        ))}
                    </Animated.View>
                    <FlatList
                        data={entriesData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRow}
                        showsHorizontalScrollIndicator={true}
                    />
                </View>



            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    btn: {
        width: 25,
        height: 25,
        marginLeft: 15,
        tintColor: '#1E3D5C',
    },
    btnHover: {
        tintColor: '#67E9DA'
    },
    container: {
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 32,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        margin: 8,
    },
    deleteButton: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginVertical: 10,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
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
    dropdownSelectedValueStyle: {
        fontSize: 16,
    },
    dropdownOptionsContainer: {
        position: 'absolute',
        top: '100%',
        right: 0,
        left: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 10,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web
            },
        }),
        minWidth: 150
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
    dropdownButtonSelect: {
        // borderColor: '#558BC1',
        // shadowColor: '#558BC1',
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 1,
        // shadowRadius: 10,
        // elevation: 0,
    }

})

export default Form;
