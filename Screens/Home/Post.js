import React from 'react'

import { PermissionsAndroid,Animated, Dimensions, Linking, Image, StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput , Switch, ScrollView } from 'react-native'
import { backArrow, colorsArray, theme, themeLight, themeLightest } from '../Exports/Colors'
import { RandomContext } from '../Exports/Context'
import {AntDesign} from 'react-native-vector-icons';
import { NavigationContainer, useNavigation, useRoute , useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { GiftComponent, RewardsComponent } from '../Exports/Components';
import Constants from 'expo-constants'
import {dataRetrieve, URL} from '../Exports/Config'
import {homeFeed} from "../FakeData/HomeFeed"
import Contacts from 'react-native-contacts';
import {Avatar} from 'react-native-paper'
import * as firebase from "firebase";
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { width } from '../Exports/Constants';
import { Rating, AirbnbRating } from 'react-native-ratings';
import * as Amplitude from 'expo-analytics-amplitude';
import { home } from '../../Styles/Home';
import  Modal  from 'react-native-modal'
import { add } from '../../Styles/Add';

try {
    Amplitude.initializeAsync("eb87439a02205454e7add78f67ab45b2");
}
catch {
    console.log("No Amplitude Tracking")
}

const Post = () => {
    
    const navigation = useNavigation()
    const route = useRoute()

    const {item,id,userInfo} = route?.params

    const [randomNo, userId] = React.useContext(RandomContext)
    const [colorNo,setColorNo] = React.useState(0) 
    const [tempFollow,setTempFollow] = React.useState(false)
    const [like,setLike] = React.useState(item.activity_like)
    const [dislike,setDislike] = React.useState(item.activity_dislike)
    const [buys,setBuys] = React.useState(item.activity_buy)
    const [result,setResult] = React.useState()

  
    

    React.useEffect(() => {
    

     //   console.log(userInfo)


    },[])

    const followUser = () => {
        setTempFollow(true)
    }

    const likePost = () => {
        setLike(!like)
        const body = {
            "user_id": userId,
            "feed_id": item.feed_id,
            "feed_user_id" : item.user_id,
            "user_name": userInfo.user_name,
            "activity_like": !like,
            "activity_dislike": dislike,
            "activity_buy": buys
        }

        axios({
            method: 'post',
            url: URL + '/engagement/engagepost',
            data: body
          }, {timeout : 5000})
        .then(res => {
        //    console.log(res)
        })
        .catch((e) => console.log(e))


    }

    const dislikePost = () => {
        setDislike(!dislike)
        const body = {
            "user_id": userId,
            "feed_id": item.feed_id,
            "feed_user_id" : item.user_id,
            "user_name": userInfo.user_name,
            "activity_like": like,
            "activity_dislike": !dislike,
            "activity_buy": buys
        }

        axios({
            method: 'post',
            url: URL + '/engagement/engagepost',
            data: body
          }, {timeout : 5000})
        .then(res => {
        //    console.log(res)
        })
        .catch((e) => console.log(e))


    }

    const redirect = async (buyURL) => {
        try {   
            Linking.openURL(buyURL)
        } catch (error) {
            Amplitude.logEventWithPropertiesAsync("BUY URL ERROR", { "buy_url": buyURL})
            alert("Browser not reachable")

        }
    };

    const buyItem = (buyURL) => {
        Amplitude.logEventWithPropertiesAsync("BUY URL", { "user_id": userId,"feed_id": item.feed_id,"feed_user_id" : item.user_id,"user_name": userInfo.user_name})
     //   console.log(buyURL)
        redirect(buyURL)
        setBuys(buys+1)

        
        const body = {
            "user_id": userId,
            "feed_id": item.feed_id,
            "feed_user_id" : item.user_id,
            "user_name": userInfo.user_name,
            "activity_like": like,
            "activity_dislike": dislike,
            "activity_buy": buys+1
        }

        axios({
            method: 'post',
            url: URL + '/engagement/engagepost',
            data: body
          }, {timeout : 5000})
        .then(res => {
        //    console.log(res)
        })
        .catch((e) => console.log(e))

    }


    return(
        <View style = {{backgroundColor : 'white'}}>
            <View 
            style = {add.headerView}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.goBack()}
                    style = {add.headerBack}>
                        <AntDesign name = "arrowleft" size = {30} color = {backArrow}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {add.headerTitle}
                        disabled
                        >
                        <Text style = {add.headerTitleText}>Post</Text>
                    </TouchableOpacity>
            </View>
        
        <ScrollView 
        showsVerticalScrollIndicator = {false}
        style = {{marginLeft : 10 , marginRight : 10 , borderWidth : 1 , borderColor : '#EEE', borderRadius : 10, marginTop : 50 , marginBottom : 5,  }}>
            
            <View style = {{marginTop : 5 ,marginLeft : 10 , flexDirection : 'row', justifyContent : 'flex-start'}}>
                <View style = {{marginRight : 10}}>
                {item.user_image && item.user_image != "None" && item.user_image != "" ?
                    <Image source = {{uri : item.user_image}} style = {{width : 40, height : 40 , borderRadius : 40 , marginTop : 5 , marginLeft : 5  }}/> :
                    <Avatar.Image style = {{marginTop : 5 , marginLeft : 5 , }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={40}/> }  
                </View>  
                <View style = {{flex : 1,}}>
                    <View style = {{flexDirection : 'row', marginLeft : 5}}>
                        <TouchableOpacity onPress = {()=> {
                         //   console.log(" user info ",userInfo, " item " , item)
                            navigation.navigate("UserPage", {homeUserName : userInfo.user_name, userName : item.user_name , userId : item.user_id , isFollowing : item.isFollowing}
                        
                        )}}>
                            <Text style = {{fontSize : 15 , fontWeight : 'bold' , color : "#555"}}>{item.user_name}</Text>
                        </TouchableOpacity> 
                        { item.isFollowing ? null :
                        tempFollow ?
                        <View>
                            <Text style = {{color : '#AAA', marginLeft : 10 }}>Following</Text>
                        </View> :
                        <TouchableOpacity onPress = {followUser}>
                            <Text style = {{color : 'skyblue', marginLeft : 10 }}>Follow</Text>
                        </TouchableOpacity>
                        }
                    </View>
               
                    <View style = {{marginTop : 5 ,marginLeft : 5 , flexDirection : 'row', flex : 1, }}>
                        <Text style = {{fontSize : 12 , color : "#555" , }}>{item.product_name}</Text>
                    </View>
                </View> 
            </View>
                <View style = {{marginHorizontal : 20 , marginVertical : 5,flexDirection : 'row' , justifyContent : 'space-between'}}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.navigate("CategoryPage", {categoryId : item.category_id, categoryName : item.category_name , userInfo : userInfo, userName : userInfo.user_name})}
                    style = {{ paddingHorizontal: 5, paddingVertical : 2, backgroundColor :  "#888" , borderRadius : 10, }}>
                        <Text style = {{color : 'white',fontSize : 12, fontStyle : 'italic'}}>{item.category_name}</Text>
                    </TouchableOpacity>
                    <View style = {{borderWidth : 1 , paddingHorizontal: 5, paddingVertical : 2, 
                        borderColor :  "#CCC" , borderRadius : 20, }}>
                        <Text style = {{fontSize : 12, fontStyle : 'italic'}}>{item.context_name}</Text>
                    </View>
                </View>
                { item.feed_image && item.feed_image != "None" && item.feed_image != "" ? <View style = {{marginTop : 5, justifyContent : 'center', alignItems : 'center' }}>
                   <Image source = {{uri : item.feed_image}} 
                        style = {{
                            width : Dimensions.get('screen').width * 0.92,
                            height: Dimensions.get('screen').width * 0.92,
                            borderRadius : 40, 
                        }} 
                    />
                   <TouchableOpacity 
                    onPress = {()=>buyItem(item.buy_url)}
                    style = {{position : 'absolute', bottom : 10 , left : Dimensions.get('screen').width * 0.15, width : Dimensions.get('screen').width * 0.62 , backgroundColor : colorsArray[colorNo] , alignItems : 'center' , padding : 5 , borderRadius : 20}}>
                        <Text style = {{fontWeight : 'bold' , color : 'white', fontSize : 18}}>BUY</Text>
                    </TouchableOpacity> 
                    <AirbnbRating
                        ratingContainerStyle = {{position : 'absolute', top : 10 , left : Dimensions.get('screen').width * 0.65, backgroundColor : 'transparent'}}
                        defaultRating = {item.rating}
                        readOnly = {true}
                        size={15}
                        showRating = {false}
                        isDisabled = {true}
                        count = {5}
                        unSelectedColor = "transparent"
                        />
                </View> :  
                <View style = {{flexDirection : 'row' , }}>
                    <AirbnbRating
                        ratingContainerStyle = {{width : Dimensions.get('screen').width * 0.7, backgroundColor : 'transparent', flex : 1}}
                        defaultRating = {item.rating}
                        readOnly = {true}
                        size={15}
                        showRating = {false}
                        isDisabled = {true}
                        count = {5}
                        unSelectedColor = "transparent"
                        />
                    <TouchableOpacity 
                    onPress = {()=>buyItem(item.buy_url)}
                    style = {{width : Dimensions.get('screen').width * 0.3 , backgroundColor : colorsArray[colorNo] , alignItems : 'center' , marginRight : 20 , borderRadius : 20}}>
                        <Text style = {{fontWeight : 'bold' , color : 'white', fontSize : 18, flex : 1}}>BUY</Text>
                    </TouchableOpacity> 
                </View>
                }
                <View style = {{marginTop : 5, flexDirection : 'row',justifyContent : 'space-between' , paddingHorizontal : Dimensions.get('screen').width * 0.05 , borderRadius : 5}}>
                    <TouchableOpacity 
                    disabled={dislike}
                    onPress = {likePost}
                    >
                        <AntDesign name = "like2" color = {like ? "green" : dislike ? "#EEE" : "#AAA"} size = {20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    disabled={like}
                    onPress = {dislikePost}
                    >
                        <AntDesign name = "dislike2" color = {dislike ? "red" : like ? "#EEE" :"#AAA"} size = {20} />
                    </TouchableOpacity>
                </View>
                <View style = {{marginTop : 5 , paddingHorizontal : 10 , marginBottom : 10 }}> 
                    <Text style = {{fontWeight : 'bold'}}>{item.title}</Text>
                </View>
                <View style = {{marginTop : 5 , paddingHorizontal : 10 , marginBottom : 10 }}>
                    <Text>{item.comment}</Text>
                </View>
            </ScrollView>
            </View>
        )
}

export default Post

const styles = StyleSheet.create({})
