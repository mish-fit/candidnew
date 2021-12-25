import React from 'react'
import { PermissionsAndroid,Animated, Dimensions, Linking, Image, StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput , Switch, ScrollView, Pressable, ImageBackground, ToastAndroid } from 'react-native'
import { alttheme, background, borderColor, colorsArray, theme, themeLight, themeLightest } from '../Exports/Colors'
import { RandomContext } from '../Exports/Context'
import {AntDesign, Fontisto} from 'react-native-vector-icons';
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
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { width } from '../Exports/Constants';
import { Rating, AirbnbRating } from 'react-native-ratings';
import * as Amplitude from 'expo-analytics-amplitude';
import { home } from '../../Styles/Home';
import  Modal  from 'react-native-modal'
import Swiper from 'react-native-swiper'
import { LoadingPage } from '../Exports/Pages';


try {
    Amplitude.initializeAsync("eb87439a02205454e7add78f67ab45b2");
}
catch {
    console.log("No Amplitude Tracking")
}



const FriendsCarousel = ({DATA , onClickItem}) => {
    const [data,setData] = React.useState([...DATA])
    const scrollX = React.useRef(new Animated.Value(0)).current
    
    const ITEM_SIZE = 70
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
    
    const renderItem = ({item , index}) => {
        
        const itemClick = (item) => {
            onClickItem(item.user_id, item.user_name, true)
        }
       
        const inputRange = [
            ITEM_SIZE*(index-1),
            ITEM_SIZE*(index),
            
        ]
       
        const scale = scrollX.interpolate({
            inputRange,
            outputRange : [1,1]
        })
      
  
        return(
            <Animated.View style={[home.mainViewCarouselScrollableItemContainer,{borderWidth : 0}  , {transform : [{scale}]}]}>
                <TouchableOpacity style = {[home.mainViewCarouselScrollableItemButton,{borderWidth : 0}]} onPress = {() => {itemClick(item)}}>
                    <View style = {{flex: 1  , width : ITEM_SIZE, height : ITEM_SIZE-20, backgroundColor : background}}>
                     {item.user_profile_image ? 
                     <Image source = {{uri : item.user_profile_image}} 
                          style = {[home.mainViewCarouselScrollableItemImageBackground, {opacity : 1 , backgroundColor : background, borderRadius : 10 , width : ITEM_SIZE-20, height : ITEM_SIZE-20 , marginLeft : 10} ]} />
                   : <Avatar.Image style = {{marginTop : 10 , marginLeft : 20 ,  }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.following_user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={ITEM_SIZE-40}/> }
                    </View>
                    <View style = {{backgroundColor : background , width : ITEM_SIZE,height : 30 , borderRadius : 5, justifyContent :'flex-end', alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : borderColor}]}>{item.following_user_name.length > 30 ? item.following_user_name.substring(0,20) + "..." : item.following_user_name}</Text>
                    </View>
                    <View style = {{position : 'absolute' , top : 0 , right : 0 , backgroundColor : alttheme , borderRadius : 20, width : 20 , height : 20 , justifyContent : 'center' , alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : 'white'}]}>{item.count_posts}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
  
    return (  
            <Animated.FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.following_user_id.toString()}
            horizontal = {true}
            style = {{marginLeft : Dimensions.get('screen').width*0.01,width : Dimensions.get('screen').width*0.98}}
            contentContainerStyle = {home.mainViewCarouselScrollableItem}
            onScroll = {Animated.event(
                [{nativeEvent :  {contentOffset : {x : scrollX}}}],
                {useNativeDriver : true}
            )}
            snapToInterval = {ITEM_SIZE+5}
            showsHorizontalScrollIndicator = {false}
            />
    )
  }
  
