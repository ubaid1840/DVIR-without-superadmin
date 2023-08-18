import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Animated, TextInput } from 'react-native'
import Svg, { G, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const oceanBlueGradient = ['#00A8FF', '#0077B6'];
const sunnyOrangeGradient = ['#FFA500', '#FFC300'];
const purpleHazeGradient = ['#6A0572', '#490057'];
const tealDreamGradient = ['#03DAC6', '#018786'];
const berryBurstGradient = ['#D93A86', '#FF5A6D'];
const mintyFreshGradient = ['#00EAD3', '#00917C'];
const sunsetVibesGradient = ['#FFD54F', '#FF6D00'];
const roseGoldGradient = ['#EAB0D5', '#F7C1BB'];
const tropicalParadiseGradient = ['#56CCF2', '#2F80ED'];
const pastelDelightGradient = ['#FFD26F', '#3670FF'];

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function NumberProgressBar({
    percentage = 75,
    radius = 80,
    strokeWidth = 13,
    duration = 1000,
    color = 'tomato',
    colors = berryBurstGradient,
    gradientAngle = 90,
    delay = 0,
    textColor = '#D93A86',
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
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[StyleSheet.absoluteFillObject, { fontSize: 100, color: textColor ?? color }, { fontWeight: 'bold' }]}>
                    {`${Math.round(inputProgress)}`}
                </Text>
        </View>
    )
}