import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"


const AppBtn = (props) => {
    const [btnHovered, setBtnHovered] = useState(false);

    return(
    <TouchableOpacity
        style={[styles.btn, btnHovered && styles.btnHover]}
        onPress={props.onPress}
        activeOpacity={0.7}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
    >
        <Text style={styles.btnText}>{props.title}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        height: 50,
        backgroundColor: '#336699',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    btnHover: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: '#558BC1',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft:10,
        marginRight:10
    },
})

export default AppBtn