const FollowingCarousel = ({DATA , isFollowing, onClickItem , onClickFollow}) => {
    const [data,setData] = React.useState([...DATA])
    const scrollX = React.useRef(new Animated.Value(0)).current
   
    React.useEffect(() => {
        console.log("Following",isFollowing)
    },[])

    const ITEM_SIZE = 70
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

    const renderItem = ({item , index}) => {
        
        const itemClick = () => {
            onClickItem(item.user_id, item.user_name, false)
        }

        const itemFollow = () => {
            onClickFollow(item.user_id, item.user_name, index)
        }
        
        const inputRange = [
            ITEM_SIZE*(index-1),
            ITEM_SIZE*(index),
           
        ]
        const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE*index,
            ITEM_SIZE*(index+1),   
        ]
        const scale = scrollX.interpolate({
            inputRange,
            outputRange : [1,1]
        })
        const opacity = scrollX.interpolate({
            inputRange : opacityInputRange,
            outputRange : [1,1,1,0]
        })

        return(
            <Animated.View style={[home.mainViewCarouselScrollableItemContainer,{borderWidth : 0}  , {transform : [{scale}]}]}>
                <TouchableOpacity style = {[home.mainViewCarouselScrollableItemButton,{borderWidth : 0, marginRight : 10 , }]} onPress = {() => {itemClick(item)}}>
                    <View style = {{flex: 1  , width : ITEM_SIZE, height : ITEM_SIZE-20, backgroundColor : background }}>
                    {item.user_profile_image ? 
                     <Image source = {{uri : item.user_profile_image}} 
                          style = {[home.mainViewCarouselScrollableItemImageBackground, {opacity : 1 , backgroundColor : background, borderRadius : 10 , width : ITEM_SIZE-20, height : ITEM_SIZE-20 , marginLeft : 10} ]} />
                   : <Avatar.Image style = {{marginTop : 10 , marginLeft : 20 ,  }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={ITEM_SIZE-40}/> }
                    </View>
                    <View style = {{backgroundColor : background , borderRadius : 5,alignItems : 'center', justifyContent : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 7 , color : borderColor}]}>{item.user_name.length > 20 ? item.user_name.substring(0,20) + "..." : item.user_name}</Text>
                    </View>
                    <TouchableOpacity 
                    disabled = {isFollowing[index]}
                    onPress = {itemFollow}
                    style = {{backgroundColor : isFollowing[index]? "#888" : themeLightest , borderRadius : 5, height : 20, justifyContent :'center', alignItems :'center' }}>
                        <Text style={{fontSize : 10 , color : 'black', alignSelf : 'center'}}>{isFollowing[index]?  "Following" : "Follow"}</Text>
                    </TouchableOpacity>
                    <View style = {{position : 'absolute' , top : 0 , right : 0 , backgroundColor : alttheme ,  borderRadius : 20, width : 20 , height : 20 , justifyContent : 'center' , alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 7 , color : 'white'}]}>{item.count_posts}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (  
            <Animated.FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.user_id.toString()}
            horizontal = {true}
            style = {{width : Dimensions.get('screen').width*0.98, marginLeft : Dimensions.get('screen').width*0.01}}
            contentContainerStyle = {home.mainViewCarouselScrollableItem}
            onScroll = {Animated.event(
                [{nativeEvent :  {contentOffset : {x : scrollX}}}],
                {useNativeDriver : true}
            )}
            snapToInterval = {ITEM_SIZE}
            showsHorizontalScrollIndicator = {false}
            />
    )
    }


