import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Modal, ScrollView, TouchableOpacity, View, StyleSheet, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import AlertModal from '../../components/AlertModal';
import { DataContext } from '../store/context/DataContext';
import moment from 'moment'
import { BlurView } from 'expo-blur';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../config/firebase';
import { PeopleContext } from '../store/context/PeopleContext';
import { AssetContext } from '../store/context/AssetContext';
import { HeaderOptionContext } from '../store/context/HeaderOptionContext';
import { CloseAllDropDowns } from '../../components/CloseAllDropdown';
import AppBtn from '../../components/Button';
import jsPDF from 'jspdf';
import * as interbold from '../../assets/fonts/Inter-Bold-normal'
import * as interregular from '../../assets/fonts/Inter-Regular-normal'
import * as intermedium from '../../assets/fonts/Inter-Medium-normal'
import 'jspdf-autotable'
import { DefectContext } from '../store/context/DefectContext';



const FormDetail = ({ formValue, returnFormDetail, onDashboardGeneralInspection }) => {

    const [driverPicture, setDriverPicture] = useState(null)
    const [groups, setGroups] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteOptionHover, setDeleteOptionHover] = useState({})
    const [loading, setLoading] = useState(true)
    const [alertIsVisible, setAlertIsVisible] = useState(false)
    const [alertStatus, setAlertStatus] = useState('')
    const [pdf, setPdf] = useState(null)


    const db = getFirestore(app)
    const { state: dataState, setData } = useContext(DataContext)
    const { state: peopleState } = useContext(PeopleContext)
    const { state: assetState } = useContext(AssetContext)
    const { state: headerOptionState, setHeaderOption } = useContext(HeaderOptionContext)
    const { state: defectState } = useContext(DefectContext)


    useEffect(() => {

        fetchDriverDp()
        // console.log(formValue)

        if (formValue.length != 0) {
            const groupedData = groupData(formValue.form);

            const countTypeOccurrences = (groupedData) => {
                const typeCounts = {};

                for (const group of groupedData) {
                    const firstItem = group[0];
                    if (firstItem && firstItem.type) {
                        const type = firstItem.type;
                        typeCounts[type] = (typeCounts[type] || 0) + 1;
                    }
                }

                // Remove types with only one occurrence
                for (const type in typeCounts) {
                    if (typeCounts[type] === 1) {
                        delete typeCounts[type];
                    }
                }

                return typeCounts;
            };

            const markFirstOccurrence = (groupedData) => {
                const typeCounts = countTypeOccurrences(groupedData);
                const typeAppearanceCounts = {};

                for (const group of groupedData) {
                    const firstItem = group[0];
                    if (firstItem && firstItem.type) {
                        const type = firstItem.type;
                        firstItem.totalTypeOccurrences = typeCounts[firstItem.type] || 0;  // Add total type occurrences

                        // Mark the appearance based on the count
                        if (!typeAppearanceCounts[firstItem.type]) {
                            typeAppearanceCounts[firstItem.type] = 1;
                        } else {
                            typeAppearanceCounts[firstItem.type]++;
                        }

                        firstItem.appearance = typeAppearanceCounts[firstItem.type];
                    }
                }

                return groupedData;
            };

            // Usage


            const groupedDataWithAppearance = markFirstOccurrence([...groupedData]);
            // console.log(groupedDataWithAppearance)


            setGroups(groupedDataWithAppearance)
            // Call this function when setting the groups
            createPdf(groupedDataWithAppearance)



        }

    }, [])

    const mergeGroupsByType = (groups) => {
        const mergedGroups = [];

        groups.forEach((group) => {
            const existingGroup = mergedGroups.find((mergedGroup) => mergedGroup[0].type === group[0].type);

            if (existingGroup) {
                // Merge the data of groups with the same type
                existingGroup.push(...group);
            } else {
                // Add the group as a new merged group
                mergedGroups.push([...group]);
            }
        });

        return mergedGroups;
    };

    const createPdf = async (data) => {
        const mergedGroups = mergeGroupsByType(data);
        const doc = await generatePDFContent(mergedGroups)
        setPdf(doc)
    }

    const fetchImageAsDataUrl = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const convertImageToBase64 = async (localUri) => {
        try {
            const base64Image = await FileSystem.readAsStringAsync(localUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // base64Image will contain the base64 string of the image
            return base64Image;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };

    const generatePDFContent = async (groups) => {
        const doc = new jsPDF();

        interregular
        intermedium
        // console.log(doc.getFontList())

        const pageWidth = doc.internal.pageSize.width;
        const usableWidth = pageWidth - 40; // Adjusted usable width with margins
        let yOffset = 20;
        let i = 1;

        doc.setTextColor('#646464');
        doc.setFont('Inter-Medium', 'normal');
        doc.setFontSize(16);
        doc.text('Inspection Report', 20, yOffset);

        yOffset += 10

        doc.setFont('Inter-Medium', 'normal');
        doc.setFontSize(10);
        doc.text('Form:', 20, yOffset);
        doc.text('eDVIR', 80, yOffset);
        yOffset += 8
        doc.text('Form Status:', 20, yOffset)
        if (formValue.formStatus == 'Failed') {
            doc.setTextColor('#FF0000');
        }
        else if (formValue.formStatus == 'Passed') {
            doc.setTextColor('green');
        }
        else {
            doc.setTextColor('#646464');
        }
        doc.text(`${formValue.formStatus}`, 80, yOffset);
        yOffset += 8;
        doc.setFont('Inter-Regular', 'normal');
        doc.setTextColor('#646464');
        doc.setFontSize(10);
        doc.text('Date Received:', 20, yOffset)
        doc.text(`${((new Date(formValue.TimeStamp.seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(formValue.TimeStamp.seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })).toString()}`, 80, yOffset)
        yOffset += 8;
        doc.text('Date Inspected:', 20, yOffset)
        doc.text(`${((new Date(formValue.TimeStamp.seconds * 1000)).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) + " " + (new Date(formValue.TimeStamp.seconds * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))}`, 80, yOffset);
        yOffset += 8;
        doc.text('Inspection Duration:', 20, yOffset)
        doc.text(`${moment.duration(formValue.duration).minutes() + ':' + moment.duration(formValue.duration).seconds() + " minutes"}`, 80, yOffset);
        yOffset += 8;
        doc.text('Driver:', 20, yOffset)
        doc.text(`${peopleState.value.data.filter(d => d.Designation === 'Driver').find(driver => driver["Employee Number"].toString() === formValue.driverEmployeeNumber)?.Name || 'Unknown Driver'}`, 80, yOffset);
        yOffset += 8;
        doc.text('Vehicle:', 20, yOffset)
        doc.text(`${assetState.value.data.find(asset => asset["Asset Number"].toString() === formValue.assetNumber)?.['Asset Name'] || 'Unknown Asset'}`, 80, yOffset);

        yOffset += 10; // Move down for other content

        // Function to add a new page if needed
        const addNewPageIfNeeded = (rowHeight) => {
            if (yOffset + rowHeight > doc.internal.pageSize.height - 20) {
                doc.addPage();
                yOffset = 20;
            }
        };

        // Iterate through each group
        for (const group of groups) {
            const groupType = group[0].type;
            yOffset += 10;
            // Add Group Type as the header
            doc.setFillColor('#D3D3D3');  // Green color for the header
            doc.rect(20, yOffset, usableWidth, 8, 'F');  // Draw a filled rectangle as the header
            doc.setFont('Inter-Medium', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0);  // Set text color to white
            doc.text(`${groupType}`, 30, yOffset + 5.5);  // Adjust position for text

            // Move down for table headers

            // Table headers
            const titleColumnWidth = usableWidth * 0.8;  // Adjust the width for the title column
            const valueColumnWidth = usableWidth * 0.2;  // Adjust the width for the value column

            // doc.rect(20, yOffset, titleColumnWidth, 10); // Title column
            // doc.rect(20 + titleColumnWidth, yOffset, valueColumnWidth, 10); // Value column
            // doc.setFont('Inter-Medium', 'normal');
            // doc.setFontSize(10);
            doc.setTextColor('#646464');  // Set text color to black

            yOffset += 8; // Move down for table content

            // Iterate through each item in the group
            for (let j = 0; j < group.length; j++) {

                const groupData = group[j];

                // Draw cells for title and value

                doc.setFontSize(9)
                doc.setFont('Inter-Regular', 'normal');
                // doc.text(`${i}.${j + 1}- ${groupData.title}`, 30, yOffset + 5.5); // Title
                let rectHeight = 0
                const titleLines = doc.splitTextToSize(`${i}.${j + 1}- ${groupData.title}`, titleColumnWidth - 10);
                titleLines.forEach((line, index) => {
                    doc.text(line, 30, yOffset + 5.5 + (index * 5)); // Title
                    rectHeight = rectHeight + index
                });

                if (groupData.value == 'Pass') {
                    doc.setTextColor('green')
                }
                else if (groupData.value == 'Fail') {
                    doc.setTextColor('red')
                }
                else {
                    doc.setTextColor('#646464')
                }
                doc.text(groupData.value, 30 + titleColumnWidth, yOffset + 5.5 + (rectHeight * 2.25)); // Value

                doc.setDrawColor('#8D8D8D');
                doc.rect(20, yOffset, titleColumnWidth, 8 + (rectHeight * 5)); // Title cell
                doc.rect(20 + titleColumnWidth, yOffset, valueColumnWidth, 8 + (rectHeight * 5)); // Value cell

                doc.setTextColor('#646464');
                yOffset += 8 + (rectHeight * 5);

                // Add image if available
                if (groupData.Defect && groupData.Defect.Image) {
                    try {
                        yOffset += 8
                        const imgData = await fetchImageAsDataUrl(groupData.Defect.Image);
                        const imgHeight = 50;
                        const imgWidth = 50;
                        if (yOffset + imgHeight > doc.internal.pageSize.height - 20) {
                            doc.addPage(); // Move to the next page
                            yOffset = 20; // Reset the yOffset for the new page
                        }
                        doc.addImage(imgData, 'JPEG', 30, yOffset, imgWidth, imgHeight);
                        yOffset += 58;
                    } catch (error) {
                        console.log(error);
                    }
                }

                // Add comments if available
                if(groupData.value == 'Fail' && groupData.Defect.Image == ""){
                    yOffset += 8;
                }
                if (groupData.Defect && groupData.Defect.Note) {
                    const commentLines = doc.splitTextToSize(`${groupData.Defect.Note}`, titleColumnWidth - 10);
                    if (yOffset + commentLines.length * 5 > doc.internal.pageSize.height - 20) {
                        doc.addPage(); // Move to the next page
                        yOffset = 20; // Reset the yOffset for the new page
                    }
                    commentLines.forEach((line, i) => {
                        doc.setFont('Inter-Regular', 'normal');
                        doc.text(line, 30, yOffset + i * 5);
                    });

                    yOffset += commentLines.length * 5;
                }

                // Check for page break
                addNewPageIfNeeded(20);
            }

            i++;

            // Add a new page if needed for the next group
            addNewPageIfNeeded(20);
        }

        yOffset += 10;
        // Add Group Type as the header
        doc.setFillColor('#D3D3D3');  // Green color for the header
        doc.rect(20, yOffset, usableWidth, 8, 'F');  // Draw a filled rectangle as the header
        doc.setFont('Inter-Medium', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0);  // Set text color to white
        doc.text(`Signature`, 30, yOffset + 5.5);  // Adjust position for text
        yOffset += 8

        if (yOffset + 80 > doc.internal.pageSize.height - 20) {
            doc.addPage();
            yOffset = 20
        }

        doc.addImage(`${formValue.signature}`, 'JPEG', 25, yOffset, 30, 50);



        setLoading(false);
        return doc;
    };









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

            <View style={{ marginVertical: 10, backgroundColor: 'white', borderRadius: 4, width: 350, padding: 20, margin: 5, }} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                        fontFamily: 'inter-semibold',
                        fontSize: 20,
                        marginVertical: 5,
                    }}
                    >
                        {group[0].type}
                    </Text>
                    {group[0].totalTypeOccurrences != 0
                        ?
                        <Text style={{ fontFamily: 'inter-semibold', fontSize: 16, marginVertical: 5, }} >
                            {group[0].appearance} of {group[0].totalTypeOccurrences}
                        </Text>
                        :
                        null}

                </View>
                <ScrollView style={{}}
                    contentContainerStyle={{ maxHeight: 300, }}>
                    {group.map((groupData, index) => (
                        <View key={index}>
                            {groupData.title == 'Reservation number' ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <View style={{ height: 4, width: 4, backgroundColor: '#000000', borderRadius: 2 }}></View>
                                    <Text style={{ color: '#000000', marginLeft: 15, fontFamily: 'inter-regular', fontSize: 14 }}>{groupData.value} </Text>
                                </View>
                            ) : groupData.title == 'Mileage' ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <View style={{ height: 4, width: 4, backgroundColor: '#000000', borderRadius: 2 }}></View>
                                    <Text style={{ color: '#000000', marginLeft: 15, fontFamily: 'inter-regular', fontSize: 14 }}>{groupData.value} </Text>
                                </View>
                            ) :
                                groupData.value == 'Fail' ? (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <View style={{ height: 4, width: 4, backgroundColor: '#000000', borderRadius: 2 }}></View>
                                            <Text style={{ color: 'red', marginLeft: 15, fontFamily: 'inter-regular', fontSize: 14 }}>{groupData.title}</Text>
                                        </View>
                                        <TouchableOpacity key={index} onPress={() => { window.open(groupData.Defect.Image, '_blank'); }}>
                                            <View style={{ marginVertical: 10 }}>
                                                {groupData.Defect.Image ? <Image style={{ height: 300, width: 300, }} source={{ uri: groupData.Defect.Image }}>
                                                </Image> : null}
                                                <View style={{ flexDirection: 'row', padding: 10 }}>
                                                    <Text style={{ width: 100, color: 'black', fontSize: 13, marginLeft: 5 }}>Comment:</Text>
                                                    <Text style={{ width: '100%', color: 'black', fontSize: 13, marginLeft: 5 }}>{groupData.Defect.Note}</Text>
                                                </View>
                                            </View>

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
                </ScrollView>
                {group[0].type !== 'Mileage' && group[0].type !== 'Reservation number' ? (
                    <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 10 }}>
                        <View style={{ borderRadius: 5, marginTop: 10, backgroundColor: group[0].groupValue === 'Pass' ? 'green' : 'red', padding: 2, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{group[0].groupValue}</Text>
                        </View>
                    </View>
                ) : null}

            </View>
        );
    }, [])

    const handleDeleteForm = async () => {

        if (formValue.formStatus == 'Failed') {
            const newArray = [...defectState.value.defect.filter(item => item.inspectionId == formValue.id)]
            if (newArray.length != 0) {
                await deleteDoc(doc(db, "Defects", newArray[0].id.toString()));
            }
        }
        await deleteDoc(doc(db, "Forms", formValue.id.toString()));
        setAlertStatus('successful')
        setAlertIsVisible(true)
        fetchData()
    }


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
            <TouchableWithoutFeedback onPress={() => {
                CloseAllDropDowns()
            }}>
                <ScrollView style={{ height: 100 }}
                    contentContainerStyle={{ margin: 40, width: 'auto' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column', }}>
                            <View style={{}}>
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
                                        onDashboardGeneralInspection()
                                        // clearAll()
                                    }} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={[styles.selectedFormPropertyStyle, { fontFamily: 'inter-semibold' }]}>Form eDVIR</Text>
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
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15, height: 25, marginTop: 5 }}>{peopleState.value.data.filter(d => d.Designation === 'Driver').find(driver => driver["Employee Number"].toString() === formValue.driverEmployeeNumber)?.Name || 'Unknown Driver'}</Text>
                            </View>

                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image style={{ height: 40, width: 40 }} source={require('../../assets/vehicle_icon.png')}></Image>
                                <Text style={{ fontFamily: 'inter-regular', fontSize: 15, height: 25, marginTop: 5 }}>{assetState.value.data.find(asset => asset["Asset Number"].toString() === formValue.assetNumber)?.['Asset Name'] || 'Unknown Asset'}</Text>
                            </View>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.selectedFormKeyStyle, { width: 300 }]}>Check on </Text>
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
                        <TouchableOpacity style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', padding: 5, marginLeft: 20 }} onPress={async () => {
                            // const doc = await generatePDFContent(groups);
                            // pdf.save('Inspection-Report.pdf');
                            // window.open(pdf.output('filename.pdf'))
                            const pdfBlob = pdf.output('blob');
                            const pdfUrl = URL.createObjectURL(pdfBlob);  // Create a URL for the Blob
                            window.open(pdfUrl, '_blank');  // Open the URL in a new tab


                        }}>
                            <Text >Download PDF</Text>
                        </TouchableOpacity>

                    </View>


                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginVertical: 10, backgroundColor: 'white', borderRadius: 4, width: 525, padding: 20, margin: 5, alignItems: 'center', justifyContent: 'center' }} >
                            {formValue.frontImage ?
                                <>
                                    <TouchableOpacity onPress={() => { window.open(formValue.frontImage, '_blank'); }}>
                                        <Image style={{ height: 300, width: 300, }} source={{ uri: formValue.frontImage }}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text>Front Side</Text>
                                </>
                                :
                                <Text>No Image</Text>
                            }
                        </View>
                        <View style={{ marginVertical: 10, backgroundColor: 'white', borderRadius: 4, width: 525, padding: 20, margin: 5, alignItems: 'center', justifyContent: 'center' }} >
                            {formValue.backImage ?
                                <>
                                    <TouchableOpacity onPress={() => { window.open(formValue.backImage, '_blank'); }}>
                                        <Image style={{ height: 300, width: 300, }} source={{ uri: formValue.backImage }}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text>Back Side</Text>
                                </>
                                :
                                <Text>No Image</Text>
                            }

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginVertical: 10, backgroundColor: 'white', borderRadius: 4, width: 525, padding: 20, margin: 5, alignItems: 'center', justifyContent: 'center' }} >
                            {formValue.rightImage ?
                                <>
                                    <TouchableOpacity onPress={() => { window.open(formValue.rightImage, '_blank'); }}>
                                        <Image style={{ height: 300, width: 300, }} source={{ uri: formValue.rightImage }}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text>Right Side</Text>
                                </>
                                :
                                <Text>No Image</Text>
                            }
                        </View>
                        <View style={{ marginVertical: 10, backgroundColor: 'white', borderRadius: 4, width: 525, padding: 20, margin: 5, alignItems: 'center', justifyContent: 'center' }} >
                            {formValue.leftImage ?
                                <>
                                    <TouchableOpacity onPress={() => { window.open(formValue.leftImage, '_blank'); }}>
                                        <Image style={{ height: 300, width: 300, }} source={{ uri: formValue.leftImage }}>
                                        </Image>
                                    </TouchableOpacity>
                                    <Text>Left Side</Text>
                                </>
                                :
                                <Text>No Image</Text>
                            }

                        </View>
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
            </TouchableWithoutFeedback>

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
                                        handleDeleteForm()

                                    }}

                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[0] && { backgroundColor: '#558BC1', borderColor: '#558BC1' }]}>
                                    <Text style={[{ fontSize: 16 }, deleteOptionHover[0] && { color: '#FFFFFF' }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                onMouseEnter={() => setDeleteOptionHover({ [1]: true })}
                                onMouseLeave={() => setDeleteOptionHover({ [1]: false })}>
                                <TouchableOpacity
                                    onPress={() => setDeleteModal(false)}
                                    style={[{ width: 100, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 0, shadowColor: '#575757', marginHorizontal: 10 }, deleteOptionHover[1] && { backgroundColor: '#558BC1', borderColor: '#558BC1' }]}>
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
        width: 300,
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

