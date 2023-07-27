import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native"


const AddBtn = (props) => {
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
        <Image style = {{width:20, height:20, tintColor:'#FFFFFF', marginLeft:15}} source = {require('../../assets/add_plus_btn_icon.png')}></Image>
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

export default AddBtn