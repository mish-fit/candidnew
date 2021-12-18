import React from 'react'
import { PermissionsAndroid,Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput } from 'react-native'
import {dataRetrieve, URL} from './Exports/Config'
import * as firebase from "firebase";
import axios from 'axios';
import { StackActions , useNavigation} from '@react-navigation/native';
import { LoadingPage } from './Exports/Pages';

const Blank = () => {
    
    const navigation = useNavigation()
    
    React.useEffect(()=>{
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                axios.get(URL + "/user/info",{params:{user_id : user.phoneNumber.slice(1,13)}} , {timeout : 5000})
                    .then(res => res.data).then(async function(responseData) {
                        if(responseData.length && responseData[0].user_name) {
                            navigation.navigate("Home",{phoneNumber : user.phoneNumber, body : responseData[0] })
                        }
                        else {
                            navigation.navigate("ProfileInfo",{phoneNumber : user.phoneNumber})
                        }
                    }).catch(function(error) {
          
                    });
                }
            })
    },[])
    

    return (
        <View style = {{flex : 1 ,}}>
            <LoadingPage />
        </View>
    )
}

export default Blank

const styles = StyleSheet.create({})
