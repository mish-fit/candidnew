


import { home } from '../../Styles/Home'
import { URL } from '../Exports/Config'
import React from 'react'
import {Animated, FlatList, Easing,  StyleSheet, Text, View , TouchableOpacity, Dimensions, Image, ToastAndroid, Alert, Linking} from 'react-native'
import { alttheme, colorsArray, theme } from '../Exports/Colors'

import { useNavigation, useRoute } from '@react-navigation/core'
import LottieView from 'lottie-react-native';
import { color } from 'react-native-reanimated'
import axios from 'axios'

import { LoadingPage } from '../Exports/Pages'
import Hyperlink from 'react-native-hyperlink'
import { ScrollView } from 'react-native-gesture-handler'
import Markdown from 'react-native-markdown-display';
import HTMLView from 'react-native-htmlview';
import * as Amplitude from 'expo-analytics-amplitude';
import moment from 'moment'


const FeedItemComponent = ({item,id}) => {
    return(
        <View style = {{ borderRadius : 10, marginTop : 5 , marginBottom : 5, justifyContent : 'center' , alignItems : 'center' }}>
            <View style = {{}}>
            {item.reward_image && item.reward_image != "None" && item.reward_image != "" ?
                <Image source = {{uri : item.reward_image + "?" + moment().format('YYYY-MM-DD')}} style = {{width : Dimensions.get('screen').width*0.95, height : Dimensions.get('screen').width*0.5343 , borderRadius : 40  }}/> :
                null}  
            </View>    
        </View>
    )
}


const HowToEarn = () => {
    
    
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()
    const [userInfo,setUserInfo] = React.useState(route?.params?.userInfo ? route?.params?.userInfo : [] )
    const [userSummary,setUserSummary] = React.useState(route?.params?.userSummary ? route?.params?.userSummary : [])
    const [recentBurn,setRecentBurn] = React.useState(route?.params?.recentBurn ? route?.params?.recentBurn : 0)
    const [feedData,setFeedData] = React.useState([])

    React.useEffect(()=>{
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver : true
              },).start()
        Amplitude.logEventAsync('HOW TO EARN')     
        axios.get(URL + "/rewards/howtoearn", {timeout : 5000})
        .then(res => res.data).then(function(responseData) {
       //     console.log(responseData)
            setFeedData(responseData)
        })
        .catch(function(error) {
            console.log(error)
        });
    },[])

    const FeedItem = ({item,index}) => (
        <View key = {index.toString()}>
            <FeedItemComponent item = {item} id = {index} />
        </View> 
    )

    const HeaderComponent = () => {
        return(
            <View style = {{height : 70 , flexDirection : 'row-reverse', alignItems : 'center', justifyContent : 'space-between'}}>
                <TouchableOpacity
                    style = {{marginRight : 30}}
                    onPress = {()=>navigation.navigate("MyDetails")}
                    >
                    <Text style = {{fontWeight : 'bold', fontSize : 18, color : alttheme}}>{userInfo.user_name}</Text>
                </TouchableOpacity>
                <View style = {{marginLeft : 20, flexDirection : 'row', alignItems : 'center'}}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.navigate("MyRewards")}
                    style = {{justifyContent : 'center', marginLeft : 10}}>
                        <LottieView
                        progress = {progress}
                        style={{width : 60 , height : 60}}
                        source={require('../../assets/animation/coins-money.json')}
                        autoPlay
                        />
                    </TouchableOpacity>
                    <Text style = {{marginLeft : 5 , fontSize : 20, fontWeight : 'bold' , color : theme}}>{userSummary && userSummary.coins_available ? userSummary.coins_available : "0" }</Text>
                </View>
            </View>
        )
    }


    return (
            <FlatList
                keyExtractor = {(item,index)=>index.toString()}
                style = {{}}
                contentContainerStyle = {{paddingTop : 0}}
                data = {feedData}
                renderItem = {FeedItem}
                showsVerticalScrollIndicator = {false}
                ListHeaderComponent = {HeaderComponent}
            />
    )
}

export default HowToEarn

const styles = StyleSheet.create({})
