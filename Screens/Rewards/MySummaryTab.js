import React from 'react'
import {Animated, Easing, FlatList,  StyleSheet, Text, View , TouchableOpacity, Dimensions, Image} from 'react-native'
import { alttheme, background, colorsArray, theme, themeLightest } from '../Exports/Colors'
import { RewardsComponent } from '../Exports/Components'
import { RandomContext } from '../Exports/Context'
import {Button,Box,Heading,VStack,Center,NativeBaseProvider} from "native-base"
import {AntDesign , FontAwesome5, MaterialIcons} from 'react-native-vector-icons'
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
import { Avatar } from 'react-native-paper'


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



const MySummaryTab = () => {
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
            <View 
            style = {{ 
                backgroundColor : 'white', flex : 1 ,
                height : 50 , 
                position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
                flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'}}>
                    <TouchableOpacity style = {{marginLeft : 10, height : 30}} onPress={()=>navigation.openDrawer()}>
                        {userInfo.user_profile_image && userInfo.user_profile_image != "" ? 
                        <Image source = {{uri : userInfo.user_profile_image + "?" + moment().format('YYYY-MM-DD')}} 
                            style = {{opacity : 1 , backgroundColor : 'red',  flex: 1,justifyContent: "center",borderRadius : 30, height : 30 , width : 30}} />
                        : <Avatar.Image style = {{ }}
                        source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ userInfo.user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                        size={30}/> }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{marginLeft : 10, flex : 1 }}
                        onPress = {()=>{
                            navigation.navigate("MyDetails", {userInfo : userInfo , userSummary : userSummary})}
                            }
                        >
                        <Text style = {{fontWeight : 'bold', fontSize : 20, color : alttheme}}>{userInfo && userInfo.user_name ? userInfo.user_name.length > 15 ? userInfo.user_name : userInfo.user_name.slice(0,15) : ""}</Text>
                    </TouchableOpacity>
                    <View style = {{alignItems : 'center', justifyContent : 'flex-end',flexDirection : 'row-reverse' , marginRight : 10 }}>
                        <RewardsComponent rewards = {userSummary && userSummary.coins_available ? userSummary.coins_available : 0} source = "Feed" userInfo = {userInfo}  userSummary = {userSummary} />
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
            
            
            <View style = {{position : 'absolute', right : 20 , bottom : 60 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Redeem",{userSummary: userSummary, userInfo : userInfo, recentBurn : recentBurn})}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <MaterialIcons name = "redeem" size = {30} color = 'white' />
                </TouchableOpacity>
            </View>
            
            
        </View>
    )
}

export default MySummaryTab

const styles = StyleSheet.create({})
