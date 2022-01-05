import React , {useState,useEffect , useContext} from 'react'
import { Animated, Easing, View,Text , Image ,ImageBackground, TouchableOpacity , TextInput , Dimensions , Button, ToastAndroid , ScrollView , PermissionsAndroid } from 'react-native'

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
import { theme } from '../Exports/Colors';
import { s3URL, uploadImageOnS3 } from '../Exports/S3';
import LottieView from 'lottie-react-native';

import 'react-native-get-random-values'
import { nanoid , customAlphabet} from 'nanoid'
import * as Amplitude from 'expo-analytics-amplitude';



const ProfileInfo = () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6)

  const navigation = useNavigation()
  const route = useRoute()
  const progress = React.useRef(new Animated.Value(0)).current

  const [selectedItem, setSelectedItem ] = useState(0);
  const [date, setDate] = useState(new Date())
  const [image, setImage] = React.useState(route.params?.image ? route.params?.image  : "");
  const [gender, setGender] = useState(route.params?.gender ? route.params?.gender  : "")
  const [instagram, setInstagram] = useState(route.params?.instagram ? route.params?.instagram  :"")
  const [twitter, setTwitter] = useState(route.params?.twitter ? route.params?.twitter  :"")
  
  const [imageUrl,setImageUrl] = useState("")
  const [profileImageChange,setProfileImageChange] = useState(false)
  const [coverImageChange,setCoverImageChange] = useState(false)
  const [age,setAge] = useState("")
  const [userName,setUserName] = React.useState(route.params?.username ? route.params?.username  : "")
  const [userId] = React.useContext(RandomContext)
  const [phoneNumber,setPhoneNumber] = React.useState(route.params?.phoneNumber ? route.params?.phoneNumber : "")
  const [refereeName,setRefereeName] = React.useState(route.params?.refereeName ? route.params?.refereeName : "")
  const [refereeId,setRefereeId] = React.useState(route.params?.refereeId ? route.params?.refereeId : "")
  const [coinsValue,setCoinsValue] = React.useState(route.params?.coinsValue ? route.params?.coinsValue : "")
  const [userInfo,setUserInfo] = React.useState([])
  const [submitted,setSubmitted] = React.useState(false)

  const [userDob,setUserDob] = useState(route.params?.dob ? route.params?.dob  :"")
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [expoToken,setExpoToken] = React.useState("")
  const [deviceToken,setDeviceToken] = React.useState("")
  const [refresh,setRefresh] = React.useState(false)
  const [dbContacts,setDbContacts] = React.useState([])
  const [dbPhoneNumbers,setDbPhoneNumbers] = React.useState([])
  const [socialHandles,setSocialHandles] = React.useState({})

  const [userNameAccepted,setUserNameAccepted] = React.useState(false)
  const [userNameRefreshBoolean,setUserNameRefreshBoolean] = React.useState(false)

 

  
  const [variable,setVariable] = React.useState(route.params?.variable ?  route.params?.variable : "new user")
  
  const showDatePicker = () => {setDatePickerVisibility(true);};
  const hideDatePicker = () => {setDatePickerVisibility(false);};
  const handleConfirm = (date) => {
      setUserDob(moment(date).format("YYYY-MM-DD"))
      hideDatePicker();
  };


  const [contactsAlreadyExist,setContactsAlreadyExist] = React.useState(true)

    
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


    const userNameRefresh = () => {
      setUserNameRefreshBoolean(!userNameRefreshBoolean)
      if(userNameRefreshBoolean) {
        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver : true
          },).start();
    }
    else {
        Animated.timing(progress, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver : true
          },).start();
    }
    ToastAndroid.show("Username should contain minimum 5 characters", ToastAndroid.SHORT)
      
    }

    const onSubmitOnboarding = () =>{



        Amplitude.logEventAsync("NEW USER PROFILE SUBMITTED")
        setSubmitted(true)
        if(profileImageChange) {
          uploadImageOnS3(phoneNumber.slice(1,13) + "/profile",image) 
        }

        const userbody = {
          "user_id": phoneNumber.slice(1,13),
          "user_name": userName,
          "user_profile_image": profileImageChange ? s3URL + phoneNumber.slice(1,13) + "/profile" : "",
          "user_phone_number": phoneNumber,
          "user_gender": gender,
          "user_email": "",
          "user_dob": userDob,
          "expo_token": expoToken,
          "device_token": deviceToken,
          "instagram_user_name": instagram,
          "country_name": "India",
          "state_name": "",
          "city_name": "",
          "pin_code": 0 ,
          "twitter_user_name" : "",
          "social_handles" : socialHandles,
          "coupon" : nanoid()
        }
    //  console.log("USER BODY",userbody)
      
     const userPoints = {
      "user_id": phoneNumber.slice(1,13),
      "user_name": userName,
      "reward_type": "completed Onboarding",
      "coins_value": coinsValue,
      "reward_type_id": 1,
      "engaged_post_id" : "", 
      "engaged_user_id" : "",  
      "engaged_user_name" : "", 
      "engaged_product_name" : "" 
    }
    
    const refereePoints = {
      "user_id": refereeId,
      "user_name": refereeName,
      "reward_type": "Signed up using your referral code",
      "coins_value": coinsValue,
      "reward_type_id": 2,
      "engaged_post_id" : "", 
      "engaged_user_id" : "",  
      "engaged_product_name" : "" ,
      "engaged_user_name" : userName
    }

   //   console.log("USER POINTS",userPoints)
   //   console.log("REFEREE POINTS",refereePoints)

   axios.get(URL + "/user/info", {params:{user_id : phoneNumber.slice(1,13) }} , {timeout:5000})
   .then(res => res.data).then(function(responseData) {
     if(responseData.length>0) {
      axios({
        method: 'post',
        url: URL + '/user/new',
        data: userbody
        })
        .then(res => {            
            ToastAndroid.show("Details updated", ToastAndroid.LONG)
                    setTimeout(function(){
                    navigation.navigate("Home", {source : "Onboarding", body : userbody})
              }, 300);        
        })
        .catch((e) => {
            ToastAndroid.show("Error updating details. Please try later", ToastAndroid.SHORT)
            setSubmitted(false)
        })
     }
     else {
      axios({
        method: 'post',
        url: URL + '/user/new',
        data: userbody
        })
        .then(res => {
          axios({
            method: 'post',
            url: URL + '/rewards/earn',
            data: userPoints
            }).then(res=>{
       //       console.log(res)
            }).catch((e)=>{
              console.log(e)
          })
          if(refereeId && refereeId != "" ) 
            {
              axios({
                  method: 'post',
                  url: URL + '/rewards/earn',
                  data: refereePoints
                  }).then(res=>{
          //          console.log(res)
                  }).catch((e)=>{
                    console.log(e)
                })
            }
            
            ToastAndroid.show("Hi " + userbody.user_name, ToastAndroid.LONG)
                    setTimeout(function(){
                    navigation.navigate("Home", {source : "Onboarding", body : userbody})
                    }, 300);        
            })
        .catch((e) => {
            ToastAndroid.show("Error updating details. Please try later", ToastAndroid.SHORT)
            setSubmitted(false)
        })
     }
      
   })
   .catch(function(error) {
       //
   });






    }



    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
      
        if (!result.cancelled) {
       //   console.log(result.uri)
          setImage(result.uri);
          setProfileImageChange(true)
       //   console.log("I am reaching here")
          
        }
      };   
      
      
    const pickProfilePhoto = () => {
    //  console.log("image picker")
      pickImage()
    }

    const userNameChange = (text) => {
      setUserName(text)
      axios.get(URL + "/isexists/username", {params:{user_name : text}} , {timeout:5000})
      .then(res => res.data).then(function(responseData) {
    //      console.log("username" , userName , "Check", responseData)
          if(responseData.length == 0 && text.length > 4) {
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
          {/* <View style = {header.headerView}>
            <ModernHeader 
              title="My Info"
              titleStyle = {header.headerText}
              backgroundColor= {background}
              leftDisable
              rightDisable
            />
          </View> */}

          <View style = {{}}>
            <View style = {style.editUserDetailsDisplayContainer}>
              <TouchableOpacity style = {style.editUserDetailsDisplayImageButton} onPress = {pickProfilePhoto}>
                <ImageBackground source = {image && image != "None"? {uri : image + "?" + new Date() } : {uri : 'https://ui-avatars.com/api/?rounded=true&name&size=512'}} 
                        style = {style.editUserDetailsDisplayImage} >
                </ImageBackground>
                <View style = {{position: 'absolute' , backgroundColor : 'white' , padding : 3, borderRadius : 20 , bottom : 0 , right : 0 , margin : 15 , zIndex : 150}}>
                  <Entypo name = "edit" size = {10} color = 'black' />
                </View>
              </TouchableOpacity>
            </View>
            
            {!image ? 
            <View style = {{justifyContent : 'center' , alignItems : 'center'}}><Text>Pick a profile image</Text></View>
            : null
            }
            

            <View style = {style.editUserDetailsInputContainer}>
              <Text style = {style.editUserProfileHeader}>Profile Info</Text>
              <View style = {style.editUserDetailsElementContainer}>
                <View style = {{flexDirection : 'row'}}>
                  <Text style = {style.editUserDetailsElementText}>UserName *</Text>
                  <View style = {{marginLeft : 10,alignItems :'center', justifyContent :'center'}}>
                    {userNameAccepted ?
                    <AntDesign name = "checkcircle" color = "green" size = {20} /> :
                    <AntDesign name = "closecircle" color = "#888" size = {20} /> 
                    }
                  </View>
                </View>
                <View style = {{flexDirection  : 'row'}}>
                  
                  <TextInput 
                          placeholder = {userName ? userName : "username"}
                          style = {[style.editUserDetailsElementTextInput,{flex : 1,}]}
                          onChangeText = {(text)=>userNameChange(text)}
                          value = {userName}
                  />
                  
                  <TouchableOpacity
                  style = {{justifyContent : 'center', alignItems : 'center'}}
                  onPress = {userNameRefresh}
                  >
                    <LottieView
                      progress = {progress}
                      style={{width : 20 , height : 20, marginRight : 10}}
                      source={require('../../assets/animation/refresh.json')}
                      />
                  </TouchableOpacity>
                </View>
              </View>
              <View style = {style.editUserDetailsElementContainer}>
                <Text style = {style.editUserDetailsElementText}>Instagram(@)</Text>
                <TextInput 
                        style = {style.editUserDetailsElementTextInput}
                        onChangeText = {(text)=>{
                          setInstagram(text)
                          setSocialHandles({...socialHandles,instagram : instagram})}
                        }
                        value = {instagram}
                />
              </View>
              <View style = {style.editUserDetailsElementContainer}>
                <Text style = {style.editUserDetailsElementText}>Twitter(@)</Text>
                <TextInput 
                        style = {style.editUserDetailsElementTextInput}
                        onChangeText = {(text)=>{
                          setTwitter(text)
                          setSocialHandles({...socialHandles,twitter : twitter})}
                        }
                        value = {twitter}
                />
              </View>

              <View style = {style.editUserDetailsElementContainer}>
                <Text style = {style.editUserDetailsElementText}>Birthday</Text>
                <View style = {{flexDirection : 'row'}}>
                  <Text style = {[style.editUserDetailsElementTextInput,{flex : 1}]}> 
                      { userDob && userDob != "0000-00-00" ? userDob.replace('"','').substring(0,10) : ""} 
                  </Text>
                  <TouchableOpacity style = {style.datepicker} onPress={showDatePicker}>
                      <EvilIcons name = "calendar" size = {24} color = {theme}/>
                  </TouchableOpacity>  
                  <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                  />
                </View>
              </View>
              <View style = {style.editUserDetailsElementContainer}>
                <Text style = {style.editUserDetailsElementText}>Gender</Text>
                <View style = {{flexDirection : 'row' ,  justifyContent : 'flex-end', alignItems : 'flex-end' }}>
                  <Text style = {{ borderBottomWidth : 1 ,borderBottomColor : "#CCC",flex : 1 , paddingBottom : 5,}}> 
                      { gender && gender != "NA" ? gender : ""} 
                  </Text>
                  <Picker
                    selectedValue={gender}
                    style = {{width : 50, }}
                    onValueChange={(value) => setGender(value)}
                    dropdownIconColor = {theme}
                    itemStyle = {{fontSize : 12, color : theme}}
                  >
                    
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Others" value="Others" />
                    <Picker.Item label="Prefer not to say" value="Prefer Not to say" />
                  </Picker>
                </View> 
              </View>
              <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,
                 alignItems:'flex-end'}}>
                <TouchableOpacity 
                        onPress = {onSubmitOnboarding}
                        disabled = {!userNameAccepted}
                        style = {{
                          backgroundColor : !userNameAccepted ? "#DDD" :theme , width : 100, height : 40 , borderRadius : 10, 
                        flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                    <Text style = {{color : !userNameAccepted ? '#888' : 'white'}}>Submit</Text>
                </TouchableOpacity>
              </View>                  
            </View>
          </View>
          </ScrollView>
    )
}

export default ProfileInfo
