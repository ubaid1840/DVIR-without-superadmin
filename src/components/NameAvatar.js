import { StyleSheet, View, Text } from "react-native"



const NameAvatar = (props) => {


    return (
        <View style={styles.driverAndAssetAvatar}>
            <Text style={{ fontSize: 25, color: 'grey' }}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    driverAndAssetAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 25,
        color: 'grey'
    }
})

export default NameAvatar;