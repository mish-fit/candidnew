import React,{useEffect , createContext} from 'react'
import { View , Text, ScrollView, Dimensions, TouchableOpacity, ToastAndroid , ActivityIndicator, StyleSheet, Animated, Easing} from 'react-native'
import LottieView from 'lottie-react-native';

export const LoadingPage = ({duration}) => {
    const progress = React.useRef(new Animated.Value(0)).current
        React.useEffect(()=>{
            Animated.loop(
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver : true
                  },)
            ).start();
        },[])
        return (
            <View style = {{flex : 1 , justifyContent : 'center' , alignItems : 'center', width : Dimensions.get('screen').width , height : Dimensions.get('screen').height }}>
              <LottieView
                  ref={animation => animation}
                  progress = {progress}
                  style={{ width: 200, height: 200, backgroundColor: 'transparent',}}
                  source={require('../../assets/animation/loading.json')}
              />
            </View>
        )
}
