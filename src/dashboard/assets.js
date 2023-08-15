import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Animated, Platform, TextInput, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';
import DropDownComponent from '../../components/DropDown';
import AlertModal from '../../components/AlertModal';
import * as DocumentPicker from 'expo-document-picker';

const columns = [
    'Name',
    'Forms',
    'Team Name',
    'Last Ins.',
    'License Plate',
    'Action'

];

const entriesData = [
    {
        'Name': 'Truck 1',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '14-01-2017',
        'License Plate': 'ABC-123',
        'Action': 'Button',
        'Hover': '#558BC1'
    },
    // Add more entries
    {
        'Name': 'Truck 2',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '22-10-2022',
        'License Plate': 'LEV-875',
        'Action': 'Button'
    },
    {
        'Name': 'Truck 3',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '15-04-2023',
        'License Plate': 'AA-567',
        'Action': 'Button'
    },
    // Add more entries
    {
        'Name': 'Truck 4',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '1-5-2021',
        'License Plate': 'ZRYU-9458',
        'Action': 'Button'
    },
    // Add more entries
    {
        'Name': 'Truck 5',
        'Forms': 1,
        'Team Name': 'Octa Soft',
        'Last Ins.': '14-07-2022',
        'License Plate': 'LKG-7654',
        'Action': 'Button'
    },
];


