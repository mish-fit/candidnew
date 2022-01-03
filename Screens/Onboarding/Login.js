import React, {useState,useEffect} from "react";
import { Animated,Easing, Text, View, TextInput, Button, Linking, TouchableOpacity, Platform, ToastAndroid , Keyboard , ImageBackground, Dimensions , ScrollView, Image, Pressable} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { useNavigation } from '@react-navigation/native';

import { authContext } from "../Exports/Context";

// import SMSUserConsent from 'react-native-sms-user-consent';
// import { useSmsUserConsent } from '@eabdullazyanov/react-native-sms-user-consent';

import {width , height } from '../Exports/Constants'
import { theme } from "../Exports/Colors";
import * as Amplitude from 'expo-analytics-amplitude';
import Hyperlink from 'react-native-hyperlink'
import {Ionicons} from 'react-native-vector-icons'
import { add } from "react-native-reanimated";
import { loginStyle } from "../../Styles/Login";

export default function Login() {
    const [code, setCode] = React.useState();

  

    const navigation = useNavigation()
    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  
//   const [message, showMessage] = React.useState((!firebaseConfig || Platform.OS === 'web')
//     ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
//     : undefined);

  const [loginClick,setLoginClick] = React.useState(false)
  const [valid,setValid] = React.useState(false)
  const [otpvalid,setOTPValid] = React.useState(false)
  const [length,setLength] = React.useState(0)
  const [number, setNumber] = React.useState("");
  const [otplength,setOTPLength] = React.useState(0)
  const [otpnumber, setOTPNumber] = React.useState("");
  const [otpClick,setOtpClick] = React.useState(false)



  const [resendButtonDisabledTime, setResendButtonDisabledTime] =  React.useState(60);
  const [isAndroid, setAndroid] = React.useState(true)
  const [attemptsRemaining,setAttemptsRemaining] = React.useState(3)
  

  const [screen,setScreen] = React.useState(false)
  const [mins, setMins] = useState(0)
  const [secs, setSecs] = useState(300)
  
  const [message,setMessage] = React.useState("")

  // const retrievedCode = useSmsUserConsent();

  React.useEffect(() => {
    Amplitude.logEventAsync('LOGIN SCREEN')
  //  console.log("Code",retrievedCode)
    // if (retrievedCode) {
    //   setCode(retrievedCode);
    //   setOTPNumber(retrievedCode)
    // }
    // if(code) {
    //   onSubmit()
    // }    
  // }, [retrievedCode, code]);
}, []);
  
  React.useEffect(()=>{
   
    
    const timerId = setInterval(() => {
      if (secs <= 0) {
        setSecs(-1)
      }
      else setSecs(s => s - 1)
    }, 1000)
    return () => {
        // SMSUserConsent.removeOTPListener()
        clearInterval(timerId);}
  },[secs])



  const onChangeNumber = (text) => {
      setNumber(text)
      setPhoneNumber("+91" + text)
      setLength(text.length)
    //  console.log(text.length)
      if(text.length === 10) {
        setValid(true)
        Keyboard.dismiss(false)
      } else {
        setValid(false)
      }
    }

    const onChangeOTP = (text) => {
      setOTPNumber(text)
      setOTPLength(text.length)
    //  console.log(text.length)
      if(text.length === 6) {
        setOTPValid(true)
        Keyboard.dismiss(false)
      } else {
        setOTPValid(false)
      }
    }


  const onPressLogin = async () => {
    // getSMSMessage()
    setLoginClick(true)
    try {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber,recaptchaVerifier.current);
    setVerificationId(verificationId);
    ToastAndroid.show("Verification code has been sent to your phone",ToastAndroid.SHORT)
    
    setScreen(true)
    } catch (err) {
       // console.log(err)
        ToastAndroid.show(err,ToastAndroid.SHORT )
        setLoginClick(false)
    }
  }





const onSubmit = async () => {
    
    setOtpClick(true)
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId,otpnumber);
      await firebase.auth().signInWithCredential(credential);
      navigation.navigate("HomeTab" , {userId : phoneNumber})
      Amplitude.logEventAsync('OTP SUBMITTED')
    //  console.log("it logged in")
    } catch (err) {
    //    console.log(err)
          ToastAndroid.show("Error Logging in! Re-enter correct OTP", ToastAndroid.SHORT)
          setOtpClick(false)
    }
  }

// const getSMSMessage = async () => {
//     try {
   