const TrendingProducts = ({DATA , onClickItem }) => {
    const [data,setData] = React.useState([...DATA])
    const scrollX = React.useRef(new Animated.Value(0)).current
    
    React.useEffect(() => {
      
    },[])

    const ITEM_SIZE = Dimensions.get('screen').width*0.4
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

    const renderItem = ({item , index}) => {
        
        const itemClick = () => {
            onClickItem(item.product_id, item.product_name)
        }
      
        const inputRange = [
            ITEM_SIZE*(index-1),
            ITEM_SIZE*(index),
            
        ]
        const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE*index,
         
        ]
        const scale = scrollX.interpolate({
            inputRange,
            outputRange : [1,1]
        })
        const opacity = scrollX.interpolate({
            inputRange : opacityInputRange,
            outputRange : [1,0.9,1]
        })

        return(
            <Animated.View style={[home.mainViewCarouselScrollableItemContainer,{borderWidth : 0}  , {transform : [{scale}] , opacity : opacity}]}>
                <TouchableOpacity style = {[home.mainViewCarouselScrollableItemButton,{borderWidth : 0, marginRight : 10 , }]} onPress = {() => {itemClick(item)}}>
                    <View style = {{flex: 1  , width : ITEM_SIZE, height : ITEM_SIZE-20, backgroundColor : background }}>
                    {item.product_image ? 
                        <Image source = {{uri : item.product_image}} 
                            style = {[home.mainViewCarouselScrollableItemImageBackground, {opacity : 1 , backgroundColor : background, borderRadius : 10 , width : ITEM_SIZE-20, height : ITEM_SIZE-20 , marginLeft : 10} ]} />
                    : <Avatar.Image style = {{marginTop : 10 , marginLeft : 20 ,  }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.product_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={ITEM_SIZE-40}/> }
                    </View>
                    <View style = {{backgroundColor : background , borderRadius : 5,alignItems : 'center', justifyContent : 'center', width : ITEM_SIZE-20 }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 12 , color : borderColor}]}>{item.product_name.length > 30 ? item.product_name.substring(0,30) + "..." : item.product_name}</Text>
                    </View>
                    <View style = {{position : 'absolute' , top : 0 , right : 0 , backgroundColor : alttheme ,  borderRadius : 20, width : 20 , height : 20 , justifyContent : 'center' , alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 7 , color : 'white'}]}>{item.trending}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (  
            <Animated.FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.product_id.toString()}
            horizontal = {true}
            style = {{width : Dimensions.get('screen').width*0.98, marginLeft : Dimensions.get('screen').width*0.01}}
            contentContainerStyle = {home.mainViewCarouselScrollableItem}
            onScroll = {Animated.event(
                [{nativeEvent :  {contentOffset : {x : scrollX}}}],
                {useNativeDriver : true}
            )}
            snapToInterval = {ITEM_SIZE}
            showsHorizontalScrollIndicator = {false}
            />
    )
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
         //   console.log("expo error",e)
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
    //  console.log(" device token", token)
      return token;
    }
    
    
const FeedAlt = () => {

    const [randomNo, userId] = React.useContext(RandomContext)
    const [headerHeight,setHeaderHeight] = React.useState(70)
    const navigation = useNavigation()
    const route  = useRoute()
    const isFocused = useIsFocused()
    const progress = React.useRef(new Animated.Value(0)).current

    const [myFriends,setMyFriends] = React.useState([])
    const [peopleYouCanFollow,setPeopleYouCanFollow] = React.useState([])
    const [userSummary,setUserSummary] = React.useState([])
    const [userInfo, setUserInfo] = React.useState([])
    const [categoryCarousel, setCategoryCarousel] = React.useState([])
    const [source,setSource] = React.useState(route?.params?.source ? route?.params?.source : "")
    const [modalVisible,setModalVisible] = React.useState(false)
    const [deviceToken , setDeviceToken] = React.useState("")
    const [expoToken , setExpoToken] = React.useState("")
    const [masterCategory,setMasterCategory] = React.useState([])
    const [trendingProducts,setTrendingProducts] = React.useState([])

    const [loading,setLoading] = React.useState(false)

    const [isFollowing,setFollowing] = React.useState([])
    const scrollY = React.useRef(new Animated.Value(0));
    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY.current}}}],
        {useNativeDriver: true},
      );
      const scrollYClamped = Animated.diffClamp(scrollY.current, 0, headerHeight)
      const translateY = scrollYClamped.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight) ],
        });
       const translateYNumber = React.useRef();
       translateY.addListener(({value}) => {
         translateYNumber.current = value;
       });
    const [heroImage,setHeroImage] = React.useState([])
    const [heroLink,setHeroLink] = React.useState([])
    const [heroLinkExists,setHeroLinkExists] = React.useState([])
    const [heroBanner,setHeroBanner] = React.useState([])
    const [heroSearchText,setHeroSearchText] = React.useState("")
React.useEffect(()=>{
    setLoading(true)
    console.log("source" , source)
    if(source == "Onboarding") {
        setSource("")
        setModalVisible(true)
    } else {
        setSource("")
    }
    
    Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver : true
          },).start()


