import React from 'react'
import { PermissionsAndroid,Animated, FlatList,Dimensions, Image, StyleSheet, Text, TouchableOpacity, View ,Easing,TextInput, Pressable } from 'react-native'
import { colorsArray } from '../Exports/Colors'
import { RandomContext } from '../Exports/Context'
import {AntDesign} from 'react-native-vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { RewardsComponent } from '../Exports/Components';
import Constants from 'expo-constants'
import {dataRetrieve, URL} from '../Exports/Config'
import {homeFeed} from "../FakeData/HomeFeed"
import Contacts from 'react-native-contacts';
import  Modal  from 'react-native-modal'



import * as Permissions from 'expo-permissions'
import axios from 'axios';
// import { FlatList } from 'react-native-gesture-handler';
// import { categories } from '../FakeData/SearchByCategory';

const FeedItemComponent = ({item,id}) => {
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

    const likePost = () => {
        setLike(!like)
    }

    const dislikePost = () => {
        setDislike(!dislike)
    }


    return(
        <View style = {{marginLeft : 10 , marginRight : 10 , borderWidth : 1 , borderColor : '#EEE', borderRadius : 10, marginTop : 10 , marginBottom : 5,  }}>
                <View style = {{marginTop : 10 ,marginLeft : 30 , flexDirection : 'row', justifyContent : 'space-between'}}>
                    <View style = {{flexDirection : 'row'}}>
                    <TouchableOpacity>
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
                   
                </View>
                <View style = {{marginTop : 5 ,marginLeft : 30 , flexDirection : 'row', flexWrap : 'wrap'}}>
                    <Text style = {{ fontSize : 12 , color : colorsArray[colorNo] }}>{item.product_name}</Text>
                </View>
                <View style = {{marginHorizontal : 30 , marginVertical : 5,flexDirection : 'row' , justifyContent : 'space-between'}}>
                    <View style = {{ paddingHorizontal: 5, paddingVertical : 2, backgroundColor :  "#888" , borderRadius : 10, }}>
                        <Text style = {{color : 'white',fontSize : 12, fontStyle : 'italic'}}>{item.category_name}</Text>
                    </View>
                    <View style = {{borderWidth : 1 , paddingHorizontal: 5, paddingVertical : 2, 
                        borderColor :  "#CCC" , borderRadius : 20, }}>
                        <Text style = {{fontSize : 12, fontStyle : 'italic'}}>{item.context_name}</Text>
                    </View>
                </View>
                <View style = {{marginTop : 10, justifyContent : 'center', alignItems : 'center' }}>
                    <Image source = {{uri : item.image}} 
                        style = {{
                            width : Dimensions.get('screen').width * 0.92,
                            height: Dimensions.get('screen').width * 0.92,
                            borderRadius : 40, 
                        }} 
                    />
                    <TouchableOpacity style = {{position : 'absolute', bottom : 10 , left : Dimensions.get('screen').width * 0.15, width : Dimensions.get('screen').width * 0.62 , backgroundColor : colorsArray[colorNo] , alignItems : 'center' , padding : 5 , borderRadius : 20}}>
                        <Text style = {{fontWeight : 'bold' , color : 'white', fontSize : 18}}>BUY</Text>
                    </TouchableOpacity>
                </View>
                <View style = {{marginTop : 10, flexDirection : 'row',justifyContent : 'space-between' , paddingHorizontal : Dimensions.get('screen').width * 0.05 , borderRadius : 5}}>
                    <TouchableOpacity 
                     disabled={dislike}
                    onPress = {likePost}
                    >
                        <AntDesign name = "like2" color = {item.like ? "green" : "#888"} size = {20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    disabled={like}
                    onPress = {dislikePost}
                    >
                        <AntDesign name = "dislike2" color = {item.dislike ? "red" : "#888"} size = {20} />
                    </TouchableOpacity>
                </View >
                <View style = {{marginTop : 10 , paddingHorizontal : 10 , marginBottom : 10 }}>
                    <Text>{item.comment}</Text>
                </View>
            </View>
        
        )
}

const FeedItem = ({item,index}) => (
            <View key = {index.toString()}>
                <FeedItemComponent item = {item} id = {index.toString()}/>
            </View> 
        )




const ByCategory = () => {

    const progress = React.useRef(new Animated.Value(0)).current
    const ref = React.useRef(null)
    
    const [categories,setCategories] = React.useState([])
   
    const [headerHeight,setHeaderHeight] = React.useState(60)
    const [randomNo,userId] = React.useContext(RandomContext)

    const navigation = useNavigation()

    const [feedData,setFeedData] = React.useState([])

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

    const [modalVisible,setModalVisible] = React.useState(true)
    const [categoriesChecked,setCategoriesChecked] = React.useState([])
    const [categoriesRequest,setCategoriesRequest] = React.useState([])

    const categoryCheckFunc = (index, name , type) => {
    //    console.log(index , name , type)
        if(type) {
            let newArray = [...categoriesChecked]
            newArray[index] = true
            setCategoriesChecked([...newArray])
            let newArray1 = [...categoriesRequest]
            newArray1.push(name)
            setCategoriesRequest([...newArray1])
        } else {
            let newArray = [...categoriesChecked]
            newArray[index] = false
            setCategoriesChecked([...newArray])
            let newarray1 = [...categoriesRequest]
            let index1 = newarray1.indexOf(name)
            if (index1 !== -1) {
                newarray1.splice(index, 1);
                setCategoriesRequest(newarray1)
            }
        }
     
    }

    React.useEffect(()=>{
        Animated.timing(progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver : true
              },).start()


    //    console.log(Constants.systemFonts);

        if(dataRetrieve) {
            axios.get(URL + "/all/categories",{params:{limit : 50}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
            //    console.log(responseData)
                setCategories(responseData)
            })
            .catch(function(error) {
              
            });
            
        } else {
            setFeedData(homeFeed)
        }

      
    },[categoriesChecked])

    const onContextModalClose = () => {
    //    console.log(userId, categoriesRequest)
        if(categoriesRequest.length) 
        {
            axios.get(URL + "/feedsummary/bycategory",{params:{user_id : userId.slice(1,13) , category_id : JSON.stringify(categoriesRequest)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
            //    console.log("context",responseData)
                setFeedData(responseData)
                setModalVisible(false)
            })
            .catch(function(error) {
            //  console.log(error)
              setModalVisible(false)
            });
        } else {
            setModalVisible(false)
            navigation.navigate("Home")
        }     
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
                        style = {{marginLeft : 10 }}
                        onPress = {()=>navigation.goBack()}
                        >
                        <AntDesign name = "arrowleft" size = {30} color = 'black' />
                    </TouchableOpacity>
                    <Pressable 
                    onPress = {()=>setModalVisible(true)}
                    style = {{alignItems : 'flex-start', paddingLeft : 10, justifyContent :'center', borderWidth : 1, borderColor : "#EEE" , flex : 1 , borderRadius : 10 , marginLeft : 10 , marginRight : 10 , height  : 40  }}>
                        <Text style = {{color : "#888", fontSize : 16, fontStyle : 'italic'}}>Filter by Category</Text>
                    </Pressable>
            </Animated.View>
            <Modal 
                isVisible={modalVisible}
                deviceWidth={Dimensions.get('screen').width}
                deviceHeight={Dimensions.get('screen').height}
                onBackdropPress={onContextModalClose}
                onSwipeComplete={onContextModalClose}
                swipeDirection="left"
                style = {{marginHorizontal : 10 , marginVertical : 10}}
                >
                <View style = {{flexDirection : 'row' , flexWrap : 'wrap' , }}>
                {categories.map((item,index)=>{
                    return(
                    categoriesChecked[index]  == true ?
                            <Pressable 
                            android_ripple = {{color : 'black'}}
                            onPress = {()=> categoryCheckFunc(index, item.category_id ,false)}
                            style = {{backgroundColor : 'green' , flexDirection : 'row' , borderRadius : 20 , padding : 10 , alignItems : 'center', margin : 10 }}>
                                <Text style = {{color : 'white', marginRight : 10 }}>{item.category_name}</Text>
                                <AntDesign name = "check" size = {15} color = 'white' />
                            </Pressable>:
                            <Pressable 
                            onPress = {()=> categoryCheckFunc(index, item.category_id, true)}
                            android_ripple = {{color : 'green'}}
                            style = {{backgroundColor : 'white', flexDirection : 'row' , borderRadius : 20 , borderWidth : 1, borderColor : 'green', padding : 10 , margin : 10 }}>
                                <Text style = {{color : 'red' , marginRight : 10}}>{item.category_name}</Text>
                                <AntDesign name = "plus" size = {15} color = 'green' />
                            </Pressable>
                )                  
                })}
                </View>
            </Modal>
            <Animated.FlatList
                keyExtractor = {(item,index)=>index.toString()}
                ref = {ref}
                style = {{}}
                contentContainerStyle = {{paddingTop : headerHeight}}
                data = {feedData}
                renderItem = {FeedItem}
                onScroll = {handleScroll}
                showsVerticalScrollIndicator = {false}
            />
            <TouchableOpacity 
            onPress = {()=>navigation.navigate("AddPost")}
            style = {{width: 60 , height : 60 , 
            backgroundColor : colorsArray[randomNo+1], 
            borderRadius : 60 , justifyContent : 'center', alignItems : 'center', position : 'absolute' , bottom : 20 , right : 20  }}>
                <View>
                    <AntDesign name = "plus" size = {40} color = "white" />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ByCategory

const styles = StyleSheet.create({})
