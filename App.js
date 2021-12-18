import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { RandomProvider } from './Screens/Exports/Context';
import Navigator from './Screens/Navigator';
import { NativeBaseProvider, Box } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';

import * as firebase from "firebase";

import { firebaseConfig, dataRetrieve, URL } from './Screens/Exports/Config';
import { LoadingPage } from './Screens/Exports/Pages';
import axios from 'axios'

import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

try {
  firebase.initializeApp(firebaseConfig);

} catch (err) {
  // ignore app already initialized error in snack
}


export default function App() {

  const [randomNo , setRandomNo] = React.useState(Math.floor(Math.random()*3+1))
  const [userId,setUserId] = React.useState("")

  const [loggedIn,setLoggedIn] = React.useState(false)
  const [isLoading,setLoading] = React.useState(true)
  const [loadingTimeWait,setLoadingTimeWait] = React.useState(false)
  const [userDetails,setUserDetails] = React.useState({})

  React.useEffect( () => {
    const getData = async () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
         // console.log("firebase",user)
          
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

ReceiveSharingIntent.getReceivedFiles(files => {
//  console.log("received intent", files)    
},
(error) =>{
//  console.log(error);
});




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
          <NavigationContainer>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
