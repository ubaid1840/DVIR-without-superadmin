import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Animated, TextInput } from 'react-native'
import Svg, { G, Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedInput = Animated.createAnimatedComponent(TextInput)

export default function CircularProgressBar({
    percentage = 75,
    radius = 80,
    strokeWidth = 10,
    duration = 1000,
    color = 'tomato',
    delay = 0,
    textColor,
    max = 100

}) {
    const halfCircle = radius + strokeWidth
    const circleCircumference = 2 * Math.PI * radius
    const animatedValue = useRef(new Animated.Value(0)).current
    const [statusProgress, setStatusProgress] = useState(0)
    const [inputProgress, setInputProgress] = useState(0)

    const animation = (toValue) => {

        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: false
        }).start();
    }



    useLayoutEffect(() => {
        animation(percentage)
        animatedValue.addListener((v) => {
            const maxPercentage = 100 * v.value / max
            const strokeDashoffset = circleCircumference - (circleCircumference * maxPercentage) / 100
            setStatusProgress(strokeDashoffset)
            setInputProgress(v.value)
        })
        return () => {
            animatedValue.removeAllListeners()
        }
    }, [max, percentage])





    return (

        <View style={{justifyContent:'center',  alignItems:'center'}}>
            <Svg
                width={radius * 2}
                height={radius * 2}
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
                style={{transform: [{ rotate: '270deg' }], }}>
                <G>
                    <Circle
                        cx='50%'
                        cy='50%'
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        strokeOpacity={0.2}
                        fill='transparent'
                    />

                    <AnimatedCircle
                        cx='50%'
                        cy='50%'
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill='transparent'
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={statusProgress}
                        strokeLinecap='round'
                    />

                </G>

            </Svg>
            {/* <TextInput
                editable={false}
                value={`${Math.round(inputProgress)}%`}
                style={[StyleSheet.absoluteFillObject, { fontSize: radius / 2, color: textColor ?? color }, { fontWeight: 'bold', textAlign: 'center', position:'absolute' }]}
            >
            </TextInput> */}

            <Text style={[StyleSheet.absoluteFillObject, { fontSize: radius / 2, color: textColor ?? color }, { fontWeight: 'bold', textAlign: 'center', position:'absolute' }]}>
            {`${Math.round(inputProgress)}%`}
            </Text>
        </View>
    )
}