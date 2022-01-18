import React , {useState,useEffect , useContext} from 'react'
import { Animated, Easing, View,Text , Image ,ImageBackground, TouchableOpacity , TextInput , Dimensions , Button, ToastAndroid , ScrollView , PermissionsAndroid, Pressable } from 'react-native'

import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios'
import Contacts from 'react-native-contacts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { useNavigation , useRoute } from '@react-navigation/native';

import { AntDesign, Entypo, EvilIcons, MaterialIcons } from 'react-native-vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';
import { style } from '../../Styles/ProfileInfo';
import { URL } from '../Exports/Config';
import { RandomContext } from '../Exports/Context';
import { alttheme, backArrow, theme } from '../Exports/Colors';
import { s3URL, uploadImageOnS3 } from '../Exports/S3';
import LottieView from 'lottie-react-native';

import 'react-native-get-random-values'
import { nanoid , customAlphabet} from 'nanoid'
import * as Amplitude from 'expo-analytics-amplitude';
import { TextInputMask } from 'react-native-masked-text';
import { Snackbar } from 'react-native-paper';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RNBounceable from "@freakycoder/react-native-bounceable";
import LinearGradient from 'react-native-linear-gradient';

const ProfileInfo = () => {
  
  const navigation = useNavigation()
  const route = useRoute()
  const [userName,setUserName] = React.useState(route.params?.username ? route.params?.username  : "")
  const [phoneNumber,setPhoneNumber] = React.useState(route.params?.phoneNumber ? route.params?.phoneNumber : "")
  const [userInfo,setUserInfo] = React.useState([])
  const [expoToken,setExpoToken] = React.useState("")
  const [deviceToken,setDeviceToken] = React.useState("")
  const [refresh,setRefresh] = React.useState(false)
  const [dbContacts,setDbContacts] = React.useState([])
  const [dbPhoneNumbers,setDbPhoneNumbers] = React.useState([])
  const [userNameAccepted,setUserNameAccepted] = React.useState(false)
  const [checked,setChecked] = React.useState(false)
  const [referralCode,setReferralCode] = React.useState("")
  const [userNameSnackVisible,setUserNameSnackVisible] = React.useState(true)
  const onDismissSnackBar = () => {
    setUserNameSnackVisible(false)
  }

  const [couponCodeAccepted,setCouponCodeAccepted] = React.useState(false)
  const [refereeName,setRefereeName] = React.useState("")
  const [refereeId,setRefereeId] = React.useState("")
  const [coinsValue,setCoinsValue] = React.useState(500)

  const couponCodeChange = (text) => {
    var couponValue = text
    if(text.length == 6) {
      setReferralCode(couponValue)
      axios.get(URL + "/isexists/coupon", {params:{coupon : couponValue}} , {timeout:5000})
      .then(res => res.data).then(function(responseData) {
        if(responseData.length) {
          setRefereeName(responseData[0].user_name)
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
      setReferralCode(couponValue)
      setCouponCodeAccepted(false)
    }
  }  

  const registerForExpoPushNotificationsAsync= async() => {
      let token;
      
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          ToastAndroid.show('Failed to get push token for push notification!',ToastAndroid.SHORT);
          return;
        }
        try {
          token = await Notifications.getExpoPushTokenAsync({
            experienceId : '@kandurisv/candidapp'
          })
        }
        catch(e) {
        //  console.log(e)
        }
         } 
      else {
        alert('Must use physical device for Push Notifications');
      }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return token.data;
  }
  
  const registerForDevicePushNotificationsAsync = async() => {
    let token;
   
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
     
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      token = (await Notifications.getDevicePushTokenAsync()).data;
      
    } else {
      alert('Must use physical device for Push Notifications');
    }
   // console.log("token", token)
    return token;
  }
  
    React.useEffect(() => {
      try {
        Amplitude.logEventAsync("NEW USER PROFILE INFO")
      } catch(e) {
        console.log("Amplitude new user", e)
      }
      
      const registerNotification = async () => {
        registerForExpoPushNotificationsAsync().then(token => {
         // console.log("expo token", token)
          setExpoToken(token)
          AsyncStorage.setItem('expoToken', token )
        });
        registerForDevicePushNotificationsAsync().then(token => {
         // console.log("device token", token)
          setDeviceToken(token)
          AsyncStorage.setItem('deviceToken', token )
        });
      }
      try {
        registerNotification()
      } catch(e) {
        console.log("Register Notification", e)
      }

      console.log("Coming to profile info")
        

    
      const getContacts = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: "Contacts Access",
              message: "Now get your friends' recommendations at your fingertips",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Contacts.getAll().then(contacts => {
              const a = []
              setDbPhoneNumbers([])
              setDbContacts([])
              contacts.map((item,index)=>{
                  //console.log("Phone",item.phoneNumbers)
                  if(item.phoneNumbers.length) {
                      item.phoneNumbers.map((item1,index1)=>{
                          a.push(item1.number.replace(/\s+/g, ''))
                        //setDbPhoneNumbers(dbPhoneNumbers => [...dbPhoneNumbers,item1.number.replace(/\s+/g, '')] );  
                      })  
                  } 
                  //console.log("Reached Here", dbPhoneNumbers.length)
              })
              setDbPhoneNumbers(a)
          }).then(()=>{
            console.log("Reached Here", dbPhoneNumbers.length)
            //console.log(dbPhoneNumbers.filter((val,id,array) => array.indexOf(val) == id))
            setDbContacts(dbPhoneNumbers.filter((val,id,array) => array.indexOf(val) == id))
            
            if(dbPhoneNumbers.length) {
            const contactsBody = {
              "user_id": phoneNumber.slice(1,13),
              "user_name": "",
              "val": JSON.stringify(dbPhoneNumbers.filter((val,id,array) => array.indexOf(val) == id)), 
            }
      
            axios({
              method: 'post',
              url: URL + '/contacts',
              data: contactsBody
              })
              .then(res => {
                //console.log("Contacts res", res)
              }).catch((e) => {
                console.log("Contacts error", e)
              })
            }
            else {
              setRefresh(!refresh)
            }
        
          })
          } else {
            console.log("Contacts permission denied");
          }
        } catch (err) {
          console.log(err);
        }
          
      }
      
      try {
        getContacts()
      } catch(e) {
        console.log("Get contacts Notification", e)
      }
      
    //  console.log("USER DETAILS USE EFFECT" , route.params.userDetails)
       const getUserInfo = () => {
        axios.get(URL + "/user/info", {params:{user_id : phoneNumber.slice(1,13) }} , {timeout:5000})
        .then(res => res.data).then(function(responseData) {
        //    console.log("USER INFO",responseData)
            setUserInfo(responseData)
           
        })
        .catch(function(error) {
            //
        });
       }

       try {
        getUserInfo()
       } catch(e) {
        console.log("Get user info", e)
       }
       
       
    }, [refresh])


    const next = () => {
      navigation.navigate("ProfileImage",{phoneNumber : phoneNumber, userName : userName, expoToken : expoToken , deviceToken : deviceToken , refereeId : couponCodeAccepted ? refereeId : "" , refereeName : couponCodeAccepted ? refereeName : "" , coinsValue : coinsValue})
    }


    const userNameChange = (e) => {
      
      const str = e.nativeEvent.text
      const ascii = str.charAt(str.length - 1).charCodeAt()
      if((ascii > 47 && ascii < 58) || (ascii > 96 && ascii < 123) || str.length == 0) 
      {
        setUserName(e.nativeEvent.text)
      } else {
        setUserNameSnackVisible(true)
      }
       
      axios.get(URL + "/isexists/username", {params:{user_name : str}} , {timeout:5000})
      .then(res => res.data).then(function(responseData) {
    //      console.log("username" , userName , "Check", responseData)
          if(responseData.length == 0 && str.length > 4) {
            setUserNameAccepted(true)
          } else {
            setUserNameAccepted(false)
          }

        })
      .catch(function(error) {
          //
      });
    }

    
    return (
        <ScrollView 
          contentContainerStyle = {style.mainViewContentContainer}
          style = {style.mainViewContainer} >
          <View style = {{ 
            backgroundColor : 'white', flex : 1 ,
            height : 50 , 
            position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
            flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'}}>
                <TouchableOpacity
                    style = {{marginLeft : 60, marginRight:20, flex : 1 , justifyContent :'center', alignItems :'center' }}
                    disabled
                    >
                    <Text style = {{fontSize : 20, fontWeight : 'bold'}}>Enter username</Text>
                </TouchableOpacity>
                <View style = {{marginLeft : 10,marginRight : 20, alignItems :'center', justifyContent :'center'}}>
                  {userNameAccepted ?
                  <AntDesign name = "checkcircle" color = "green" size = {20} /> :
                  <AntDesign name = "closecircle" color = "#ccc" size = {20} /> 
                  }
                </View>
          </View>
          <View style = {{marginTop : 30}}>
            <View style = {style.editUserDetailsInputContainer}>
              <View style = {style.editUserDetailsElementContainer}>
                <View style = {{flexDirection  : 'row' , backgroundColor : 'rgba(200,200,225,.1', borderRadius : 10, padding : 10 , borderColor : "#EEE" , borderWidth : 2}}>
                  <TextInput 
                    placeholder = {userName ? userName : "username"}
                    style = {{flex : 1,fontSize : 20}}
                    onChange = {userNameChange}
                    value = {userName}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    keyboardType={"visible-password"}
                  />
                </View>
              </View>
              <View style = {{flexDirection : 'row', marginVertical : 20}}>
                <BouncyCheckbox iconStyle={{
                  borderRadius: 0,
                  borderColor : alttheme, 
                }}
                disableText = {true}
                fillColor = {alttheme}
                onPress={(isChecked) => {setChecked(isChecked)}} />
                <View style = {{marginLeft : 10, justifyContent :'center', alignContent : 'center', flex : 1}}>
                {checked ? 
                <View style = {{justifyContent : 'space-between', flexDirection :'row', flex : 1}}>
                  <TextInput 
                    style = {{width : 150 , borderBottomWidth  : 1 , borderBottomColor : "#AAA", textAlign : 'center' , fontSize : 18}}
                    maxLength={6}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    keyboardType={"visible-password"}
                    placeholder='Referral Code here'
                    value = {referralCode}
                    onChangeText={(text)=>{
                      setReferralCode(text)
                      couponCodeChange(text) 
                    }}
                  />
                  <View style = {{marginLeft : 10,alignItems :'center', justifyContent :'center'}}>
                    {couponCodeAccepted ?
                    <AntDesign name = "checkcircle" color = "green" size = {20} /> :
                    null 
                    }
                  </View>
                </View>
                : 
                <Text style = {{color : '#555', fontWeight : 'bold'}}>Do you have referral code ?</Text>}
              </View>
            </View> 
            <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,alignItems:'flex-end'}}>
              <LinearGradient 
              colors = {checked ? couponCodeAccepted && userNameAccepted ?  ["#ed4b60","#E7455A","#D7354A"] : ['rgba(200,200,200,0.5)','rgba(225,225,225,0.5)','rgba(250,250,250,0.5)'] : !userNameAccepted ? ['rgba(200,200,200,0.5)','rgba(225,225,225,0.5)','rgba(250,250,250,0.5)'] : ["#ed4b60","#E7455A","#D7354A"]}
              style = {{
                  width : 100, height : 40 , borderRadius : 10, flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                  <TouchableOpacity 
                    onPress = {next}
                    style = {{width : 100, height : 40 , borderRadius : 10, flex : 1, justifyContent : 'center' , alignItems : 'center'}}
                    disabled = {checked ? !couponCodeAccepted && !userNameAccepted : !userNameAccepted}
                    >
                    <Text style = {{color : checked ? couponCodeAccepted && userNameAccepted ?  'white' : '#888' : !userNameAccepted ? '#888' : 'white'}}>Next</Text>
                  </TouchableOpacity>
                </LinearGradient> 
              </View>                  
            </View>
          </View>
          <Snackbar
            visible={userNameSnackVisible}
            onDismiss={onDismissSnackBar}
            duration={2000}
            action={{
            label: 'OK',
            onPress: () => {
                // Do something
            },
            }}>
            Min 5 chars. Only numbers and lower case characters allowed
          </Snackbar>
        </ScrollView>
    )
}

export default ProfileInfo
