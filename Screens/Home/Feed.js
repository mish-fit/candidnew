import React from 'react'
import { PermissionsAndroid,Animated, Dimensions, Linking, Image, StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput , Switch, ScrollView } from 'react-native'
import { alttheme, colorsArray, theme, themeLight, themeLightest } from '../Exports/Colors'
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
import { LoadingPage } from '../Exports/Pages';

try {
    Amplitude.initializeAsync("eb87439a02205454e7add78f67ab45b2");
}
catch {
    console.log("No Amplitude Tracking")
}

const FeedItemComponent = ({item,id, userInfo}) => {
    const [randomNo, userId] = React.useContext(RandomContext)
    const [colorNo,setColorNo] = React.useState(0) 
    const [tempFollow,setTempFollow] = React.useState(false)
    const [like,setLike] = React.useState(item.activity_like)
    const [dislike,setDislike] = React.useState(item.activity_dislike)
    const [buys,setBuys] = React.useState(item.activity_buy)
    const [result,setResult] = React.useState()

    const navigation = useNavigation()
    

    React.useEffect(() => {
        setColorNo((randomNo+id)%(colorsArray.length-1))

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
            "activity_buy": 1
        }

        axios({
            method: 'post',
            url: URL + '/engagement/engagepost',
            data: body
          }, {timeout : 5000})
        .then(res => {
           console.log(res)
        })
        .catch((e) => console.log(e))

    }


    return(
        <View style = {{marginLeft : 10 , marginRight : 10 , borderWidth : 1 , borderColor : '#EEE', borderRadius : 10, marginTop : 5 , marginBottom : 5,  }}>
            <View style = {{marginTop : 5 ,marginLeft : 10 , flexDirection : 'row', justifyContent : 'flex-start'}}>
                <View style = {{marginRight : 10}}>
                {item.user_image && item.user_image != "None" && item.user_image != "" ?
                    <Image source = {{uri : item.user_image + "?" + new Date()}} style = {{width : 40, height : 40 , borderRadius : 40 , marginTop : 5 , marginLeft : 5  }}/> :
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
               
                    <TouchableOpacity 
                    onPress = {()=>navigation.navigate("Post", {item : item , id : id , userInfo : userInfo})}
                    style = {{marginTop : 5 ,marginLeft : 5 , flexDirection : 'row', flex : 1, }}>
                        <Text style = {{fontSize : 12 , color : "#555" , }}>{item.product_name.length > 100 ? item.product_name.substring(0,60) + "..." : item.product_name }</Text>
                    </TouchableOpacity>
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
                { item.feed_image && item.feed_image != "None" && item.feed_image != "" ? 
                <View style = {{marginTop : 5, justifyContent : 'center', alignItems : 'center' }}>
                   <Image source = {{uri : item.feed_image + "?" + new Date()}} 
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
                    <TouchableWithoutFeedback onPress = {()=>navigation.navigate("Post", {item : item , id : id , userInfo : userInfo})}>
                        <Text>
                            {item.title}
                            <Text style = {{color : "#2980b9"}}>{item.comment.length > 20 ? " .. Read Detailed Review" : ""}</Text>
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        
        )
}

const UpdatedCarousel = ({DATA , onClickItem }) => {
    const [randomNo] = React.useContext(RandomContext)
    const [data,setData] = React.useState([...DATA])
    const scrollX = React.useRef(new Animated.Value(0)).current
    const ITEM_SIZE = Dimensions.get('screen').width*0.25
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
    
    const renderItem = ({item , index}) => {
        const itemClick = (item) => {
            onClickItem(item.category_id, item.category_name)
        }
       
        const inputRange = [
            ITEM_SIZE*(index-1),
            ITEM_SIZE*(index)
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
            outputRange : [1,0.9,0]
        })
  
        return(
            item.category_name ? 
            <Animated.View style={[{borderRadius : 20 , justifyContent : 'center', alignItems : 'center',padding : 5 , paddingHorizontal : 10, marginHorizontal : 5 , marginVertical : 5 ,borderWidth : 1,borderColor : "#888"}  , {transform : [{scale}]}]}>
                <TouchableOpacity style = {[{borderWidth : 0}]} onPress = {() => {itemClick(item)}}>
                    <Text style={[{margin:1 ,fontSize : 15 , color : "#444"}]}>{item.category_name.length > 20 ? item.category_name.substring(0,20) + "..." : item.category_name}</Text>
                </TouchableOpacity>
            </Animated.View> : null
        )
    }
  

    return (  
            <Animated.FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item,index) => index.toString()}
            horizontal = {true}
            style = {{width : Dimensions.get('screen').width}}
            contentContainerStyle = {{}}
            onScroll = {Animated.event(
                [{nativeEvent :  {contentOffset : {x : scrollX}}}],
                {useNativeDriver : true}
            )}
            snapToInterval = {ITEM_SIZE+5}
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




const Feed = () => {

    const progress = React.useRef(new Animated.Value(0)).current
    const ref = React.useRef(null)
  
    const [headerHeight,setHeaderHeight] = React.useState(50)
    const [randomNo, userId] = React.useContext(RandomContext)
    
    const navigation = useNavigation()
    const route = useRoute()
    const isFocused = useIsFocused()

    const [user_id,setUser_id] = React.useState(route.params?.user_id)
    const [userDetailsAvailable,setUserDetailsAvailable] = React.useState(false)

    const [dbContacts,setDbContacts] = React.useState([])
    const [dbPhoneNumbers,setDbPhoneNumbers] = React.useState([])
    const [showTextInput,setShowTextInput] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")

    const [feedData,setFeedData] = React.useState([])
    const [userInfo,setUserInfo] = React.useState(route?.params?.body ? route?.params?.body : {})
    const [source,setSource] = React.useState(route?.params?.source ? route?.params?.source : "")
    const [userSummary,setUserSummary] = React.useState(route?.params?.userSummary ? route?.params?.userSummary : {})
    const [refresh,setRefresh] = React.useState(false)
    const [categoryCarousel, setCategoryCarousel] = React.useState(["Laptop", "Mobile", "TV", "Phone", "Books", "Series", "Swimsuit"])

    const [deviceToken , setDeviceToken] = React.useState("")
    const [expoToken , setExpoToken] = React.useState("")

    const [toggled, setToggled] = React.useState(false);

    const [modalVisible,setModalVisible] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)

    const [pageNumber,setPageNumber] = React.useState(0)
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
            
                    axios.get(URL + "/feed/home",{params:{user_id : user.phoneNumber.slice(1,13), page : pageNumber}} , {timeout : 5000})
                    .then(res => res.data).then(function(responseData) {
                            setLoading(false)
                            setFeedData(responseData)
                    })
                    .catch(function(error) {
                        setError(true)
                    });
            
                   
            
                //     if(userInfo) {
                //         axios.get(URL + "/user/info",{params:{user_id : user.phoneNumber.slice(1,13)}} , {timeout : 5000})
                //         .then(res => res.data).then(async function(responseData) {
                // //       console.log("a",responseData)
                //             setUserInfo(responseData[0])
                //             if(responseData.length && responseData[0].user_name) {
                //                 setUserDetailsAvailable(true)
                //             }
                //             else {
                //                 setRefresh(!refresh)
                //                 navigation.navigate("ProfileInfo",{phoneNumber : user.phoneNumber})
                //             }
                //         }).catch(function(error) {
              
                //         });
                //     }
                        
                    axios.get(URL + "/user/summary",{params:{user_id : user.phoneNumber.slice(1,13)}} , {timeout : 5000})
                    .then(res => res.data).then(function(responseData) {
                    //  console.log(responseData)
                        setUserSummary(responseData[0])
                    })
                    .catch(function(error) {
                    
                    });
            
                    axios.get(URL + "/all/categories",{params:{limit : 50}} , {timeout : 5000})
                    .then(res => res.data).then(function(responseData) {
                    //  console.log("Categories",responseData)
                        setCategoryCarousel(responseData)
                    })
                    .catch(function(error) {
                    
                    });
                }
                else {
                    navigation.navigate("Auth")
                }})}
            else {
                setLoading(false)
                setFeedData(homeFeed)
            }

      
    },[isFocused])

    const FeedItem = ({item,index}) => (
        <View key = {index.toString()}>
            <FeedItemComponent item = {item} id = {index} userInfo = {userInfo}/>
        </View> 
    )

    


    


    // const HeaderComponent = () => {
    //    // return null
    //     return(
    //         categoryCarousel.length ? 
    //             <View style = {{marginTop : headerHeight, height : 50}}>
    //                  <UpdatedCarousel DATA = {categoryCarousel} onClickItem = {(id,name)=>onClickCategory(id,name)} />
    //              </View> : null    
    //     )
    // }

    const onClickCategory = (id,name) => {
        Amplitude.logEventWithPropertiesAsync("CLICKED ON CATEGORY",{categoryId : id, categoryName : name , userName : userInfo.user_name })
        navigation.navigate("CategoryPage",{categoryId : id, categoryName : name , userName : userInfo.user_name })
      //  console.log(id, name)
    }

    const onContextModalClose = () => {
        setModalVisible(false)
    }

    const HeaderComponent = () => {
        return (<View 
            style = {{width: width-20, height : 40, borderRadius : 2,
            backgroundColor : themeLightest, marginleft : 5, flex : 1, marginHorizontal : 10,
            justifyContent : 'space-around', alignItems : 'center', }}>
                <View style = {{flexDirection : 'row'}}>
                    <View style = {{  justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{color : theme, fontSize : 15,marginRight : 5 , fontWeight : !toggled ? 'bold' :'normal'}}>Home</Text>
                    </View>
                    <View style = {{  justifyContent : 'center', alignItems : 'center'}}>
                        <Switch
                            trackColor={{ true: theme , false: "white" }}
                            thumbColor={'white'}
                            onValueChange={()=>{
                                Amplitude.logEventAsync("HOME FEED TOGGLE")
                                navigation.navigate("Home")
                                }
                            }
                            value={true}
                        />
                    </View>
                    <View style = {{ justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{color : theme, fontSize : 15,marginLeft : 5, fontWeight : !toggled ? 'normal' :'bold'}}>Feed</Text>
                    </View>
                </View>
            </View>)
    }

    return (
        <View style = {{ backgroundColor : 'white', flex : 1,}}>
            <Modal 
                isVisible={modalVisible}
                deviceWidth={Dimensions.get('screen').width}
                deviceHeight={Dimensions.get('screen').height}
                onBackdropPress={onContextModalClose}
                onSwipeComplete={onContextModalClose}
                swipeDirection="left"
                style = {{marginHorizontal : 20 , marginVertical : 120 , borderRadius : 20}}
                >
                <ScrollView style = {{backgroundColor : 'white' , borderRadius : 30 , padding : 20}}>
                    <Text style = {{fontWeight : 'bold', textAlign :'center', color : theme, fontSize : 30}}>Congratulations</Text>
                    <Text style = {{textAlign : 'center' , fontSize : 20}}>You just earned 500 coins</Text>
                    <View style = {{justifyContent :'center', alignItems : 'center'}}>
                        <GiftComponent />
                    </View>
                    <Text style = {{fontWeight : 'bold', textAlign :'center' , fontSize : 20,marginTop : 40}}>Welcome to Candid Community</Text>
                    <View style = {{justifyContent : 'center', alignItems : 'center'}}>
                        <TouchableOpacity style = {home.modalButton} onPress = {()=>navigation.navigate("MyRewards")}>
                            <Text style = {home.modalButtonText}>Go To Rewards Section</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {home.modalButton} onPress = {()=>navigation.navigate("HowToEarn")}>
                            <Text style = {home.modalButtonText}>Read Community Guidelines</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </Modal>
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

            {/* {categoryCarousel.length ? 
               <View style = {{marginTop : headerHeight, height : 50}}>
                    <UpdatedCarousel DATA = {categoryCarousel} onClickItem = {onClickCategory} />
                </View> : null    
            } */}
        
            {error ? <View><Text>Error loading the feed. Please try later!</Text></View> : loading ? <LoadingPage /> :
            <Animated.FlatList
            keyExtractor = {(item,index)=>index.toString()}
            ref = {ref}
            style = {{marginBottom : 0 , }}
            contentContainerStyle = {{paddingTop : 50,}}
            data = {toggled ? feedData.filter((item,index)=>item.rating >3) : feedData}
            renderItem = {FeedItem}
            onScroll = {handleScroll}
            showsVerticalScrollIndicator = {false}
            ListHeaderComponent={HeaderComponent}
            
            />
            }
            <TouchableOpacity 
            onPress = {()=>navigation.navigate("AddCategory" , {user_id : userId.slice(1,13), user_name : userInfo.user_name, user_image : userInfo.user_image})}
            style = {{width: Dimensions.get('screen').width*.8 , height : 50 , borderRadius : 40,
            backgroundColor : alttheme
            , justifyContent : 'center', alignItems : 'center', position : 'absolute' , bottom : 10 , left : Dimensions.get('screen').width*.1   }}>
                <View>
                    <Text style = {{color : 'white', fontWeight : 'bold'}}>POST REVIEW AND EARN COINS</Text>
                </View>
        </TouchableOpacity>
            
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({})