//       const message = await SMSUserConsent.listenOTP()
//     //  console.log("message",message.receivedOtpMessage , retrievedCode)
//     } catch (e) {
//     //  console.log("message",e)
//     }
// }


  return (
   
    <ScrollView 
      contentContainerStyle={{}}
      style={{flex : 1}}>
      {!screen ?  (
      <View style = {{ flex : 1 , }}> 
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={true}
          title='Prove you are human!'
          cancelLabel='x'
        />
      
     
        <View style = {{justifyContent : 'center' ,  alignItems : 'center',  backgroundColor : theme,}}>
          <Image
            source = {require("../../assets/icon.png")}
            style = {{marginTop : height*0.1 ,marginBottom : height*0.1 ,width : width*0.7 , height : width*0.7 , borderRadius : width*0.7}}
            />
        </View>
        <View style={[{justifyContent : 'center', alignItems : 'center', marginTop : height*0.05, }]}>
          <Text style={[{fontSize : 20}]}>Enter phone number</Text>
        </View>
      <View style = {{
        flexDirection : 'row', 
        marginTop : 20, 
        marginHorizontal : 10 , 
        paddingHorizontal : 10, alignItems :'center', justifyContent :'center'
        }}>
        <View style = {{}}>
              <Text style = {{fontWeight :'bold'}}>+91</Text>
        </View>
        <View style = {{flex : 1 ,borderBottomColor : "#EEE" , borderBottomWidth : 1, marginLeft : 10, }}>
        <TextInput
          style={length ? {fontSize : 25, letterSpacing : 1,} : [{fontSize : 15, letterSpacing : 1, }]  }
          placeholder="10 Digit mobile number"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={(phoneNumber) => onChangeNumber(phoneNumber)}
          value = {number}
        /> 
        </View>
      </View>
      <TouchableOpacity
        style = {{ marginHorizontal : 20, marginTop : 20 ,  borderRadius : 10 ,  padding : 10, backgroundColor : loginClick || !valid ? "#888" : theme, justifyContent : 'center', alignItems : 'center'}}
        onPress={onPressLogin}
        disabled={loginClick || !valid}
        >
          <Text style = {{color : 'white'}}>GET OTP</Text>
        </TouchableOpacity>
        <View style = {{justifyContent : 'center', alignItems : 'center', marginHorizontal : 10 , marginBottom : 10 , marginTop : 100}}>
        <Text style = {{fontSize : 12}}>
          <Ionicons name = "shield-checkmark-outline" size = {20} color = "green" /> 100% Safe. We don't use any private information 
        </Text>
        <Hyperlink  linkStyle={ { color: '#2980b9', fontSize: 12 } }
                    linkText={ url => url === 'https://www.getcandid.app/termsandconditions' ? 'Terms and Conditions' : url === 'https://www.getcandid.app/privacypolicy' ?  'Privacy Policy' : url}>
          <Text style={ { fontSize: 12, textAlign :'center' } }>
           By continuing, you agree to our https://www.getcandid.app/termsandconditions and https://www.getcandid.app/privacypolicy
          </Text>
        </Hyperlink>
      </View>
      {/* <View style = {{}} /> */}
      </View>
      ) : (
      <View style = {{}}>
      <View style = {{justifyContent : 'center' , flex : 1 , alignItems : 'center',  backgroundColor : theme,}}>
        <Image
          source = {require("../../assets/icon.png")}
          style = {{marginTop : height*0.1 ,marginBottom : height*0.1 ,width : width*0.7 , height : width*0.7 , borderRadius : width*0.7}}
          />
      </View>
      <View style = {{justifyContent : 'center', alignItems : 'center', marginTop : height*0.05,}}>
        <Text style = {{fontSize : 20}}> Enter OTP </Text>
     
      <View style = {{borderBottomColor : "#DDD" , borderBottomWidth : 1, marginTop : 10, flex : 1, width : width*0.8}}>
        <TextInput
          style={otplength ? {fontSize : 25, letterSpacing : 1, textAlign : 'center'} : [{fontSize : 15, letterSpacing : 1,  textAlign : 'center' }]  }
          placeholder="Please enter your 6 digit OTP"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={(otp) => onChangeOTP(otp)}
          value = {otpnumber}
        />
      </View>
      
     
      </View>
       <TouchableOpacity style = {{ marginHorizontal : 20, marginTop : 20 ,  borderRadius : 10 ,  padding : 10, backgroundColor : otpClick || !otpvalid ?"#888" :  theme , justifyContent : 'center', alignItems : 'center'}}
        disabled = {otpClick || !otpvalid}
        onPress = {onSubmit} 
        >
        <Text style = {{color : 'white'}}>
          Submit
        </Text>
      </TouchableOpacity>
      <View style = {{marginTop : 10 , justifyContent : 'center', alignItems : 'center'}}>
      {
        secs > 0 ?
        <Text style = {{}}>Resend OTP in {Math.floor(secs/60)}:{secs%60 < 10 ? "0"+secs%60 : secs%60}</Text> :
        <TouchableOpacity 
          style = {{}}
          onPress={()=>{
            setScreen(false)
            setLoginClick(false)
            setAttemptsRemaining(attemptsRemaining-1)
            setSecs(300)

          }}>
            <Text style = {{color : theme}}> Resend OTP </Text>
        </TouchableOpacity>
      }
        <Text style = {{marginTop : 10 ,}}> {attemptsRemaining} Attempts Remaining</Text>
      </View>
        
    </View>
      )}
    </ScrollView>
   
     );
}
