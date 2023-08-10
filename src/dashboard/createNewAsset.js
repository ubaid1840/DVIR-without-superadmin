import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import * as DocumentPicker from 'expo-document-picker';

const CreateNewAssetModal = ({ isVisible, onClose, modalText }) => {

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

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.modalView}>
                    <ScrollView horizontal>
                        <ScrollView>
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                overflow: 'hidden'
                            }}>
                                <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
                                <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
                                <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
                                <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
                            </View>
                            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />


                            <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 40, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 30, color: '#1E3D5C', fontWeight: '900', marginLeft: 10, borderBottomColor: '#67E9DA', paddingBottom: 5, borderBottomWidth: 5 }}>
                                    Create New Asset
                                </Text>
                                <View>
                                    <AppBtn
                                        title="Save"
                                        btnStyle={[styles.btn, { minWidth: 100 }]}
                                        btnTextStyle={styles.btnText}
                                        onPress={() => console.log("save")} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 40, marginTop: 20 }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 50, borderColor: '#cccccc', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }} onPress={pickDocument}>

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



                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 40 }}>
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
                                        style={[styles.input, textInputBorderColor == 'Notes' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
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
                    </ScrollView>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                        <AppBtn
                            title="Close"
                            btnStyle={[styles.btn, { marginLeft: 20 }]}
                            btnTextStyle={styles.btnText}
                            onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        maxHeight: '90%',
        maxWidth: '90%'
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
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none',
        marginVertical:5
    },
    withBorderInputContainer: {
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,
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
        shadowColor: '#575757'
    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 15,
    },
    withBorderInputContainer: {
        borderColor: '#558BC1',
        shadowColor: '#558BC1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 0,
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
});

export default CreateNewAssetModal;
