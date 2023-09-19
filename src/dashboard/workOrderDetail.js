import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, TextInput, Dimensions, ActivityIndicator, Modal } from "react-native"
import AppBtn from "../../components/Button";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import app from "../config/firebase";
import { DataContext } from "../store/context/DataContext";
import { AuthContext } from "../store/context/AuthContext";
import { DefectContext } from "../store/context/DefectContext";
import { subscribeToCollection } from "./defectFirebaseService";
import DropDownComponent from "../../components/DropDown";
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { PeopleContext } from "../store/context/PeopleContext";
import { AssetContext } from "../store/context/AssetContext";
import AlertModal from "../../components/AlertModal";
import { subscribeToCollectionWorkOrder } from "./workOrderFirebaseService";
import { BlurView } from "expo-blur";



const WorkOrderDetail = ({ value, returnWorkOrderDetail }) => {

    const db = getFirestore(app)

    const [selectedWorkOrder, setSelectedWorkOrder] = useState(value)
    const [loading, setLoading] = useState(false)
    const [plateNumber, setPlateNumber] = useState('')
    const [workOrderVariable, setWorkOrderVariable] = useState([])
    const [addTask, setAddTask] = useState('')
    const [openAddItems, setOpenAddItems] = useState(false)
    const [workOrderAddItemVariable, setWorkOrderAddItemVariable] = useState([])
    const [partsSubTotal, setPartsSubTotal] = useState('0')
    const [partsTax, setPartsTax] = useState('')
    const [laborSubTotal, setLaborSubTotal] = useState('0')
    const [laborTax, setLaborTax] = useState('')
    const [netTotal, setNetTotal] = useState('0.00')
    const [completionMileage, setCompletionMileage] = useState('')
    const flatlistRef = useRef()
    const [comment, setComment] = useState('')
    const [searchTextInputBorderColor, setSearchTextInputBorderColor] = useState(false)
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const [totalItems, setTotalItems] = useState()
    const { state: assetState } = useContext(AssetContext)
    const { state: authState, setAuth } = useContext(AuthContext)

    useEffect(() => {

        const plate = [...assetState.value.data.filter((item) => item['Asset Number'].toString() === selectedWorkOrder.assetNumber)]
        setPlateNumber(plate[0]['Plate Number'])
        setTotalItems(selectedWorkOrder.defectedItems.length)

    }, [])

    useEffect(() => {

        const unsubscribe = subscribeToCollectionWorkOrder('myCollection', (newData) => {
            // console.log(newData)
            // console.log(selectedDefect)

            const updatedSelectedWorkOrder = newData.find((workOrder) => workOrder.id === selectedWorkOrder.id);

            if (updatedSelectedWorkOrder) {
                // console.log('found')
                setSelectedWorkOrder(updatedSelectedWorkOrder); // Update the selectedDefect state with the latest data
            }
            // setDefectedArray(newData)
            // setDefect(newData)
            setLoading(false)
        });

        return () => {
            // Unsubscribe when the component unmounts
            unsubscribe();
        };
    }, []);

    useEffect(() => {

        const temp = [...selectedWorkOrder.defectedItems]

        if (temp.length != 0) {
            if (temp[0].hasOwnProperty('description')) {
                console.log(temp)

                let totalPartsSum = 0;
                let totalLaborSum = 0

                for (const item of temp) {
                    totalPartsSum += (parseFloat(item.parts) || 0) * (parseFloat(item.qty) || 0);
                    totalLaborSum += parseFloat(item.labor) || 0;
                }

                setNetTotal((totalPartsSum + totalLaborSum).toFixed(2).toString())
                setPartsSubTotal(totalPartsSum.toString())
                setLaborSubTotal(totalLaborSum.toString())

                setWorkOrderVariable(temp)
            }
            else {
                const dataWithAdditionalProperties = temp.map(item => ({
                    ...item,
                    priority: selectedWorkOrder.priority,
                    description: "",
                    labor: 0,
                    qty: 0,
                    parts: 0,
                    total: 0
                }));
                setWorkOrderVariable(dataWithAdditionalProperties)
            }
        }



    }, [])

    const handleUpdateTotal = async (index, total, labor, qty, parts) => {
        const updatedItems = [...workOrderVariable];
        updatedItems[index].total = total;
        updatedItems[index].qty = qty;
        updatedItems[index].labor = labor
        updatedItems[index].parts = parts

        let totalPartsSum = 0;
        let totalLaborSum = 0

        for (const item of updatedItems) {
            totalPartsSum += (parseFloat(item.parts) || 0) * (parseFloat(item.qty) || 0);
            totalLaborSum += parseFloat(item.labor) || 0;
        }

        setNetTotal((totalPartsSum + totalLaborSum).toFixed(2).toString())
        setPartsSubTotal(totalPartsSum.toString())
        setLaborSubTotal(totalLaborSum.toString())
        console.log(updatedItems)
        await updateDoc(doc(db, 'WorkOrders', selectedWorkOrder.id.toString()), {
            'defectedItems': [...updatedItems]
        })
        setWorkOrderVariable(updatedItems);

        setLoading(false)

    };

    const handleUpdateDescription = async (index, description) => {
        const updatedItems = [...workOrderVariable];
        updatedItems[index].description = description;
        console.log(updatedItems)
        setWorkOrderVariable(updatedItems);
        await updateDoc(doc(db, 'WorkOrders', selectedWorkOrder.id.toString()), {
            'defectedItems': [...updatedItems]
        })
        setLoading(false)
    }

    const handleUpdateItems = async (index, item) => {
        let totalPartsSum = 0;
        let totalLaborSum = 0

        for (const items of item) {
            totalPartsSum += (parseFloat(items.parts) || 0) * (parseFloat(items.qty) || 0);
            totalLaborSum += parseFloat(items.labor) || 0;
        }

        setNetTotal((totalPartsSum + totalLaborSum).toFixed(2).toString())
        setPartsSubTotal(totalPartsSum.toString())
        setLaborSubTotal(totalLaborSum.toString())  
        
        setWorkOrderVariable(item)
        await updateDoc(doc(db, 'WorkOrders', selectedWorkOrder.id.toString()), {
            'defectedItems': [...item]
        })
        setLoading(false)

    }


    const WorkOrderVariableTable = useCallback(({ item, index, onUpdateTotal, onUpdateDescription, onUpdateTotalItems }) => {

        const [hover, setHover] = useState(false)
        const [descriptionValue, setDescriptionValue] = useState(item.description)
        const [laborValue, setLaborValue] = useState(item.labor == 0 ? '' : item.labor.toString());  // Initial value of labor
        const [qtyValue, setQtyValue] = useState(item.qty == 0 ? '' : item.qty.toString());  // Initial value of qty
        const [partsValue, setPartsValue] = useState(item.parts == 0 ? '' : item.parts.toString());  // 
        const qtyRef = useRef()
        const partsRef = useRef()
        const laborRef = useRef()
        const descriptionRef = useRef()

        const calculateTotal = () => {
            const labor = parseFloat(laborRef.current.value) || 0;
            const qty = parseFloat(qtyRef.current.value) || 0;
            const parts = parseFloat(partsRef.current.value) || 0;
            return labor + (qty * parts);
        };

        const handleUpdateTotal = () => {
            const newTotal = calculateTotal();
            console.log(newTotal)
            if (newTotal !== parseFloat(item.total)) {
                onUpdateTotal(index, newTotal.toString(), laborValue, qtyValue, partsValue);
            }
        }

        const handleSaveDescription = () => {
            onUpdateDescription(index, descriptionRef.current.value)
        }




        const handleDeleteWorkOrderItem = (index) => {
            const temp = [...workOrderVariable]
            const updatedItems = temp.filter((item, i) => i !== index);
            setTotalItems(updatedItems.length)
            onUpdateTotalItems(index, updatedItems)
        }

        return (
            <View style={{ flexDirection: 'row', paddingVertical: 15, borderWidth: 1, borderRightWidth: 0, borderLeftWidth: 0, borderColor: '#cccccc', alignItems: 'center', }}>
                <View style={{ minWidth: 70 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>#{index + 1}</Text>
                </View>
                <View style={{ minWidth: 150 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.priority}</Text>
                </View >
                <View style={{ minWidth: 200, paddingRight: 5 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.title}</Text>
                </View >

                <TextInput style={[styles.input, { width: 300 }]}
                    ref={descriptionRef}
                    value={descriptionValue}
                    onChangeText={setDescriptionValue}
                    onSubmitEditing={() => {
                        setLoading(true)
                        handleSaveDescription()
                    }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>$</Text>
                    <TextInput style={[styles.input, { width: 100, }]}
                        ref={laborRef}
                        value={laborValue}
                        onChangeText={setLaborValue}
                        placeholder="0"
                        placeholderTextColor="#868383DC"
                        onSubmitEditing={() => {
                            handleUpdateTotal()
                        }} />

                </View>


                <TextInput style={[styles.input, { width: 100 }]}
                    ref={qtyRef}
                    placeholder="0"
                    value={qtyValue}
                    onChangeText={setQtyValue}
                    placeholderTextColor="#868383DC"
                    onSubmitEditing={() => {
                        handleUpdateTotal()
                    }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>$</Text>
                    <TextInput style={[styles.input, { width: 100 }]}
                        ref={partsRef}
                        placeholder="0"
                        value={partsValue}
                        onChangeText={setPartsValue}
                        placeholderTextColor="#868383DC"
                        onSubmitEditing={() => {
                            handleUpdateTotal()
                        }} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>$</Text>
                        <TextInput style={[styles.input, { width: 100 }]}
                            value={item.total.toString()}
                            placeholder="0"
                            placeholderTextColor="#868383DC"
                            editable={false} />
                    </View>
                    <TouchableOpacity style={{ marginLeft: 5, marginRight: 15 }} onPress={() => {
                        setLoading(true)
                        handleDeleteWorkOrderItem(index)}}>
                        <Image style={{ height: 25, width: 25 }} source={require('../../assets/delete_icon.png')} tintColor="#4D4D4D"></Image>
                    </TouchableOpacity>
                </View >


            </View>
        )
    }, [workOrderVariable])

    const handleAddItem = () => {
        setWorkOrderAddItemVariable((prevState) => {
            const newState = [...prevState]
            newState.push({
                title: addTask,
                timeStamp: new Date().getTime(),
                priority: selectedWorkOrder.priority,
                description: "",
                labor: 0,
                qty: 0,
                parts: 0,
                total: 0
            })
            return newState
        })
        setAddTask('')
    }


    const WorkOrderVariableAddItemTable = useCallback(({ item, index }) => {

        const [hover, setHover] = useState(false)

        const handleDeleteWorkOrderItem = (index) => {
            const temp = [...workOrderAddItemVariable]
            const updatedItems = temp.filter((item, i) => i !== index);
            setWorkOrderAddItemVariable(updatedItems)

        }

        return (
            <View style={{ flexDirection: 'row', padding: 15, borderWidth: 1, borderColor: '#cccccc', alignItems: 'center' }}>
                <View style={{ minWidth: 100 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>#{index + 1}</Text>
                </View>
                <View style={{ minWidth: 250 }}>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, }}>{item.title}</Text>
                </View >
                <View style={{ minWidth: 250, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 25, width: 25 }} tintColor="#cccccc" source={require('../../assets/calendar_icon.png')}></Image>
                    <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginLeft: 10 }}>{(new Date().toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString())}</Text>
                </View>
                <TouchableOpacity style={{ paddingVertical: 4, paddingHorizontal: 15, borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, position: 'absolute', top: 10, bottom: 10, right: 15 }} onPress={() => handleDeleteWorkOrderItem(index)}>
                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/delete_icon.png')} tintColor="#4D4D4D"></Image>
                </TouchableOpacity>
            </View>
        )
    }, [workOrderAddItemVariable])

    const handleAddItemsSave = async () => {

        const temp = [...workOrderVariable]
        workOrderAddItemVariable.forEach((item) => {
            temp.push(item)
        })
        setTotalItems(temp.length)
        await updateDoc(doc(db, 'WorkOrders', selectedWorkOrder.id.toString()), {
            'defectedItems': [...temp]
        })
        setWorkOrderVariable(temp)
        setLoading(false)
    }

    const handleDeleteWorkOrder = async () => {

    }

    const updateComment = async () => {

        const currentDate = new Date();
        const currentTimeInMillis = currentDate.getTime();
        let oldComments = [...selectedWorkOrder.comments]

        // console.log(oldComments)
        oldComments.push({
            sendBy: authState.value.name,
            msg: comment,
            timeStamp: currentTimeInMillis
        })
        // console.log(oldComments)

        const dbRef = doc(db, 'WorkOrders', selectedWorkOrder.id.toString())
        await updateDoc(dbRef, {
            comments: oldComments
        })
    }


    const closeAlert = () => {
        setAlertIsVisible(false)
    }

    const fetchData = async () => {


        setLoading(false)
        returnWorkOrderDetail('nill')
    }

    const updateWOStatus = async () => {
        updateDoc(doc(db, 'WorkOrders', selectedWorkOrder.id.toString()), {
            'status': 'Completed',
            'mileage': completionMileage
        })
    }

    const updatePendingWOStatus = async () => {
        updateDoc(doc(db, 'WorkOrders', selectedWorkOrder.id.toString()), {
            'status': 'Pending',
        })
    }


    if (selectedWorkOrder.length != 0) {
        return (
            <>
                <View style={{ flex: 1, backgroundColor: '#f6f8f9' }}>
                    <ScrollView style={{ height: 100 }}
                        contentContainerStyle={{ paddingHorizontal: 30 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 20 }}>
                            <Text style={{ fontFamily: 'inter-semibold', fontSize: 30 }}>WO-{selectedWorkOrder.id}</Text>
                            <View>
                                <AppBtn
                                    title="Delete"
                                    btnStyle={[styles.btn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ADADAD' }]}
                                    btnTextStyle={[styles.btnText, { fontFamily: 'inter-regular', color: '#000000', fontSize: 13 }]}
                                    onPress={() => {
                                        // setStatusLoading(true)
                                        // updateStatus('In Progress')
                                        setDeleteModal(true)
                                    }} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={[styles.newContentCardStyle,]}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingVertical: 20, marginBottom: 10 }}>
                                    <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Work Order</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Work Order ID:</Text>
                                    <Text style={{}}>{selectedWorkOrder.id}</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Status:</Text>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={{}}>{selectedWorkOrder.status}</Text>
                                    {selectedWorkOrder.status == 'Completed'
                                    ?
                                <Image style={{height:20, width:20, marginLeft:10}} tintColor='green' source={require('../../assets/completed_icon.png')}></Image>
                                : null}
                                    </View>
                                    
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Due Date:</Text>
                                    <Text style={{}}>{new Date(selectedWorkOrder.dueDate).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' })}</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Assignee:</Text>
                                    <Text style={{}}>{selectedWorkOrder.assignedMechanic}</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Items:</Text>
                                    <Text style={{}}>{totalItems}</Text>
                                </View>
                            </View>

                            <View style={[styles.newContentCardStyle]}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingVertical: 20, marginBottom: 10 }}>
                                    <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Asset</Text>
                                </View>

                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Asset Name:</Text>
                                    <Text style={{}}>{selectedWorkOrder.assetName}</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Make, Model, Year:</Text>
                                    <Text style={{}}>{`${selectedWorkOrder.assetMake}, ${selectedWorkOrder.assetModel}, ${selectedWorkOrder.assetYear}`}</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>License Plate:</Text>
                                    <Text style={{}}>{plateNumber}</Text>
                                </View>
                                <View style={styles.subViewStyle}>
                                    <Text style={{ width: 200, fontFamily: 'inter-medium', fontSize: 15 }}>Mileage:</Text>
                                    <Text style={{}}>{selectedWorkOrder.mileage}</Text>
                                </View>

                            </View>

                        </View>


                        <View style={[styles.newContentCardStyle, { width: '100%' }]}>

                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingVertical: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Items</Text>
                                <View style={{}}>
                                    <AppBtn
                                        title="Items"
                                        imgSource={require('../../assets/add_plus_btn_icon.png')}
                                        btnStyle={styles.addBtn}
                                        btnTextStyle={styles.addBtnText}
                                        onPress={() => { setOpenAddItems(true) }} />
                                </View>
                            </View>

                            <View style={{ width: '100%', borderColor: '#6B6B6B', paddingHorizontal: 25 }}>
                                <ScrollView horizontal>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row', marginVertical: 15, }}>
                                            <View style={{ width: 70 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, }}>ID</Text>
                                            </View>
                                            <View style={{ width: 150, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, width: 200 }}>Priority</Text>
                                            </View >
                                            <View style={{ width: 200, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, }}>Title</Text>
                                            </View>
                                            <View style={{ width: 300, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, }}>Description</Text>
                                            </View>
                                            <View style={{ width: 100, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, }}>Labor</Text>
                                            </View>
                                            <View style={{ width: 100, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, }}>Qty</Text>
                                            </View>
                                            <View style={{ width: 100, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14, }}>Parts</Text>
                                            </View>
                                            <View style={{ width: 100, marginLeft: 5 }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>Total</Text>
                                            </View>

                                        </View>
                                        {workOrderVariable.map((item, index) => {
                                            return (
                                                <WorkOrderVariableTable
                                                    key={index.toString()}
                                                    item={item}
                                                    index={index}
                                                    onUpdateTotal={(idx, total, labor, qty, parts) => handleUpdateTotal(idx, total, labor, qty, parts)}
                                                    onUpdateDescription={(idx, description) => handleUpdateDescription(idx, description)} 
                                                    onUpdateTotalItems={(idx, item) => handleUpdateItems(idx, item)}/>
                                            )
                                        })}
                                    </View>
                                </ScrollView>

                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={[styles.newContentCardStyle, { width: '48%' }]}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingVertical: 20, width: '100%', }}>
                                    <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Activity</Text>
                                </View>
                                <View style={{ margin: 25, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#23d3d3' }}>
                                    <Text style={{ fontFamily: 'inter-medium', fontSize: 15, color: '#23d3d3' }}>Comments</Text>
                                </View>
                                {selectedWorkOrder.comments.length == 0
                                    ?
                                    <View style={{ borderWidth: 1, padding: 35, margin: 25, borderColor: '#C6C6C6' }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 14 }}>There are no comments</Text>
                                    </View>
                                    :
                                    <FlatList
                                        style={{ maxHeight: 300 }}
                                        data={selectedWorkOrder.comments}
                                        ref={flatlistRef}
                                        onContentSizeChange={() => {
                                            if (selectedWorkOrder.comments.length != 0) {
                                                flatlistRef.current.scrollToEnd({ animated: true })
                                            }
                                        }}
                                        onLayout={() => {
                                            if (selectedWorkOrder.comments.length != 0) {
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
                                        style={[styles.input, { marginLeft: 5, width: '100%' }, searchTextInputBorderColor && styles.withBorderInputContainer]}
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

                            <View style={{ flexDirection: 'column', width: '48%' }}>
                                <View style={[styles.newContentCardStyle, { width: '100%' }]}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingVertical: 20, width: '100%', }}>
                                        <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Cost Summary</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>Parts sub total:</Text>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>{partsSubTotal}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between', width: '100%', marginVertical: 10, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>Parts Tax:</Text>
                                            <TextInput style={[styles.input, { width: 100, }]}
                                                value={partsTax}
                                                onChangeText={setPartsTax}
                                                placeholder="0"
                                                placeholderTextColor="#868383DC"
                                            />
                                        </View>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>{(parseFloat(partsSubTotal) || 0) * (parseFloat(partsTax) || 0) / 100}</Text>
                                    </View>

                                    <View style={{ width: '90%', borderBottomWidth: 1, borderBottomColor: '#C6C6C6', marginTop: 10, alignSelf: 'center' }}></View>

                                    <View style={{ flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>Labor sub total:</Text>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>{laborSubTotal}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between', width: '100%', marginVertical: 10, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>Labor Tax:</Text>
                                            <TextInput style={[styles.input, { width: 100, }]}
                                                value={laborTax}
                                                onChangeText={setLaborTax}
                                                placeholder="0"
                                                placeholderTextColor="#868383DC"
                                            />
                                        </View>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>{(parseFloat(laborSubTotal) || 0) * (parseFloat(laborTax) || 0) / 100}</Text>
                                    </View>

                                    <View style={{ width: '90%', borderBottomWidth: 1, borderBottomColor: '#C6C6C6', marginTop: 10, alignSelf: 'center' }}></View>

                                    <View style={{ flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 20, color: '#000000' }}>Total:</Text>
                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 20, color: '#000000' }}>
                                            $ {((parseFloat(netTotal) || 0) + ((parseFloat(laborSubTotal) || 0) * (parseFloat(laborTax) || 0) / 100) + ((parseFloat(partsSubTotal) || 0) * (parseFloat(partsTax) || 0) / 100)).toFixed(2)}
                                        </Text>
                                    </View>

                                </View>

                                <View style={[styles.newContentCardStyle, { width: '100%' }]}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#C6C6C6', paddingHorizontal: 25, paddingVertical: 20, width: '100%', }}>
                                        <Text style={{ color: '#353535', fontFamily: 'inter-medium', fontSize: 20 }}>Completion</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>Date</Text>
                                            <View style={{ height: 50, justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000', marginTop: 10 }}>{new Date().toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View>
                                                <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000' }}>Mileage</Text>
                                                {selectedWorkOrder.status == 'Pending'
                                                    ?
                                                    <TextInput style={[styles.input, { width: 200, marginTop: 10, paddingHorizontal: 10, marginLeft: 0 }]}
                                                        value={completionMileage}
                                                        onChangeText={setCompletionMileage}
                                                        placeholder="0"
                                                        placeholderTextColor="#868383DC"
                                                    />
                                                    :
                                                    <View style={{ height: 50, justifyContent: 'center' }}>
                                                        <Text style={{ fontFamily: 'inter-medium', fontSize: 16, color: '#000000', marginTop: 10 }}>{selectedWorkOrder.mileage}</Text>
                                                    </View>
                                                }
                                            </View>

                                        </View>
                                    </View>
                                    {selectedWorkOrder.status == 'Pending'
                                        ?
                                        <View style={{ width: '90%', alignSelf: 'center' }}>
                                            <AppBtn
                                                title="Complete WO"
                                                btnStyle={[styles.btn]}
                                                btnTextStyle={styles.btnText}
                                                onPress={() => {
                                                    updateWOStatus()
                                                    // setOpenAddItems(false)
                                                    // clearAll()
                                                }} />
                                        </View>
                                        :
                                        <View style={{ width: '90%', alignSelf: 'center' }}>
                                            <AppBtn
                                                title="Mark as Pending"
                                                btnStyle={[styles.btn, {backgroundColor:'orange'}]}
                                                btnTextStyle={styles.btnText}
                                                onPress={() => {
                                                    updatePendingWOStatus()
                                                    // setOpenAddItems(false)
                                                    // clearAll()
                                                }} />
                                        </View>
                                    }

                                </View>

                            </View>

                        </View>
                    </ScrollView>
                </View>

                <Modal
                    animationType="fade"
                    visible={openAddItems}
                    transparent={true}>

                    <ScrollView style={{ height: 100, width: '100%', backgroundColor: '#555555A0' }}
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 30 }}>
                        {/* <Blu intensity={40} tint="dark" style={StyleSheet.absoluteFill} /> */}
                        <View style={{ width: '60%', backgroundColor: '#ffffff' }}>

                            <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#C9C9C9', flexDirection: 'row' }}>
                                <View>
                                    <Text style={{ fontFamily: 'inter-bold', color: 'grey', fontSize: 18 }}>Add Items</Text>
                                </View>
                                <TouchableOpacity onPress={() => setOpenAddItems(false)}>
                                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/cross_icon.png')}></Image>
                                </TouchableOpacity>
                            </View>


                            <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20, zIndex: 1 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'inter-medium', fontSize: 14, marginTop: 20, marginBottom: 20 }}>Asset : {selectedWorkOrder.assetName}</Text>
                                    <Text style={{ fontFamily: 'inter-medium', fontSize: 14, marginTop: 20, marginBottom: 20 }}>Mileage : {selectedWorkOrder.mileage}</Text>
                                </View>


                                <Text style={{ fontFamily: 'inter-regular', fontSize: 14, marginBottom: 10 }}>Items</Text>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderColor: '#cccccc', }}>
                                        <Image style={{ height: 20, width: 20 }} source={require('../../assets/add_plus_btn_icon.png')} tintColor='#cccccc'></Image>
                                    </View>
                                    <TextInput
                                        style={[styles.input, { borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingHorizontal: 0, marginLeft: 0, paddingLeft: 0, width: '100%' }]}
                                        placeholderTextColor="#868383DC"
                                        placeholder="Add or Create Service Task"
                                        value={addTask}
                                        onChangeText={setAddTask}
                                        onSubmitEditing={handleAddItem}
                                    />
                                </View>
                                <View style={{ marginTop: 15, width: '100%', borderColor: '#6B6B6B' }}>
                                    {workOrderAddItemVariable.map((item, index) => {
                                        return (
                                            <WorkOrderVariableAddItemTable
                                                key={index.toString()}
                                                item={item}
                                                index={index} />
                                        )
                                    })}
                                </View>

                                {/* <View style={{ marginTop: 40, width: '100%', borderWidth: 1, borderColor: '#cccccc', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                                        <View style={{ marginVertical: 15, width: '40%' }}>
                                            <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>Due Date</Text>
                                            <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: '#cccccc', marginTop: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setOpenCalendar(true)}>
                                                <Text style={{ fontFamily: 'inter-regular', fontSize: 14 }}>{!selectedDate ? '' : new Date(selectedDate).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }).toString()}</Text>
                                                <Image style={{ height: 25, width: 24 }} tintColor='#cccccc' source={require('../../assets/calendar_icon.png')} ></Image>
                                            </TouchableOpacity>

                                        </View>
                                    </View> */}

                            </View>

                            <View style={{ backgroundColor: '#ffffff', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#C9C9C9', flexDirection: 'row', zIndex: 0 }}>
                                <View>
                                    <Text style={{ fontFamily: 'inter-medium', color: '#000000', fontSize: 14 }}>{workOrderAddItemVariable.length} items added</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
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
                                                shadowOffset: { width: 1, height: 1 },
                                                shadowOpacity: 0.6,
                                                shadowRadius: 3,
                                                elevation: 0,
                                                shadowColor: '#575757',

                                            }, { minWidth: 70 }]}
                                            btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                            onPress={() => {
                                                setOpenAddItems(false)
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
                                                shadowOffset: { width: 1, height: 1 },
                                                shadowOpacity: 0.6,
                                                shadowRadius: 3,
                                                elevation: 0,
                                                shadowColor: '#575757',

                                            }, { minWidth: 70 }]}
                                            btnTextStyle={{ fontSize: 13, fontWeight: '400', color: '#000000' }}
                                            onPress={() => {
                                                setOpenAddItems(false)
                                                setLoading(true)
                                                handleAddItemsSave()
                                            }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                </Modal>

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
                                            await deleteDoc(doc(db, "WorkOrders", selectedWorkOrder.id.toString()));
                                            await updateDoc(doc(db, 'Defects', selectedWorkOrder.defectID.toString()), {
                                                workOrder: 'not issued',
                                                assignedMechanic: 'n/a'
                                            })
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

                {loading
                    ?
                    <View style={styles.activityIndicatorStyle}>
                        <ActivityIndicator color="#23d3d3" size="large" />
                    </View>
                    : null}
            </>
        )
    }
}

const styles = StyleSheet.create({

    newContentCardStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        width: '48%',
        paddingBottom: 25,
        marginBottom: 20
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
    subViewStyle: {
        flexDirection: 'row',
        marginLeft: 25,
        marginVertical: 3,
        alignItems: 'center'
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
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        outlineStyle: 'none',
        padding: 10,
        height: 40,
        marginLeft: 5
    },
    addBtn: {
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
    addBtnText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'inter-bold'
    },
})


export default WorkOrderDetail