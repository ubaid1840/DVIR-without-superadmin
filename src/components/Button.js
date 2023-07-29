import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"


const AppBtn = (props) => {
    const [btnHovered, setBtnHovered] = useState(false);

    return(
    <TouchableOpacity
        style={[props.btnStyle, btnHovered && styles.btnHover ]}
        onPress={props.onPress}
        activeOpacity={0.7}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
    >
        <Text style={props.btnTextStyle}>{props.title}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnHover: {
        backgroundColor: '#558BC1',
    },
})

export default AppBtn