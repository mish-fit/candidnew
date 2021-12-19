import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, Text, View , Animated, Easing, TextInput, TouchableOpacity, Dimensions , ToastAndroid} from 'react-native'
import { style } from '../../Styles/ProfileInfo';
import { AntDesign, Entypo, EvilIcons, MaterialIcons } from 'react-native-vector-icons';
import { theme, themeLight, themeLightest } from '../Exports/Colors';
import LottieView from 'lottie-react-native';
import axios from 'axios'
import { URL } from '../Exports/Config';



const Coupon = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const progress = React.useRef(new Animated.Value(0)).current

    const [phoneNumber,setPhoneNumber] = React.useState(route?.params?.phoneNumber ? route?.params?.phoneNumber : "" )
    const [coupon,setCoupon] = React.useState("")

    const [couponCodeAccepted,setCouponCodeAccepted] = React.useState(false)
    const [couponCodeRefreshBoolean,setCouponCodeRefreshBoolean] = React.useState(false)

    const [username,setUsername] = React.useState("")
    const [refereeId,setRefereeId] = React.useState("")
    const [coinsValue,setCoinsValue] = React.useState("")

    React.useEffect(()=>{

    },[])

    const next = () => {
        navigation.navigate("ProfileInfo",{phoneNumber : phoneNumber , coupon : coupon , refereeName : username , refereeId : refereeId , coinsValue : coinsValue   })
    }

    const skip = () => {
      navigation.navigate("ProfileInfo",{phoneNumber : phoneNumber , coupon : "" , refereeName : "" , refereeId : "" , coinsValue : ""  })
  }

    const couponCodeRefresh = () => {
      couponCodeChange(coupon)
    //   setCouponCodeRefreshBoolean(!couponCodeRefreshBoolean)
    //   if(couponCodeRefreshBoolean) {
    //     Animated.timing(progress, {
    //         toValue: 0,
    //         duration: 1000,
    //         easing: Easing.linear,
    //         useNativeDriver : true
    //       },).start();
    // }
    // else {
    //     Animated.timing(progress, {
    //         toValue: 1,
    //         duration: 1000,
    //         easing: Easing.linear,
    //         useNativeDriver : true
    //       },).start();
    // }
    
    }

    const couponCodeChange = (text) => {
      var couponValue = text
     // var couponValue = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") 
      console.log(" text ",text , " length " , text.length, " coupon " , coupon , "coupon Value ", couponValue)
      if(text.length == 6) {
        console.log("text ",text , " length " , text.length, " coupon " , coupon)
        setCoupon(couponValue)
        axios.get(URL + "/isexists/coupon", {params:{coupon : couponValue}} , {timeout:5000})
        .then(res => res.data).then(function(responseData) {
          console.log("coupon" , text , "Check", responseData)
          if(responseData.length) {
            setUsername(responseData[0].user_name)
            setRefereeId(responseData[0].user_id)
            setCoinsValue(responseData[0].coins_value)
            setCouponCodeAccepted(true)
          } else {
            setCouponCodeAccepted(false)
          }

        })
      .catch(function(error) {
          //
        });
      } else if(text.length > 6) {
        setCouponCodeAccepted(false)
      } else {  
        setCoupon(couponValue)
        setCouponCodeAccepted(false)
      }
    }

    return (
        <View style = {{flex : 1, backgroundColor : 'white' , padding : 20}}>
            <View style = {style.editUserDetailsElementContainer}>
                <View style = {{flexDirection : 'row'}}>
                  <Text style = {{fontWeight : 'bold', fontSize : 25 , color : theme }}>Coupon Code</Text>
                  <View style = {{marginLeft : 10,alignItems :'center', justifyContent :'center'}}>
                    {couponCodeAccepted ?
                    <AntDesign name = "checkcircle" color = "green" size = {30} /> :
                    null 
                    }
                  </View>
                </View>
                <View style = {{flexDirection  : 'row'}}>
                  
                  <TextInput 
                          placeholder = {coupon ? coupon : ""}
                          style = {[style.editUserDetailsElementTextInput,{flex : 1, fontSize : 20}]}
                          onChangeText = {(text)=>couponCodeChange(text)}
                          value = {coupon}
                  />
                  
                  <TouchableOpacity
                  style = {{justifyContent : 'center', alignItems : 'center'}}
                  onPress = {couponCodeRefresh}
                  >
                    <LottieView
                      progress = {progress}
                      style={{width : 30 , height : 30, marginRight : 10}}
                      source={require('../../assets/animation/refresh.json')}
                      />
                  </TouchableOpacity>
                </View>
            </View>
            <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,
            justifyContent :'space-between' , flexDirection : 'row'}}>
              <Pressable onPress={skip}
                    disabled = {couponCodeAccepted}
                    style = {{
                    backgroundColor : couponCodeAccepted ? "#DDD" :themeLight , width : 100, height : 40 , borderRadius : 10, 
                    justifyContent : 'center' , alignItems : 'center' , marginTop : 20,}}
              >
                  <Text style = {{color : couponCodeAccepted ? '#888' : 'white'}}>Skip</Text>
              </Pressable>
              <Pressable onPress={next}
                    disabled = {!couponCodeAccepted}
                    style = {{
                    backgroundColor : !couponCodeAccepted ? "#DDD" :theme , width : 100, height : 40 , borderRadius : 10, 
                    justifyContent : 'center' , alignItems : 'center' , marginTop : 20,}}
              >
                  <Text style = {{color : !couponCodeAccepted ? '#888' : 'white'}}>Next</Text>
              </Pressable>
            </View>
            <View style = {{marginTop : 20 , padding : -10, paddingTop : 20 , borderTopColor : themeLightest , borderTopWidth : 1,}}>
              <Text style = {{color : !couponCodeAccepted ? '#888' : themeLight }}>By entering valid coupon code , you and your referrer both will get 500 free coins equivalent to Rs. 50</Text>
              {couponCodeAccepted ?
                <Text style = {{color : theme , marginTop : 20}}>Congrats! {coinsValue} coins will be credited in your and {username}'s account in a day</Text>
              : null
              } 
            </View>
        </View>
    )
}

export default Coupon

const styles = StyleSheet.create({})
