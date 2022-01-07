import React from 'react'
import {Animated, Easing,  StyleSheet, Text, View , TouchableOpacity, Dimensions, Image, ToastAndroid, Alert, ScrollView} from 'react-native'
import { alttheme, colorsArray, theme } from '../Exports/Colors'
import { RewardsComponent } from '../Exports/Components'
import { RandomContext } from '../Exports/Context'
import {Button,Box,Heading,VStack,Center,NativeBaseProvider} from "native-base"
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { useNavigation, useRoute } from '@react-navigation/core'
import LottieView from 'lottie-react-native';
import { color } from 'react-native-reanimated'
import axios from 'axios'
import { URL } from '../Exports/Config'
import { LoadingPage } from '../Exports/Pages'
import * as Amplitude from 'expo-analytics-amplitude';


const Redemptions = () => {
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()

    const [userInfo,setUserInfo] = React.useState(route?.params?.userInfo)
    const [userSummary,setUserSummary] = React.useState(route?.params?.userSummary)
    const [recentBurn,setRecentBurn] = React.useState(route?.params?.recentBurn)

    const [myRewardsCoins,setMyRewardsCoins] = React.useState()
    const [randomNo] = React.useContext(RandomContext)

    const [pageLoading, setPageLoading] = React.useState(false)
    
    const [redeemMapping,setRedeemMapping] = React.useState([])
        // [
        // {company : "Amazon",
        // company_logo:"https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/q/p/qpgc.png"
        // ,coins_value : 4000,cash_value : 250},
        // {company : "BookMyShow",
        // company_logo:"https://in-aps.bmscdn.com/gv/gift_my_show_25412019034153_480x295.jpg"
        // ,coins_value : 7000,cash_value : 500},
        // {company : "Tanishq",
        // company_logo:"https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1465394428/a9ohccgnrekwa10sayjk.png",
        // coins_value : 10000,cash_value : 1000}])

    React.useEffect(()=>{
        setMyRewardsCoins(userSummary && userSummary.coins_available ? userSummary.coins_available : 0)
        Amplitude.logEventAsync('REDEMPTIONS')
        Animated.timing(progress, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver : true
            },).start();

        axios.get(URL + "/all/rewards", {timeout : 5000})
        .then(res => res.data).then(function(responseData) {
        //    console.log(responseData)
            setRedeemMapping(responseData)
        })
        .catch(function(error) {
            
        });

    },[])

    const redeemPoints = (reward_id , company_name, company_logo, coins_value , cash_value) => {
        setPageLoading(true)
        const body = {
            "reward_id": reward_id,
            "user_id": userInfo.user_id,
            "user_name": userInfo.user_name,
            "company_name": company_name,
            "company_logo": company_logo,
            "coins_value": coins_value,
            "cash_value": cash_value
          }

    //    console.log(body)
        axios({
            method: 'post',
            url: URL + '/rewards/redeem',
            data: body
          }, {timeout : 5000})
        .then(res => {
        //    console.log(res)
            setPageLoading(false)
            ToastAndroid.show("Your "+ company_name + " voucher code will be sent to your mobile.", ToastAndroid.SHORT)
        })
        .catch((e) => console.log(e))

    }

    const importantInstructions = () => {
    //    console.log("Instructions Modal")
    }

    const howToUse = () => {
     //   console.log("How to use modal")
    }


    return (
        pageLoading ? <LoadingPage /> :
        <ScrollView style = {{flex :1 , backgroundColor : 'white'  }} contentContainerStyle = {{paddingBottom : 60}}>
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
                      //  autoPlay
                        />
                    </TouchableOpacity>
                    <Text style = {{marginLeft : 5 , fontSize : 20, fontWeight : 'bold' , color : theme }}>{userSummary && userSummary.coins_available ? userSummary.coins_available : "0" }</Text>
                </View>
            </View>
            <View style = {{flex : 1, backgroundColor : 'white', width: '100%' }}>
                <View style = {{ margin : 10 , }}>    
                { redeemMapping.map((item,index)=>{ 
                    return(
                    <View style = {{
                        backgroundColor : myRewardsCoins < item.coins_value ? 'rgba(0,0,0,0.2)' : 'white',
                        flexDirection : 'row' , margin : 10 , padding : 10 , borderRadius : 20 , borderWidth : 1 , borderColor : "#EEE" }}>
                        <View style = {{ justifyContent : 'center', alignItems : 'center', flex : 1 , }}>
                            <View>
                                <Image source = {{uri : item.company_logo + "?" + new Date()}} 
                                style = {{width : 100, height : 100 }} />
                            </View>  
                            <View style = {{height : 50 ,  width : '100%', justifyContent : 'center', alignItems : 'center', borderWidth : 1 , padding : 5, borderColor : "#AAA", justifyContent : 'center' }}>
                                <Text style = {{
                                    color : myRewardsCoins < item.coins_value ? "#888" : "#222",
                                    fontWeight : 'bold', fontSize : 12,}}>{item.company} voucher worth Rs.{item.cash_value}</Text>
                            </View>        
                        </View>
                        <View style = {{flex : 1 , justifyContent : 'center', alignItems : 'center' }}> 
                            <View style = {{flex : 1 , alignItems : 'center' , justifyContent : 'center'}}>
                                <Text style = {{
                                    color : myRewardsCoins < item.coins_value ? "#888" : "#222" ,
                                    fontSize : 40,
                                    fontWeight : 'bold'
                                }}>{item.coins_value}</Text>
                            </View>
                            <TouchableOpacity 
                            style = {{marginBottom : 5}}
                            onPress = {()=>importantInstructions(item.company)}>
                                <Text style = {{
                                    color : myRewardsCoins < item.coins_value ? "#888" : "#222",
                                    fontSize : 12, borderBottomWidth : 1 , paddingBottom : 1 ,  
                                    borderBottomColor : myRewardsCoins < item.coins_value ? "#888" : colorsArray[(randomNo-1+index)%(colorsArray.length-1)]}}>Important Instructions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             style = {{marginBottom : 5}}
                            onPress = {()=>howToUse(item.company)}>
                                <Text style = {{
                                    color : myRewardsCoins < item.coins_value ? "#888" : "#222",
                                    fontSize : 12, borderBottomWidth : 1 , paddingBottom : 1 ,  
                                    borderBottomColor : myRewardsCoins < item.coins_value ? "#888" : colorsArray[(randomNo-1+index)%(colorsArray.length-1)]}}>How to use</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                            onPress = {()=>
                                userInfo.user_id && userInfo.user_name ? 
                                redeemPoints(item.reward_id, item.company_name, item.company_logo, item.coins_value, item.cash_value) : alert("Sorry! User Error. Please restart the app")
                  }
                            disabled={myRewardsCoins < item.coins_value ? true  : false}
                            style = {{height : 50 , 
                                backgroundColor : myRewardsCoins >= item.coins_value ? colorsArray[(randomNo+index)%(colorsArray.length-1)]  : "#AAA", 
                                width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                                <Text style = {{
                                    color :'white'
                                }}>REDEEM</Text>
                            </TouchableOpacity>
                        </View>

                    
                    </View>
                        )
                    })

                }
                </View>
            </View>
            {/* <View style = {{position : 'absolute', left : 30 , bottom : 30 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Home")}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <AntDesign name = "home" size = {30} color = 'white' />
                </TouchableOpacity>
            </View> */}
        </ScrollView>
    
    )
}

export default Redemptions

const styles = StyleSheet.create({})
