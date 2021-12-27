import React from 'react'
import {Animated, Easing, FlatList,  StyleSheet, Text, View , TouchableOpacity, Dimensions, Image} from 'react-native'
import { alttheme, background, colorsArray, theme, themeLightest } from '../Exports/Colors'
import { RewardsComponent } from '../Exports/Components'
import { RandomContext } from '../Exports/Context'
import {Button,Box,Heading,VStack,Center,NativeBaseProvider} from "native-base"
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LottieView from 'lottie-react-native';
import { color } from 'react-native-reanimated'
import axios from 'axios'
import { URL } from '../Exports/Config'
import moment from 'moment'
import { mySummaryStyle } from '../../Styles/MySummary'
import MyEarns from './MyEarns'
import MyRedeems from './MyRedeems'
import * as Amplitude from 'expo-analytics-amplitude';


const Tab = createMaterialTopTabNavigator()
const Tabs = ({user_id}) => {
    return (
        <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { color : theme },
          tabBarStyle: { backgroundColor: background },
          tabBarIndicatorStyle : {backgroundColor : theme}
        }}
        >
            <Tab.Screen name = "Coins Earned" children={()=><MyEarns user_id={user_id}/>} />
            <Tab.Screen name = "Coins Redeemed" children={()=><MyRedeems user_id={user_id}/>} /> 
        </Tab.Navigator>
        )
        ;
    
  
}



const MySummary = () => {
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()

    const [userSummary,setUserSummary] = React.useState({})
    const [userInfo,setUserInfo] = React.useState({})
    const [recentBurn,setRecentBurn] = React.useState({
        user_id : 0,
        coins_value : 0
    })
    const [randomNo, userId] = React.useContext(RandomContext)
    const [earnRewards,setEarnRewards] = React.useState([])
    
    React.useEffect(()=>{
        Animated.timing(progress, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver : true
            },).start();

            axios.get(URL + "/user/summary",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
        //        console.log(responseData)
                setUserSummary(responseData[0])
            })
            .catch(function(error) {
              
            });
            axios.get(URL + "/user/info",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
       //         console.log(responseData)
                setUserInfo(responseData[0])
            })
            .catch(function(error) {
              
            });

            axios.get(URL + "/rewards/user/today/burn",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
       //         console.log(responseData)
                setRecentBurn(...recentBurn, responseData[0])
            })
            .catch(function(error) {
              
            });
            
            axios.get(URL + "/rewards/user/earn",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
       //         console.log(responseData)
                setEarnRewards(responseData)
            })
            .catch(function(error) {
              
            });


    },[])
    

    const redeemPoints = (coins , cash) => {
    //    console.log(coins ,"  ", cash )
    }

    const importantInstructions = () => {
  //      console.log("Instructions Modal")
    }

    const howToUse = () => {
//    console.log("How to use modal")
    }


    return (
        <View style = {{flex :1 , backgroundColor : 'white'  }}>
            <View style = {{height : 80 , flexDirection : 'row-reverse', alignItems : 'center', justifyContent : 'space-between'}}>
                <TouchableOpacity
                    style = {{marginRight : 30}}
                    onPress = {()=>navigation.navigate("MyDetails")}
                    >
                    <Text style = {{fontWeight : 'bold', fontSize : 18, color : alttheme}}>{userInfo.user_name}</Text>
                </TouchableOpacity>
                <View style = {{marginLeft : 20, flexDirection : 'row', alignItems : 'center'}}>
                    <View style = {{justifyContent : 'center', marginLeft : 10}}>
                        <LottieView
                        progress = {progress}
                        style={{width : 60 , height : 60}}
                        source={require('../../assets/animation/coins-money.json')}
                      //  autoPlay
                        />
                    </View>
                    <Text style = {{marginLeft : 5 , fontSize : 20, fontWeight : 'bold' , color : theme}}>{userSummary && userSummary.coins_available ? userSummary.coins_available : "0" }</Text>
                </View>
            </View>
            
            <View style = {{height: 40, backgroundColor : themeLightest }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("HowToEarn",{userSummary: userSummary, userInfo : userInfo, recentBurn : recentBurn})}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1 , borderBottomColor : '#888', borderBottomWidth : 1, borderStyle:'dashed'}}>
                    <Text style = {{color : alttheme, fontWeight : 'bold'}}>How to Earn ?</Text>
                </TouchableOpacity>
            </View>
            <NavigationContainer independent = {true}>
                <Tabs user_id = {userId.slice(1,13)}/>
            </NavigationContainer>  
            <View style = {{height: 40, backgroundColor : theme}}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Redeem",{userSummary: userSummary, userInfo : userInfo, recentBurn : recentBurn})}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1 , borderBottomColor : '#888', borderBottomWidth : 1, borderStyle:'dashed'}}>
                    <Text style = {{color : "#EEE"}}>REDEEM NOW</Text>
                </TouchableOpacity>
            </View>
            
            <View style = {{position : 'absolute', left : 30 , bottom : 50 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Home")}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <AntDesign name = "home" size = {30} color = 'white' />
                </TouchableOpacity>
            </View>
            
            
        </View>
    )
}

export default MySummary

const styles = StyleSheet.create({})
