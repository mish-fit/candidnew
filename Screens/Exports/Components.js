import { NavigationContainer, useNavigation } from '@react-navigation/native'
import React from 'react'
import {Animated, View, Text,TouchableOpacity, Easing, Dimensions} from 'react-native'
import { colorsArray } from './Colors'
import { RandomContext } from './Context'
import LottieView from 'lottie-react-native';
import * as Amplitude from 'expo-analytics-amplitude';

export const RewardsComponent = ({rewards, source, userSummary, userInfo}) => {
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const [randomNo] = React.useContext(RandomContext)


    React.useEffect(()=>{
        
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver : true
          },).start();
    },[])
    return (
        <TouchableOpacity 
            style = {{marginRight : 30 , flexDirection : 'row-reverse', }}
            onPress = {()=>{
                Amplitude.logEventWithPropertiesAsync("Clicked on Rewards section ", {source : source})
                navigation.navigate("MyRewards", {source : source})
                }}
            >
                <View style = {{justifyContent : 'center', marginLeft : 5, marginRight : 10,}}>
                    <Text style = {{color : colorsArray[randomNo-1], fontSize : 15 , fontWeight : '700'}}>{rewards}</Text>
                </View>
                <View style = {{justifyContent : 'center', marginLeft : 10}}>
                    <LottieView
                    progress = {progress}
                    style={{width : 40 , height : 40}}
                    source={require('../../assets/animation/coins-money.json')}
                    autoPlay
                    />
                </View>
        </TouchableOpacity>
    )
}


export const EmptyComponent = () => {
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const [randomNo] = React.useContext(RandomContext)


    React.useEffect(()=>{
        Amplitude.logEventAsync("Empty Component Shown")
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver : true
          },).start();
    },[])
    return (
        <View style = {{justifyContent : 'center'}}>
            <LottieView
            progress = {progress}
            style={{width : Dimensions.get('screen').width*0.4 , height : Dimensions.get('screen').width*0.4}}
            source={require('../../assets/animation/astronaut.json')}
            autoPlay
            />
        </View>
    )
}

