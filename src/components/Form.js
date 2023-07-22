import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import AppBtn from './Button';

const columns = [
    'Status',
    'Inspection ID',
    'Date Inspected',
    'Date Received',
    'Asset Name',
    'Asset VIN',
    'Asset License Plate',
    'Asset Type',
    'Asset Make',
    'Asset Model',
    'Driver Name',
    'Driver User',
    'Employee Number',
    'Defects Count'
];

const entriesData = [
    {
        'Status': 'Completed',
        'Inspection ID': '12345',
        'Date Inspected': '2023-07-20',
        'Date Received': '2023-07-21',
        'Asset Name': 'Asset A',
        'Asset VIN': 'VIN123',
        'Asset License Plate': 'ABC123',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandX',
        'Asset Model': 'ModelY',
        'Driver Name': 'John Doe',
        'Driver User': 'john.doe',
        'Employee Number': 'EMP001',
        'Defects Count': '3',
    },
    // Add more entries
    {
        'Status': 'In Progress',
        'Inspection ID': '67890',
        'Date Inspected': '2023-07-22',
        'Date Received': '2023-07-23',
        'Asset Name': 'Asset B',
        'Asset VIN': 'VIN456',
        'Asset License Plate': 'XYZ789',
        'Asset Type': 'Car',
        'Asset Make': 'BrandY',
        'Asset Model': 'ModelZ',
        'Driver Name': 'Jane Smith',
        'Driver User': 'jane.smith',
        'Employee Number': 'EMP002',
        'Defects Count': '0',
    },
    {
        'Status': 'Pending',
        'Inspection ID': '54321',
        'Date Inspected': '2023-07-23',
        'Date Received': '2023-07-24',
        'Asset Name': 'Asset C',
        'Asset VIN': 'VIN789',
        'Asset License Plate': 'PQR123',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandZ',
        'Asset Model': 'ModelX',
        'Driver Name': 'Robert Johnson',
        'Driver User': 'robert.johnson',
        'Employee Number': 'EMP003',
        'Defects Count': '5',
    },
    // Add more entries
    {
        'Status': 'Completed',
        'Inspection ID': '98765',
        'Date Inspected': '2023-07-25',
        'Date Received': '2023-07-26',
        'Asset Name': 'Asset D',
        'Asset VIN': 'VIN111',
        'Asset License Plate': 'LMN456',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandA',
        'Asset Model': 'ModelB',
        'Driver Name': 'Sarah Johnson',
        'Driver User': 'sarah.johnson',
        'Employee Number': 'EMP004',
        'Defects Count': '1',
    },
    // Add more entries
    {
        'Status': 'In Progress',
        'Inspection ID': '23456',
        'Date Inspected': '2023-07-27',
        'Date Received': '2023-07-28',
        'Asset Name': 'Asset E',
        'Asset VIN': 'VIN222',
        'Asset License Plate': 'OPQ789',
        'Asset Type': 'Car',
        'Asset Make': 'BrandC',
        'Asset Model': 'ModelD',
        'Driver Name': 'Michael Smith',
        'Driver User': 'michael.smith',
        'Employee Number': 'EMP005',
        'Defects Count': '2',
    },
    // Add more entries
    {
        'Status': 'Pending',
        'Inspection ID': '87654',
        'Date Inspected': '2023-07-29',
        'Date Received': '2023-07-30',
        'Asset Name': 'Asset F',
        'Asset VIN': 'VIN333',
        'Asset License Plate': 'RST012',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandE',
        'Asset Model': 'ModelF',
        'Driver Name': 'Emily Brown',
        'Driver User': 'emily.brown',
        'Employee Number': 'EMP006',
        'Defects Count': '4',
    },
    // Add more entries
    {
        'Status': 'Completed',
        'Inspection ID': '34567',
        'Date Inspected': '2023-07-31',
        'Date Received': '2023-08-01',
        'Asset Name': 'Asset G',
        'Asset VIN': 'VIN444',
        'Asset License Plate': 'UVW345',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandB',
        'Asset Model': 'ModelC',
        'Driver Name': 'David Johnson',
        'Driver User': 'david.johnson',
        'Employee Number': 'EMP007',
        'Defects Count': '0',
    },
    // Add more entries
    {
        'Status': 'In Progress',
        'Inspection ID': '65432',
        'Date Inspected': '2023-08-02',
        'Date Received': '2023-08-03',
        'Asset Name': 'Asset H',
        'Asset VIN': 'VIN555',
        'Asset License Plate': 'XYZ678',
        'Asset Type': 'Car',
        'Asset Make': 'BrandD',
        'Asset Model': 'ModelE',
        'Driver Name': 'Sophia Brown',
        'Driver User': 'sophia.brown',
        'Employee Number': 'EMP008',
        'Defects Count': '3',
    },
    // Add more entries
    {
        'Status': 'Pending',
        'Inspection ID': '12345',
        'Date Inspected': '2023-08-04',
        'Date Received': '2023-08-05',
        'Asset Name': 'Asset I',
        'Asset VIN': 'VIN666',
        'Asset License Plate': 'ABC987',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandF',
        'Asset Model': 'ModelG',
        'Driver Name': 'Oliver Johnson',
        'Driver User': 'oliver.johnson',
        'Employee Number': 'EMP009',
        'Defects Count': '1',
    },
    // Add more entries
    {
        'Status': 'Completed',
        'Inspection ID': '23456',
        'Date Inspected': '2023-08-06',
        'Date Received': '2023-08-07',
        'Asset Name': 'Asset J',
        'Asset VIN': 'VIN777',
        'Asset License Plate': 'LMN654',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandA',
        'Asset Model': 'ModelB',
        'Driver Name': 'Emma Davis',
        'Driver User': 'emma.davis',
        'Employee Number': 'EMP010',
        'Defects Count': '0',
    },
    // Add more entries
    {
        'Status': 'In Progress',
        'Inspection ID': '54321',
        'Date Inspected': '2023-08-08',
        'Date Received': '2023-08-09',
        'Asset Name': 'Asset K',
        'Asset VIN': 'VIN888',
        'Asset License Plate': 'OPQ987',
        'Asset Type': 'Car',
        'Asset Make': 'BrandC',
        'Asset Model': 'ModelD',
        'Driver Name': 'William Miller',
        'Driver User': 'william.miller',
        'Employee Number': 'EMP011',
        'Defects Count': '2',
    },
    // Add more entries
    {
        'Status': 'Pending',
        'Inspection ID': '87654',
        'Date Inspected': '2023-08-10',
        'Date Received': '2023-08-11',
        'Asset Name': 'Asset L',
        'Asset VIN': 'VIN999',
        'Asset License Plate': 'RST321',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandE',
        'Asset Model': 'ModelF',
        'Driver Name': 'Noah Davis',
        'Driver User': 'noah.davis',
        'Employee Number': 'EMP012',
        'Defects Count': '4',
    },
    // Add more entries
    {
        'Status': 'Completed',
        'Inspection ID': '34567',
        'Date Inspected': '2023-08-12',
        'Date Received': '2023-08-13',
        'Asset Name': 'Asset M',
        'Asset VIN': 'VIN000',
        'Asset License Plate': 'UVW012',
        'Asset Type': 'Truck',
        'Asset Make': 'BrandB',
        'Asset Model': 'ModelC',
        'Driver Name': 'Ava Johnson',
        'Driver User': 'ava.johnson',
        'Employee Number': 'EMP013',
        'Defects Count': '0',
    },
    // Add more entries
    {
        'Status': 'In Progress',
        'Inspection ID': '65432',
        'Date Inspected': '2023-08-14',
        'Date Received': '2023-08-15',
        'Asset Name': 'Asset N',
        'Asset VIN': 'VIN111',
        'Asset License Plate': 'XYZ222',
        'Asset Type': 'Car',
        'Asset Make': 'BrandD',
        'Asset Model': 'ModelE',
        'Driver Name': 'James Brown',
        'Driver User': 'james.brown',
        'Employee Number': 'EMP014',
        'Defects Count': '3',
    },
    // Add more entries
    {
        'Status': 'Pending',
        'Inspection ID': '12345',
        'Date Inspected': '2023-08-16',
        'Date Received': '2023-08-17',
        'Asset Name': 'Asset O',
        'Asset VIN': 'VIN222',
        'Asset License Plate': 'ABC333',
        'Asset Type': 'Bus',
        'Asset Make': 'BrandF',
        'Asset Model': 'ModelG',
        'Driver Name': 'Ella Johnson',
        'Driver User': 'ella.johnson',
        'Employee Number': 'EMP015',
        'Defects Count': '1',
    },
];


