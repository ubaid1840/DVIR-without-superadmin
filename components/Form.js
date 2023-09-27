import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, Image, Platform, Animated, Pressable, Dimensions, Modal, ActivityIndicator, Switch } from 'react-native';
import Checkbox from 'expo-checkbox';
import AppBtn from './Button';
import DropDownComponent from './DropDown';
import { CSVLink } from 'react-csv';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AppModal from './Modal';
import { Firestore, deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../src/config/firebase';
import { AssetContext } from '../src/store/context/AssetContext';
import { PeopleContext } from '../src/store/context/PeopleContext';
import { AuthContext } from '../src/store/context/AuthContext';
import { getAuth } from 'firebase/auth';

const Form = ({ columns, entriesData, row, cell, entryText, columnHeaderRow, columnHeaderCell, columnHeaderText, titleForm, onValueChange, onOpenWorkOrder, inHouseValueChange, onHandleAssetStatus, onFormSortDateCreated, onFormSortDueDate }) => {

    const priorityOptionList = ['High', 'Medium', 'Low', 'Undefined'];
    const severityOptionList = ['Non critical', 'Critical', 'Undefined'];

    const { width, height } = Dimensions.get('window')
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
    const [rowColor, setRowColor] = useState([])
    const entriesPerPage = 10; // Number of entries to display per page
    const [currentPage, setCurrentPage] = useState(1);

    const [prioritySelectedOption, setPrioritySelectedOption] = useState('Undefined')
    const [priorityModalVisible, setPriorityModalVisible] = useState(false)
    const [priorityIndex, setPriorityIndex] = useState(0)

    const [severityModalVisible, setSeverityModalVisible] = useState(false)
    const [severityIndex, setSeverityIndex] = useState(0)

    const [priorityHovered, setPriorityHovered] = useState({})
    const [severityHovered, setSeverityHovered] = useState({})

    const [loading, setLoading] = useState(false)
    const { state: assetState } = useContext(AssetContext)

    const { state: peopleState } = useContext(PeopleContext)
    const { state: authState } = useContext(AuthContext)

    const [tooltipVisible, setTooltipVisible] = useState({});
    const [tooltipText, setTooltipText] = useState('');

    // const [receivedPriorityData, setReceivedPriorityData] = useState('');
    // const [receivedSeverityData, setReceivedSeverityData] = useState('');



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

        if (entriesData[column].formStatus == 'Passed') {
            Animated.parallel([
                Animated.timing(colorAnimatePassed, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                // Animated.timing(colorAnimateFailed, {
                //     toValue: 0,
                //     duration: 500,
                //     useNativeDriver: false,
                // }),
            ]).start();
        } else if (entriesData[column].formStatus == 'Failed') {
            Animated.parallel([
                // Animated.timing(colorAnimatePassed, {
                //     toValue: 0,
                //     duration: 500,
                //     useNativeDriver: false,
                // }),
                Animated.timing(colorAnimateFailed, {
                    toValue: 1,
                    duration: 200,
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
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(colorAnimateFailed, {
                toValue: 0,
                duration: 200,
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

    const openWorkOrder = (value) => {
        onOpenWorkOrder(value)
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

    const handleDelete = async (index) => {

        const db = getFirestore(app)

        // const filteredEntries = entriesData.filter((item, ind) => !index.includes(ind))


        // // Clear the selectedRows state

        // console.log(index)
        // console.log(filteredEntries)
        // console.log(entriesData[index].Email)
        // // await deleteDoc(doc(db, "DVIR", "DC"));

        // // Update the entriesData with the filtered entries (excluding the selected rows)
        // // setdata(filteredEntries)
        // setSelectedRows([]);
        // setIsCheckedSelected(data.map(() => false))

        await deleteDoc(doc(db, "DVIR", entriesData[index].Email));
        console.log('item deleted')

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

    const handleAssetStatus = (item) => {
        onHandleAssetStatus(item)
    }


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
            const last = data.lastInspection.seconds * 1000 // Convert Last Inspection date to timestamp
            const next = data.nextInspection; // Convert Next Inspection date to timestamp
            // console.log(lastInspectionDate, nextInspectionDate)
            const timeDifferenceInMilliseconds = next - today;
            const timeDifferenceInDays = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));


            if (last > next) {
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
        if (titleForm == '45 days Inspection')
            setColors()
    }, [])

    const handlePriorityValueChange = (value) => {
        setPrioritySelectedOption(value);
    };

    const closePriorityModal = () => {
        setPriorityModalVisible(false)
    }

    const closeSeverityModal = () => {
        setSeverityModalVisible(false)
    }

    const handleReceivedPriorityData = (data) => {
        entriesData[priorityIndex].Priority = data
    };

    const handleReceivedSeverityData = (data) => {
        entriesData[severityIndex].Severity = data
    };


    if (titleForm == "General Inspection") {

        entriesData.sort((a, b) => b.TimeStamp - a.TimeStamp)

        const totalPages = Math.ceil(entriesData.length / entriesPerPage);

        const goToPage = (pageNumber) => {
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber);
            }
        };

        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const visibleEntries = entriesData.slice(startIndex, endIndex);

        const renderRow = ({ item, index }) => {

            // const itemIndex = startIndex + index; // Adjusted calculation


            const colorStyle = {
                backgroundColor:
                    rowHovered[index] == true && entriesData[index].formStatus == 'Passed' && formRowClick.includes(index)
                        ? '#67E9DA'
                        : rowHovered[index] == true && entriesData[index].formStatus == 'Failed' && formRowClick.includes(index)
                            ? '#67E9DA'
                            : rowHovered[index] == true && entriesData[index].formStatus == 'Passed'
                                ? colorInterpolatePassed
                                : rowHovered[index] == true && entriesData[index].formStatus == 'Failed'
                                    ? colorInterpolateFailed
                                    : {}
            };

            return (
                <Animated.View style={[row, colorStyle]}>
                    {columns.map((column) => {
                        let formattedDateTime
                        if (column == 'TimeStamp') {
                            const date = new Date(item[column].seconds * 1000);

                            // Format the date as AM/PM time
                            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                            // Format the date as "Mon DD, YYYY" (e.g., "Jan 01, 2020")
                            const options = { year: 'numeric', month: 'short', day: '2-digit' };
                            const formattedDate = date.toLocaleDateString([], options);

                            // Combine the formatted date and time
                            formattedDateTime = `${formattedDate} ${formattedTime}`;
                        }
                        return (

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
                                {
                                    column == 'id'
                                        ?
                                        <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>#{item[column]}</Text>
                                        :
                                        column == 'assetName'
                                            ?
                                            <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{assetState.value.data.find(asset => asset["Asset Number"].toString() === item.assetNumber)?.['Asset Name'] || 'Unknown Asset'}</Text>
                                            :
                                            column == 'driverName'
                                                ?
                                                <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{peopleState.value.data.filter(d => d.Designation === 'Driver').find(driver => driver["Employee Number"].toString() === item.driverEmployeeNumber)?.Name || 'Unknown Driver'}</Text>
                                                :
                                                column == 'TimeStamp'
                                                    ?
                                                    <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{formattedDateTime}</Text>
                                                    // null
                                                    :
                                                    column == 'Company name' ?
                                                        <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>Octa Soft</Text>
                                                        :
                                                        column == 'Form name'
                                                            ?
                                                            <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>eDVIR</Text>
                                                            :
                                                            item[column] == 'Passed'
                                                                ? <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                                    <View style={{ padding: 1 }}>
                                                                        <Image style={styles.formRowIcon}
                                                                            source={require('../assets/completed_icon.png')}
                                                                            tintColor={rowHovered[index] ? '#FFFFFF' : 'green'}
                                                                            resizeMode='contain'></Image>
                                                                    </View>
                                                                    <Text style={[entryText, { paddingLeft: 10 }, rowHovered[index] && { color: '#FFFFFF' }]}>{item[column]}</Text>
                                                                </View>
                                                                : item[column] == 'Failed'
                                                                    ? <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                                                        <View style={{ padding: 1 }}>
                                                                            <Image style={styles.formRowIcon}
                                                                                source={require('../assets/failed_icon.png')}
                                                                                tintColor={rowHovered[index] ? '#FFFFFF' : 'red'}
                                                                                resizeMode='contain'></Image>
                                                                        </View>
                                                                        <Text style={[entryText, { paddingLeft: 10 }, rowHovered[index] && { color: '#FFFFFF', }]}>{item[column]}</Text>
                                                                    </View>
                                                                    : null
                                }

                            </Pressable>
                        )
                    })}
                </Animated.View>
            );
        };
        return (
            <>

                <ScrollView style={{ flex: 1, }} horizontal
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ width: '100%' }}>
                        <View style={[columnHeaderRow]}>
                            {columns.map((column) => (

                                <View key={column} style={[columnHeaderCell, {}]}>
                                    <Text style={columnHeaderText}>{column == 'formStatus' ? 'Status' : column == 'id' ? 'Inspection ID' : column == 'TimeStamp' ? 'Date Inspected' : column == 'assetName' ? 'Asset name' : column == 'driverName' ? 'Driver name' : column}</Text>
                                </View>
                            ))}

                        </View>
                        <FlatList
                            data={visibleEntries}
                            keyExtractor={(_, index) => `${startIndex + index}`}
                            renderItem={renderRow}
                            showsHorizontalScrollIndicator={true}
                            style={{ height: 630, paddingVertical: 5 }}
                        />
                        {/* Pagination */}
                    </View>

                </ScrollView>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Image style={{ height: 20, width: 20 }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>

                    <Text style={{ paddingHorizontal: 20 }}>{`Page ${currentPage} of ${Math.ceil(
                        entriesData.length / entriesPerPage
                    )}`}</Text>

                    <TouchableOpacity
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(entriesData.length / entriesPerPage)}>
                        <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }] }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>
                </View>

            </>

        );
    }

    else if (titleForm == "45 days Inspection") {

        entriesData.sort((a, b) => b.TimeStamp - a.TimeStamp)

        const totalPages = Math.ceil(entriesData.length / entriesPerPage);

        const goToPage = (pageNumber) => {
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber);
            }
        };

        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const visibleEntries = entriesData.slice(startIndex, endIndex);

        const handleInHouseWO = (item) => {
            inHouseValueChange(item)
        }

        const renderRow = ({ item, index }) => {
            const showRowData = (entry) => {

                // console.log(entry.nextInspection - entry.lastInspection)

                // console.log(entry)

                const today = new Date().getTime(); // Get the current timestamp in milliseconds
                const last = entry.lastInspection.seconds * 1000 // Convert Last Inspection date to timestamp
                const next = entry.nextInspection; // Convert Next Inspection date to timestamp
                // console.log(lastInspectionDate, nextInspectionDate)
                const timeDifferenceInMilliseconds = next - today;
                const timeDifferenceInDays = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
                // console.log(today, next)
                // console.log(next)


                if (last > next) {
                    return (
                        <View>
                            <Text style={[entryText, { marginLeft: 3 }]}>Inspection done</Text>
                        </View>
                    )
                } else if (timeDifferenceInMilliseconds < 0) {
                    return (

                        <View>
                            <Text style={[entryText, { marginLeft: 3 }]}>Inspection due</Text>
                        </View>
                    )
                } else if (timeDifferenceInDays <= 3) {
                    return (
                        <View>
                            <Text style={[entryText, { marginLeft: 3 }]}>{timeDifferenceInDays} days left</Text>
                        </View>
                    )
                } else if (timeDifferenceInDays <= 7) {
                    return (

                        <View>
                            <Text style={[entryText, { marginLeft: 3 }]}>{timeDifferenceInDays} days left</Text>
                        </View>
                    )
                } else {

                    return (
                        <View>
                            <Text style={[entryText, { marginLeft: 5 }]}>Inspection done</Text>
                        </View>
                    )
                }

                // console.log(entry.nextInspection)
            }

            return (
                <Animated.View style={[row, { backgroundColor: rowColor[index] }]}>
                    {columns.map((column) => {
                        let formattedDateTime
                        if (column == 'lastInspection' || column == 'nextInspection') {
                            const date = new Date(column == 'lastInspection' ? item[column].seconds * 1000 : item[column]);

                            // Format the date as AM/PM time
                            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                            // Format the date as "Mon DD, YYYY" (e.g., "Jan 01, 2020")
                            const options = { year: 'numeric', month: 'short', day: '2-digit' };
                            const formattedDate = date.toLocaleDateString([], options);

                            // Combine the formatted date and time
                            formattedDateTime = `${formattedDate}`;
                        }
                        return (

                            <View key={column} style={cell}
                            >
                                {
                                    column == 'lastInspection' || column == 'nextInspection'
                                        ?
                                        <Text style={[entryText,]}>{formattedDateTime}</Text>
                                        :
                                        column == 'Action'
                                            ?
                                            item.inhouseInspection == 'not issued'
                                                ?
                                                <View style={{ maxWidth: 100 }}>
                                                    <AppBtn
                                                        title="Create WO"
                                                        btnStyle={[{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#8C8C8C', height: 40, width: '100%', justifyContent: 'center', alignItems: 'center' }]}
                                                        btnTextStyle={[styles.btnText, { color: '#000000', fontFamily: 'inter-regular', fontSize: 13 }]}
                                                        onPress={() => {
                                                            handleValueChange(item)
                                                        }} />
                                                </View>

                                                :
                                                <TouchableOpacity onPress={() => { handleInHouseWO(item) }}>
                                                    <Text style={[entryText, { color: '#67E9DA', fontFamily: 'inter-regular', fontSize: 13 }]}>WO-{item.inhouseInspection}</Text>
                                                </TouchableOpacity>
                                            :
                                            column == 'status'
                                                ?
                                                showRowData(item)
                                                :
                                                <Text style={[entryText,]}>{item[column]}</Text>
                                }

                            </View>
                        )
                    })}
                </Animated.View>
            );
        };
        return (
            <>

                <ScrollView style={{ flex: 1, }} horizontal
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ width: '100%' }}>
                        <View style={columnHeaderRow}>
                            {columns.map((column) => (

                                <View key={column} style={[columnHeaderCell, { zIndex: 2 }]}>
                                    <Text style={columnHeaderText}>{column == 'lastInspection' ? 'Last Inspection' : column == 'nextInspection' ? 'Next Inspection' : column == 'status' ? 'Status' : column}</Text>
                                </View>
                            ))}
                            {/* <Text style={styles.columnHeaderText}>Action</Text> */}
                        </View>
                        <FlatList
                            data={visibleEntries}
                            keyExtractor={(_, index) => `${startIndex + index}`}
                            renderItem={renderRow}
                            showsHorizontalScrollIndicator={false}
                        />
                        {/* Pagination */}
                    </View>

                </ScrollView>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Image style={{ height: 20, width: 20 }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>

                    <Text style={{ paddingHorizontal: 20 }}>{`Page ${currentPage} of ${Math.ceil(
                        entriesData.length / entriesPerPage
                    )}`}</Text>

                    <TouchableOpacity
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(entriesData.length / entriesPerPage)}>
                        <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }] }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>
                </View>

                {loading
                    ?
                    <View style={styles.activityIndicatorStyle}>
                        <ActivityIndicator color="#23d3d3" size="large" />
                    </View>
                    : null}
            </>

        );
    }

    else if (titleForm == "Assets") {


        const columnsCSV = columns.filter((column) => column !== 'Action');

        const entriesDataCSV = entriesData.map((entry) => {
            // Create a new object without the 'Action' key
            const { Action, ...newEntry } = entry;
            return newEntry;
        });


        const renderRow = ({ item, index }) => {

            return (
                <View style={[row, { zIndex: 3 }]}>
                    {columns.map((column) => {
                        return (


                            <View
                                key={column}
                                style={[cell]}
                            >
                                {column === "Action" ?
                                    <TouchableOpacity
                                        onPress={() => handleValueChange(item)}
                                        key={column}
                                        style={[cell, { paddingHorizontal: 20 }]}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={() => handleMouseLeave(index)}
                                    >
                                        <Image
                                            style={[styles.btn, { transform: [{ rotate: '90deg' }] }]}
                                            resizeMode='contain'
                                            source={require('../assets/up_arrow_action_icon.png')}
                                            tintColor={imageHovered[index] ? '#67E9DA' : '#1E3D5C'}
                                        />
                                    </TouchableOpacity>

                                    :
                                    column === 'Asset Name'
                                        ?
                                        <View style={[styles.cell,]}>
                                            <Text style={entryText}>{item[column]}</Text>
                                        </View>
                                        :
                                        column === 'Plate Number'
                                            ?
                                            <View style={[styles.cell,]}>
                                                <Text style={entryText}>{item[column]}</Text>
                                            </View>
                                            :
                                            column === 'Engine Type'
                                                ?
                                                <View style={[styles.cell,]}>
                                                    <Text style={entryText}>{item[column]}</Text>
                                                </View>
                                                :
                                                column === 'ADA'
                                                    ?
                                                    <View style={[styles.cell,]}>
                                                        <Text style={entryText}>{item[column]}</Text>
                                                    </View>
                                                    :
                                                    column === 'Asset Type'
                                                        ?
                                                        <View style={[styles.cell,]}>
                                                            <Text style={entryText}>{item[column]}</Text>
                                                        </View>
                                                        :
                                                        column === 'Status'
                                                            ?

                                                            <View style={[styles.cell,]}>
                                                                <View
                                                                    onMouseEnter={() => {
                                                                        setTooltipVisible({ [index]: true })
                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipVisible({ [index]: false })
                                                                    }}
                                                                >
                                                                    <Switch
                                                                        style={{ marginLeft: 20 }}
                                                                        value={item.active}
                                                                        onValueChange={() => handleAssetStatus(item)} />
                                                                </View>
                                                                {tooltipVisible[index] && (
                                                                    <View style={[styles.tooltip]}>
                                                                        <Text style={styles.tooltipText}>{item.active == true ? 'Activated' : 'Deactivated'}</Text>
                                                                    </View>
                                                                )}
                                                            </View>


                                                            :
                                                            null


                                }



                            </View>
                        )
                    })}
                </View>

            );
        };
        return (
            <>
                <ScrollView style={{ flex: 1, }} horizontal
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ width: '100%', }}>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <CSVLink style={{ textDecorationLine: 'none' }} data={entriesDataCSV} headers={columnsCSV} filename={"assets_report.csv"}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Export</Text>
                                    <Image style={{ height: 15, width: 15, marginLeft: 10 }} source={require('../assets/export_icon.png')}></Image>
                                </TouchableOpacity>
                            </CSVLink>
                        </View>
                        <View style={[columnHeaderRow, { zIndex: 0 }]}>
                            {columns.map((column) => (
                                <View key={column} style={[columnHeaderCell,]}>
                                    <Text style={columnHeaderText}>{column}</Text>
                                </View>
                            ))}
                        </View>
                        <FlatList
                            data={entriesData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderRow}
                            showsHorizontalScrollIndicator={true}
                            style={{ height: 630, paddingVertical: 5 }}
                        />
                    </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Image style={{ height: 20, width: 20 }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>

                    <Text style={{ paddingHorizontal: 20 }}>{`Page ${currentPage} of ${Math.ceil(
                        entriesData.length / entriesPerPage
                    )}`}</Text>

                    <TouchableOpacity
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(entriesData.length / entriesPerPage)}>
                        <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }] }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    else if (titleForm == "Driver" || titleForm == 'Mechanic' || titleForm == 'Manager') {

        const columnsCSV = columns.filter((column) => column !== 'Action');

        const entriesDataCSV = entriesData.map((entry) => {
            // Create a new object without the 'Action' key
            const { Action, ...newEntry } = entry;
            return newEntry;
        });
        const renderRow = ({ item, index }) => {
            return (
                <Animated.View style={[row,]}>
                    {columns.map((column) => {
                        return (
                            <View
                                key={column}
                                style={[cell,]}
                            >
                                {column === "Action" ?
                                    getAuth().currentUser.email == item.Email ?
                                        null
                                        :

                                        <TouchableOpacity
                                            onPress={() => {
                                                handleValueChange(item)
                                            }}
                                            key={column}
                                            style={[cell, { paddingHorizontal: 20 }]}
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            onMouseLeave={() => handleMouseLeave(index)}
                                        >
                                            <Image
                                                style={[styles.btn, { transform: [{ rotate: titleForm == 'Driver' ? '90deg' : '0deg' }] }]}
                                                resizeMode='contain'
                                                source={titleForm == 'Driver' ? require('../assets/up_arrow_action_icon.png') : require('../assets/delete_icon.png')}
                                                tintColor={titleForm == 'Driver' ? imageHovered[index] ? '#67E9DA' : '#1E3D5C' : imageHovered[index] ? '#67E9DA' : 'red'}
                                            />
                                        </TouchableOpacity>
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
            <>
                <ScrollView style={{ flex: 1, }} horizontal
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ width: '100%' }}>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <CSVLink style={{ textDecorationLine: 'none' }} data={entriesDataCSV} headers={columnsCSV} filename={`${titleForm}_report.csv`}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Export</Text>
                                    <Image style={{ height: 15, width: 15, marginLeft: 10 }} source={require('../assets/export_icon.png')}></Image>
                                </TouchableOpacity>
                            </CSVLink>

                        </View>
                        <Animated.View style={[columnHeaderRow,]}>
                            {columns.map((column) => (
                                <View key={column} style={[columnHeaderCell,]}>
                                    <Text style={columnHeaderText}>{column}</Text>
                                </View>
                            ))}
                        </Animated.View>
                        <FlatList
                            data={entriesData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderRow}
                            showsHorizontalScrollIndicator={true}
                            style={{ height: 630, paddingVertical: 5 }}
                        />
                    </View>



                </ScrollView>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Image style={{ height: 20, width: 20 }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>

                    <Text style={{ paddingHorizontal: 20 }}>{`Page ${currentPage} of ${Math.ceil(
                        entriesData.length / entriesPerPage
                    )}`}</Text>

                    <TouchableOpacity
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(entriesData.length / entriesPerPage)}>
                        <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }] }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    else if (titleForm == "Defects") {

        entriesData.sort((a, b) => b.TimeStamp - a.TimeStamp)

        const totalPages = Math.ceil(entriesData.length / entriesPerPage);

        const goToPage = (pageNumber) => {
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber);
            }
        };

        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const visibleEntries = entriesData.slice(startIndex, endIndex);

        // console.log(visibleEntries)

        const renderRow = ({ item, index }) => {

            // const itemIndex = startIndex + index; // Adjusted calculation




            return (
                <Animated.View style={[row,]}>
                    {columns.map((column) => {
                        let formattedDateTime
                        if (column == 'dateCreated') {
                            const date = new Date(item[column].seconds * 1000);

                            // Format the date as AM/PM time
                            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                            // Format the date as "Mon DD, YYYY" (e.g., "Jan 01, 2020")
                            const options = { year: 'numeric', month: 'short', day: '2-digit' };
                            const formattedDate = date.toLocaleDateString([], options);

                            // Combine the formatted date and time
                            formattedDateTime = `${formattedDate} ${formattedTime}`;
                        }
                        return (


                            <View key={column} style={cell}
                            >
                                {
                                    column == 'id'
                                        ?
                                        <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>Defect# {item['id']}</Text>
                                        :
                                        column == 'assetName'
                                            ?
                                            <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{assetState.value.data.find(asset => asset["Asset Number"].toString() === item.assetNumber)?.['Asset Name'] || 'Unknown Asset'}</Text>
                                            :
                                            column == 'driverName'
                                                ?
                                                <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{peopleState.value.data.filter(d => d.Designation === 'Driver').find(driver => driver["Employee Number"].toString() === item.driverEmployeeNumber)?.Name || 'Unknown Driver'}</Text>
                                                :
                                                column == 'dateCreated'
                                                    ?
                                                    <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{formattedDateTime}</Text>
                                                    // null
                                                    :
                                                    column == 'priority' ?
                                                        <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{item[column]}</Text>
                                                        :
                                                        column == 'severity'
                                                            ?
                                                            <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF', }]}>{item[column]}</Text>
                                                            :
                                                            column == 'title'
                                                                ?
                                                                <Text style={[entryText, {}, rowHovered[index] && { color: '#FFFFFF' }, {}]}>{item[column].length > 35 ? item[column].slice(0, 30) + "..." : item[column]}</Text>
                                                                :
                                                                column == 'Work Order'
                                                                    ?
                                                                    <TouchableOpacity onPress={() => { openWorkOrder(item) }}>
                                                                        <Text style={[entryText, { color: item.workOrder == 'not issued' ? '#000000' : '#67E9DA' }]}>{item.workOrder == 'not issued' ? 'not issued' : "WO-" + item.workOrder}</Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    column == 'Action'
                                                                        ?
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                handleValueChange(item)
                                                                            }}
                                                                            key={column}
                                                                            style={[cell, { paddingHorizontal: 20 }]}
                                                                            onMouseEnter={() => handleMouseEnter(index)}
                                                                            onMouseLeave={() => handleMouseLeave(index)}
                                                                        >
                                                                            <Image
                                                                                style={[styles.btn, { transform: [{ rotate: '90deg' }] }]}
                                                                                resizeMode='contain'
                                                                                source={require('../assets/up_arrow_action_icon.png')}
                                                                                tintColor={imageHovered[index] ? '#67E9DA' : '#1E3D5C'}
                                                                            />
                                                                        </TouchableOpacity>
                                                                        :
                                                                        null
                                }

                            </View>
                        )
                    })}
                </Animated.View>
            );
        };
        return (
            <>

                <ScrollView style={{ flex: 1, }} horizontal
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ width: '100%' }}>
                        <View style={columnHeaderRow}>
                            {columns.map((column) => (

                                <View key={column} style={[columnHeaderCell]}>
                                    <Text style={columnHeaderText}>{column == 'priority' ? 'Priority' : column == 'severity' ? 'Severity' : column == 'title' ? 'Defect' : column == 'id' ? 'Defect ID' : column == 'dateCreated' ? 'Date Created' : column == 'assetName' ? 'Asset' : column == 'driverName' ? 'Driver' : column == 'Work Order' ? 'Work Order' : column}</Text>
                                </View>
                            ))}

                        </View>
                        <FlatList
                            data={visibleEntries}
                            keyExtractor={(_, index) => `${startIndex + index}`}
                            renderItem={renderRow}
                            showsHorizontalScrollIndicator={true}
                            style={{ flex: 1, paddingVertical: 5, }}
                        />
                        {/* Pagination */}
                    </View>

                </ScrollView>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Image style={{ height: 20, width: 20 }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>

                    <Text style={{ paddingHorizontal: 20 }}>{`Page ${currentPage} of ${Math.ceil(
                        entriesData.length / entriesPerPage
                    )}`}</Text>

                    <TouchableOpacity
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(entriesData.length / entriesPerPage)}>
                        <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }] }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>
                </View>

            </>

        );
    }

    else if (titleForm == "Work Order") {

        // entriesData.sort((a, b) => b.TimeStamp - a.TimeStamp)

        const totalPages = Math.ceil(entriesData.length / entriesPerPage);

        const goToPage = (pageNumber) => {
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber);
            }
        };

        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const visibleEntries = entriesData.slice(startIndex, endIndex);

        // console.log(visibleEntries)

        const renderRow = ({ item, index }) => {

            return (
                <Animated.View style={[row,]}>
                    {columns.map((column, i) => {
                        let formattedDateTime
                        if (column == 'dueDate') {
                            const date = new Date(item[column]);

                            // Format the date as AM/PM time
                            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                            // Format the date as "Mon DD, YYYY" (e.g., "Jan 01, 2020")
                            const options = { year: 'numeric', month: 'short', day: '2-digit' };
                            const formattedDate = date.toLocaleDateString([], options);

                            // Combine the formatted date and time
                            formattedDateTime = `${formattedDate}`;
                        }

                        return (
                            <View key={i} style={cell}
                            >
                                {
                                    column == 'id'
                                        ?
                                        <Text style={[entryText, {},]}>WO-{item['id']}</Text>
                                        :
                                        column == 'status'
                                        ?
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Image style={{height:20, width:20}} source={item.status == 'Completed' ? require('../assets/completed_icon.png') : require('../assets/pending_icon.png')} tintColor={item.status == 'Completed' ? 'green' : 'red'} resizeMode='contain'/>
                                        <Text style={[entryText,]}>{item.status}</Text>
                                        </View>
                                        :
                                        column == 'assetName'
                                            ?
                                            <Text style={[entryText, {},]}>{assetState.value.data.find(asset => asset["Asset Number"].toString() === item.assetNumber)?.['Asset Name'] || 'Unknown Asset'}</Text>
                                            :
                                            column == 'defectedItems'
                                                ?
                                                <Text style={[entryText, {},]}>{item[column].length}</Text>

                                                :
                                                column == 'dueDate'
                                                    ?
                                                    <Text style={[entryText, {},]}>{formattedDateTime}</Text>

                                                    :
                                                    column == 'assignedMechanic'
                                                        ?
                                                        <Text style={[entryText, {},]}>{peopleState.value.data.find(mechanic => mechanic["Employee Number"].toString() === item.assignedMechanic)?.Name || 'Unknown Mechanic'}</Text>
                                                        :
                                                        column == 'TimeStamp'
                                                            ?
                                                            <Text style={[entryText, {},]}>{new Date(item[column].seconds * 1000).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' })}</Text>
                                                            :
                                                            column == 'priority'
                                                            ?
                                                            <Text style={[entryText, {},]}>{item.priority}</Text>
                                                            :
                                                            column == 'Action'
                                                                ?
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        handleValueChange(item)
                                                                    }}
                                                                    key={column}
                                                                    style={[cell, { paddingHorizontal: 20 }]}
                                                                    onMouseEnter={() => handleMouseEnter(index)}
                                                                    onMouseLeave={() => handleMouseLeave(index)}
                                                                >
                                                                    <Image
                                                                        style={[styles.btn, { transform: [{ rotate: '90deg' }] }]}
                                                                        resizeMode='contain'
                                                                        source={require('../assets/up_arrow_action_icon.png')}
                                                                        tintColor={imageHovered[index] ? '#67E9DA' : '#1E3D5C'}
                                                                    />
                                                                </TouchableOpacity>
                                                                :
                                                                null
                                }

                            </View>
                        )
                    })}
                </Animated.View>
            );
        };
        return (
            <>

                <ScrollView style={{ flex: 1, }} horizontal
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View style={{ width: '100%' }}>
                        <View style={columnHeaderRow}>
                            {columns.map((column) => (

                                <View key={column} style={[columnHeaderCell, { zIndex: 2, flexDirection: 'row', alignItems: 'center' }]}>
                                    <Text style={columnHeaderText}>{column == 'id' ? 'Work Order' : column == 'assetName' ? 'Asset Name' : column == 'defectedItems' ? 'Items' : column == 'dueDate' ? 'Due Date' : column == 'assignedMechanic' ? 'Assignee' : column == 'TimeStamp' ? 'Date Created' : column == 'priority' ? 'Priority' : column == 'status' ? 'Status' : column}</Text>
                                    {column == 'TimeStamp' ?
                                        <TouchableOpacity onPress={()=>{
                                            onFormSortDateCreated()
                                        }}>
                                            <Image style={{ height: 18, width: 18, marginBottom: 5 }} tintColor='#000000' source={require('../assets/sort_icon.png')} />
                                        </TouchableOpacity>
                                        :
                                        null}
                                         {column == 'dueDate' ?
                                        <TouchableOpacity onPress={()=>{
                                            onFormSortDueDate()
                                        }}>
                                            <Image style={{ height: 18, width: 18, marginBottom: 5 }} tintColor='#000000' source={require('../assets/sort_icon.png')} />
                                        </TouchableOpacity>
                                        :
                                        null}
                                </View>
                            ))}
                            {/* <Text style={styles.columnHeaderText}>Action</Text> */}
                        </View>
                        <FlatList
                            data={visibleEntries}
                            keyExtractor={(_, index) => `${startIndex + index}`}
                            renderItem={renderRow}
                            showsHorizontalScrollIndicator={false}
                        />
                        {/* Pagination */}
                    </View>

                </ScrollView>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Image style={{ height: 20, width: 20 }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>

                    <Text style={{ paddingHorizontal: 20 }}>{`Page ${currentPage} of ${Math.ceil(
                        entriesData.length / entriesPerPage
                    )}`}</Text>

                    <TouchableOpacity
                        onPress={() => goToPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(entriesData.length / entriesPerPage)}>
                        <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }] }} source={require('../assets/left_arrow_icon.png')}></Image>
                    </TouchableOpacity>
                </View>

            </>

        );
    }

    else if (titleForm == "RegisterCompany") {

        const columnsCSV = columns.filter((column) => column !== 'Action');

        const entriesDataCSV = entriesData.map((entry) => {
            // Create a new object without the 'Action' key
            const { Action, ...newEntry } = entry;
            return newEntry;
        });

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
                                        onPress={() => {
                                            // handleDelete(index)
                                            handleValueChange(entriesData[index].Email)
                                        }}
                                        key={column}
                                        style={[cell, {}]}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={() => handleMouseLeave(index)}
                                    >
                                        <Image
                                            style={styles.btn}
                                            resizeMode='contain'
                                            source={require('../assets/delete_icon.png')}
                                            tintColor={imageHovered[index] ? '#67E9DA' : 'red'}
                                        />
                                    </TouchableOpacity>

                                    :
                                    <View
                                        key={column}
                                        style={[cell, column === "Company" && { minWidth: 200 }, column === "Name" && { minWidth: 200 }, column === "Email" && { minWidth: 200 }, column === "Industry" && { minWidth: 150 }, column === "Number" && { minWidth: 200 }]}
                                    >

                                        <View style={[styles.cell,]}>
                                            <Text style={entryText}>{item[column]}</Text>
                                        </View>

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
                        <CSVLink style={{ textDecorationLine: 'none' }} data={entriesDataCSV} headers={columnsCSV} filename={"assets_report.csv"}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Export</Text>
                                <Image style={{ height: 15, width: 15, marginLeft: 10 }} source={require('../assets/export_icon.png')}></Image>
                            </TouchableOpacity>
                        </CSVLink>
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
                            <View key={column} style={[columnHeaderCell, column === "Company" && { minWidth: 200 }, column === "Name" && { minWidth: 200 }, column === "Email" && { minWidth: 200 }, column === "Industry" && { minWidth: 150 }, column === "Number" && { minWidth: 200 }]}>
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
        // marginLeft: 15,

    },
    hoverContent: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        left: 70,
        top: -20
    },
    tooltipText: {
        color: '#fff',
    },
    activityIndicatorStyle: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        backgroundColor: '#555555DD',
    },

    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 15,
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
        marginRight: 5,
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        maxHeight: '90%',
        maxWidth: '90%',
        overflow: 'hidden'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#1E90FF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default Form;
