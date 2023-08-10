import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { View, Modal, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import AppBtn from "./Button"
import { useState } from "react"


const AppModal = ({ isVisible, onClose, optionList, entryText, sendData }) => {

    const [optionListHovered, setOptionListHovered] = useState({})

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.centeredView}>
                    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                    <TouchableWithoutFeedback >
                    <View style={styles.modalView}>

                        <View style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: 'hidden'
                        }}>
                            <LinearGradient colors={['#AE276D', '#B10E62']} />
                            <LinearGradient colors={['#2980b9', '#3498db']} />
                            <LinearGradient colors={['#678AAC', '#9b59b6']} />
                            <LinearGradient colors={['#EFEAD2', '#FAE2BB']} />
                        </View>
                        <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />

                        <View style={{ flexDirection: 'column', marginHorizontal: 40, alignItems: 'center', justifyContent: 'space-between' }}>

                            {optionList.map((value, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            sendData(optionList[index])
                                            onClose()
                                        }}
                                        onMouseEnter={() => setOptionListHovered(prevState => ({ ...prevState, [index]: true }))}
                                        onMouseLeave={() => setOptionListHovered(prevState => ({ ...prevState, [index]: false }))}
                                        style={[{ marginVertical: 10, borderWidth: 1, height: 50, width: 100, borderRadius: 5, opacity: 1, borderColor: '#A2A2A2', justifyContent: 'center', alignItems: 'center' }, optionListHovered[index] && { backgroundColor: '#67E9DA', borderWidth: 0 }]}>
                                        <Text style={[entryText,{fontSize:16}, optionListHovered[index] && { color: 'white' }]}>{value}</Text>
                                    </TouchableOpacity>
                                )
                            })}

                            {/* <View style={{ marginTop: 20 }}>
                                    <AppBtn
                                        title="Close"
                                        btnStyle={[styles.btn, {minWidth:100}]}
                                        btnTextStyle={styles.btnText}
                                        onPress={onClose} />
                                </View> */}
                        </View>
                    </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
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

})

export default AppModal