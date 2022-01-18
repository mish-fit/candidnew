import React from 'react'
import { PermissionsAndroid,Animated, Dimensions,BackHandler, Linking, Image, StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput , Switch, ScrollView, Pressable, ImageBackground, ToastAndroid, Share, Alert } from 'react-native'
import { alttheme, background, borderColor, colorsArray, theme, themeLight, themeLightest } from '../Exports/Colors'
import { RandomContext } from '../Exports/Context'
import {AntDesign, Fontisto, FontAwesome5} from 'react-native-vector-icons';
import { NavigationContainer, useNavigation, useRoute , useIsFocused, useFocusEffect} from '@react-navigation/native';
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
// import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import Clipboard from '@react-native-clipboard/clipboard';
import { useBackHandler } from '@react-native-community/hooks'
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';



const urlRegex = require('url-regex');

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
            onClickItem(item.following_user_id, item.following_user_name, true)
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
                     <Image source = {{uri : item.user_profile_image + "?" + moment().format('YYYY-MM-DD')}} 
                          style = {[home.mainViewCarouselScrollableItemImageBackground, {opacity : 1 , backgroundColor : background, borderRadius : 10 , width : ITEM_SIZE-20, height : ITEM_SIZE-20 , marginLeft : 10} ]} />
                   : <Avatar.Image style = {{marginTop : 10 , marginLeft : 20 ,  }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.following_user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={ITEM_SIZE-40}/> }
                    </View>
                    <View style = {{backgroundColor : background , width : ITEM_SIZE,height : 30 , borderRadius : 5, justifyContent :'flex-end', alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : borderColor}]}>{item.following_user_name.length > 30 ? item.following_user_name.substring(0,20) + "..." : item.following_user_name}</Text>
                    </View>
                    {item.count_posts>0 ?
                    <View style = {{position : 'absolute' , top : 0 , right : 0 , backgroundColor : alttheme  , borderRadius : 20, width : 20 , height : 20 , justifyContent : 'center' , alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : 'white'}]}>{item.count_posts}</Text>
                    </View> : null }
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
                     <Image source = {{uri : item.user_profile_image + "?" + moment().format('YYYY-MM-DD')}} 
                          style = {[home.mainViewCarouselScrollableItemImageBackground, {opacity : 1 , backgroundColor : background, borderRadius : 10 , width : ITEM_SIZE-20, height : ITEM_SIZE-20 , marginLeft : 10} ]} />
                   : <Avatar.Image style = {{marginTop : 10 , marginLeft : 20 ,  }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={ITEM_SIZE-40}/> }
                    </View>
                    <View style = {{backgroundColor : 'transparent' , borderRadius : 5,alignItems : 'center', justifyContent : 'center', height : 30, width : ITEM_SIZE }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : borderColor , textAlign : 'center'}]}>{item.user_name.length > 20 ? item.user_name.substring(0,20) + "..." : item.user_name }</Text>
                    </View>
                    <TouchableOpacity 
                    disabled = {isFollowing[index]}
                    onPress = {itemFollow}
                    style = {{backgroundColor : isFollowing[index]? "#888" : themeLightest , borderRadius : 5, height : 20, justifyContent :'center', alignItems :'center' }}>
                        <Text style={{fontSize : 10 , color : isFollowing[index]?  'white' : 'black', alignSelf : 'center'}}>{isFollowing[index]?  "Following" : "Follow"}</Text>
                    </TouchableOpacity>
                    {item.count_posts>0 ? <View style = {{position : 'absolute' , top : 0 , right : 0 , backgroundColor : alttheme ,  borderRadius : 20, width : 20 , height : 20 , justifyContent : 'center' , alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : 'white'}]}>{item.count_posts}</Text>
                    </View> : null }
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
                    <View style = {{backgroundColor : background , borderRadius : 5,alignItems : 'center', justifyContent : 'center', width : ITEM_SIZE }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 14 , color : borderColor}]}>{item.product_name.length > 30 ? item.product_name.substring(0,30) + "..." : item.product_name}</Text>
                    </View>
                    <View style = {{position : 'absolute' , top : 0 , right : 0 , backgroundColor : alttheme ,  borderRadius : 20, width : 20 , height : 20 , justifyContent : 'center' , alignItems : 'center' }}>
                        <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : 'white'}]}>{item.trending}</Text>
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
    const [headerHeight,setHeaderHeight] = React.useState(50)
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



    useFocusEffect(
        
        React.useCallback(() => {
            const onBackPress = () => {
                if (route.name == "TabHome") {
                    Alert.alert("Wait!!","Do you want to exit the app ?", [
                        {
                            text: "Cancel",
                            onPress: () => null,
                            style: "cancel"
                        },
                        { text: "YES", onPress: () => BackHandler.exitApp() }
                    ]);
                return true
                }
                else {
                    return false
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            axios.get(URL + "/user/summary",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                  //  console.log(responseData)
                    setUserSummary(responseData[0])
                })
                .catch(function(error) {
                  
                })

            return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [route.name])
    );


    React.useEffect(()=>{
        console.log(route.name)
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
                    console.log("OUTPUT", responseData)
                    console.log(moment().diff(moment(responseData[0].created_at),'hours'))
                    if(moment().diff(moment(responseData[0].created_at),'hours') < 6 ) {
                        setModalVisible(true)
                    }
                    setUserInfo(responseData[0])
                })
                .catch(function(error) {
                //  console.log(error)
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

       
            
  
},[])




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
    else if (link == "AddCategory") {
        navigation.navigate("AddCategory" , {user_id : userId.slice(1,13), user_name : userInfo.user_name, user_image : userInfo.user_image})
    } else if (link.slice(0,9) == "Category-") {
        navigation.navigate("CategoryAlt", {categoryCarousel : categoryCarousel, master_category_name : link.slice(9,).toString() , userInfo : userInfo, userSummary : userSummary})
    } else if (link == "HowToEarn") {
        navigation.navigate("HowToEarn", {userInfo : userInfo, userSummary : userSummary})
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

// ReceiveSharingIntent.getReceivedFiles(files => {
//     console.log("received intent", JSON.stringify(files))    
//     if(JSON.stringify(files).match(urlRegex())) {
//         navigation.navigate("AddPost", {buy_url : JSON.stringify(files).match(urlRegex())[0]})
//     }
// },
// (error) =>{
// //  console.log(error);
// });

const onContextModalClose = () => {
    setModalVisible(false)
}


const followUser = (id,name, index) => {
    Amplitude.logEventWithPropertiesAsync('FOLLOW USER IN ALT FEED',{"user_name": userInfo.user_name,"user_id": userInfo.user_id,"following_user_id": id,"following_user_name": name})
    let newArr = [...isFollowing]; // copying the old datas array
    newArr[index] = true // replace e.target.value with whatever you want to change it to
    setFollowing(newArr)
    const body = {
        "user_name": userInfo.user_name,
        "user_id": userInfo.user_id,
        "following_user_id": id,
        "following_user_name": name,
        "isFollowing": true
      }

      axios({
        method: 'post',
        url: URL + '/engagement/followuser',
        data: body
      }, {timeout : 5000})
    .then(res => {
        console.log(res)
    })
    .catch((e) => console.log(e))
}



const share = async () => {
  //  console.log(userInfo)
    Amplitude.logEventWithPropertiesAsync('SHARE PROFILE', {userName : userInfo.user_name })
    try {
        const result = await Share.share({
          message: 'Shop from the amazing products I recommended on https://www.getcandid.app/user?user_name=' + userInfo.user_name + " . Use my referral code : " + userInfo.coupon 
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
         //     console.log(result.activityType)
            } 
          else {
        //  console.log(result)
        }
        } 
      } catch (error) {
        console.log(error.message);
      }
    }















      

    return (
        !loading ? 
        <View style = {{flex : 1}}>
        <Modal 
                isVisible={modalVisible}
                deviceWidth={Dimensions.get('screen').width}
                deviceHeight={Dimensions.get('screen').height}
                onBackdropPress={onContextModalClose}
                style = {{marginHorizontal : 20 , marginVertical : 80 , borderRadius : 20, paddingVertical : 20}}
                propagateSwipe={true}
                >
                <ScrollView style = {{backgroundColor : 'white' , borderRadius : 30 , paddingBottom : 60 , }}>
                    <Text style = {{fontWeight : 'bold', textAlign :'center', color : theme, fontSize : 30, marginTop : 10}}>Congratulations</Text>
                    <Text style = {{textAlign : 'center' , fontSize : 20}}>You earned 500 coins for signing up </Text>
                    <View style = {{justifyContent :'center', alignItems : 'center'}}>
                        <GiftComponent />
                    </View>
                    <Text style = {{fontWeight : 'bold', textAlign :'center' , fontSize : 20,marginTop : 40}}>Welcome to Candid Community</Text>
                    <View style = {{justifyContent : 'center', alignItems : 'center'}}>
                        <TouchableOpacity style = {home.modalButton} onPress = {()=>{
                            setModalVisible(false)
                            navigation.navigate("MyRewards")
                        }}>
                            <Text style = {home.modalButtonText}>Go To Rewards Section</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[home.modalButton,{marginBottom : 20}]} onPress = {()=>{
                            setModalVisible(false)
                            navigation.navigate("HowToEarn",{userInfo : userInfo})
                        }}>
                            <Text style = {home.modalButtonText}>How to Earn ?</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
        </Modal>
        <ScrollView style = {{flex : 1 , backgroundColor : 'white'}} contentContainerStyle = {{paddingBottom : 110}}>
            <Animated.View 
            style = {{ transform: [{translateY}],
                backgroundColor : 'white', flex : 1 ,
                height : headerHeight , 
                position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
                flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'}}>
                    <TouchableOpacity style = {{marginLeft : 10, height : 30}} onPress={()=>navigation.openDrawer()}>
                        {userInfo.user_profile_image && userInfo.user_profile_image != "" ? 
                        <Image source = {{uri : userInfo.user_profile_image + "?" + moment().format('YYYY-MM-DD')}} 
                            style = {{opacity : 1 , backgroundColor : 'red',  flex: 1,justifyContent: "center",borderRadius : 30, height : 30 , width : 30}} />
                        : <Avatar.Image style = {{ }}
                        source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ userInfo.user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                        size={30}/> }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{marginLeft : 10, flex : 1 }}
                        onPress = {()=>{
                            Clipboard.setString(userInfo.coupon)
                            ToastAndroid.show("Your referral code : " + userInfo.coupon + " is copied", ToastAndroid.SHORT)
                            Amplitude.logEventAsync("Clicked on My Details on Home")
                            navigation.navigate("MyDetails", {userInfo : userInfo , userSummary : userSummary})}
                            }
                        >
                        <Text style = {{fontWeight : 'bold', fontSize : 20, color : alttheme}}>{userInfo && userInfo.user_name ? userInfo.user_name.length > 15 ? userInfo.user_name : userInfo.user_name.slice(0,15) : ""}</Text>
                    </TouchableOpacity>
                    <View style = {{alignItems : 'center', justifyContent : 'flex-end',flexDirection : 'row-reverse' , marginRight : 10 }}>
                        <RewardsComponent rewards = {userSummary && userSummary.coins_available ? userSummary.coins_available : 0} source = "Feed" userInfo = {userInfo}  userSummary = {userSummary} />
                    </View>
            </Animated.View>
            <View style = {{marginTop : headerHeight,}}>
            {/* <View 
            style = {{width: width-10, height : 40, borderRadius : 2,
            backgroundColor : themeLightest, marginleft : 5, flex : 1, marginHorizontal : 5,
            justifyContent : 'space-around', alignItems : 'center',  }}>
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
            </View> */}
            <TouchableOpacity onPress = {()=>navigation.navigate("Search",{userInfo : userInfo})}
                style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                borderRadius : 2, padding : 5, margin : 5 , marginTop : 5, height : 50, justifyContent: 'space-between', 
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
              <View style = {{width : Dimensions.get('screen').width-5, height : Dimensions.get('screen').width*0.55 ,justifyContent : 'center',  marginRight : 5, marginBottom : 5,}}>
                
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
                      style = {{width : Dimensions.get('screen').width-10 , height : Dimensions.get('screen').width*0.55 }}/>
                    </TouchableOpacity>  
                      )
                  })}  
              </Swiper>
                
              </View>
              : null }
            
            
            
            <Text style = {{fontSize : 18, borderTopWidth : 3, borderTopColor : "#EEE" , fontWeight : 'bold' , fontSize : 18, paddingLeft : 10 ,paddingTop : 10}}>Critics in your network</Text>
            {myFriends.length ? 
                <View style = {{marginRight : 10 , backgroundColor : "#FFF", marginBottom :5 }}> 
                    <FriendsCarousel DATA = {myFriends} onClickItem = {(id, name , following)=>goToUser(id , name , following)} />
                </View> :
                <View style = {{marginVertical : 5,marginHorizontal : 10}}>
                    <Text style = {{color : alttheme}}>Start following critics you like </Text>
                </View>
            }
            <TouchableOpacity 
            onPress = {share}
            style = {{width: width-10, height : 40, borderRadius : 2,
            backgroundColor : themeLightest, marginleft : 5, flex : 1, marginHorizontal : 5, justifyContent : 'center',
            alignItems : 'center', flexDirection : 'row'}}>
                <FontAwesome5 name = "user-friends" size = {15} color = {alttheme} />
                <Text style = {{color : alttheme, fontWeight :'bold', fontSize : 16 , marginLeft : 10}}>
                    Invite your friends
                </Text>
            </TouchableOpacity>
            <Text style = {{fontSize : 18, borderTopWidth : 3, borderTopColor : "#EEE" , fontWeight : 'bold' , fontSize : 18, paddingLeft : 10 ,paddingTop : 10}}>Top Critics</Text>
            {peopleYouCanFollow.length ? 
                <View style = {{marginRight : 10 , backgroundColor : "#FFF", marginBottom :5 }}>
                    <FollowingCarousel DATA = {peopleYouCanFollow} isFollowing = {isFollowing} onClickItem = {(id , name , following)=>goToUser(id, name , following)} onClickFollow = {(id, name,index)=>followUser(id, name,index)} />
                </View>: null
            }
            <Text style = {{fontSize : 18, borderTopWidth : 3, borderTopColor : "#EEE" , fontWeight : 'bold' , fontSize : 18, paddingLeft : 10 ,paddingTop : 10}}>Trending Products</Text>
            {trendingProducts.length ? 
                <View style = {{marginRight : 10 , backgroundColor : "#FFF", marginBottom :5 }}>
                    <TrendingProducts DATA = {trendingProducts} onClickItem = {(id , name )=>goToProduct(id, name )}  />
                </View>: null
            }
            </View>
            
            <Text style = {{fontSize : 18, borderTopWidth : 3, borderTopColor : "#EEE" , fontWeight : 'bold' , fontSize : 18, paddingLeft : 10 ,paddingTop : 10}}>Explore</Text>
            <View style = {{flexDirection : 'row', marginHorizontal : Dimensions.get('screen').width*0.01 , flexWrap : 'wrap' , }}>
                
                {masterCategory.map((item,index)=>{
                    return(<Pressable key = {index.toString()} 
                    onPress = {()=>navigation.navigate("CategoryAlt", {categoryCarousel : categoryCarousel, master_category_name : item.master_category_name , userInfo : userInfo, userSummary : userSummary})}
                    style = {{ backgroundColor :'white', borderRadius : 10,
                        width : Dimensions.get('screen').width*0.305 , height : Dimensions.get('screen').width*0.305, marginHorizontal : Dimensions.get('screen').width*0.01 , marginVertical : Dimensions.get('screen').width*0.02
                        }}>
                        <ImageBackground source={{uri : item.master_category_image}} resizeMode="cover" style={{flex : 1, padding : 5, justifyContent : 'center', alignItems : 'center'}} imageStyle={{ borderRadius: 10,  opacity:0.2}}> 
                            <Text style = {{fontSize : 16, fontWeight : 'bold'}} >{item.master_category_name}</Text>
                        </ImageBackground>
                    </Pressable>)
                })}
            </View>
            
        </ScrollView> 
        <LinearGradient colors={["#ed4b60","#E7455A","#D7354A"]} 
        style = {{width: Dimensions.get('screen').width*.8 , height : 50 , borderRadius : 40,
            backgroundColor : theme
            , justifyContent : 'center', alignItems : 'center', position : 'absolute' , bottom : 60 , left : Dimensions.get('screen').width*.1  }} >
        <TouchableOpacity 
            onPress = {()=>navigation.navigate("AddCategory" , {user_id : userId.slice(1,13), user_name : userInfo.user_name, user_image : userInfo.user_image})}
            >
                <View>
                    <Text style = {{color : 'white', fontWeight : 'bold'}}>POST REVIEW AND EARN COINS</Text>
                </View>
        </TouchableOpacity>
        </LinearGradient>
    </View>
        : <LoadingPage />
    )
}

export default FeedAlt

const styles = StyleSheet.create({})
