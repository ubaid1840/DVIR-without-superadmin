import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Modal, ScrollView, TouchableOpacity, View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import AlertModal from '../../components/AlertModal';
import { DataContext } from '../store/context/DataContext';
import moment from 'moment'
import { BlurView } from 'expo-blur';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../config/firebase';


const FormDetail = ({ formValue, returnFormDetail }) => {

    const [driverPicture, setDriverPicture] = useState(null)
    const [groups, setGroups] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const [loading, setLoading] = useState(false)
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')


    const db = getFirestore(app)
    const { state: dataState, setData } = useContext(DataContext)

    useEffect(() => {

        fetchDriverDp()
        // console.log(formValue)

        if (formValue.length != 0) {
            const groupedData = groupData(formValue.form);
            // console.log(groupedData)
            setGroups(groupedData)
            // console.log(groupedData)
        }

    }, [])

    const fetchDriverDp = async () => {
        await getDocs(query(collection(db, 'AllowedUsers'), where('Designation', '==', 'Driver')))
            .then((snapshot) => {
                snapshot.forEach((item) => {
                    if (item.data()['Employee Number'].toString() == formValue.driverEmployeeNumber) {
                        setDriverPicture(item.data().dp)
                        return
                    }
                })
            })
    }

    const groupData = (data) => {
        const groups = [];
        let currentGroup = [];
        let groupValue; // Store the group value outside the object array

        for (const item of data) {
            if (
                currentGroup.length >= 5 ||
                !currentGroup.length ||
                currentGroup[0].type !== item.type
            ) {
                if (currentGroup.length) {
                    // Determine the group value based on the presence of 'Fail' values
                    groupValue = currentGroup.some(obj => obj.value === 'Fail') ? 'Fail' : 'Pass';

                    // Add the group value to the first object in the group
                    currentGroup[0].groupValue = groupValue;

                    groups.push([...currentGroup]);
                }
                currentGroup = [item];
            } else {
                currentGroup.push(item);
            }
        }

        if (currentGroup.length) {
            // Determine the group value for the last group
            groupValue = currentGroup.some(obj => obj.value === 'Fail') ? 'Fail' : 'Pass';

            // Add the group value to the first object in the last group
            currentGroup[0].groupValue = groupValue;

            groups.push([...currentGroup]);
        }

        return groups;
    };

    const fetchData = async () => {

        let list = []
        await getDocs(collection(db, 'Forms'))
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    list.push(doc.data())
                })
            })
        setData(list)
        setLoading(false)
        returnFormDetail('nill')
    }

    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const GroupComponent = useCallback(({ group }) => {

        return (
            <View
                style={{
                    marginVertical: 10,
                    backgroundColor: 'white',
                    borderRadius: 4,
                    width: 350,
                    padding: 20,
                    margin: 5,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'inter-semibold',
                        fontSize: 20,
                        marginVertical: 5,
                    }}
                >
                    {group[0].type}
                </Text>
                {group.map((groupData, index) => (
                    <View key={index}>
                        {groupData.title == 'Mileage' ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <View style={{ height: 4, width: 4, backgroundColor: '#000000', borderRadius: 2 }}></View>
                                <Text style={{ color: '#000000', marginLeft: 15, fontFamily: 'inter-regular', fontSize: 14 }}>{groupData.value} </Text>
                            </View>
                        ) : groupData.value == 'Fail' ? (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <View style={{ height: 4, width: 4, backgroundColor: '#000000', borderRadius: 2 }}></View>
                                    <Text style={{ color: 'red', marginLeft: 15, fontFamily: 'inter-regular', fontSize: 14 }}>{groupData.title}</Text>
                                </View>
                                <TouchableOpacity key={index} onPress={() => { window.open(groupData.Defect.Image, '_blank'); }}>
                                    <ImageBackground style={{ height: 300, width: '100%', marginVertical: 10, justifyContent: 'flex-end' }} source={{ uri: groupData.Defect.Image }}>
                                        <Text style={{ width: '100%', color: 'red', margin: 20, fontSize: 13 }}>{groupData.Defect.Note}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <View style={{ height: 4, width: 4, backgroundColor: '#000000', borderRadius: 2 }}></View>
                                <Text style={{ color: '#000000', marginLeft: 15, fontFamily: 'inter-regular', fontSize: 13 }}>{groupData.title}</Text>
                            </View>
                        )}
                    </View>
                ))}
                {group[0].type != 'Mileage' ? (
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <View style={{ borderRadius: 5, marginTop: 10, backgroundColor: group[0].groupValue == 'Pass' ? 'green' : 'red', padding: 2, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{group[0].groupValue}</Text>
                        </View>
                    </View>
                ) : null}
            </View>
        );
    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: '#f6f8f9' }}>
            {/* <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                height: Dimensions.get('window').height,
                
            }}></View> */}
            <ScrollView style={{ height: 100 }}
                contentContainerStyle={{ margin: 40, width: 'auto' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column', }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.selectedFormPropertyStyle, { fontFamily: 'inter-semibold' }]}>Form 1</Text>
                            <Text style={{ color: '#FFFFFF', backgroundColor: formValue.formStatus == 'Passed' ? 'green' : 'red', width: 60, height: 20, textAlign: 'center', borderRadius: 5 }}>{formValue.formStatus}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={[styles.selectedFormPropertyStyle]}>Date Received</Text>
                            <Text style={[styles.selectedFormKeyStyle]}>{((new Date(formValue.TimeStamp.seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(formValue.TimeStamp.seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })).toString()}</Text>

                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={[styles.selectedFormPropertyStyle]}>Date Inspected</Text>
                            <Text style={[styles.selectedFormKeyStyle]}>{((new Date(formValue.TimeStamp.seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(formValue.TimeStamp.seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.selectedFormPropertyStyle]}>Inspection Duration</Text>
                            <Text style={[styles.selectedFormKeyStyle]}>{moment.duration(formValue.duration).minutes() + ':' + moment.duration(formValue.duration).seconds() + " minutes"}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 20 }}>
                            {driverPicture ? <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={{ uri: driverPicture }}></Image> :
                                <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={require('../../assets/driver_icon.png')}></Image>}
                            <Text style={{ fontFamily: 'inter-regular', fontSize: 15, height: 25, marginTop: 5 }}>{formValue.driverName}</Text>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={{ height: 40, width: 40 }} source={require('../../assets/vehicle_icon.png')}></Image>
                            <Text style={{ fontFamily: 'inter-regular', fontSize: 15, height: 25, marginTop: 5 }}>{formValue.assetName}</Text>
                        </View>

                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.selectedFormKeyStyle, { width: 150 }]}>Check on </Text>
                    <TouchableOpacity style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', padding: 5 }} onPress={() => {

                        const mapsURL = `https://www.google.com/maps?q=${formValue.location._lat},${formValue.location._long}`;
                        window.open(mapsURL, '_blank');
                    }}>
                        <Text>GPS stamp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setDeleteModal(true)
                    }}>
                        <Image style={{ height: 25, width: 25, marginLeft: 20 }} tintColor='red' source={require('../../assets/delete_icon.png')}></Image>
                    </TouchableOpacity>

                </View>

                {groups.length != 0
                    ?
                    <View style={{ width: 'auto' }}>
                        <ScrollView
                            horizontal
                            contentContainerStyle={{ width: 'auto' }}
                        >
                            <FlatList
                                data={groups}
                                numColumns={3} // Display three groups per row
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => <GroupComponent key={index} group={item}
                                    contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center' }} />}
                            />
                        </ScrollView>
                        <View>
                            <Text style={{ fontFamily: 'inter-semibold', fontSize: 20, marginVertical: 5, }}>Signatures:</Text>
                        </View>
                        <View style={{}}>
                            <Image style={{ height: 400, width: 300, backgroundColor: '#FFFFFF', borderRadius: 4, padding: 15 }} source={{ uri: formValue.signature }}></Image>
                        </View>
                    </View>
                    : null}
            </ScrollView>

            <Modal
                animationType="fade"
                visible={deleteModal}
                transparent={true}>
                <View style={styles.centeredView}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.modalView}>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '400' }}>Are you sure you want to Delete ?</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 250, justifyContent: 'space-between', marginTop: 20 }}>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [0]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [0]: false })}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        setDeleteModal(false)
                                        setLoading(true)
                                        await deleteDoc(doc(db, "Forms", formValue.id.toString()));
                                        console.log('deleted')
                                        setAlertStatus('successful')
                                        setAlertIsVisible(true)
                                        fetchData()
                                    }}

                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[0] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[0] && { color: '#FFFFFF' }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [1]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [1]: false })}>
                                <TouchableOpacity
                                    onPress={() => setDeleteModal(false)}
                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[1] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[1] && { color: '#FFFFFF' }]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>

            {alertStatus == 'successful'
                ?

                <AlertModal
                    centeredViewStyle={styles.centeredView}
                    modalViewStyle={styles.modalView}
                    isVisible={alertIsVisible}
                    onClose={closeAlert}
                    img={require('../../assets/successful_icon.png')}
                    txt='Successful'
                    txtStyle={{ fontWeight: '500', fontSize: 20, marginLeft: 10 }}
                    tintColor='green'>

                </AlertModal>
                :
                alertStatus == 'failed'
                    ?
                    <AlertModal
                        centeredViewStyle={styles.centeredView}
                        modalViewStyle={styles.modalView}
                        isVisible={alertIsVisible}
                        onClose={closeAlert}
                        img={require('../../assets/failed_icon.png')}
                        txt='Failed'
                        txtStyle={{ fontFamily: 'futura', fontSize: 20, marginLeft: 10 }}
                        tintColor='red'>
                    </AlertModal>
                    : null
            }

            {loading ?
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator color="#23d3d3" size="large" />
                </View>
                : null}
        </View>
    )
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
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#FFFFFF',
        fontFamily: 'futura-extra-black',
        alignSelf: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        maxHeight: '98%',
        maxWidth: '95%'
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
    dropdown: {
        // Custom styles for the dropdown container
        // For example:
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
    },
    dropdownProfile: {
        padding: 12,
        minWidth: 100,
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
        fontSize: 14,
        fontFamily: 'inter-semibold',
        color: '#A8A8A8',
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
        height: 800
    },
    btn: {
        width: '100%',
        height: 50,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        // marginRight: 5
    },
    formCellStyle: {
        justifyContent: 'center',
        width: 160,
        height: 50,

        // paddingLeft: 20
    },
    formEntryTextStyle: {
        fontFamily: 'inter-regular',
        paddingHorizontal: 20,
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
        // alignItems: 'center',
    },
    formColumnHeaderCellStyle: {
        width: 160,
        // paddingLeft:20

    },
    formColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 13
    },
    selectedFormPropertyStyle: {
        fontFamily: 'inter-regular',
        fontSize: 15,
        width: 150,
        height: 25
    },
    selectedFormKeyStyle: {
        fontFamily: 'inter-semibold',
        fontSize: 15,
        // width: 150,
        height: 25
    }
});

export default FormDetail

