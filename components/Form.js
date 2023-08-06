import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, Image, Platform, Animated, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import AppBtn from './Button';
import DropDownComponent from './DropDown';

const Form = ({ columns, entriesData, row, cell, entryText, columnHeaderRow, columnHeaderCell, columnHeaderText, titleForm, onValueChange }) => {


    const [isChecked, setChecked] = useState(false);
    const [imageHovered, setImageHovered] = useState({});
    const [rowHovered, setRowHovered] = useState({});

    const [isCheckedSelected, setIsCheckedSelected] = useState(entriesData.map(() => false));
    const [selectedRows, setSelectedRows] = useState([]);
    const [data, setdata] = useState(entriesData)
    const [density, setDensity] = useState(15);
    const densityAnim = useRef(new Animated.Value(density)).current;

    const [colorAnimatePassed] = useState(new Animated.Value(0))
    const [colorAnimateFailed] = useState(new Animated.Value(0))
    const [colorAnimation, setColorAnimation] = useState(false)

    const [formRowClick, setFormRowClick] = useState([])

    const [isStatus, setStatus] = useState('')
    const [rowColor ,setRowColor] = useState([])

    const rowHoverColorAnimatePassed = (value) => {
        Animated.timing(colorAnimatePassed, {
            toValue: value,
            duration: 500,
            useNativeDriver: false
        }).start()
    }

    const rowHoverColorAnimateFailed = (value) => {
        Animated.timing(colorAnimateFailed, {
            toValue: value,
            duration: 1000,
            useNativeDriver: false
        }).start()
    }

    // useEffect(() => {
    //     if (colorAnimation == false) {
    //         rowHoverColorAnimate()
    //     }
    //     else {
    //         rowHoverColorAnimateBack()
    //     }
    // }, [colorAnimation])



    const handleMouseEnter = (column) => {
        setImageHovered(prevState => ({ ...prevState, [column]: true }));
    };

    const handleMouseLeave = (column) => {
        setImageHovered(prevState => ({ ...prevState, [column]: false }));
    };

    const handleMouseEnterGeneralInspection = (column) => {

        setRowHovered({ [column]: true });

        if (entriesData[column].Status == 'Passed') {
            Animated.parallel([
                Animated.timing(colorAnimatePassed, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimateFailed, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ]).start();
        } else if (entriesData[column].Status == 'Failed') {
            Animated.parallel([
                Animated.timing(colorAnimatePassed, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimateFailed, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    };

    const handleMouseLeaveGeneralInspection = (column) => {

        setRowHovered({ [column]: false });

        Animated.parallel([
            Animated.timing(colorAnimatePassed, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(colorAnimateFailed, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const colorInterpolatePassed = colorAnimatePassed.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', 'green'],
    });

    const colorInterpolateFailed = colorAnimateFailed.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', 'red'],
    });


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

        const filteredEntries = entriesData.filter((item, ind) => !index.includes(ind))


        // Clear the selectedRows state


        console.log(filteredEntries)

        // Update the entriesData with the filtered entries (excluding the selected rows)
        setdata(filteredEntries)
        setSelectedRows([]);
        setIsCheckedSelected(data.map(() => false))

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

    const revertRowColor = (index) => {
        setTimeout(() => {
            setFormRowClick((prevState) => prevState.filter((item) => item !== index));
        }, 1000);
    };

    const handleRowPress = (index) => {
        setFormRowClick((prevState) => [...prevState, index]);
        revertRowColor(index);
    };

    const setColors = () => {

        let newRowColor = []

        entriesData.map((data, index) => {
            const today = new Date().getTime(); // Get the current timestamp in milliseconds

            const lastInspectionDate = new Date(data['Last Inspection']).getTime(); // Convert Last Inspection date to timestamp
            const nextInspectionDate = new Date(data['Next Inspection']).getTime(); // Convert Next Inspection date to timestamp
            const timeDifferenceInMilliseconds = nextInspectionDate - today;
            const timeDifferenceInDays = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
            if (lastInspectionDate > nextInspectionDate) {
                newRowColor[index] = 'white'

            } else if (timeDifferenceInMilliseconds < 0) {
                newRowColor[index] = 'pink'

            } else if (timeDifferenceInDays <= 3) {
                newRowColor[index] = 'orange'

            } else if (timeDifferenceInDays <= 7) {

                newRowColor[index] = 'yellow'

            } else {
                newRowColor[index] = 'white'

            }
        })
        setRowColor(newRowColor)
    }

    useEffect(() => {
        setColors()
    }, [])


    if (titleForm == "General Inspection") {
        const renderRow = ({ item, index }) => {
            const colorStyle = {
                backgroundColor:
                    rowHovered[index] == true && entriesData[index].Status == 'Passed' && formRowClick.includes(index)
                        ? '#67E9DA'
                        : rowHovered[index] == true && entriesData[index].Status == 'Failed' && formRowClick.includes(index)
                            ? '#67E9DA'
                            : rowHovered[index] == true && entriesData[index].Status == 'Passed'
                                ? colorInterpolatePassed
                                : rowHovered[index] == true && entriesData[index].Status == 'Failed'
                                    ? colorInterpolateFailed
                                    : {}
            };
            return (
                <Animated.View style={[row, colorStyle]}>
                    {columns.map((column) => {
                        return (
                            item[column] == undefined ? null :

                                <Pressable key={column} style={cell}
                                    onPress={() => {
                                        handleValueChange(item)
                                        handleRowPress(index)
                                    }}
                                    onMouseEnter={() => {
                                        handleMouseEnterGeneralInspection(index)
                                    }}
                                    onMouseLeave={() => {
                                        handleMouseLeaveGeneralInspection(index)
                                    }}>
                                    {item[column] == 'Passed'
                                        ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ padding: 1 }}>
                                                <Image style={styles.formRowIcon}
                                                    source={require('../assets/completed_icon.png')}
                                                    tintColor={rowHovered[index] ? '#FFFFFF' : 'green'}></Image>
                                            </View>
                                            <Text style={[entryText, { paddingLeft: 10 }, rowHovered[index] && { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }]}>{item[column]}</Text>
                                        </View>
                                        : item[column] == 'Failed'
                                            ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ padding: 1 }}>
                                                    <Image style={styles.formRowIcon}
                                                        source={require('../assets/failed_icon.png')}
                                                        tintColor={rowHovered[index] ? '#FFFFFF' : 'red'}></Image>
                                                </View>
                                                <Text style={[entryText, { paddingLeft: 10 }, rowHovered[index] && { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }]}>{item[column]}</Text>
                                            </View>
                                            : <Text style={[entryText, { paddingLeft: 10 }, rowHovered[index] && { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }]}>{item[column]}</Text>
                                    }

                                </Pressable>
                        )
                    })}
                </Animated.View>
            );
        };
        return (

            <ScrollView horizontal>
                <View>
                    <View style={columnHeaderRow}>
                        {columns.map((column) => (

                            <View key={column} style={[columnHeaderCell, { zIndex: 2 }]}>
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

    else if (titleForm == "45 days Inspection") {
        const renderRow = ({ item, index }) => {
            const colorStyle = {
                backgroundColor:
                rowColor[index]
            };

            const showRowData = (entry) => {

            const today = new Date().getTime(); // Get the current timestamp in milliseconds
                const lastInspectionDate = new Date(entry['Last Inspection']).getTime(); // Convert Last Inspection date to timestamp
                const nextInspectionDate = new Date(entry['Next Inspection']).getTime(); // Convert Next Inspection date to timestamp
                const timeDifferenceInMilliseconds = nextInspectionDate - today;
                const timeDifferenceInDays = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));


                if (lastInspectionDate > nextInspectionDate) {
                    return (
                        <View>
                            <Text>Inspection done</Text>
                        </View>
                    )
                } else if (timeDifferenceInMilliseconds < 0) {

                    return (
                        <View>
                            <Text>Inspection due</Text>
                        </View>
                    )
                } else if (timeDifferenceInDays <= 3) {
                    return (
                        <View>
                            <Text>{timeDifferenceInDays} days left</Text>
                        </View>
                    )
                } else if (timeDifferenceInDays <= 7) {
                    return (
                        <View>
                            <Text>{timeDifferenceInDays} days left</Text>
                        </View>
                    )
                } else {
                    return (
                        <View>
                            <Text>Inspection done</Text>
                        </View>
                    )
                }
            }
                     
            return (
                <View style={[row, colorStyle]}>
                    {columns.map((column) => {
                        return (
                            item[column] == undefined ? null :

                                <Pressable key={column} style={cell}
                                    onPress={() => {
                                        handleValueChange(item)
                                        handleRowPress(index)
                                    }}>

                                    {item[column] == 'Status'
                                        ? showRowData(item)
                                            : <Text style={[entryText, { paddingLeft: 10 }, rowHovered[index] && { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }]}>{item[column]}</Text>
                                    }

                                </Pressable>
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

                            <View key={column} style={[columnHeaderCell, { zIndex: 2 }]}>
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
            const rowStyle = {
                paddingVertical: densityAnim, // Apply the padding to the entire row
            };
            return (
                <Animated.View style={[row, rowStyle]}>
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
                                            style={styles.btn}
                                            resizeMode='contain'
                                            source={require('../assets/action_icon.png')}
                                            tintColor={imageHovered[index] ? '#67E9DA' : '#1E3D5C'}
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
                                            <View style={[styles.cell,]}>
                                                <Text style={entryText}>{item[column]}</Text>
                                            </View>
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
                            imageSource={require('../assets/density_icon.png')}
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
                            <Image style={{ height: 15, width: 15, marginLeft: 10 }} source={require('../assets/export_icon.png')}></Image>
                        </TouchableOpacity>
                        {selectedRows.length > 0 && (
                            <TouchableOpacity onPress={() => { handleDelete(selectedRows) }} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: 'red' }}>Delete</Text>
                                <Image style={{ height: 20, width: 20, marginLeft: 10 }} source={require('../assets/trash_icon.png')}
                                    tintColor='red'></Image>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Animated.View style={[columnHeaderRow, { paddingVertical: densityAnim }]}>
                        {columns.map((column) => (
                            <View key={column} style={[columnHeaderCell, column == 'Name' && { minWidth: 300 }, column == 'Forms' && { minWidth: 100 }, column == 'Team Name' && { minWidth: 200 }, column == 'Last Ins.' && { minWidth: 150 }, column == 'License Plate' && { minWidth: 200 }]}>
                                <Text style={columnHeaderText}>{column}</Text>
                            </View>
                        ))}
                    </Animated.View>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRow}
                        showsHorizontalScrollIndicator={true}
                    />
                </View>



            </ScrollView>
        );
    }

    else if (titleForm == "Driver" || titleForm == 'Mechanic' || titleForm == 'Manager') {
        const renderRow = ({ item, index }) => {
            return (
                <Animated.View style={[row, { paddingVertical: 15 }]}>
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
                                            style={styles.btn}
                                            source={require('../assets/action_icon.png')}
                                            resizeMode='contain'
                                            tintColor={imageHovered[index] ? '#67E9DA' : '#1E3D5C'}
                                        />
                                    </TouchableOpacity>

                                    :
                                    <View
                                        key={column}
                                        style={[cell, column === "Name" && { minWidth: 300 }, column === "Number" && { minWidth: 150 }, column === "Email" && { minWidth: 150 }, column === "Company" && { minWidth: 150 }, column === "Role" && { minWidth: 200 }, column === "Last Inspection" && { minWidth: 200 }]}
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
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Export</Text>
                            <Image style={{ height: 15, width: 15, marginLeft: 10 }} source={require('../assets/export_icon.png')}></Image>
                        </TouchableOpacity>
                        {selectedRows.length > 0 && (
                            <TouchableOpacity onPress={() => { handleDelete(selectedRows) }} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: 'red' }}>Delete</Text>
                                <Image style={{ height: 20, width: 20, marginLeft: 10 }} source={require('../assets/trash_icon.png')}
                                    tintColor='red'></Image>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Animated.View style={[columnHeaderRow, { paddingVertical: densityAnim }]}>
                        {columns.map((column) => (
                            <View key={column} style={[columnHeaderCell, column == 'Name' && { minWidth: 300 }, column == 'Number' && { minWidth: 150 }, column == 'Email' && { minWidth: 150 }, column == 'Company' && { minWidth: 150 }, column == 'Role' && { minWidth: 200 }, column == 'Last Inspection' && { minWidth: 200 }]}>
                                <Text style={columnHeaderText}>{column}</Text>
                            </View>
                        ))}
                    </Animated.View>
                    <FlatList
                        data={data}
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
        width: 30,
        height: 30,
        marginLeft: 15,

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
    formRowIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }


})

export default Form;
