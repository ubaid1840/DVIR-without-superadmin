import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Platform, TextInput, Dimensions, Modal, ActivityIndicator, Switch, Alert, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import DropDownComponent from '../../components/DropDown';
import AlertModal from '../../components/AlertModal';
import * as DocumentPicker from 'expo-document-picker';
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../config/firebase';
import { DataContext } from '../store/context/DataContext';
import { DefectContext } from '../store/context/DefectContext';
import { WOContext } from '../store/context/WOContext'
import { AssetContext } from '../store/context/AssetContext';
import { AssetDetailContext } from '../store/context/AssetDetailContext';
import { CloseAllDropDowns } from '../../components/CloseAllDropdown';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { IconButton, Tooltip } from 'react-native-paper';






const columns = [
    'Asset Name',
    'Plate Number',
    'Engine Type',
    'ADA',
    'Asset Type',
    'Status',
    'Action',
];



const AssetsPage = (props) => {

    const auth = getAuth()
    const db = getFirestore(app)
    const storage = getStorage(app)

    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [totalAssets, setTotalAssets] = useState(0)
    const [totalAssetsInspected, setTotalAssetsInspected] = useState(2)
    const [assetsWithDefects, setAssetsWithDefects] = useState(0)
    const [search, setSearch] = useState('')
    const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)
    const [searchAssetSelectedOption, setSearchAssetSelectedOption] = useState("Select")
    const [searchBtnHover, setSearchBtnHover] = useState(false)
    const [createNewAssetModalVisible, setCreateNewAssetModalVisible] = useState(false);
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [deleteAlertVisible, setDeleteAlertVisible] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const { width, height } = Dimensions.get('window')
    const [fileUri, setFileUri] = useState(null);
    const [textInputBorderColor, setTextInputBorderColor] = useState('')
    const [dbReference, setDbReference] = useState('')
    const [assetNumber, setAssetNumber] = useState(0)
    const [entriesData, setEntriesData] = useState([])
    const [plateNumber, setPlateNumber] = useState('')
    const [make, setMake] = useState('')
    const [year, setYear] = useState('')
    const [model, setModel] = useState('')
    const [color, setColor] = useState('')
    const [notes, setNotes] = useState('')
    const [company, setCompany] = useState('')
    const [mileage, setMileage] = useState('')
    const [assetType, setAssetType] = useState('Select')
    const [ADA, setADA] = useState('Select')
    const [airBrakes, setAirBrakes] = useState('Select')
    const [engineType, setEngineType] = useState('Select')
    const [deleteAsset, setDeleteAsset] = useState(null)
    const [loading, setloading] = useState(true)
    const [assetName, setAssetName] = useState('')
    const [assignDriverModalVisible, setAssignDriverModalVisible] = useState(false)
    const [driversList, setDriversList] = useState([])
    const [searchDriver, setSearchDriver] = useState('')
    const [driverAssignItemHovered, setDriverAssignItemHovered] = useState({})
    const [assetIndex, setAssetIndex] = useState(0)
    // const [openDetail, setOpenDetail] = useState(props.selectedOptionForAsset)
    const [options, setOptions] = useState('1')
    const [selectedAsset, setSelectedAsset] = useState([])
    const [workOrderArray, setWorkOrderArray] = useState([])
    const [switchValue, setSwitchValue] = useState(false)
    const [editAsset, setEditAsset] = useState(false)

    const [nameBorder, setNameBorder] = useState('#cccccc')
    const [plateNumberBorder, setPlateNumberBorder] = useState('#cccccc')
    const [makeBorder, setMakeBorder] = useState('#cccccc')
    const [modelBorder, setModelBorder] = useState('#cccccc')
    const [yearBorder, setYearBorder] = useState('#cccccc')
    const [colorBorder, setColorBorder] = useState(null)
    const [engineTypeBorder, setEngineTypeBorder] = useState('#cccccc')
    const [ADABorder, setADABorder] = useState('#cccccc')
    const [airBrakesBorder, setAirBrakesBorder] = useState('#cccccc')
    const [assetTypeBorder, setAssetTypeBorder] = useState('#cccccc')
    const [mileageBorder, setMileageBorder] = useState('#cccccc')
    const [notesBorder, setNotesBorder] = useState(null)



    const { state: dataState, setData } = useContext(DataContext)
    const { state: defectState, setDefect } = useContext(DefectContext)
    const { state: woState, setWO } = useContext(WOContext)
    const { state: assetState, setAssetData } = useContext(AssetContext)
    const { state: assetDetailState, setAssetDetail } = useContext(AssetDetailContext)

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState('');

    const handleMouseEnter = (text) => {
        setTooltipText(text);
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };


    const fetchData = async () => {

        CloseAllDropDowns()
        let assetRef = []
        try {
            const querySnapshot = await getDocs(query(collection(db, "Assets"), orderBy("TimeStamp", 'desc')));
            querySnapshot.forEach((doc) => {
                assetRef.push(doc.data())
                if (doc.data().DefectStatus == true) {
                    setAssetsWithDefects((count) => count + 1)
                }
            });

            if (assetRef.length === 0) {
                setAssetNumber(1)
            }
            else {
                setAssetNumber(assetRef[0]['Asset Number'] + 1)
            }

            const assetsWithWorkOrders = assetRef.reduce((count, asset) => {
                const assetId = asset['Asset Number'].toString();
                const hasWorkOrder = woState.value.data.some(order => order.assetNumber === assetId);
                if (hasWorkOrder) {
                    count++;
                }
                return count;
            }, 0);

            setAssetsWithDefects(assetsWithWorkOrders)

            setTotalAssets(assetRef.length)
            setEntriesData(assetRef)
            setAssetData(assetRef)

            const updatedWorkorders = updateWorkOrdersWithAssetInfo(woState.value.data, assetRef);
            setWorkOrderArray([...updatedWorkorders])
            setWO([...updatedWorkorders])


            setloading(false)
            // console.log(entriesData)

        } catch (e) {
            console.log(e)
        }

    }

    const updateWorkOrdersWithAssetInfo = (workorders, assets) => {
        return workorders.map(order => {
            const asset = assets.find(asset => asset['Asset Number'].toString() === order.assetNumber);
            if (asset) {
                return {
                    ...order,
                    assetName: asset['Asset Name'],
                    assetMake: asset.Make,
                    assetModel: asset.Model,
                    assetYear: asset.Year
                };
            } else {
                return order; // Asset not found for this work order
            }
        });
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*', // Change the MIME type to specify the type of files you want to allow
            });

            if (result.assets[0].uri) {
                setFileUri(result.assets[0].uri);

            }
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    const showCreateNewAssetModal = () => {
        setCreateNewAssetModalVisible(true);
    };

    const closeCreateNewAssetModal = () => {
        setCreateNewAssetModalVisible(false);
    };

    useEffect(() => {
        CloseAllDropDowns()
    }, [assetDetailState.value.data, createNewAssetModalVisible, options, editAsset])

    // useEffect(() => {

    //     if (assetName.length > 0) {
    //         setNameBorder('#cccccc')
    //     }
    //     else {
    //         setNameBorder('red')
    //     }

    //     if (plateNumber.length > 0) {
    //         setPlateNumberBorder('#cccccc')
    //     }
    //     else {
    //         setPlateNumberBorder('red')
    //     }

    //     if (make.length > 0) {
    //         setMakeBorder('#cccccc')
    //     }
    //     else {
    //         setMakeBorder('red')
    //     }

    //     if (year.length > 0) {
    //         setYearBorder('#cccccc')
    //     }
    //     else {
    //         setYearBorder('red')
    //     }

    //     if (model.length > 0) {
    //         setModelBorder('#cccccc')
    //     }
    //     else {
    //         setModelBorder('red')
    //     }

    //     if (engineType != 'Select') {
    //         setEngineTypeBorder('#cccccc')
    //     }
    //     else {
    //         setEngineTypeBorder('red')
    //     }

    //     if (ADA != 'Select') {
    //         setADABorder('#cccccc')
    //     }
    //     else {
    //         setADABorder('red')
    //     }

    //     if (airBrakes != 'Select') {
    //         setAirBrakesBorder('#cccccc')
    //     }
    //     else {
    //         setAirBrakesBorder('red')
    //     }

    //     if (assetType != 'Select') {
    //         setAssetTypeBorder('#cccccc')
    //     }
    //     else {
    //         setAssetTypeBorder('red')
    //     }

    //     if (mileage.length > 0) {
    //         setMileageBorder('#cccccc')
    //     }
    //     else {
    //         setMileageBorder('red')
    //     }

    // }, [assetName, plateNumber, make, model, year, engineType, ADA, airBrakes, assetType, mileage])

    useEffect(() => {

        fetchData()

        return () => {

            setCreateNewAssetModalVisible(false)
        }

    }, [selectedPage])

    const handleDownloadReportBtn = () => {

    }



    const handleAssetsAppBtn = () => {
        // props.onAddAssetBtn('CreateNewAsset')
        clearAll()
        setCreateNewAssetModalVisible(true)
    }

    const handleFormValue = (value) => {

        setEditAsset(false)
        setSelectedAsset(value)
        setMake(value.Make)
        setYear(value.Year)
        setModel(value.Model)
        setColor(value.Color)
        setAssetType(value['Asset Type'])
        setMileage(value.Mileage)
        setNotes(value.Notes)
        setAssetName(value['Asset Name'])
        setAssetDetail(true)

    }

    const handleInspectionFormValue = (value) => {
        props.onDashboardValue(value)
    }


    const handleDefectFormValue = (value) => {
        props.onDashboardDefectValue(value)
    }
    const handleOpenWorkOrderValue = (value) => {
        props.onDashboardWODetailValue(value)
    }

    const handleWOFormValue = (value) => {
        props.onDashboardWOValue(value)
    }

    const handleSearchAssetValueChange = (value) => {
        setSearchAssetSelectedOption(value)
    }

    const searchAssetOptionList = ["Select", "Name", "License Plate",]

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#23d3d3" size="large" />
            </View>
        );
    };

    const handleUpdateAsset = async () => {

        await updateDoc(doc(db, 'Assets', selectedAsset['Asset Number'].toString()), {
            'Make': make,
            'Year': year,
            'Model': model,
            'Color': color,
            'Mileage': mileage,
            'Notes': notes,
            'Asset Name': assetName,
        })

        setEditAsset(false)
        setAssetDetail(false)
        fetchData()

    }

    const uploadImage = async (resultimage) => {
        // convert image to blob image
        const blobImage = await new Promise((resole, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resole(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", resultimage, true);
            xhr.send(null);
        });

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        //upload image to firestore
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'AssetImages/' + assetNumber + '.image');
        const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {

                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // setFileuploading(Math.round(progress))


                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                setloading(false)
                Alert.alert('Error', 'Error uploading image')
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL)
                    if (downloadURL) {
                        handleAddNewAsset(downloadURL)
                    }

                });
            }
        );
    }

    const addNewAsset = () => {
        if (fileUri) {
            uploadImage(fileUri)
        }
        else {
            handleAddNewAsset('')
        }
    }

    const handleAddNewAsset = async (imageURL) => {

        await setDoc(doc(db, "Assets", assetNumber.toString()), {
            'Asset Number': assetNumber,
            'Plate Number': plateNumber,
            'Make': make,
            'Year': year,
            'Model': model,
            'Color': color,
            'Engine Type': engineType,
            'ADA': ADA,
            'Air Brakes': airBrakes,
            'Asset Type': assetType,
            'Mileage': mileage,
            'Notes': notes,
            'Assigned To': '',
            'Company': company,
            'Asset Name': assetName,
            'Action': 'Button',
            'lastInspection': serverTimestamp(),
            'inhouseInspection': 'not issued',
            'DefectStatus': false,
            TimeStamp: serverTimestamp(),
            'active': true,
            'image': imageURL
        });


        setCreateNewAssetModalVisible(false)
        setAlertStatus('successful')
        setAlertIsVisible(true)
        fetchData()
        clearAll()
        setloading(false)
    }

    const clearAll = () => {
        setPlateNumber('')
        setMake('')
        setYear('')
        setModel('')
        setColor('')
        setEngineType('Select')
        setADA('Select')
        setAirBrakes('Select')
        setAssetType('Select')
        setMileage('')
        setNotes('')
        setAssetName('')
        setNameBorder('#cccccc')
        setPlateNumberBorder('#cccccc')
        setMakeBorder('#cccccc')
        setYearBorder('#cccccc')
        setModelBorder('#cccccc')
        setEngineTypeBorder('#cccccc')
        setADABorder('#cccccc')
        setAirBrakesBorder('#cccccc')
        setAssetTypeBorder('#cccccc')
        setMileageBorder('#cccccc')
    }
    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const closeAssignDriverModal = () => {
        setAssignDriverModalVisible(false)
    }

    const handleDriverAssign = async (name, email) => {

        const ref = doc(db, "Assets", assetIndex.toString());

        // Set the "capital" field of the city 'DC'
        await updateDoc(ref, {
            "Assigned To": name,
            "Assigned To Email": email
        });

        setAlertStatus('successful')
        setAlertIsVisible(true)
        fetchData()

    }

    const handleChangeAssetStatus = async (val) => {
        await updateDoc(doc(db, 'Assets', val['Asset Number'].toString()), {
            'active': !val.active
        })
        fetchData()
    }
    return (
        <>
            {assetDetailState.value.data ?
                <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#f6f8f9' }}
                    onPress={() => {
                        CloseAllDropDowns()
                    }}>
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ height: 100 }}>
                            {/* <TouchableOpacity onPress={() => {
                            setOpenDetail(false)
                        }}>
                            <Image style={{ width: 25, height: 25, margin:20, transform: [{ rotate: '180deg' }] }} source={require('../../assets/arrow_right_icon.png')}></Image>
                        </TouchableOpacity> */}
                            <View style={{ flexDirection: 'row', marginHorizontal: 40, marginVertical: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
                                        <Image style={{ width: 30, height: 30, margin: 7 }}
                                            tintColor='#FFFFFF'
                                            source={require('../../assets/vehicle_icon.png')}></Image>
                                    </View>
                                    <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                        Assets
                                    </Text>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                    <AppBtn
                                        title="Back"
                                        btnStyle={[{
                                            width: 100,
                                            height: 40,
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowOffset: { width: 1, height: 1 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 3,
                                            elevation: 0,
                                            shadowColor: '#575757',
                                            marginRight: 50
                                        }, { minWidth: 70 }]}
                                        btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                        onPress={() => {
                                            setAssetDetail(false)
                                            setOptions('1')
                                            // clearAll()
                                        }} />
                                </View>

                            </View>

                            <View style={{ flexDirection: 'row', margin: 10 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }} onPress={() => {
                                    setMake(selectedAsset.Make)
                                    setYear(selectedAsset.Year)
                                    setModel(selectedAsset.Model)
                                    setColor(selectedAsset.Color)
                                    setAssetType(selectedAsset['Asset Type'])
                                    setMileage(selectedAsset.Mileage)
                                    setNotes(selectedAsset.Notes)
                                    setAssetName(selectedAsset['Asset Name'])
                                    setOptions('1')
                                }}>
                                    <Text style={{ color: options == '1' ? '#335a75' : 'grey', fontFamily: 'inter-bold', fontSize: options == '1' ? 16 : 14 }}>Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }} onPress={() => {
                                    setEditAsset(false)
                                    setOptions('2')
                                }}>
                                    <Text style={{ color: options == '2' ? '#335a75' : 'grey', fontFamily: 'inter-bold', fontSize: options == '2' ? 16 : 14 }}>Inspections</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }} onPress={() => {
                                    setEditAsset(false)
                                    setOptions('3')
                                }}>
                                    <Text style={{ color: options == '3' ? '#335a75' : 'grey', fontFamily: 'inter-bold', fontSize: options == '3' ? 16 : 14 }}>Defects</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }} onPress={() => {
                                    setEditAsset(false)
                                    setOptions('4')
                                }}>
                                    <Text style={{ color: options == '4' ? '#335a75' : 'grey', fontFamily: 'inter-bold', fontSize: options == '4' ? 16 : 14 }}>Work Orders</Text>
                                </TouchableOpacity>
                            </View>


                            {assetDetailState.value.data
                                ?
                                options == '1'
                                    ?
                                    editAsset
                                        ?
                                        <>
                                            <View style={[styles.contentCardStyle, { height: 'auto' }]}>

                                                <ScrollView horizontal style={{ paddingBottom: 10, }} >
                                                    <View style={{ flexDirection: 'column' }}>
                                                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Name</Text>
                                                                <TextInput
                                                                    style={[styles.input, { marginLeft: 25 },]}
                                                                    placeholderTextColor="#868383DC"
                                                                    value={assetName}
                                                                    onChangeText={setAssetName}

                                                                />
                                                            </View>
                                                            {!editAsset
                                                                ?
                                                                <AppBtn
                                                                    title="Edit"
                                                                    btnStyle={[{
                                                                        width: 70,
                                                                        height: 40,
                                                                        backgroundColor: '#FFFFFF',
                                                                        borderRadius: 5,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        shadowOffset: { width: 1, height: 1 },
                                                                        shadowOpacity: 0.5,
                                                                        shadowRadius: 3,
                                                                        elevation: 0,
                                                                        shadowColor: '#575757',
                                                                    }, { minWidth: 70 }]}
                                                                    btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                                                    onPress={() => {
                                                                        if (editAsset == false) {
                                                                            setMake(selectedAsset.Make)
                                                                            setYear(selectedAsset.Year)
                                                                            setModel(selectedAsset.Model)
                                                                            setColor(selectedAsset.Color)
                                                                            setAssetType(selectedAsset['Asset Type'])
                                                                            setMileage(selectedAsset.Mileage)
                                                                            setNotes(selectedAsset.Notes)
                                                                            setAssetName(selectedAsset['Asset Name'])
                                                                        }
                                                                        setEditAsset(!editAsset)
                                                                        // clearAll()
                                                                    }} />
                                                                :
                                                                <AppBtn
                                                                    title="Revert"
                                                                    btnStyle={[{
                                                                        width: 70,
                                                                        height: 40,
                                                                        backgroundColor: '#FFFFFF',
                                                                        borderRadius: 5,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        shadowOffset: { width: 1, height: 1 },
                                                                        shadowOpacity: 0.5,
                                                                        shadowRadius: 3,
                                                                        elevation: 0,
                                                                        shadowColor: '#575757',
                                                                    }, { minWidth: 70 }]}
                                                                    btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                                                    onPress={() => {
                                                                        if (editAsset == false) {
                                                                            setMake(selectedAsset.Make)
                                                                            setYear(selectedAsset.Year)
                                                                            setModel(selectedAsset.Model)
                                                                            setColor(selectedAsset.Color)
                                                                            setAssetType(selectedAsset['Asset Type'])
                                                                            setMileage(selectedAsset.Mileage)
                                                                            setNotes(selectedAsset.Notes)
                                                                            setAssetName(selectedAsset['Asset Name'])
                                                                        }
                                                                        setEditAsset(!editAsset)
                                                                        // clearAll()
                                                                    }} />
                                                            }

                                                        </View>
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <View style={{ flexDirection: 'column' }}>
                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Number</Text>
                                                                    <TextInput
                                                                        style={[styles.input, { backgroundColor: '#E2E2E2' },]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset['Asset Number']}
                                                                    // onChangeText={(val)=>setEmployeeNumber(val)}

                                                                    />
                                                                </View>
                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Plate Number</Text>
                                                                    <TextInput
                                                                        style={[styles.input, { backgroundColor: '#E2E2E2' },]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset['Plate Number']}
                                                                    // onChangeText={(val) => { setPlateNumber(val) }}

                                                                    />
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Make</Text>
                                                                    <TextInput
                                                                        style={[styles.input, textInputBorderColor == 'Make' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={make}
                                                                        onChangeText={setMake}
                                                                    />
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Year</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, textInputBorderColor == 'Year' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={year}
                                                                            onChangeText={setYear}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Model</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, textInputBorderColor == 'Model' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={model}
                                                                            onChangeText={setModel}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Color</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, textInputBorderColor == 'Color' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={color}
                                                                            onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                            </View>
                                                            <View style={{ flexDirection: 'column', marginLeft: 80 }}>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 4 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Engine Type</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, { backgroundColor: '#E2E2E2' },]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset['Engine Type']}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>ADA Wheelchair</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, { backgroundColor: '#E2E2E2' },]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset.ADA}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Air Brakes</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, { backgroundColor: '#E2E2E2' },]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset['Air Brakes']}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Type</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, { backgroundColor: '#E2E2E2' },]}
                                                                            value={selectedAsset['Asset Type']}
                                                                            // onChangeText={(val) => { setAssetType(val) }}
                                                                            editable={false}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Mileage</Text>
                                                                    <TextInput
                                                                        style={[styles.input, textInputBorderColor == 'Mileage' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={mileage}
                                                                        onChangeText={(val) => { setMileage(val) }}

                                                                    />
                                                                </View>


                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Notes</Text>
                                                                    <TextInput
                                                                        style={[styles.input, textInputBorderColor == 'Notes' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={notes}
                                                                        multiline={true}
                                                                        onChangeText={(val) => { setNotes(val) }}

                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>

                                                </ScrollView>

                                            </View>
                                        </>
                                        :
                                        <>
                                            <View style={[styles.contentCardStyle, { height: 'auto' }]}>
                                                <ScrollView horizontal style={{ paddingBottom: 10 }}
                                                >
                                                    <View style={{ flexDirection: 'column' }}>
                                                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Name</Text>
                                                                <TextInput
                                                                    style={[styles.input, { marginLeft: 25 }, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                    editable={false}
                                                                    placeholderTextColor="#868383DC"
                                                                    value={selectedAsset['Asset Name']}
                                                                // onChangeText={setAssetName}

                                                                />
                                                            </View>

                                                            <AppBtn
                                                                title="Edit"
                                                                btnStyle={[{
                                                                    width: 70,
                                                                    height: 40,
                                                                    backgroundColor: '#FFFFFF',
                                                                    borderRadius: 5,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    shadowOffset: { width: 1, height: 1 },
                                                                    shadowOpacity: 0.5,
                                                                    shadowRadius: 3,
                                                                    elevation: 0,
                                                                    shadowColor: '#575757',
                                                                }, { minWidth: 70 }]}
                                                                btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                                                onPress={() => {
                                                                    if (editAsset == false) {
                                                                        setMake(selectedAsset.Make)
                                                                        setYear(selectedAsset.Year)
                                                                        setModel(selectedAsset.Model)
                                                                        setColor(selectedAsset.Color)
                                                                        setAssetType(selectedAsset['Asset Type'])
                                                                        setMileage(selectedAsset.Mileage)
                                                                        setNotes(selectedAsset.Notes)
                                                                        setAssetName(selectedAsset['Asset Name'])
                                                                    }
                                                                    setEditAsset(!editAsset)
                                                                    // clearAll()
                                                                }} />
                                                        </View>
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <View style={{ flexDirection: 'column' }}>
                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Number</Text>
                                                                    <TextInput
                                                                        style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset['Asset Number']}
                                                                    // onChangeText={(val)=>setEmployeeNumber(val)}


                                                                    />
                                                                </View>
                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Plate Number</Text>
                                                                    <TextInput
                                                                        style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset['Plate Number']}
                                                                    // onChangeText={(val) => { setPlateNumber(val) }}

                                                                    />
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Make</Text>
                                                                    <TextInput
                                                                        style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset.Make}
                                                                    // onChangeText={(val) => { setMake(val) }}

                                                                    />
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Year</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset.Year}
                                                                        // onChangeText={(val) => { setYear(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Model</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset.Model}
                                                                        // onChangeText={(val) => { setModel(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Color</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset.Color}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                            </View>
                                                            <View style={{ flexDirection: 'column', marginLeft: 80 }}>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 4 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Engine Type</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset['Engine Type']}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>ADA Wheelchair</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset.ADA}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Air Brakes</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset['Air Brakes']}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Type</Text>
                                                                    <View>
                                                                        <TextInput
                                                                            style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                            editable={false}
                                                                            placeholderTextColor="#868383DC"
                                                                            value={selectedAsset['Asset Type']}
                                                                        // onChangeText={(val) => { setColor(val) }}

                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Mileage</Text>
                                                                    <TextInput
                                                                        style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset.Mileage}
                                                                    // onChangeText={(val) => { setMileage(val) }}

                                                                    />
                                                                </View>


                                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Notes</Text>
                                                                    <TextInput
                                                                        style={[styles.input, !editAsset && { backgroundColor: '#E2E2E2' }, textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                                        editable={false}
                                                                        placeholderTextColor="#868383DC"
                                                                        value={selectedAsset.Notes}
                                                                        multiline={true}
                                                                    // onChangeText={(val) => { setNotes(val) }}

                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>

                                                </ScrollView>

                                            </View>



                                        </>
                                    :
                                    options == '2'
                                        ?
                                        <>
                                            <View style={styles.optioncontentCardStyle}>
                                                <Form
                                                    columns={[
                                                        'formStatus',
                                                        'id',
                                                        'TimeStamp',
                                                        'assetName',
                                                        'driverName',
                                                        'Company name',
                                                        'Form name',
                                                    ]}
                                                    entriesData={dataState.value.data.filter((item) => item.assetNumber == selectedAsset['Asset Number'])}
                                                    titleForm="General Inspection"
                                                    onValueChange={handleInspectionFormValue}
                                                    row={styles.formRowStyle}
                                                    cell={styles.formCellStyle}
                                                    entryText={styles.formEntryTextStyle}
                                                    columnHeaderRow={styles.formColumnHeaderRowStyle}
                                                    columnHeaderCell={styles.formColumnHeaderCellStyle}
                                                    columnHeaderText={styles.formColumnHeaderTextStyle} />
                                            </View>
                                        </>
                                        :
                                        options == '3'
                                            ?
                                            <>
                                                <View style={styles.optioncontentCardStyle}>
                                                    <Form
                                                        columns={[
                                                            'id',
                                                            'assetName',
                                                            'dateCreated',
                                                            'priority',
                                                            'severity',
                                                            'title',
                                                            'driverName',
                                                            'Work Order',
                                                            'Action'
                                                        ]}
                                                        entriesData={defectState.value.defect.filter((item) => item.assetNumber == selectedAsset['Asset Number'])}
                                                        titleForm="Defects"
                                                        onValueChange={handleDefectFormValue}
                                                        onOpenWorkOrder={handleOpenWorkOrderValue}
                                                        row={styles.formRowStyle}
                                                        cell={styles.formCellStyle}
                                                        entryText={styles.formEntryTextStyle}
                                                        columnHeaderRow={styles.formColumnHeaderRowStyle}
                                                        columnHeaderCell={styles.formColumnHeaderCellStyle}
                                                        columnHeaderText={styles.formColumnHeaderTextStyle} />
                                                </View>
                                            </>
                                            :
                                            <>
                                                <View style={styles.optioncontentCardStyle}>
                                                    <Form
                                                        columns={[
                                                            'id',
                                                            'assetName',
                                                            'defectedItems',
                                                            'dueDate',
                                                            'assignedMechanic',
                                                            'Action',
                                                        ]}
                                                        entriesData={woState.value.data.filter((item) => item.assetNumber == selectedAsset['Asset Number'])}
                                                        titleForm="Work Order"
                                                        onValueChange={handleWOFormValue}
                                                        row={styles.formRowStyle}
                                                        cell={styles.formCellStyle}
                                                        entryText={styles.formEntryTextStyle}
                                                        columnHeaderRow={styles.formColumnHeaderRowStyle}
                                                        columnHeaderCell={styles.formColumnHeaderCellStyle}
                                                        columnHeaderText={styles.formColumnHeaderTextStyle} />
                                                </View>
                                            </>

                                :
                                <>

                                </>
                            }


                        </ScrollView>



                        {/* <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#67E9DA', paddingVertical: 20, justifyContent: 'flex-end', paddingRight: 80 }}>
                        <View>
                            <AppBtn
                                title="Close"
                                btnStyle={[{
                                    width: '100%',
                                    height: 30,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 0.9,
                                    shadowRadius: 5,
                                    elevation: 0,
                                    shadowColor: '#575757',
                                    marginHorizontal: 10
                                }, { minWidth: 70 }]}
                                btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                onPress={() => {
                                    setOpenDetail(false)
                                    setOptions('1')
                                    // clearAll()
                                }} />
                        </View>
                    </View> */}
                        {editAsset && options === '1'
                            ?
                            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#67E9DA', paddingVertical: 20, justifyContent: 'flex-end', paddingRight: 80 }}>
                                <View>
                                    <AppBtn
                                        title="Close"
                                        btnStyle={[{
                                            width: '100%',
                                            height: 30,
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowOffset: { width: 2, height: 2 },
                                            shadowOpacity: 0.9,
                                            shadowRadius: 5,
                                            elevation: 0,
                                            shadowColor: '#575757',
                                            marginHorizontal: 10
                                        }, { minWidth: 70 }]}
                                        btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                        onPress={() => {
                                            setAssetDetail(false)
                                            // clearAll()
                                        }} />
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <AppBtn
                                        title="Save"
                                        btnStyle={[{
                                            width: '100%',
                                            height: 30,
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowOffset: { width: 2, height: 2 },
                                            shadowOpacity: 0.9,
                                            shadowRadius: 5,
                                            elevation: 0,
                                            shadowColor: '#575757',
                                            marginHorizontal: 10
                                        }, { minWidth: 70 }]}
                                        btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                        onPress={() => {

                                            setloading(true)
                                            handleUpdateAsset()


                                        }} />
                                </View>
                            </View>
                            :
                            null}
                    </View>

                </TouchableWithoutFeedback>
                :
                createNewAssetModalVisible ?
                    <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#f6f8f9' }}
                        onPress={() => {
                            CloseAllDropDowns()
                        }}>
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ height: 100 }}>
                                <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 40, alignItems: 'center', }}>
                                    <Text style={{ fontSize: 30, color: '#1E3D5C', fontWeight: '900', marginLeft: 10, borderBottomColor: '#67E9DA', paddingBottom: 5, borderBottomWidth: 5 }}>
                                        Create New Asset
                                    </Text>
                                    <View>

                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>

                                    <View style={{ flexDirection: 'column', marginLeft: 40 }}>
                                        {fileUri
                                            ?
                                            <TouchableOpacity onPress={pickDocument}>
                                                <Image style={{ height: 100, width: 100, borderRadius: 50 }} source={{ uri: fileUri }} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 50, borderColor: '#cccccc', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }} onPress={pickDocument}>

                                                <Image style={{ height: 20, width: 20 }}
                                                    source={require('../../assets/add_photo_icon.png')}
                                                    tintColor='#67E9DA'></Image>
                                                <Text style={{ color: '#30E0CB' }}>Add Photo</Text>

                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <TextInput
                                        style={[styles.input, { borderColor: nameBorder }, textInputBorderColor == 'Asset Name' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                        placeholderTextColor="#868383DC"
                                        value={assetName}
                                        placeholder='Asset Name'
                                        onChangeText={(val) => setAssetName(val)}
                                        onFocus={() => setNameBorder('#cccccc')}

                                    />
                                </View>


                                <View style={[styles.contentCardStyle, { height: 'auto' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#67E9DA' }}></View>
                                        <Text style={{ color: '#1E3D5C', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                            Asset details
                                        </Text>
                                    </View>
                                    <ScrollView horizontal style={{ paddingBottom: 10 }} >
                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Number*</Text>
                                                    <TextInput
                                                        style={[styles.input, , textInputBorderColor == 'Asset Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                        placeholderTextColor="#868383DC"
                                                        value={assetNumber}
                                                    // onChangeText={(val)=>setEmployeeNumber(val)}

                                                    />
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Plate Number*</Text>
                                                    <TextInput
                                                        style={[styles.input, { borderColor: plateNumberBorder }, textInputBorderColor == 'Plate Number' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                        placeholderTextColor="#868383DC"
                                                        value={plateNumber}
                                                        onChangeText={(val) => { setPlateNumber(val) }}
                                                        onFocus={() => setPlateNumberBorder('#cccccc')}

                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Make*</Text>
                                                    <TextInput
                                                        style={[styles.input, { borderColor: makeBorder }, textInputBorderColor == 'Make' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                        placeholderTextColor="#868383DC"
                                                        value={make}
                                                        onChangeText={(val) => { setMake(val) }}
                                                        onFocus={() => setMakeBorder('#cccccc')}

                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Year*</Text>
                                                    <View>
                                                        <TextInput
                                                            style={[styles.input, { borderColor: yearBorder }, textInputBorderColor == 'Year' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                            placeholderTextColor="#868383DC"
                                                            value={year}
                                                            onChangeText={(val) => { setYear(val) }}
                                                            onFocus={() => setYearBorder('#cccccc')}

                                                        />
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Model*</Text>
                                                    <View>
                                                        <TextInput
                                                            style={[styles.input, { borderColor: modelBorder }, textInputBorderColor == 'Model' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                            placeholderTextColor="#868383DC"
                                                            value={model}
                                                            onChangeText={(val) => { setModel(val) }}
                                                            onFocus={() => setModelBorder('#cccccc')}

                                                        />
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Color</Text>
                                                    <View>
                                                        <TextInput
                                                            style={[styles.input, textInputBorderColor == 'Color' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                            placeholderTextColor="#868383DC"
                                                            value={color}
                                                            onChangeText={(val) => { setColor(val) }}

                                                        />
                                                    </View>
                                                </View>

                                            </View>
                                            <View style={{ flexDirection: 'column', marginLeft: 80 }}>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 4 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Engine Type*</Text>
                                                    <DropDownComponent
                                                        info='engineTypeSelection'
                                                        options={['Gas', 'Diesel']}
                                                        onValueChange={(val) => {
                                                            if (val != 'Select') {
                                                                setEngineTypeBorder('#cccccc')
                                                            }
                                                            setEngineType(val)
                                                        }}
                                                        // title="Ubaid Arshad"
                                                        selectedValue={engineType}
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
                                                        dropdownStyle={[styles.dropdown, { borderColor: engineTypeBorder }]}
                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>ADA Wheelchair*</Text>
                                                    <DropDownComponent
                                                        info='ADASelection'
                                                        options={['Yes', 'No']}
                                                        onValueChange={(val) => {
                                                            if (val != 'Select') {
                                                                setADABorder('#cccccc')
                                                            }
                                                            setADA(val)
                                                        }}
                                                        // title="Ubaid Arshad"
                                                        selectedValue={ADA}
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
                                                        dropdownStyle={[styles.dropdown, { borderColor: ADABorder }]}
                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Air Brakes*</Text>
                                                    <DropDownComponent
                                                        info='airBrakesSelection'
                                                        options={['Yes', 'No']}
                                                        onValueChange={(val) => {
                                                            if (val != 'Select') {
                                                                setAirBrakesBorder('#cccccc')
                                                            }
                                                            setAirBrakes(val)
                                                        }}
                                                        // title="Ubaid Arshad"
                                                        selectedValue={airBrakes}
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
                                                        dropdownStyle={[styles.dropdown, { borderColor: airBrakesBorder }]}
                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Asset Type*</Text>
                                                    <DropDownComponent
                                                        info='assetTypeSelection'
                                                        options={['Car', 'Bus', 'Van', 'Truck']}
                                                        onValueChange={(val) => {
                                                            if (val != 'Select') {
                                                                setAssetTypeBorder('#cccccc')
                                                            }
                                                            setAssetType(val)
                                                        }}
                                                        // title="Ubaid Arshad"
                                                        selectedValue={assetType}
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
                                                        dropdownStyle={[styles.dropdown, { borderColor: assetTypeBorder }]}
                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Mileage*</Text>
                                                    <TextInput
                                                        style={[styles.input, { borderColor: mileageBorder }, textInputBorderColor == 'Mileage' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                        placeholderTextColor="#868383DC"
                                                        value={mileage}
                                                        onChangeText={(val) => { setMileage(val) }}
                                                        onFocus={() => setMileageBorder('#Cccccc')}

                                                    />
                                                </View>


                                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Notes</Text>
                                                    <TextInput
                                                        style={[styles.input, textInputBorderColor == 'Notes' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                                        placeholderTextColor="#868383DC"
                                                        value={notes}
                                                        multiline={true}
                                                        onChangeText={(val) => { setNotes(val) }}

                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>

                            </ScrollView>

                            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#67E9DA', paddingVertical: 20, justifyContent: 'flex-end', paddingRight: 80 }}>
                                <View>
                                    <AppBtn
                                        title="Close"
                                        btnStyle={[{
                                            width: '100%',
                                            height: 30,
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowOffset: { width: 2, height: 2 },
                                            shadowOpacity: 0.9,
                                            shadowRadius: 5,
                                            elevation: 0,
                                            shadowColor: '#575757',
                                            marginHorizontal: 10
                                        }, { minWidth: 70 }]}
                                        btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                        onPress={() => {
                                            setCreateNewAssetModalVisible(false)
                                            // clearAll()
                                        }} />
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <AppBtn
                                        title="Save"
                                        btnStyle={[{
                                            width: '100%',
                                            height: 30,
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowOffset: { width: 2, height: 2 },
                                            shadowOpacity: 0.9,
                                            shadowRadius: 5,
                                            elevation: 0,
                                            shadowColor: '#575757',
                                            marginHorizontal: 10
                                        }, { minWidth: 70 }]}
                                        btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                        onPress={() => {
                                            if (assetName == '') {
                                                setNameBorder('red')
                                            }
                                            if (plateNumber == '') {
                                                setPlateNumberBorder('red')
                                            }
                                            if (make == '') {
                                                setMakeBorder('red')
                                            }
                                            if (year == '') {
                                                setYearBorder('red')
                                            }
                                            if (model == '') {
                                                setModelBorder('red')
                                            }
                                            if (engineType == 'Select') {
                                                setEngineTypeBorder('red')
                                            }
                                            if (ADA == 'Select') {
                                                setADABorder('red')
                                            }
                                            if (airBrakes == 'Select') {
                                                setAirBrakesBorder('red')
                                            }
                                            if (assetType == 'Select') {
                                                setAssetTypeBorder('red')
                                            }
                                            if (mileage == '') {
                                                setMileageBorder('red')
                                            }

                                            if (assetName == '' || plateNumber == '' || make == '' || year == '' || model == '' || engineType == 'Select' || ADA == 'Select' || airBrakes == 'Select' || assetType == 'Select' || mileage == '') {
                                            }
                                            else {
                                                setloading(true)
                                                addNewAsset()
                                            }

                                        }} />
                                </View>
                            </View>
                        </View>

                    </TouchableWithoutFeedback>
                    :
                    <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: '#f6f8f9' }}
                        onPress={() => {
                            CloseAllDropDowns()
                        }}>
                        <ScrollView style={{ height: 100 }}>
                            <View style={{ flexDirection: 'row', margin: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#23d3d3', borderRadius: 15, }}>
                                        <Image style={{ width: 30, height: 30, margin: 7 }}
                                            tintColor='#FFFFFF'
                                            source={require('../../assets/vehicle_icon.png')}></Image>
                                    </View>
                                    <Text style={{ fontSize: 30, color: '#335a75', fontFamily: 'inter-extrablack', marginLeft: 10 }}>
                                        Assets
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{totalAssets}</Text>
                                    <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '700' }}>Total assets</Text>
                                    <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 20, opacity: 0.5 }}></View>

                                    <Text style={{ fontSize: 45, color: '#D60000' }}>{assetsWithDefects}</Text>
                                    <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '700' }}>Assets with active defects</Text>
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

                                        />
                                    </View>
                                    <View style={{ marginRight: 10 }}>
                                        <DropDownComponent
                                            options={searchAssetOptionList}
                                            onValueChange={handleSearchAssetValueChange}
                                            // title="Ubaid Arshad"
                                            info='searchSelection'
                                            selectedValue={searchAssetSelectedOption}
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
                                    <View >
                                        <AppBtn
                                            title="Asset"
                                            imgSource={require('../../assets/add_plus_btn_icon.png')}
                                            btnStyle={styles.btn}
                                            btnTextStyle={styles.btnText}
                                            onPress={() => { handleAssetsAppBtn() }} />
                                    </View>
                                </View>

                            </View>
                            <View style={styles.contentCardStyle}>
                                {entriesData.length != 0
                                    ?
                                    <Form
                                        columns={columns}
                                        entriesData={searchAssetSelectedOption == 'Name' ? entriesData.filter((item) => item['Asset Name'].toLowerCase().includes(search.toLowerCase())) : searchAssetSelectedOption == 'License Plate' ? entriesData.filter((item) => item['Plate Number'].toLowerCase().includes(search.toLowerCase())) : entriesData}
                                        titleForm="Assets"
                                        onValueChange={handleFormValue}
                                        row={styles.formRowStyle}
                                        cell={styles.formCellStyle}
                                        entryText={styles.formEntryTextStyle}
                                        columnHeaderRow={styles.formColumnHeaderRowStyle}
                                        columnHeaderCell={styles.formColumnHeaderCellStyle}
                                        columnHeaderText={styles.formColumnHeaderTextStyle}
                                        onHandleAssetStatus={(val) => {
                                            setloading(true)
                                            handleChangeAssetStatus(val)
                                        }}
                                    />
                                    : null}
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
            }
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
            <Modal
                animationType="fade"
                visible={deleteAlertVisible}
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
                                        setDeleteAlertVisible(false)
                                        setloading(true)
                                        await deleteDoc(doc(db, "Assets", deleteAsset.toString()));
                                        // await deleteDoc(doc(db, `AllowedUsers`, deleteUser));
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
                                    onPress={() => setDeleteAlertVisible(false)}
                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[1] && { backgroundColor: '#67E9DA', borderColor: '#67E9DA' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[1] && { color: '#FFFFFF' }]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType="fade"
                visible={assignDriverModalVisible}
                transparent={true}>
                <TouchableWithoutFeedback
                    style={{ height: height, width: width }}
                    onPress={() => closeAssignDriverModal()}>
                    <View style={styles.centeredView}>
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 20, elevation: 5, maxHeight: '98%', width: 300 }}>
                                    <TextInput
                                        style={[styles.input, { height: 50, marginVertical: 20 }]}
                                        placeholder='Search'
                                        value={searchDriver}
                                        onChangeText={(val) => {
                                            setSearchDriver(val.toLowerCase())
                                        }}
                                    />
                                    <View style={{ height: 250 }}>
                                        <FlatList
                                            data={driversList}

                                            renderItem={({ item, index }) => {

                                                // const formattedSearchNumber = searchNumber.replace(/ /g, '');
                                                if (searchDriver === "" || item.employeeName.toLowerCase().includes(searchDriver)) {
                                                    return (
                                                        <View
                                                            onMouseEnter={() => setDriverAssignItemHovered({ [index]: true })}
                                                            onMouseLeave={() => setDriverAssignItemHovered({ [index]: false })}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setloading(true)
                                                                    handleDriverAssign(item.employeeName, item.employeeEmail)
                                                                    closeAssignDriverModal()
                                                                    // setAssignedDriver(item)
                                                                    // closeAssignDriverModal()
                                                                }}
                                                                style={[
                                                                    {
                                                                        marginTop: 15,
                                                                        borderWidth: 1,
                                                                        borderColor: '#cccccc',
                                                                        outlineStyle: 'none',
                                                                        padding: 10,
                                                                        borderRadius: 5,
                                                                    },
                                                                    driverAssignItemHovered[index] && {
                                                                        backgroundColor: '#67E9DA',
                                                                        borderColor: '#67E9DA',
                                                                    },
                                                                ]}
                                                            >
                                                                <Text>{item.employeeNumber} {item.employeeName}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }
                                            }} />

                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {loading ? CustomActivityIndicator() : null}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
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
        top: -40,  // Adjust this value to position the tooltip above the content
      },
      tooltipText: {
        color: '#fff',
      },
    input: {
        width: 250,
        height: 40,
        marginLeft: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none'
    },
    withBorderInputContainer: {
        // borderColor: '#558BC1',
        // shadowColor: '#558BC1',
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 1,
        // shadowRadius: 10,
        // elevation: 0,
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
        // overflow: 'scroll'
    },
    btn: {
        width: '100%',
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 0,
        shadowColor: '#575757',
        marginHorizontal: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'inter-bold'
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
        maxWidth: 150

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
        width: 'auto',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    formColumnHeaderCellStyle: {
        // width: 160,
        // paddingLeft:20
        flex: 1,
        maxWidth: 150

    },
    formColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 20,
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
    inspectionformRowStyle: {
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
    inspectionformCellStyle: {
        justifyContent: 'center',
        width: 160,
        height: 50,

        // paddingLeft: 20
    },
    inspectionformEntryTextStyle: {
        fontFamily: 'inter-regular',
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontSize: 13,
        color: '#000000'
    },

    inspectionformColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        // alignItems: 'center',
    },
    inspectionformColumnHeaderCellStyle: {
        width: 160,
        // paddingLeft:20

    },
    inspectionformColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 13
    },

    defectformRowStyle: {
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
    defectformCellStyle: {
        justifyContent: 'center',
        width: 140,


        // paddingLeft: 20
    },
    defectformEntryTextStyle: {
        fontFamily: 'inter-regular',
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontSize: 13,
        color: '#000000'
    },

    defectformColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        // alignItems: 'center',
    },
    defectformColumnHeaderCellStyle: {
        width: 140,
        // paddingLeft:20

    },
    defectformColumnHeaderTextStyle: {
        fontFamily: 'inter-bold',
        marginBottom: 5,
        // textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 13
    },
    optioncontentCardStyle: {
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
});

export default AssetsPage