//    console.log(Constants.systemFonts);
    const registerNotification = async () => {
        registerForExpoPushNotificationsAsync().then(token => {
     //   console.log("expo token", token)
        setExpoToken(token)
       
        });
        registerForDevicePushNotificationsAsync().then(token => {
     //   console.log("device token", token)
        setDeviceToken(token)
        
        });
    }
    registerNotification()

    //  console.log(dataRetrieve)
    if(dataRetrieve) {
    //  console.log(URL)
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                axios.get(URL + "/user/info",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                  //  console.log("OUTPUT", responseData)
                    setUserInfo(responseData[0])
                })
                .catch(function(error) {
                //  console.log(error)
                });   
                
                axios.get(URL + "/user/summary",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                  //  console.log(responseData)
                    setUserSummary(responseData[0])
                })
                .catch(function(error) {
                  
                });
        
                axios.get(URL + "/user/followingusers",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    setLoading(false)
                //    console.log("MY FRIENDS",responseData)
                    setMyFriends(responseData)
                })
                .catch(function(error) {
                  
                });
            
                axios.get(URL + "/user/getpeopletofollow",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    setLoading(false)
                //    console.log("People to follow",responseData)
                    setPeopleYouCanFollow(responseData)
                    responseData.map(()=>{
                        console.log("a",a)
                        console.log("following",isFollowing)
                        a.push(false)
                    })
                })
                .then(()=>setFollowing(a))
                .catch(function(error) {
                    
                });
        
                axios.get(URL + "/all/categories",{params:{limit : 100}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    setLoading(false)
                //  console.log("Categories",responseData)
                    setCategoryCarousel(responseData)
                    setMasterCategory([...new Map(responseData.map(item => [item['master_category_name'], item])).values()])
                })
                .catch(function(error) {
                
                });

                axios.get(URL + "/all/trending", {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    setLoading(false)
                //  console.log("Categories",responseData)
                    setTrendingProducts(responseData)
                   
                })
                .catch(function(error) {
                
                });

                axios.get(URL + "/feed/hero", {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    setLoading(false)
                   // console.log(responseData)
                    setHeroBanner(responseData)
                })
            }
            else {
                navigation.navigate("Auth")
            }})}
        else {
            setFeedData(homeFeed)
        }

  
},[isFocused])


const goToUser = (id, name , following) => {
    //    console.log(id, name , following)
    //    Amplitude.logEventWithPropertiesAsync('GO TO USER FROM HOME',{homeUserName : userInfo.user_name, userName : name , userId : id , isFollowing : following})
        navigation.navigate("UserPage", {homeUserName : userInfo.user_name, userName : name , userId : id , isFollowing : following})
    }

const goToProduct = (id, name ) => {
    //    console.log(id, name , following)
     //   Amplitude.logEventWithPropertiesAsync('GO TO PRODUCT FROM HOME',{homeUserName : userInfo.user_name, userName : name , userId : id , isFollowing : following})
        navigation.navigate("ProductPage", {userInfo : userInfo, product_name : name , product_id : id })
    }

const heroBannerClick = (link) => {
    console.log(link)
    if(link.slice(0,4) == "http") {
        WebBrowser.openBrowserAsync(link);
    } 
    else if (link.slice(0,4) == "nav-") {
        navigation.navigate(link,slice(4,).toString())
    }
    
    };
 
    