const AssetsPage = (props) => {

    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const [dashboardHovered, setDashboardHovered] = useState(false)
    const [inspectiondHovered, setInspectionHovered] = useState(false)
    const [maintenanceHovered, setMaintenanceHovered] = useState(false)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [assetsHovered, setAssetsHovered] = useState(false)
    const [usersHovered, setUsersHovered] = useState(false)
    const [inspectionCalendarSelect, setInspectionCalendarSelect] = useState('All')
    const [totalAssets, setTotalAssets] = useState(19)
    const [totalAssetsInspected, setTotalAssetsInspected] = useState(2)
    const [assetsWithDefects, setAssetsWithDefects] = useState(1)
    const [search, setSearch] = useState('')
    const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)
    const [searchAssetSelectedOption, setSearchAssetSelectedOption] = useState("Select")
    const [searchBtnHover, setSearchBtnHover] = useState(false)
    const [createNewAssetModalVisible, setCreateNewAssetModalVisible] = useState(false);
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')

    const { width, height } = Dimensions.get('window')
    const [fileUri, setFileUri] = useState(null);
    const [textInputBorderColor, setTextInputBorderColor] = useState('')

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*', // Change the MIME type to specify the type of files you want to allow
            });
          
            if (result.type === 'success') {
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

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        return () => {
            fadeAnim.setValue(0);
            setCreateNewAssetModalVisible(false)
        }

    }, [selectedPage])

    const handleDownloadReportBtn = () => {

    }

    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    let driver = [{
        name: "Ubaid",
        company: "DVIR",
        inspection: 5
    },
    {
        name: "John",
        company: "DVIR",
        inspection: 2
    },
    {
        name: "Doe",
        company: "DVIR",
        inspection: 0
    }]

    const asset = [{
        name: "Truck1",
        company: "DVIR",
        inspection: 4,
        defects: 1
    },
    {
        name: "Truck2",
        company: "DVIR",
        inspection: 2,
        defects: 3
    }]

    const handleAssetsAppBtn = () => {
        // props.onAddAssetBtn('CreateNewAsset')
        setCreateNewAssetModalVisible(true)
    }

    const handleFormValue = (value) => {
        console.log(value)
    }

    const handleSearchAssetValueChange = (value) => {
        setSearchAssetSelectedOption(value)
    }

    const searchAssetOptionList = ["Name", "License Plate",]

    return (
        <>
            {createNewAssetModalVisible ?
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, }]}>

                    <View style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        overflow: 'hidden',
                        height: height
                    }}>
                        <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                        <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                        <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                        <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
                    </View>
                    <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
                    <ScrollView style={{ height: 100 }}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 40, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 30, color: '#1E3D5C', fontWeight: '900', marginLeft: 10, borderBottomColor: '#67E9DA', paddingBottom: 5, borderBottomWidth: 5 }}>
                                Create New Asset
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 40, marginTop: 20 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 50, borderColor: '#cccccc',backgroundColor:'#FFFFFF', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }} onPress={pickDocument}>
                                    <Image style={{ height: 20, width: 20 }}
                                        source={require('../../assets/add_photo_icon.png')}
                                        tintColor='#67E9DA'></Image>
                                    <Text style={{ color: '#30E0CB' }}>Add Photo</Text>

                                </TouchableOpacity>
                                {fileUri && (
                                    <Text style={{ fontWeight: '600', marginTop: 10 }}>Image Selected</Text>
                                )}

                            </View>

                            <TextInput
                                style={[styles.input, { maxWidth: 200, marginBottom: 0, marginLeft: 20 }, textInputBorderColor == 'Enter Asset Name' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                placeholder="Enter Asset Name"
                                placeholderTextColor="#868383DC"
                                // value={""}
                                // onChangeText={(val) => { console.log(val) }}
                                onFocus={() => { setTextInputBorderColor('Enter Asset Name') }}
                                onBlur={() => { setTextInputBorderColor('') }}
                            />
                        </View>



                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.contentCardStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#67E9DA' }}></View>
                                    <Text style={{ color: '#1E3D5C', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                        Manufacturer details
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'VIN' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="VIN"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('VIN') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Make' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Make"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Make') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Model' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Model"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Model') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Year' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Year"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Year') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                    </View>


                                    <View style={{ flexDirection: 'column', marginLeft: 30 }}>
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'License' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="License"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('License') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Tire size' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Tire size"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Tire size') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Color' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Color"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Color') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                    </View>
                                </View>

                                <TextInput
                                    style={[{paddingTop:10},styles.input, textInputBorderColor == 'Notes' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                    placeholder="Notes"
                                    multiline
                                    placeholderTextColor="#868383DC"
                                    value={""}
                                    onChangeText={(val) => { console.log(val) }}
                                    onFocus={() => { setTextInputBorderColor('Notes') }}
                                    onBlur={() => { setTextInputBorderColor('') }}
                                />
                            </View>

                            <View style={styles.contentCardStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#67E9DA' }}></View>
                                    <Text style={{ color: '#1E3D5C', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
                                        Other details
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                    <View style={{ flexDirection: 'column', }}>
                                        <TextInput
                                            style={[styles.input, {}]}
                                            placeholder="Company"
                                            placeholderTextColor="#868383DC"
                                            value={"Octa Soft"}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Company') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                            editable={false}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Estimated Cost' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Estimated Cost"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Estimated Cost') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Asset Type' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Asset Type"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Asset Type') }}
                                            onBlur={() => { setTextInputBorderColor('') }}

                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Asset Subtype' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Asset Subtype"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Asset Subtype') }}
                                            onBlur={() => { setTextInputBorderColor('') }}

                                        />
                                    </View>

                                    <View style={{ flexDirection: 'column', marginLeft: 30 }}>
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Mileage' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Mileage"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Mileage') }}
                                            onBlur={() => { setTextInputBorderColor('') }}

                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Engine Hours' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Engine Hours"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Engine Hours') }}
                                            onBlur={() => { setTextInputBorderColor('') }}

                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Last service date' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Last service date"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Last service date') }}
                                            onBlur={() => { setTextInputBorderColor('') }}

                                        /><TextInput
                                            style={[styles.input, textInputBorderColor == 'Last service mileage' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Last service mileage"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Last service mileage') }}
                                            onBlur={() => { setTextInputBorderColor('') }}

                                        />
                                        <TextInput
                                            style={[styles.input, textInputBorderColor == 'Last service engine hours' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                                            placeholder="Last service engine hours"
                                            placeholderTextColor="#868383DC"
                                            value={""}
                                            onChangeText={(val) => { console.log(val) }}
                                            onFocus={() => { setTextInputBorderColor('Last service engine hours') }}
                                            onBlur={() => { setTextInputBorderColor('') }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#67E9DA', paddingVertical: 20, justifyContent: 'flex-end', paddingRight: 80 }}>
                        <View>
                            <AppBtn
                                title="Close"
                                btnStyle={[{
                                    width: '100%',
                                    height: 40,
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
                                }, { minWidth: 100 }]}
                                btnTextStyle={{ fontSize: 17, fontWeight: '400', color: '#000000' }}
                                onPress={() => {
                                    setCreateNewAssetModalVisible(false)
                                    
                                }} />
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <AppBtn
                                title="Save"
                                btnStyle={[{
                                    width: '100%',
                                    height: 40,
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
                                }, { minWidth: 100 }]}
                                btnTextStyle={{ fontSize: 17, fontWeight: '400', color: '#000000' }}
                               onPress={()=>setCreateNewAssetModalVisible(false)} />
                        </View>
                    </View>
                </Animated.View>
                :
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, }]}>

                    <View style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        overflow: 'hidden',
                        height: height
                    }}>
                        <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                        <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                        <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                        <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
                    </View>
                    <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
                    <ScrollView style={{ height: 100 }}>
                        <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, marginRight: 40, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                                    <Image style={{ width: 30, height: 30, margin: 10 }}
                                        tintColor='#FFFFFF'
                                        source={require('../../assets/vehicle_icon.png')}></Image>
                                </View>
                                <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                                    Assets
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{totalAssets}</Text>
                                <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '700' }}>Total assets</Text>
                                <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 20, opacity: 0.5 }}></View>
                                <Text style={{ fontSize: 45, color: '#1E3D5C' }}>{totalAssetsInspected}</Text>
                                <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '700' }}>Assets inspected </Text>
                                <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 20, opacity: 0.5 }}></View>
                                <Text style={{ fontSize: 45, color: '#D60000' }}>{assetsWithDefects}</Text>
                                <Text style={{ fontSize: 15, color: '#5B5B5B', marginHorizontal: 10, marginTop: 10, fontWeight: '700' }}>Assets with active defects</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop:40, paddingRight:40, zIndex: 1,}}>
                            <View style={{ marginRight: 10 }}>
                                <TextInput
                                    style={[styles.input,{marginTop:0}, searchTextInputBorderColor && styles.withBorderInputContainer]}
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
                                    options={searchAssetOptionList}
                                    onValueChange={handleSearchAssetValueChange}
                                    // title="Ubaid Arshad"
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
                            <View style={{ marginRight: 10 }}>
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
                            </View>

                            <View >
                                <AppBtn
                                    title="Asset"
                                    imgSource={require('../../assets/add_plus_btn_icon.png')}
                                    btnStyle={styles.btn}
                                    btnTextStyle={styles.btnText}
                                    onPress={() => { handleAssetsAppBtn() }} />
                            </View>
                        </View>
                        <View style={styles.contentCardStyle}>
                            <Form
                                columns={columns}
                                entriesData={entriesData}
                                titleForm="Assets"
                                onValueChange={handleFormValue}
                                row={styles.formRowStyle}
                                cell={styles.formCellStyle}
                                entryText={styles.formEntryTextStyle}
                                columnHeaderRow={styles.formColumnHeaderRowStyle}
                                columnHeaderCell={styles.formColumnHeaderCellStyle}
                                columnHeaderText={styles.formColumnHeaderTextStyle}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>
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

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none',
        marginTop:20
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
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        margin: 40,
        flex: 1
    },
    btn: {
        width: '100%',
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 0,
        shadowColor: '#575757',
        marginHorizontal: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    formRowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        //  borderBottomColor: '#ccc',
        marginBottom: 4,
        shadowColor: '#BADBFB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        marginLeft: 5,
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#BADBFB',
    },
    formCellStyle: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },
    formEntryTextStyle: {
        fontWeight: 'normal',
        fontSize: 13,
    },

    formColumnHeaderRowStyle: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        // paddingVertical: 15,
        alignItems: 'center',

    },
    formColumnHeaderCellStyle: {
        flex: 1,

    },
    formColumnHeaderTextStyle: {
        fontWeight: 'bold',
        marginBottom: 5,
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 14
    },
    dropdownContainer: {
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
    dropdown: {
        // Custom styles for the dropdown container
        // For example:
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        minWidth: 150,
        backgroundColor: '#FFFFFF',
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
    }
});

export default AssetsPage