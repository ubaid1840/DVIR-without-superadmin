import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native"


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
        <View style={{flexDirection:'row', alignItems:'center'}}>
        {props.imgSource ? <Image style = {{width:15, height:15, marginRight:10}} source = {props.imgSource} tintColor='#FFFFFF'></Image> : null}
        <Text style={props.btnTextStyle}>{props.title}</Text>
        </View>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnHover: {
        
        backgroundColor: '#558BC1',
    },
})

export default AppBtn