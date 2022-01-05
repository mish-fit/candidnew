import React from 'react'
import { PermissionsAndroid,Animated, Dimensions,Switch, Image, ScrollView,StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput, Pressable, Linking, TouchableWithoutFeedback } from 'react-native'
import { colorsArray, theme, themeLight, themeLightest, alttheme, altthemeLight,altthemeLightest, backArrow } from '../Exports/Colors'
import { RandomContext } from '../Exports/Context'
import {AntDesign} from 'react-native-vector-icons';
import { NavigationContainer, useNavigation , useRoute} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { RewardsComponent } from '../Exports/Components';
import Constants from 'expo-constants'
import {dataRetrieve, URL} from '../Exports/Config'
import {homeFeed} from "../FakeData/HomeFeed"
import {products} from "../FakeData/SearchProducts"
import Contacts from 'react-native-contacts';
import  Modal  from 'react-native-modal'
import * as Permissions from 'expo-permissions'
import { FlatList } from 'react-native-gesture-handler';
import { categories } from '../FakeData/SearchByCategory';
import { follower } from '../FakeData/Follower';
import { selectContext } from '../FakeData/SelectContext';
import { splitContext } from '../FakeData/SplitContext';
import axios from 'axios';
import { width } from '../Exports/Constants';
import {Avatar} from 'react-native-paper'
import { Rating, AirbnbRating } from 'react-native-ratings';
import * as Amplitude from 'expo-analytics-amplitude';
import { add } from '../../Styles/Add';
import { LoadingPage } from '../Exports/Pages'



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
        <View style = {{marginLeft : 10 , marginRight : 10 , borderWidth : 1 , borderColor : '#EEE', borderRadius : 10, marginTop : 10 , marginBottom : 5,  flex : 1}}>
            <View style = {{marginTop : 5 ,marginLeft : 10 , flexDirection : 'row', justifyContent : 'flex-start'}}>
                <View style = {{marginRight : 10}}>
                {item.user_image && item.user_image != "None" && item.user_image != "" ?
                    <Image source = {{uri : item.user_image + "?" + new Date()}} style = {{width : 40, height : 40 , borderRadius : 40 , marginTop : 5 , marginLeft : 5  }}/> :
                    <Avatar.Image style = {{marginTop : 5 , marginLeft : 5 , }}
                    source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.user_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                    size={40}/> }  
                </View>  
                <View style = {{flex : 1}}>
                    <View style = {{flexDirection : 'row', marginLeft : 5}}>
                        <TouchableOpacity onPress = {()=> {
                         //   console.log(" user info ",userInfo, " item " , item)
                            navigation.navigate("UserPage", {homeUserName : userInfo.user_name, userName : item.user_name , userId : item.user_id , isFollowing : item.isFollowing}
                        
                        )}}>
                            <Text style = {{fontSize : 15 , fontWeight : 'bold'}}>{item.user_name}</Text>
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
               
                    <View style = {{marginTop : 5 ,marginLeft : 5 , flexDirection : 'row', flexWrap : 'wrap'}}>
                        <Text style = {{fontSize : 12 , color : "#555" }}>{item.product_name}</Text>
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



const Product = () => {
    const [headerHeight,setHeaderHeight] = React.useState(60)
    const progress = React.useRef(new Animated.Value(0)).current
    const ref = React.useRef(null)
    const navigation = useNavigation()
    const route = useRoute()
    const {product_name, product_id, userInfo} = route?.params

    const [productFeed,setProductFeed] = React.useState([])
    const [loading,setLoading]  = React.useState(true)

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
        axios.get(URL + "/feed/product",{params:{product_id : product_id , page : 0}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
             //   console.log("FeedProduct",responseData)
                setLoading(false)
                setProductFeed(responseData)
            })
            .catch(function(error) {
                setLoading(false)
            });
    },[])

    const FeedItem = ({item,index}) => (
        <View key = {index.toString()}>
            <FeedItemComponent item = {item} id = {index} userInfo = {userInfo}/>
        </View> 
    )

    const HeaderComponent = () => {
        return(
            <Animated.View 
            style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center',height : headerHeight,transform: [{translateY}],  marginTop : 5,}}>
                <TouchableOpacity 
                onPress = {()=>navigation.navigate("Home")}
                style = {add.headerBack}>
                    <AntDesign name = "arrowleft" size = {30} color = {backArrow}/>
                </TouchableOpacity>
                <TouchableOpacity onPress = {()=>navigation.navigate("Search",{userInfo : userInfo})}
                style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                borderRadius : 2, padding : 5, margin : 5 , marginTop : 5,  justifyContent: 'space-between', flex : 1 , 
                alignItems:'center'}}>
                {/* <TextInput 
                  style = {{flex : 1 , fontSize : 14}}
                  placeholder = "Search for products here"
                  onChangeText = {(text)=>setHeroSearchText(text)}
                  value = {heroSearchText}
                /> */}
                <Text style = {{color : "#999"}}>
                    Search
                </Text>

                <TouchableOpacity 
                  style = {{ paddingTop : 2, paddingBottom : 2, paddingLeft : 5, paddingRight: 5, justifyContent : 'center' , alignItems : 'center', borderRadius : 5 }}
                  onPress = {()=>console.log("do nothing")}
                >
                  <AntDesign name = "search1" size = {20} color = {theme} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
            )
    }

    const EmptyComponent = () => {
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
                    <Text style = {{fontWeight : 'bold' , fontSize : 25}}>Uh Oh! No Posts on this category yet</Text>
                    <TouchableOpacity onPress = {()=>navigation.navigate("AddReview" , {user_id : userId.slice(1,13), user_name : userInfo.user_name, user_image : userInfo.user_image})}>
                        <Text style = {{marginTop : 10 , color : themeLight}}>Start Criticing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    return (
        loading ? <LoadingPage /> :
        <View style = {{backgroundColor : 'white', flex : 1}}>
            <Animated.View 
            style = {{transform: [{translateY}],
                backgroundColor : 'white', flex : 1 ,
                height : headerHeight , 
                position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
                flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'}}>
                <TouchableOpacity 
                onPress = {()=>navigation.navigate("Home")}
                style = {add.headerBack}>
                    <AntDesign name = "arrowleft" size = {30} color = {backArrow}/>
                </TouchableOpacity>
                <TouchableOpacity onPress = {()=>navigation.navigate("Search",{userInfo : userInfo})}
                style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                borderRadius : 2, padding : 5, margin : 5 , marginTop : 5,  justifyContent: 'space-between', flex : 1 , 
                alignItems:'center'}}>
                {/* <TextInput 
                  style = {{flex : 1 , fontSize : 14}}
                  placeholder = "Search for products here"
                  onChangeText = {(text)=>setHeroSearchText(text)}
                  value = {heroSearchText}
                /> */}
                <Text style = {{color : "#999"}}>
                    Search
                </Text>

                <TouchableOpacity 
                  style = {{ paddingTop : 2, paddingBottom : 2, paddingLeft : 5, paddingRight: 5, justifyContent : 'center' , alignItems : 'center', borderRadius : 5 }}
                  onPress = {()=>console.log("do nothing")}
                >
                  <AntDesign name = "search1" size = {20} color = {theme} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
       
            <Animated.FlatList
                key = {(index) => index.toString()}
                style = {{paddingTop : 50}}
                contentContainerStyle = {{paddingBottom : 100, }}
                data = {productFeed}
                renderItem={FeedItem}
                ListEmptyComponent={EmptyComponent}
                onScroll = {handleScroll}
                showsVerticalScrollIndicator = {false}
            />
         </View>
    )
}

export default Product

const styles = StyleSheet.create({})
