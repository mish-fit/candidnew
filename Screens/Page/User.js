import React from 'react'
import {Animated, Dimensions, Image, ScrollView,StyleSheet, Text, TouchableOpacity, View ,Easing, Pressable, Linking, ToastAndroid } from 'react-native'
import {AntDesign} from 'react-native-vector-icons';
import { useNavigation , useRoute} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import  Modal  from 'react-native-modal'

import axios from 'axios';
import {Avatar} from 'react-native-paper'
import { AirbnbRating } from 'react-native-ratings';
import * as Amplitude from 'expo-analytics-amplitude';
import HyperLink from 'react-native-hyperlink';
import LinearGradient from 'react-native-linear-gradient';
import { LoadingPage } from '../Exports/Pages';
import {dataRetrieve, URL} from '../Exports/Config'
import { RandomContext } from '../Exports/Context'
import { backArrow, colorsArray, theme, themeLightest } from '../Exports/Colors'

function FeedItemComponent({item,id, userInfo}) {
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
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         ()=>navigation.goBack() 
    //       );
    //  //   console.log(userInfo)
    //  return () => {
    //     BackHandler.removeEventListener("hardwareBackPress", backHandler);
    // };

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
            url: `${URL  }/engagement/engagepost`,
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
            url: `${URL  }/engagement/engagepost`,
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
            url: `${URL  }/engagement/engagepost`,
            data: body
          }, {timeout : 5000})
        .then(res => {
        //    console.log(res)
        })
        .catch((e) => console.log(e))

    }


    return(
        <View style = {{marginLeft : 10 , marginRight : 10 , borderWidth : 1 , borderColor : '#EEE', borderRadius : 10, marginTop : 10 , marginBottom : 5,  }}>
            <View style = {{marginTop : 5 ,marginLeft : 10 , flexDirection : 'row', justifyContent : 'flex-start'}}>
                <View style = {{flex : 1}}>              
                    <View style = {{marginVertical : 5 ,marginLeft : 5 , flexDirection : 'row', flexWrap : 'wrap'}}>
                        <Text style = {{ flexShrink : 1,fontWeight : 'bold', fontSize : 20 , color : "#555" }}>{item && item.product_name && item.product_name.length > 100 ? `${item.product_name.substring(0,100)  } ...` : item.product_name}</Text>
                    </View>
                </View> 
            </View>
                <View style = {{marginHorizontal : 20 , marginVertical : 5,flexDirection : 'row' , justifyContent : 'space-between'}}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.navigate("CategoryPage", {categoryId : item.category_id, categoryName : item.category_name , userInfo, userName : userInfo.user_name})}
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
                   {item.buy_url != "" ? 
                   <LinearGradient colors={["#ed4b60","#E7455A","#D7354A"]} style = {{position : 'absolute', bottom : 10 , left : Dimensions.get('screen').width * 0.15, width : Dimensions.get('screen').width * 0.62 ,
                     backgroundColor : colorsArray[colorNo] , alignItems : 'center' , padding : 5 , borderRadius : 20}}>
                   <TouchableOpacity 
                    onPress = {()=>buyItem(item.buy_url)}
                    >
                        <Text style = {{fontWeight : 'bold' , color : 'white', fontSize : 18}}>BUY</Text>
                    </TouchableOpacity>
                    </LinearGradient> : null }
                    <AirbnbRating
                        ratingContainerStyle = {{position : 'absolute', top : 10 , left : Dimensions.get('screen').width * 0.25, backgroundColor : 'transparent'}}
                        defaultRating = {item.rating}
                        readOnly
                        size={30}
                        showRating = {false}
                        isDisabled
                        count = {5}
                        unSelectedColor = "rgba(200,200,200,0.9)"
                        />
                </View> :  
                <View style = {{flexDirection : 'row' , }}>
                    <AirbnbRating
                        ratingContainerStyle = {{width : Dimensions.get('screen').width * 0.7, backgroundColor : 'transparent', flex : 1}}
                        defaultRating = {item.rating}
                        readOnly
                        size={15}
                        showRating = {false}
                        isDisabled
                        count = {5}
                        unSelectedColor = "rgba(200,200,200,0.9)"
                        />
                    {item.buy_url != "" ? 
                    <LinearGradient colors={["#ed4b60","#E7455A","#D7354A"]} style = {{width : Dimensions.get('screen').width * 0.3 , backgroundColor : colorsArray[colorNo] , alignItems : 'center' , marginRight : 20 ,
                     borderRadius : 20}}>
                    <TouchableOpacity onPress = {()=>buyItem(item.buy_url)}>
                        <Text style = {{fontWeight : 'bold' , color : 'white', fontSize : 18,}}>BUY</Text>
                    </TouchableOpacity>
                    </LinearGradient> : null }
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
            </View>
        
        )
}


