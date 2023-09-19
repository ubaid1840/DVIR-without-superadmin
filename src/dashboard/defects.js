import { useState, useEffect, useContext, useRef } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, Animated, Dimensions, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import { TextInput } from 'react-native-gesture-handler';
import DropDownComponent from '../../components/DropDown';
import { CSVLink } from 'react-csv';
import { DataContext } from '../store/context/DataContext';
import { collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import app from '../config/firebase';
import { AuthContext } from '../store/context/AuthContext';
import { DefectContext } from '../store/context/DefectContext';
import { subscribeToCollection } from './defectFirebaseService';

const columns = [
    'id',
    'assetName',
    'dateCreated',
    'priority',
    'severity',
    'title',
    'driverName',
    'Work Order',
    'Action'
];


const DefectsPage = (props) => {

    const db = getFirestore(app)

    const { height, width } = Dimensions.get('window');

    const [fadeAnim] = useState(new Animated.Value(0));
    const [search, setSearch] = useState('')
    const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)
    const [searchDefectSelectedOption, setSearchDefectSelectedOption] = useState("Select")
    const [defectedArray, setDefectedArray] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDefect, setSelectedDefect] = useState(null)
    const [comment, setComment] = useState('')
    const flatlistRef = useRef()
    const [totalNew, setTotalNew] = useState(0)
    const [totalInProgress, setTotalInProgress] = useState(0)
    const [totalCorrected, setTotalCorrected] = useState(0)

    const { state: dataState, setData } = useContext(DataContext)
    const { state: authState, setAuth } = useContext(AuthContext)
    const { state: defectState, setDefect } = useContext(DefectContext)



    useEffect(() => {

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        return () => {
            fadeAnim.setValue(0);
        }

    }, [])


    // useEffect(() => {
    //     // console.log(authState.value)


    //     const unsubscribe = onSnapshot(query(collection(db, 'Defects'), orderBy('dateCreated', 'desc')), (querySnapshot) => {
    //         let temp = []
    //         querySnapshot.forEach((docs) => {
    //             temp.push(docs.data())
    //         })
    //         console.log('1')
    //         setDefect(temp)
    //         setDefectedArray(temp)
    //         setLoading(false)
    //     })



    //     return () => unsubscribe()
    // }, [])

    useEffect(() => {
        const unsubscribe = subscribeToCollection('myCollection', (newData) => {
            setDefectedArray(newData)
            setDefect(newData)
            setTotalNew(newData.filter((object) => object.status === 'New').length)
            setTotalInProgress(newData.filter((object) => object.status === 'In Progress').length)
            setTotalCorrected(newData.filter((object) => object.status === 'Corrected').length)
            setLoading(false)
            // console.log(newData)
        });

        return () => {
            // Unsubscribe when the component unmounts
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (selectedDefect) {
            // Find the currently selected defect in the updated defectedArray
            const updatedSelectedDefect = defectedArray.find((defect) => defect.id === selectedDefect.id);

            if (updatedSelectedDefect) {
                setSelectedDefect(updatedSelectedDefect); // Update the selectedDefect state with the latest data
            }
        }
    }, [defectedArray]);

    const searchDefectOptionList = ["Select", "Asset", "Driver",]

    const handleDefectsFormValueChange = (value) => {
        console.log('ubaid')
        // console.log(value)
        // setSelectedDefect(value)
        props.onDashboardValueChange(value)
        // setDefect(value)


    }

    const handleOpenWorkOrderValue = (value) => {
        props.onDashboardWOValue(value)
    }

    const handleSearchDefectValueChange = (value) => {
        setSearchDefectSelectedOption(value)
    }

    const handleDownloadReportBtn = () => {

    }

    const updateComment = async () => {

        const currentDate = new Date();
        const currentTimeInMillis = currentDate.getTime();
        let oldComments = [...selectedDefect.comments]

        // console.log(oldComments)
        oldComments.push({
            sendBy: authState.value.name,
            msg: comment,
            timeStamp: currentTimeInMillis
        })
        // console.log(oldComments)

        const dbRef = doc(db, 'Defects', selectedDefect.id.toString())
        await updateDoc(dbRef, {
            comments: oldComments
        })
    }

    return (

        <Animated.View style={{ flex: 1, backgroundColor: '#f6f8f9' }}>

            {selectedDefect ?
                <ScrollView style={{ height: 100 }}>
                    <View style={{ flexDirection: 'row', padding: 40, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                {selectedDefect.title}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <AppBtn
                                    title="Mark as In Progress"
                                    btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ADADAD' }]}
                                    btnTextStyle={[styles.btnText, { fontFamily: 'inter-regular', color: '#000000', fontSize: 13 }]}
                                    onPress={handleDownloadReportBtn} />
                            </View>
                            <View style={{ marginLeft: 5 }}>
                                <AppBtn
                                    title="Mark as Corrected"
                                    btnStyle={[styles.btn, { backgroundColor: '#23d3d3' }]}
                                    btnTextStyle={[styles.btnText, { fontFamily: 'inter-regular', fontSize: 14 }]}
                                    onPress={handleDownloadReportBtn} />
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 40 }}>
                        <View style={[styles.newContentCardStyle, { paddingVertical: 25, marginRight: 20 }]}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingBottom: 25 }}>
                                <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Details</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center', marginTop: 25 }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Defect ID</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.id}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Status</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.status}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Asset</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.assetName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Driver</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.driverName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Driver Comment</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.defect.Note}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Severity</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.severity}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Priority</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.priority}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Assigned Mechanic</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>n/a</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Work Order</Text>
                                <View>
                                    <AppBtn
                                        title="Create WO"
                                        btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#8C8C8C', height: 40 }]}
                                        btnTextStyle={[styles.btnText, { color: '#000000', fontFamily: 'inter-regular', fontSize: 13 }]}
                                        onPress={() => { }} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Date Created</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{new Date(selectedDefect.dateCreated.seconds * 1000).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + new Date(selectedDefect.dateCreated.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Company</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>Octa Soft</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Inspection Form</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>Form 1</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Defect Card</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 25, marginVertical: 10, alignItems: 'center' }}>
                                <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Inspection ID</Text>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15 }}>{selectedDefect.inspectionId}</Text>
                            </View>

                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.newContentCardStyle, { width: '100%' }]}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', padding: 25 }}>
                                    <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Attachments</Text>
                                </View>
                                <View style={{ margin: 25, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#23d3d3' }}>
                                    <Text style={{ fontFamily: 'inter-medium', fontSize: 15, color: '#23d3d3' }}>Photos</Text>
                                </View>
                                <TouchableOpacity style={{ marginLeft: 25, marginBottom: 25 }} onPress={() => {
                                    window.open(selectedDefect.defect.Image, '_blank');
                                }}>
                                    <Image style={{ height: 150, width: 150 }} source={{ uri: selectedDefect.defect.Image }}></Image>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.newContentCardStyle, { marginTop: 20, width: '100%' }]}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', padding: 25 }}>
                                    <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Activity</Text>
                                </View>

                                <View style={{ margin: 25, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#23d3d3' }}>
                                    <Text style={{ fontFamily: 'inter-medium', fontSize: 15, color: '#23d3d3' }}>Comments</Text>
                                </View>
                                {selectedDefect.comments.length == 0
                                    ?
                                    <View style={{ borderWidth: 1, padding: 35, margin: 25, borderColor: '#C6C6C6' }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>There are no comments</Text>
                                    </View>
                                    :
                                    <FlatList
                                        style={{ maxHeight: 200 }}
                                        data={selectedDefect.comments}
                                        ref={flatlistRef}
                                        onContentSizeChange={() => {
                                            if (selectedDefect.comments.length != 0) {
                                                flatlistRef.current.scrollToEnd({ animated: true })
                                            }
                                        }}
                                        onLayout={() => {
                                            if (selectedDefect.comments.length != 0) {
                                                flatlistRef.current.scrollToEnd()
                                            }
                                        }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View key={index} style={{ width: '100%', marginVertical: 10, paddingHorizontal: 20, alignItems: item.sendBy == authState.value.name ? 'flex-start' : 'flex-end' }}>
                                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 12 }}>{item.sendBy}</Text>
                                                    <Text style={{ fontFamily: 'inter-regular', fontSize: 12 }}>{item.msg}</Text>
                                                </View>
                                            )
                                        }} />
                                }

                                <View style={{ flexDirection: 'row', marginHorizontal: 25, alignItems: 'center' }}>
                                    <Image style={{ height: 30, width: 30 }} source={require('../../assets/profile_icon.png')} tintColor="#8C8C8C" resizeMode='contain'></Image>
                                    <TextInput
                                        style={[styles.input, { marginLeft: 5 }, searchTextInputBorderColor && styles.withBorderInputContainer]}
                                        placeholder=""
                                        placeholderTextColor="#868383DC"
                                        value={comment}
                                        onChangeText={(val) => { setComment(val) }}
                                        onFocus={() => { setSearchTextInputBorderColor(true) }}
                                        onBlur={() => { setSearchTextInputBorderColor(false) }}
                                    />
                                </View>
                                <View style={{ width: 130, marginTop: 20, marginBottom: 25, marginLeft: 25 }}>
                                    <AppBtn
                                        title="Add Comment"
                                        btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#8C8C8C', height: 40 }]}
                                        btnTextStyle={[styles.btnText, { color: '#000000', fontFamily: 'inter-regular', fontSize: 13 }]}
                                        onPress={() => {
                                            if (comment == null || comment == '') { }
                                            else {
                                                setComment("")
                                                updateComment()
                                            }

                                        }} />
                                </View>

                            </View>



                        </View>
                    </View>

                </ScrollView>
                :
                <ScrollView style={{ height: 100 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 40, marginVertical: 40, marginRight: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
                                <Image style={{ width: 30, height: 30, margin: 7 }}
                                    tintColor="#FFFFFF"
                                    source={require('../../assets/defects_icon.png')}></Image>
                            </View>
                            <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                Defects
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: '#5B5B5B', fontSize: 20, fontFamily: 'inter-medium' }}>{totalNew}</Text>
                                <Text style={{ color: '#5B5B5B', fontSize: 17 }}>New</Text>
                            </View>
                            <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 25, opacity: 0.5, }}></View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: '#5B5B5B', fontSize: 20, fontFamily: 'inter-medium' }}>{totalInProgress}</Text>
                                <Text style={{ color: '#5B5B5B', fontSize: 17 }}>In Progress</Text>
                            </View>
                            <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 25, opacity: 0.5 }}></View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: '#5B5B5B', fontSize: 20, fontFamily: 'inter-medium' }}>{totalCorrected}</Text>
                                <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Corrected</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 40, paddingRight: 40, zIndex: 1, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginRight: 10 }}>
                                <TextInput
                                    style={[styles.input, { marginTop: 0 }, searchTextInputBorderColor && styles.withBorderInputContainer]}
                                    placeholder="Type to search"
                                    placeholderTextColor="#868383DC"
                                    value={search}
                                    onChangeText={(val) => { setSearch(val) }}
                                    onFocus={() => { setSearchTextInputBorderColor(true) }}
                                    onBlur={() => { setSearchTextInputBorderColor(false) }}
                                />
                            </View>
                            <View style={{ marginRight: 10 }}>
                                <DropDownComponent
                                    options={searchDefectOptionList}
                                    onValueChange={handleSearchDefectValueChange}
                                    // title="Ubaid Arshad"
                                    selectedValue={searchDefectSelectedOption}
                                    imageSource={require('../../assets/up_arrow_icon.png')}
                                    container={styles.dropdownContainer}
                                    dropdownButton={styles.dropdownButton}
                                    selectedValueStyle={styles.dropdownSelectedValueStyle}
                                    optionsContainer={styles.dropdownOptionsContainer}
                                    option={styles.dropdownOption}
                                    hoveredOption={styles.dropdownHoveredOption}
                                    optionText={styles.dropdownOptionText}
                                    hoveredOptionText={styles.dropdownHoveredOptionText}
                                    dropdownButtonSelect={styles.dropdownButtonSelect}
                                    dropdownStyle={styles.dropdown}
                                />
                            </View>
                            {/* <View style={{ marginRight: 10 }}>
                                    <TouchableOpacity
                                        onMouseEnter={() => setSearchBtnHover(true)}
                                        onMouseLeave={() => setSearchBtnHover(false)}
                                        onPress={() => {
                                            setSearchAssetSelectedOption('Select')
                                            setSearch('')
                                        }}
                                    >
                                        <Image style={[{ width: 40, height: 40 }]}
                                            tintColor={searchBtnHover ? '#67E9DA' : '#336699'}
                                            source={require('../../assets/search_icon.png')}></Image>
                                    </TouchableOpacity>
                                </View> */}
                            {/* <CSVLink style={{ textDecorationLine: 'none' }} data={[]} headers={[]} filename={"defects_report.csv"}>
                    <AppBtn
                        title="Download Report"
                        btnStyle={styles.btn}
                        btnTextStyle={styles.btnText}
                        onPress={handleDownloadReportBtn} />
                </CSVLink> */}
                        </View>

                    </View>
                    <View style={styles.contentCardStyle}>
                        {defectedArray.length != 0
                            ?
                            <Form
                                columns={columns}
                                entriesData={searchDefectSelectedOption == 'Asset' ? defectedArray.filter((item) => item.assetName.toLowerCase().includes(search.toLowerCase())) : searchDefectSelectedOption == 'Driver' ? defectedArray.filter((item) => item.driverName.toLowerCase().includes(search.toLowerCase())) : defectedArray}
                                titleForm="Defects"
                                onValueChange={handleDefectsFormValueChange}
                                onOpenWorkOrder={handleOpenWorkOrderValue}
                                row={styles.formRowStyle}
                                cell={styles.formCellStyle}
                                entryText={styles.formEntryTextStyle}
                                columnHeaderRow={styles.formColumnHeaderRowStyle}
                                columnHeaderCell={styles.formColumnHeaderCellStyle}
                                columnHeaderText={styles.formColumnHeaderTextStyle}
                            />
                            :
                            null}

                    </View>
                </ScrollView>
            }


            {loading ?
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator color="#23d3d3" size="large" />
                </View>
                : null}

        </Animated.View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
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
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none'
    },
    withBorderInputContainer: {
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFFFFF',
        fontFamily: 'futura-extra-black',
        alignSelf: 'center'
    },
    leftSide: {
        width: 270,
        backgroundColor: '#1E3D5C',
        paddingTop: 50,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    navItem: {
        height: 50,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        alignItems: 'center',
        paddingLeft: 20,
        flexDirection: 'row',
        marginBottom: 10

        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    selectedNavItem: {
        // backgroundColor: '#ccc',
        height: 50,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        alignItems: 'center',
        paddingLeft: 20,
        backgroundColor: '#1383B4',

    },
    navText: {
        fontSize: 14,
        color: '#67E9DA',
        fontWeight: '700',
        opacity: 0.6
    },
    navTextHover: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        opacity: 1,
        fontSize: 16
    },

    contentContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    hoverNavItem: {
        backgroundColor: '#1383B4',

    },

    text: {
        // Custom styles for the text inside dropdown and selected value
        // For example:
        color: '#000000',
    },
    gradient1: {
        ...StyleSheet.absoluteFill,
        opacity: 0.8,
    },
    gradient2: {
        ...StyleSheet.absoluteFill,
        opacity: 0.6,
        transform: [{ rotate: '45deg' }],
    },
    gradient3: {
        ...StyleSheet.absoluteFill,
        opacity: 0.4,
        transform: [{ rotate: '90deg' }],
    },
    gradient4: {
        ...StyleSheet.absoluteFill,
        opacity: 0.2,
        transform: [{ rotate: '135deg' }],
    },
    driverAndAssetAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calenderSortText: {
        fontSize: 17,
        fontWeight: '400',
        color: '#5B5B5B',
    },
    calenderSortSelectedText: {
        color: '#000000',
        borderBottomWidth: 4,
        borderBottomColor: '#67E9DA',
        paddingBottom: 10
    },
    subHeadingText: {
        color: '#1E3D5C',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 10
    },
    contentCardStyle: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        margin: 40,
        // flex:1,
        width: 'auto',
        height: 800,
        // overflow: 'visible'
    },
    newContentCardStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        width: '50%'
    },
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
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10
    },
    formRowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomColor: '#ccc',

        marginTop: 8,
        shadowColor: '#BADBFB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 0,
        // borderRadius: 20,
        // marginLeft: 5,
        // marginRight: 5,
        width: 'auto',
        justifyContent: 'space-between'
    },
    formCellStyle: {
        justifyContent: 'center',
        flex: 1,
        minHeight: 50,
        maxWidth:150

        // paddingLeft: 20
    },
    formEntryTextStyle: {
        fontFamily: 'inter-regular',
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontSize: 13,
        color: '#000000'
    },

    formColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        width: 'auto',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    formColumnHeaderCellStyle: {
        // width: 160,
        // paddingLeft:20
        flex: 1,
        maxWidth:150

    },
    formColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 5,
        color: '#5A5A5A',
        fontSize: 13
    },
    dropdownContainer: {
        position: 'relative',


    },
    dropdownButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
    },
    dropdown: {
        // Custom styles for the dropdown container
        // For example:
        // padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
        backgroundColor: '#FFFFFF',
        height: 40,
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',


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
        marginTop: 4,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web
            },
        }),

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
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,

        backgroundColor: '#FFFFFF'
    },
});

export default DefectsPage