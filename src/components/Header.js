import { View, Text, TouchableOpacity } from "react-native"
import CustomDropdownProfile from "./DropDownProfileComponent"
import NameAvatar from "./NameAvatar"


const Header = () => {

    const logoutList = ['Profile', 'Logout']
    const handleProfileValueChange = (value) => {
        console.log(value)
    };

    return (
        <View style={{ flexDirection: 'row', paddingLeft: 60, paddingRight: 60, paddingTop: 10, paddingBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF', justifyContent: 'space-between',  }}>
            <View >
                <Text style={{ fontSize: 16, fontWeight: '400', color: '#5B5B5B' }}>
                    Welcome Ubaid Ur Rehman!
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Text style={{ fontSize: 18, fontWeight: '700', color: '#5B5B5B' }}>Ubaid Arshad</Text> */}
                <View style={{ marginHorizontal: 10, }}>
                    <CustomDropdownProfile
                        options={logoutList}
                        onValueChange={handleProfileValueChange}
                        title="Ubaid Arshad"
                    />
                </View>
                <TouchableOpacity style={{}}>
                    <NameAvatar title="U" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Header