function FeedItemSummaryComponent({item,id}) {
    const [randomNo] = React.useContext(RandomContext)
    const [colorNo,setColorNo] = React.useState(0) 
    const [tempFollow,setTempFollow] = React.useState(false)
    const [like,setLike] = React.useState(item.like)
    const [dislike,setDislike] = React.useState(item.dislike)


    React.useEffect(() => {
        setColorNo((randomNo+id)%(colorsArray.length-1))
    },[])

    const followUser = () => {
        setTempFollow(true)
    }

    const redirect = async (buyURL) => {
        try {   
            Linking.openURL(buyURL)
        } catch (error) {
            Amplitude.logEventWithPropertiesAsync("BUY URL ERROR", { "buy_url": buyURL})
            alert("Browser not reachable")
        }
    };


    return(
        <View style = {{marginLeft : 10 ,  flexDirection : 'row', marginRight : 10 ,  marginTop : 10 , marginBottom : 5, borderRadius : 20 , borderWidth : 1, borderColor: "#EEE" }}>
            <View style = {{ justifyContent : 'center', alignItems : 'center' , }}>
                <Image source = {{uri : item.feed_image }} 
                    style = {{
                        width : Dimensions.get('screen').width * 0.46,
                        height: Dimensions.get('screen').width * 0.46,
                        borderTopLeftRadius : 20 , borderBottomLeftRadius : 20 ,
                    }} 
                />
            </View>  
            <View style = {{ justifyContent : 'space-between', borderTopRightRadius : 20 , borderBottomRightRadius : 20 , flexShrink : 1, flex : 1}}>
                <View style = {{paddingTop : 5 ,paddingLeft : 5 , flexDirection : 'row', flexWrap : 'wrap' , flexShrink : 1,}}>
                    <Text style = {{ flexShrink : 1,fontWeight : 'bold', fontSize : 12 , color : "#555" }}>{item && item.product_name && item.product_name.length > 100 ? `${item.product_name.substring(0,100)  } ...` : item.product_name}</Text>
                </View>
                <View style = {{paddingHorizontal: 5, paddingVertical : 2,  flexShrink : 1}}>
                    <View style = {{flexDirection : 'row', justifyContent : 'space-between', }}>
                        <TouchableOpacity 
                        style = {{alignItems : 'center', justifyContent : 'center'}} >
                            <Text style = {{fontSize : 12, fontStyle : 'italic',flexShrink : 1, backgroundColor : '#DDD' , borderRadius : 10, padding : 3}}>
                                {item.category_name}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style = {{alignItems : 'center', justifyContent : 'center'}} >
                            <Text style = {{fontSize : 12, fontStyle : 'italic',flexShrink : 1, borderColor : '#DDD' , borderWidth : 1, borderRadius : 10, padding : 3}}>
                                {item.context_name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style = {{fontSize : 12, fontStyle : 'italic',flexShrink : 1,}}>{item.feed_count_buys > 0 ? `${item.feed_count_buys  } friends bought this` : ""}</Text>
                    
                </View>
                {item.buy_url != "" ? 
                <LinearGradient colors={["#ed4b60","#E7455A","#D7354A"]} style = {{
                    backgroundColor : 'white' , 
                    alignItems : 'center' , 
                    padding : 5 , height : 30,
                    borderBottomRightRadius : 20}}>
                <TouchableOpacity 
                onPress = {()=>{
                    Amplitude.logEventWithPropertiesAsync("BUY URL FROM CONTEXT MODAL IN CATEGORY ", { context_name : item.context_name , user_name : item.user_name , product_name : item.product_name})
                    redirect(item.buy_url)}}
                >
                    <Text style = {{fontWeight : 'bold' , color : 'white', fontSize : 16 , color : colorsArray[colorNo]}}>BUY</Text>
                </TouchableOpacity>
                </LinearGradient> : null }
            </View>    
        </View>
        
        )
}

function FollowItemComponent() {
    return(
        <View style = {{flexDirection : 'row'}}>
            <Text>Name</Text>
            <Text>Follow Button</Text>
        </View>
    )
}


function User() {
    

    const progress = React.useRef(new Animated.Value(0)).current
    const ref = React.useRef(null)
  
    const [headerHeight,setHeaderHeight] = React.useState(50)
    const [randomNo, userId] = React.useContext(RandomContext)

    const navigation = useNavigation()
    const route = useRoute()
    const [userInfo,setUserInfo] = React.useState([])
    const [followingUserInfo,setFollowingUserInfo] = React.useState([])
    const [isFollowing,setFollowing] = React.useState(route?.params?.isFollowing ? route?.params?.isFollowing : false )
    const [userName,setUserName] = React.useState(route.params?.homeUserName)
    const [followingUserName,setFollowingUserName] = React.useState(route.params?.userName)
    const [followingUserId,setFollowingUserId] = React.useState(route.params?.userId)
    const [pageNumber,setPageNumber] = React.useState(0)
    const [feedData,setFeedData] = React.useState([])
    const [feedSummary,setFeedSummary] = React.useState([])

    const [loading,setLoading] = React.useState(true)

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

    
    const [splitContextModalVisible,setSplitContextModalVisible] = React.useState(false)
    const [filterContextModalVisible,setFilterContextModalVisible] = React.useState(false)
    const [categoriesChecked,setCategoriesChecked] = React.useState([])
    const [categoriesRequest,setCategoriesRequest] = React.useState([])
    const [toggled,setToggled] = React.useState(false)
    const [contextSplitData,setContextSplitData] = React.useState([])

    const categoryCheckFunc = (index, name , type) => {
      //  console.log(index , name , type)
        if(type) {
            const newArray = [...categoriesChecked]
            newArray[index] = true
            setCategoriesChecked([...newArray])
            const newArray1 = [...categoriesRequest]
            newArray1.push(name)
            setCategoriesRequest([...newArray1])
        } else {
            const newArray = [...categoriesChecked]
            newArray[index] = false
            setCategoriesChecked([...newArray])
            
            const newarray1 = [...categoriesRequest]
            const index1 = newarray1.indexOf(name)
            if (index1 !== -1) {
                newarray1.splice(index1, 1);
                setCategoriesRequest(newarray1)
            }
        }
     
    }

    React.useEffect(()=>{
        setLoading(true)
        Amplitude.logEventAsync('USER PAGE')     
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver : true
              },).start()
       

        if(dataRetrieve  && userId) {
           
            axios.get(`${URL  }/feedsummary/byuser`,{params:{following_user_id : followingUserId, user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then((responseData) => {
           //     console.log(responseData)
                setLoading(false)
                setFeedSummary(responseData)
                if(responseData.length && responseData[0].isFollowing) {
                    setFollowing(responseData[0].isFollowing)
                }
               
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
            });
        } 

        axios.get(`${URL  }/user/info`,{params:{user_id : followingUserId}} , {timeout : 5000})
            .then(res => res.data).then((responseData) => {
                console.log("OUTPUT", responseData[0].social_handles)
                setFollowingUserInfo(responseData[0])
                setUserImage(responseData[0].user_profile_image)
            })
            .catch((error) => {
            //  console.log(error)
            });   

        axios.get(`${URL  }/feed/user`,{params:{
            following_user_id : followingUserId, 
            page : pageNumber,
            user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then((responseData) => {
            //    console.log(responseData)
                setLoading(false)
                setFeedData(responseData)
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
            });
        
        
    },[categoriesChecked])


    function FeedItemSummary({item,index}) {
  return <View key = {index.toString()}>
            <FeedItemSummaryComponent item = {item} id = {index} />
        </View>
}

    function FeedItem({item,index}) {
  return <View key = {index.toString()}>
            <FeedItemComponent item = {item} id = {index} userInfo = {userInfo}/>
        </View>
}

    function FollowItem({item,index}) {
  return <View key = {index.toString()}>
        <FollowItemComponent item = {item} id = {index} />
    </View>
}

    const filterCategoryFunc = () => {
        axios.get(`${URL  }/all/byuser/categories`,{params:{user_id : followingUserId}} , {timeout : 5000})
        .then(res => res.data).then((responseData) => {
        //    console.log("FeedProduct",responseData)
            setContexts(responseData)
            setFilterContextModalVisible(!filterContextModalVisible)
        })
        .catch((error) => {
          console.log(error)
        });

        
    }

    function HeaderComponent() {
        return(
        
        <View style = {{flexDirection : 'row', paddingRight : 10 , paddingLeft : 10 ,  justifyContent : 'space-between'}}>
            <View style = {{borderRadius : 10 , marginHorizontal : Dimensions.get('screen').width*0.05, alignItems : 'center' , justifyContent : 'center'}}>
                <Text style = {{fontWeight : 'bold'}}>Filters</Text>
            </View>
            <TouchableOpacity
            onPress={filterCategoryFunc}
            style = {{width : Dimensions.get('screen').width*0.35,padding : 10 , borderRadius : 10 , marginRight : 10,   borderWidth : 2 , flexDirection: 'row', alignItems : 'center', justifyContent : 'space-between', paddingRight : 10 , backgroundColor :  !filterContextModalVisible ? "white" : "black"}}>
                <Text style = {{fontWeight : 'bold', marginRight : 10 , color : filterContextModalVisible ? "white" : "black"}}>Categories</Text>
                {filterContextModalVisible ?
                <AntDesign name = "up" color = "white" size = {15} /> :
                <AntDesign name = "down" color = "black" size = {15} />
               } 
            </TouchableOpacity> 
        </View>
        
        )
    }

    
    const followUser = () => {
        setFollowing(!isFollowing)
        const body = {
            "user_name": userName,
            "user_id": userId,
            "following_user_id": followingUserId,
            "following_user_name": followingUserName,
            "isFollowing": !isFollowing
        }
     //   console.log("POST BODY", body)

        axios({
            method: 'post',
            url: `${URL  }/engagement/followuser`,
            data: body
          }, {timeout : 5000})
        .then(res => {
            
        })
        .catch((e) => console.log(e))


    }

    const [contexts,setContexts] = React.useState([])
    const [contextsChecked,setContextsChecked] = React.useState([])
    const [contextsRequest,setContextsRequest] = React.useState([])

    const contextCheckFunc = (index, name , type) => {
      //  console.log(index , name , type)
        if(type) {
            const newArray = [...contextsChecked]
            newArray[index] = true
            setContextsChecked([...newArray])
            const newArray1 = [...contextsRequest]
            newArray1.push(name)
            setContextsRequest([...newArray1])
        } else {
            const newArray = [...contextsChecked]
            newArray[index] = false
            setContextsChecked([...newArray])
            
            const newarray1 = [...contextsRequest]
            const index1 = newarray1.indexOf(name)
            if (index1 !== -1) {
                newarray1.splice(index1, 1);
                setContextsRequest(newarray1)
            }
        }
     
    }


    const categoryApply = () => {
      //  console.log(categoryId, contextsRequest)
        if(contextsRequest.length) 
        {
            axios.get(`${URL  }/feedsummary/bycategory`,{params:{category_id : JSON.stringify(contextsRequest) , user_id : userId.slice(1,13) }} , {timeout : 5000})
            .then(res => res.data).then((responseData) => {
             //   console.log("context",responseData)
                setFeedSummary(responseData)
                setFilterContextModalVisible(false)
            })
            .catch((error) => {
           //   console.log(error)
            });
        } else {
            setFilterContextModalVisible(false)
        }     
    }

    const redirect = async (buyURL) => {
        try {   
            Linking.openURL(buyURL)
        } catch (error) {
            alert("Browser not reachable")
        }
    };

    function EmptyComponent() {
        return(
            <View style = {{marginTop : 10 }}>
                <View style = {{justifyContent : 'center'}}>
                    <LottieView
                    progress = {progress}
                    style={{width : Dimensions.get('screen').width*0.4 , height : Dimensions.get('screen').width*0.4}}
                    source={require('../../assets/animation/astronaut.json')}
                    autoPlay
                    />
                </View>
                <View style = {{justifyContent : 'center', alignItems :'center'}}>
                    <Text style = {{fontWeight : 'bold' , fontSize : 25}}>Uh Oh! No Posts yet</Text>
                </View>
            </View>
        )
    }


    return (
        <View style = {{ backgroundColor : 'white', flex : 1,}}>
            <Animated.View 
            style = {{ transform: [{translateY}],
                backgroundColor : 'white', flex : 1 ,
                height : headerHeight , 
                position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
                flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'}}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.navigate("Home")}
                    style = {{width: 20 , height : 20 , marginLeft : 10,
                    borderRadius : 20 , justifyContent : 'center', alignItems : 'center'  }}>
                            <AntDesign name = "arrowleft" size = {20} color = {backArrow}/>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{marginLeft : 10, height : 30}} disabled>
                        {followingUserInfo && followingUserInfo.user_profile_image && followingUserInfo.user_profile_image != "" ? 
                        <Image source = {{uri : `${followingUserInfo.user_profile_image  }?${  new Date()}`}} 
                            style = {{opacity : 1 , backgroundColor : 'red',  flex: 1,justifyContent: "center",borderRadius : 30, height : 30 , width : 30}} />
                        : <Avatar.Image style = {{ }}
                        source={{uri: `https://ui-avatars.com/api/?rounded=true&name=${ followingUserName  }&size=64&background=D7354A&color=fff&bold=true`}} 
                        size={30}/> }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{marginLeft : 10, flex : 1  }}
                        disabled
                        >
                        <Text style = {{fontWeight : 'bold', fontSize : 20, color : "#555"}}>{followingUserName}</Text>
                    </TouchableOpacity>
                    {/* <Pressable 
                    onPress = {followUser}
                    style = {{alignItems : 'flex-start', paddingHorizontal : 10, justifyContent :'center', borderWidth : 1, 
                    borderColor : isFollowing ? "red" : "#EEE" , 
                    borderRadius : 10 , marginLeft : 10 , marginRight : 10 , height  : 30 , 
                    backgroundColor : isFollowing ? "white" : 'red' }}>
                        <Text style = {{
                            color : isFollowing ? "#888" : 'white', 
                            fontSize : isFollowing ? 10 : 14, 
                             }}>{isFollowing ? "Following" : "Follow"}</Text>
                    </Pressable> */}
            </Animated.View>
            {followingUserInfo && followingUserInfo.social_handles && followingUserInfo.social_handles != "" && JSON.parse(followingUserInfo.social_handles) && JSON.parse(followingUserInfo.social_handles).aboutme && JSON.parse(followingUserInfo.social_handles).aboutme != "" ? 
                    <View style = {{marginTop : 50 , paddingTop : 10, paddingHorizontal : 10 , paddingBottom : 10 , borderBottomColor : '#EEE' , borderBottomWidth : 2,}}>
                        <View style = {{marginBottom : 5, }}>
                            <Text style = {{fontWeight : 'bold' , color : "#555"}}>About</Text>
                        </View>
                        <HyperLink
                            onPress={(url) => {
                                try {
                                    Linking.openURL(url)
                                }
                                catch {
                                    ToastAndroid.show("URL Invalid", ToastAndroid.SHORT)
                                }
                            }}
                            linkStyle={{ color: '#2980b9', fontSize: 15 }}
                        > 
                            <Text style = {{}}>{followingUserInfo && followingUserInfo.social_handles && followingUserInfo.social_handles != "" && JSON.parse(followingUserInfo.social_handles) && JSON.parse(followingUserInfo.social_handles).aboutme && JSON.parse(followingUserInfo.social_handles).aboutme != "" ? JSON.parse(followingUserInfo.social_handles).aboutme : ""}</Text>
                        </HyperLink>
                        
                    </View> : null }
           
            
            <Modal 
                isVisible={filterContextModalVisible}
                deviceWidth={Dimensions.get('screen').width}
                deviceHeight={Dimensions.get('screen').height}
                onBackdropPress={()=>setFilterContextModalVisible(false)}
                onSwipeComplete={()=>setFilterContextModalVisible(false)}
                swipeDirection="left"
                style = {{backgroundColor : 'white',marginTop : 110 , marginBottom : Dimensions.get('screen').height*0.3, borderRadius : 30, }}
                transparent
                backdropOpacity={0.2}
                >
                <View style={{transform:[{rotateZ:'45deg'}],width:16,height:16,backgroundColor:'white',position : 'absolute' , top : -8, right : Dimensions.get('screen').width * 0.15}} />
                <ScrollView contentContainerStyle = {{backgroundColor :'white', borderRadius : 30, width : Dimensions.get('screen').width*0.8,paddingBottom : 40, flexDirection : 'row', flexWrap : 'wrap' }}
                style = {{flexDirection : 'row' , flexWrap : 'wrap' ,  flex : 1}}>
                {contexts.length && contexts.map((item,index)=>(
                    contextsChecked[index]  == true ?
                            <Pressable 
                            android_ripple = {{color : themeLightest}}
                            onPress = {()=> contextCheckFunc(index, item.category_id ,false)}
                            style = {{backgroundColor : themeLightest ,flexDirection : 'row' , borderWidth : 1, borderColor : themeLightest, borderRadius : 10 , padding : 5 , alignItems : 'center', margin : 10 ,paddingHorizontal : 10, }}>
                                <Text style = {{color : theme,fontWeight : 'bold',}}>{item.category_name}</Text>
                               
                            </Pressable>:
                            <Pressable 
                            onPress = {()=> contextCheckFunc(index, item.category_id, true)}
                            android_ripple = {{color : themeLightest}}
                            style = {{backgroundColor : 'white', flexDirection : 'row' , borderRadius : 10 , borderWidth : 1, borderColor : '#EEE', padding : 5 , margin : 10,paddingHorizontal : 10, }}>
                                <Text style = {{color : 'black' ,fontWeight : 'bold',}}>{item.category_name}</Text>
                               
                            </Pressable>
                ))}
                <TouchableOpacity 
                onPress={categoryApply}
                style = {{borderRadius : 10 ,justifyContent:'center', alignItems : 'center', position : 'absolute' , bottom : 0 , borderTopColor : '#DDD' , borderTopWidth : 1 , height : 40, width : '100%' }}>
                    <Text style = {{color : theme, fontWeight : 'bold'}}>Apply Filters</Text>
                </TouchableOpacity>
               
                </ScrollView>
                
            </Modal>

            {loading ? <LoadingPage /> :
            <Animated.FlatList
                keyExtractor = {(item,index)=>index.toString()}
                ref = {ref}
                style = {{}}
                contentContainerStyle = {{paddingTop : followingUserInfo && followingUserInfo.social_handles && followingUserInfo.social_handles != "" && JSON.parse(followingUserInfo.social_handles) && JSON.parse(followingUserInfo.social_handles).aboutme && JSON.parse(followingUserInfo.social_handles).aboutme != "" ? 10 : 60}}
                data = {feedData}
                renderItem = {FeedItem}
                onScroll = {handleScroll}
                showsVerticalScrollIndicator = {false}
                ListEmptyComponent={EmptyComponent}
            />
            }
        </View>
    )
}

export default User

const styles = StyleSheet.create({})