const onSearchHero = () => {
    axios.get(URL + "/search/product", {params:{product_text : heroSearchText }} , {timeout:5000})
    .then(res => res.data).then(async (responseData) => {
    //  console.log(responseData)
        if (responseData.length) {
        navigation.navigate("ProductPage", {items : responseData})
        // Amplitude.logEventWithPropertiesAsync('HERO_SEARCH_FEED_VISIT_FROM_HOME',{"userId" : userId , "search" : heroSearchText })
    
        } else {
        ToastAndroid.show("Invalid Seach Query", ToastAndroid.SHORT)
        }
    })
    .catch(function(error) {
        ToastAndroid.show("Invalid Search Query", ToastAndroid.SHORT)
    });
    }
      

    return (
        !loading ? 
        <View style = {{flex : 1}}>
        <ScrollView style = {{flex : 1 , backgroundColor : 'white'}} contentContainerStyle = {{paddingBottom : 40}}>
            <Animated.View 
            style = {{ transform: [{translateY}],
                backgroundColor : 'white', flex : 1 ,
                height : headerHeight , 
                position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
                flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'}}>
              
                    <TouchableOpacity
                        style = {{marginLeft : 20, flex : 1 }}
                        onPress = {()=>{
                            Amplitude.logEventAsync("Clicked on My Details on Home")
                            navigation.navigate("MyDetails", {userInfo : userInfo , userSummary : userSummary})}
                            }
                        >
                        <Text style = {{fontWeight : 'bold', fontSize : 20, color : alttheme}}>{userInfo && userInfo.user_name ? userInfo.user_name.length > 15 ? userInfo.user_name : userInfo.user_name.slice(0,15) : ""}</Text>
                    </TouchableOpacity>
                    <View style = {{alignItems : 'center', flexDirection : 'row-reverse' , marginRight : 20 }}>
                        {/* <TouchableOpacity 
                                style = {{padding : 2 , paddingLeft : 5 , paddingRight : 5, marginRight : 20}}
                                onPress = {()=>{
                                    Amplitude.logEventAsync("Clicked on Search on Home")
                                    navigation.navigate("SearchByCategory")} 
                                    }>
                            <AntDesign name = "search1" size = {24} color = 'red' /> 
                        </TouchableOpacity>  */}
                        <RewardsComponent rewards = {userSummary && userSummary.coins_available ? userSummary.coins_available : 0} source = "Feed" userInfo = {userInfo}  userSummary = {userSummary} />
                    </View>
            </Animated.View>
            <View style = {{marginTop : 50,}}>
            <TouchableOpacity onPress = {()=>navigation.navigate("Search",{userInfo : userInfo})}
                style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                borderRadius : 2, padding : 5, margin : 5 , marginTop : 20, height : 50, justifyContent: 'space-between', 
                alignItems:'center'}}>
                {/* <TextInput 
                  style = {{flex : 1 , fontSize : 14}}
                  placeholder = "Search for products here"
                  onChangeText = {(text)=>setHeroSearchText(text)}
                  value = {heroSearchText}
                /> */}
                <Text style = {{color : "#999"}}>
                    Search for products here
                </Text>

                <TouchableOpacity 
                  style = {{ paddingTop : 2, paddingBottom : 2, paddingLeft : 5, paddingRight: 5, justifyContent : 'center' , alignItems : 'center', borderRadius : 5 }}
                  onPress = {onSearchHero}
                >
                  <Fontisto name = "search" size = {20} color = {theme} />
                </TouchableOpacity>
              </TouchableOpacity>
            {heroBanner.length > 0 ?
              <View style = {{width : Dimensions.get('screen').width - 10, height : Dimensions.get('screen').height*0.25 ,justifyContent : 'center', marginLeft : 5 , marginRight : 5, }}>
                
              <Swiper 
                  horizontal
                  loop
                  autoplay
                  autoplayTimeout = {8}
                  activeDotColor = "#DDDDDD"
                  dotColor = {background}
                  dot = {<View style = {{ backgroundColor: "#AAAAAA" , height : 6, width : 6 ,marginBottom  : 0, borderRadius: 20 , marginLeft : 10}} />}
                  activeDot = {<View style = {{ backgroundColor: background , height : 8, width : 8, marginBottom : 0, borderRadius: 20 , marginLeft : 10}} />}
                  showsButtons = {false}
                  style={{justifyContent : 'center', marginLeft : 5 , marginRight : 5,}} 
                  >
                { heroBanner.map((item,index)=>{
                    return(
                    <TouchableOpacity 
                    key = {index.toString()}
                    disabled = {!item.clickable} 
                    onPress = {()=>heroBannerClick(item.clickable_link)} 
                    >
                      <Image 
                      key = {index}
                      source = {{uri:item.image}} 
                      style = {{width : Dimensions.get('screen').width - 10, height : Dimensions.get('screen').height*0.25 }}/>
                    </TouchableOpacity>  
                      )
                  })}  
              </Swiper>
                
              </View>
              : null }
            
            
            
            <Text style = {[home.feedAltHeading,{fontSize : 18,}]}>Critics in your network</Text>
            {myFriends.length ? 
                <View style = {{marginRight : 10}}> 
                    <FriendsCarousel DATA = {myFriends} onClickItem = {(id, name , following)=>goToUser(id , name , following)} />
                </View> : null
            }
            <Text style = {[home.feedAltHeading,{fontSize : 18,}]}>Top Critics</Text>
            {peopleYouCanFollow.length ? 
                <View style = {home.mainViewCarouselChild}>
                    <FollowingCarousel DATA = {peopleYouCanFollow} isFollowing = {isFollowing} onClickItem = {(id , name , following)=>goToUser(id, name , following)} onClickFollow = {(id, name,index)=>followUser(id, name,index)} />
                </View>: null
            }
            <Text style = {home.feedAltHeading}>Trending Products</Text>
            {trendingProducts.length ? 
                <View style = {home.mainViewCarouselChild}>
                    <TrendingProducts DATA = {trendingProducts} onClickItem = {(id , name )=>goToProduct(id, name )}  />
                </View>: null
            }
            </View>
                
            <Text style = {home.feedAltHeading}>Explore</Text>
            <View style = {{flexDirection : 'row', marginHorizontal : Dimensions.get('screen').width*0.01 , flexWrap : 'wrap' }}>
                
                {masterCategory.map((item,index)=>{
                    return(<Pressable key = {index.toString()} 
                    onPress = {()=>navigation.navigate("CategoryAlt", {categoryCarousel : categoryCarousel, master_category_name : item.master_category_name , userInfo : userInfo, userSummary : userSummary})}
                    style = {{ backgroundColor :'white', borderRadius : 10,
                        width : Dimensions.get('screen').width*0.225 , height : Dimensions.get('screen').width*0.225, marginHorizontal : Dimensions.get('screen').width*0.01 , marginVertical : Dimensions.get('screen').width*0.02
                        }}>
                        <ImageBackground source={{uri : item.master_category_image}} resizeMode="cover" style={{flex : 1, padding : 5, justifyContent : 'flex-end'}} imageStyle={{ borderRadius: 10,  opacity:0.2}}> 
                            <Text style = {{fontSize : 13, fontWeight : 'bold'}} >{item.master_category_name}</Text>
                        </ImageBackground>
                    </Pressable>)
                })}
            </View>
            
        </ScrollView> 
        <TouchableOpacity 
            onPress = {()=>navigation.navigate("AddPost" , {user_id : userId.slice(1,13), user_name : userInfo.user_name, user_image : userInfo.user_image})}
            style = {{width: 50 , height : 50 , 
            backgroundColor : colorsArray[randomNo+1], 
            borderRadius : 60 , justifyContent : 'center', alignItems : 'center', position : 'absolute' , bottom : 60 , right : 20  }}>
                <View>
                    <AntDesign name = "plus" size = {40} color = "white" />
                </View>
        </TouchableOpacity>
        <View 
            style = {{width: width, height : 40,
            backgroundColor : themeLightest, 
            justifyContent : 'space-around', alignItems : 'center', position : 'absolute' , bottom : 0 , left : 0  }}>
                <View style = {{flexDirection : 'row'}}>
                    <View style = {{  justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{color : theme, fontSize : 15,marginRight : 5 , fontWeight : 'bold' }}>Home</Text>
                    </View>
                    <View style = {{  justifyContent : 'center', alignItems : 'center'}}>
                        <Switch
                            trackColor={{ true: theme , false: "white" }}
                            thumbColor={theme}
                            onValueChange={()=>{
                                Amplitude.logEventAsync("HOME FEED TOGGLE")
                                navigation.navigate("Home1",{body : userInfo, userSummary : userSummary})
                                }}
                            value={false}
                        />
                    </View>
                    <View style = {{ justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{color : theme, fontSize : 15,marginLeft : 5}}>Feed</Text>
                    </View>
                </View>
        </View>
    </View>
        : <LoadingPage />
    )
}

export default FeedAlt

const styles = StyleSheet.create({})