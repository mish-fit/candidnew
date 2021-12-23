


import { home } from '../../Styles/Home'
import { URL } from '../Exports/Config'
import React from 'react'
import {Animated, Easing,  StyleSheet, Text, View , TouchableOpacity, Dimensions, Image, ToastAndroid, Alert, Linking} from 'react-native'
import { colorsArray, theme } from '../Exports/Colors'

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



const HowToEarn = () => {
    
    
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()
    const [userInfo,setUserInfo] = React.useState(route?.params?.userInfo)
    const [userSummary,setUserSummary] = React.useState(route?.params?.userSummary)
    const [recentBurn,setRecentBurn] = React.useState(route?.params?.recentBurn)
    const [statements,setStatements] = React.useState("With candid community, you can earn money by recommeding products and asking your network to buy from those. For every purchase, you will be rewarded based on the ongoing affiliate rate on that item. Sit at home, relax and earn money!!")

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
            console.log(responseData)
            setStatements(responseData[0].statements)
        })
        .catch(function(error) {
            console.log(error)
        });
    })

    return (
        <View style = {{flex : 1 , backgroundColor : 'white'}}>
            <View style = {{height : 70 , flexDirection : 'row-reverse', alignItems : 'center', justifyContent : 'space-between'}}>
                <TouchableOpacity
                    style = {{marginRight : 30}}
                    onPress = {()=>navigation.navigate("MyDetails")}
                    >
                    <Text style = {{fontWeight : 'bold', fontSize : 18, color : "#555"}}>{userInfo.user_name}</Text>
                </TouchableOpacity>
                <View style = {{marginLeft : 20, flexDirection : 'row', alignItems : 'center'}}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.navigate("MyRewards")}
                    style = {{justifyContent : 'center', marginLeft : 10}}>
                        <LottieView
                        progress = {progress}
                        style={{width : 60 , height : 60}}
                        source={require('../../assets/animation/coins-money.json')}
                      //  autoPlay
                        />
                    </TouchableOpacity>
                    <Text style = {{marginLeft : 5 , fontSize : 20, fontWeight : 'bold' , color : theme}}>{userSummary && userSummary.coins_available ? userSummary.coins_available : "0" }</Text>
                </View>
            </View>
            <ScrollView style = {{padding : 20 }} contentContainerStyle = {{paddinBottom : 10}}>
                <HTMLView
                    value={statements}
                    stylesheet={home.howToEarn}
                />
                    {/* <Hyperlink onPress={ (url, text) => Linking.openURL(url) }> */}
                        {/* <Markdown>{statements}</Markdown> */}
                       
                        {/* <Markdown style = {home.howToEarn}>https://www.getcandid.app</Markdown>
                        <Markdown style = {home.howToEarn}>https://www.facebook.com</Markdown> */}
                    {/* </Hyperlink> */}
               
            </ScrollView>
        </View>
    )
}

export default HowToEarn

const styles = StyleSheet.create({})
