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
];

const Form = () => {
    const renderRow = ({ item }) => {
        return (
            <View style={[styles.row, { borderWidth: 0, }]}>
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
                <View>
                    <AppBtn title="Report" />
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
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    entryText: {
        fontWeight: 'normal',
        paddingHorizontal: 30,
        paddingVertical: 5
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
        color:'#5A5A5A',
        fontSize:14
    },
});

export default Form;
