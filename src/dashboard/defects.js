import { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import Form from '../../components/Form';

const columns = [
    'Defects ID',
    'Asset',
    'Date Created',
    'Priority',
    'Severity',
    'Defect',
    'Driver',
    'Mechanic',
    'Action'
];

const entriesData = [
    {
        'Defects ID': '1',
        'Asset': 'Asset A',
        'Date Created': '2023-08-08',
        'Priority': 'High',
        'Severity': 'Critical',
        'Defect': 'Brake issue',
        'Driver': 'John Doe',
        'Mechanic': 'Jane Smith',
        'Action': 'Button',
      },
      {
        'Defects ID': '2',
        'Asset': 'Asset B',
        'Date Created': '2023-08-09',
        'Priority': 'Medium',
        'Severity': 'Major',
        'Defect': 'Engine noise',
        'Driver': 'Jane Smith',
        'Mechanic': 'Michael Johnson',
        'Action': 'Button',
      },
      {
        'Defects ID': '3',
        'Asset': 'Asset C',
        'Date Created': '2023-08-10',
        'Priority': 'Low',
        'Severity': 'Minor',
        'Defect': 'Dashboard light malfunction',
        'Driver': 'Robert Johnson',
        'Mechanic': 'Ella Davis',
        'Action': 'Button',
      },
      {
        'Defects ID': '4',
        'Asset': 'Asset D',
        'Date Created': '2023-08-11',
        'Priority': 'High',
        'Severity': 'Critical',
        'Defect': 'Transmission issue',
        'Driver': 'Sarah Johnson',
        'Mechanic': 'David Johnson',
        'Action': 'Button',
      },
      {
        'Defects ID': '5',
        'Asset': 'Asset E',
        'Date Created': '2023-08-12',
        'Priority': 'Medium',
        'Severity': 'Major',
        'Defect': 'Suspension noise',
        'Driver': 'Michael Smith',
        'Mechanic': 'Sophia Brown',
        'Action': 'Button',
      },
      // Add more objects...

];

const DefectsPage = () => {

    const { height, width } = Dimensions.get('window');

    const [fadeAnim] = useState(new Animated.Value(0));

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


    const [fontsLoaded] = useFonts({
        'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleDefectsFormValueChange = (value) => {
        console.log(value)
    }

    return (

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
                <View style={{ flexDirection: 'row', marginLeft: 40, marginVertical: 40, marginRight: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
                            <Image style={{ width: 30, height: 30, margin: 10 }}
                                tintColor="#FFFFFF"
                                source={require('../../assets/defects_icon.png')}></Image>
                        </View>
                        <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
                            Defects
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#5B5B5B', fontSize: 20, fontWeight: 'bold' }}>6</Text>
                            <Text style={{ color: '#5B5B5B', fontSize: 17 }}>New</Text>
                        </View>
                        <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 25, opacity: 0.5,}}></View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#5B5B5B', fontSize: 20, fontWeight: 'bold' }}>1</Text>
                            <Text style={{ color: '#5B5B5B', fontSize: 17 }}>In Progress</Text>
                        </View>
                        <View style={{ borderRightWidth: 2, borderRightColor: '#A2A2A2', marginHorizontal: 25, opacity: 0.5 }}></View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#5B5B5B', fontSize: 20, fontWeight: 'bold' }}>3</Text>
                            <Text style={{ color: '#5B5B5B', fontSize: 17 }}>Corrected</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.contentCardStyle}>
                    <Form
                        columns={columns}
                        entriesData={entriesData}
                        titleForm="Defects"
                        onValueChange={handleDefectsFormValueChange}
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

        borderBottomWidth: 1,
        borderBottomColor: '#BADBFB',
    },
    formCellStyle: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
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
        marginLeft:10,

    },
    formColumnHeaderTextStyle: {
        fontWeight: 'bold',
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
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web

    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropdownHoveredOption: {

        backgroundColor: '#67E9DA',
        cursor: 'pointer',
        transitionDuration: '0.2s',

    },
    dropdownOptionText: {
        fontSize: 16,
    },
    dropdownHoveredOptionText: {

        color: '#FFFFFF',
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

export default DefectsPage