import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { RandomProvider } from './Screens/Exports/Context';
import Navigator from './Screens/Navigator';
import { NativeBaseProvider, Box } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import AppCenter from 'appcenter';
import * as firebase from "firebase";
import * as Linking from 'expo-linking';
import { firebaseConfig, dataRetrieve, URL } from './Screens/Exports/Config';
import { LoadingPage } from './Screens/Exports/Pages';
import axios from 'axios'

// import codePush from 'react-native-code-push';

import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import * as Amplitude from 'expo-analytics-amplitude';
try {
    Amplitude.initializeAsync("eb87439a02205454e7add78f67ab45b2");
}
catch {
    console.log("No Amplitude Tracking")
}

try {
  firebase.initializeApp(firebaseConfig);

} catch (err) {
  // ignore app already initialized error in snack
}

//const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const prefix = Linking.createURL('/')

const config = {
  screens: {
    HomeStack: {
      screens: {
        UserLink: 'user',
      },
    }
  }
}


const App = () => {

  const linking = {
    prefixes: ['https://www.getcandid.app/', 'exp://192.168.109.113:19000/', 'https://*.getcandid.app', 'candid://*'], 
    config
  }

  const [randomNo , setRandomNo] = React.useState(Math.floor(Math.random()*3+1))
  const [userId,setUserId] = React.useState("")

  const [loggedIn,setLoggedIn] = React.useState(false)
  const [isLoading,setLoading] = React.useState(true)
  const [loadingTimeWait,setLoadingTimeWait] = React.useState(false)
  const [userDetails,setUserDetails] = React.useState({})
  const [error,setError] = React.useState(false)

  const [buyLink,setBuyLink] = React.useState("")

  React.useEffect( () => {
    Crashes.setEnabled(true);
    Analytics.trackEvent("App Open");
    const getData = async () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
          AppCenter.setUserId(user.phoneNumber);
         // console.log("firebase",user)
          Amplitude.setUserIdAsync(user.phoneNumber)
          Amplitude.logEventWithPropertiesAsync('USER_VISIT', {"userPhoneNumber": user.phoneNumber})
          setLoggedIn(true)
          setUserId(user.phoneNumber)
          axios.get(URL + "/user/info", {params:{user_id : user.phoneNumber.slice(1,13) }} , {timeout:5000})
            .then(res => res.data)
            .then(function(responseData) {
              setLoadingTimeWait(true)
              setUserDetails(responseData[0])
              setLoading(false)
            })
            .catch(function(error) {
            //  console.log(error)
            
              setLoadingTimeWait(true)
              setLoading(false)
            });
        }  
        else {
          setLoadingTimeWait(true)
          setLoading(false)
        }
      }  
    )
      setLoading(false)
    }
   
    getData()
     
  // console.log("loading ", isLoading)
    
},[isLoading]);

// ReceiveSharingIntent.getReceivedFiles(files => {
//   console.log("received intent", JSON.stringify(files))    
// },
// (error) =>{
// //  console.log(error);
// });




  return (
    <View style = {{flex : 1}}>
    {isLoading ? 
      <View style = {{flex:1 , justifyContent : 'center', alignItems : 'center', marginTop : 50}}>
        <LoadingPage /> 
      </View> : 
      loadingTimeWait ?
     (
      <MenuProvider>
      <RandomProvider value = {[randomNo, userId]}>
      <NativeBaseProvider>
          <NavigationContainer linking={linking}>
              <Navigator />
          </NavigationContainer>
      </NativeBaseProvider>
      </RandomProvider>
      </MenuProvider>
      ) : (
      <View style = {{flex:1 , justifyContent : 'center', alignItems : 'center' , marginTop : 50}}>
        <LoadingPage />
      </View>
    )}
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
