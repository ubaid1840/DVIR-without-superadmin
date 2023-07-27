import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../components/Button';

const CreateNewAssetModal = ({ isVisible, onClose, modalText }) => {


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
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


                            <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 40, alignItems: 'center', justifyContent:'space-between' }}>
                                <Text style={{ fontSize: 30, color: '#1E3D5C', fontWeight: '900', marginLeft: 10, borderBottomColor: '#67E9DA', paddingBottom: 5, borderBottomWidth: 5 }}>
                                    Create New Asset
                                </Text>
                                <View>
                                <AppBtn
                                    title="Save"
                                    btnStyle={[styles.btn, {minWidth:100}]}
                                    btnTextStyle={styles.btnText}
                                    onPress={() => console.log("save")} />
                                    </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 40, marginTop: 20 }}>
                                <TouchableOpacity style={{ width: 100, height: 100, borderRadius: 50, borderColor: '#cccccc', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image style={{ height: 20, width: 20, tintColor: '#67E9DA' }} source={require('../../assets/add_photo_icon.png')}></Image>
                                    <Text style={{ color: '#30E0CB' }}>Add Photo</Text>

                                </TouchableOpacity>
                                <TextInput
                                    style={[styles.input, { maxWidth: 200, marginBottom: 0, marginLeft: 20 } /*&& styles.withBorderInputContainer*/]}
                                    placeholder="Enter Asset Name"
                                    placeholderTextColor="#868383DC"
                                    // value={""}
                                    // onChangeText={(val) => { console.log(val) }}
                                    onFocus={() => { }}
                                    onBlur={() => { }}

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
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="VIN"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Make"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Model"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Year"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                        </View>


                                        <View style={{ flexDirection: 'column', marginLeft: 30 }}>
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="License"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Tire size"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Color"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                        </View>
                                    </View>

                                    <TextInput
                                        style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                        placeholder="Notes"
                                        multiline
                                        placeholderTextColor="#868383DC"
                                        value={""}
                                        onChangeText={(val) => { console.log(val) }}
                                        onFocus={() => { }}
                                        onBlur={() => { }}
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
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="VIN"
                                                placeholderTextColor="#868383DC"
                                                value={"Octa Soft"}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                                editable={false}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Estimated Cost"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Asset Type"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Asset Subtype"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'column', marginLeft: 30 }}>
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Mileage"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Engine Hours"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Last service date"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            /><TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Last service mileage"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                            <TextInput
                                                style={[styles.input, {} /*&& styles.withBorderInputContainer*/]}
                                                placeholder="Last service engine hours"
                                                placeholderTextColor="#868383DC"
                                                value={""}
                                                onChangeText={(val) => { console.log(val) }}
                                                onFocus={() => { }}
                                                onBlur={() => { }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </ScrollView>
                    <View style={{ flexDirection: 'row' }}>

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    }, input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        outlineStyle: 'none',
        marginBottom: 20
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
});

export default CreateNewAssetModal;
