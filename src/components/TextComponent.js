import React from 'react';
import { Text } from 'react-native';
import {useFonts} from 'expo-font'

const CustomText = ({ style, ...props }) => {
    const [fontsLoaded] = useFonts({
        'futura-book': require('../../assets/fonts/futura/Futura-Book-font.ttf'),
      });
    
      if (!fontsLoaded) {
        return null;
      }
  return <Text {...props} style={[styles.text, style]} />;
};

const styles = {
  text: {
    fontFamily: 'futura-book',
    // You can define any other default text styles here
  },
};



export default CustomText;