const Form = () => {
    const renderRow = ({ item }) => {
        return (
            <View style={styles.row}>
                {columns.map((column) => {
                    console.log(item[column])
                    return (
                        item[column] == undefined ? null :
                            <View key={column} style={styles.cell}>
                                <Text style={styles.entryText}>{item[column]}</Text>
                            </View>

                    )
                })}
                {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button</Text>
        </TouchableOpacity> */}
                <View style={{justifyContent:'center', alignItems:'center', alignContent:'center'}}>
                    <AppBtn
                        title="Report"
                        btnStyle={styles.btn}
                        btnTextStyle={styles.btnText} />
                </View>
            </View>
        );
    };

    return (
        <ScrollView horizontal>
            <View>
                <View style={styles.columnHeaderRow}>
                    {columns.map((column) => (
                        <View key={column} style={styles.columnHeaderCell}>
                            <Text style={styles.columnHeaderText}>{column}</Text>
                        </View>
                    ))}
                    <Text style={styles.columnHeaderText}>Action</Text>
                </View>
                <FlatList
                    data={entriesData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRow}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomColor: '#ccc',

        marginTop: 8,
        shadowColor: '#BADBFB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 0,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    entryText: {
        fontWeight: 'normal',
        paddingHorizontal: 30,
        paddingVertical: 5,
        fontSize: 12
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100,
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'blue',
    },
    columnHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        alignItems: 'center',
    },
    columnHeaderCell: {
        flex: 1,

    },
    columnHeaderText: {
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: '#5A5A5A',
        fontSize: 14
    },
    btn: {
        width: '100%',
        height: 40,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft:10,
        marginRight:10
    },
});

export default Form;
