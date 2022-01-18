import { NavigationContainer , useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Animated, Text, View,Image, TextInput, TouchableOpacity, Easing, Pressable , ScrollView} from 'react-native'
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { RandomContext } from '../Exports/Context'
import { backArrow, colorsArray } from '../Exports/Colors'
import LottieView from 'lottie-react-native';
import {theme} from '../Exports/Colors'
import axios from 'axios'
import {URL} from '../Exports/Config'
import { add } from '../../Styles/Add'
import {Avatar} from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude';

const Search = () => {

    const [source,setSource] = React.useState(true)
    const [buyURL, setBuyURL] = React.useState("")

    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()
    const {userInfo} = route?.params
    const [randomNo,userId] = React.useContext(RandomContext)
    const [myRewardsCoins,setMyRewardsCoins] = React.useState(7000)

    const [comment,setComment] = React.useState("")

    const [primaryCommentSubmitted,setPrimaryCommentSubmitted] = React.useState(false)
    const [secondaryCommentSubmitted,setSecondaryCommentSubmitted] = React.useState(false)

    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")
    const [searchTextProduct,setSearchTextProduct] = React.useState("")
    const [searchArray,setSearchArray] = React.useState([])
    const [searchLoading,setSearchLoading] = React.useState(false)

    

    React.useEffect(()=>{
        Amplitude.logEventAsync('SEARCH PRODUCT')
        Animated.timing(progress, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver : true
            },).start();

        axios.get(URL + "/search/feedproducts", {params:{product_text : "" }} , {timeout : 3000})
        .then(res => res.data).then(function(responseData) {
        //    console.log("SearchArray",responseData)
            setSearchLoading(false)
            setSearchArray(responseData)
        //    console.log("Reached Here response")
        })
        .catch(function(error) {
            setSearchLoading(false)
        //    console.log("Reached Here error")
        });
    },[])

    const onClickSearchItemChild = (product_name, product_id) => {
      
        setSearchTextProduct(product_name)
    //    console.log(product_name)
        navigation.navigate("ProductPage", {product_name : product_name , product_id : product_id,userInfo : userInfo})
        setSearchTextProduct("")
    }

    const searchProduct = (text) => {
        
        setSearchTextProduct(text)
        setSearchLoading(true)
        
        axios.get(URL + "/search/feedproducts", {params:{product_text : text }} , {timeout : 3000})
          .then(res => res.data).then(function(responseData) {
              console.log("SearchArray",responseData)
              setSearchLoading(false)
              setSearchArray(responseData)
          //    console.log("Reached Here response")
        })
        .catch(function(error) {
              setSearchLoading(false)
          //    console.log("Reached Here error")
        });

    }



    return (
        <View style = {{flex : 1, backgroundColor : 'white'}}>
            <Animated.View 
            style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <TouchableOpacity 
                onPress = {()=>navigation.goBack()}
                style = {add.headerBack}>
                    <AntDesign name = "arrowleft" size = {30} color = {backArrow}/>
                </TouchableOpacity>
                <View style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                borderRadius : 2, padding : 5, margin : 5 , marginTop : 10, height : 50, justifyContent: 'space-between', flex : 1,alignItems : 'center',
                alignItems:'center'}}>
                    <TextInput style = {{fontSize : 15}}
                        placeholder = "Search for Product"
                        onChangeText = {(text) => searchProduct(text)}
                        value = {searchTextProduct}
                        onFocus = {()=>setInputFocus(true)}
                        onBlur = {()=>setInputFocus(false)}
                    />
                    <TouchableOpacity 
                        style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                        onPress = {()=>onClickSearchItemChild(searchTextProduct,0)} >
                        <AntDesign name = "search1" size = {24} color = {theme} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <ScrollView style = {add.dropDownList} contentContainerStyle = {{paddingBottom : 60, paddingHorizontal : 5}}>
            { searchArray.length ?
            searchArray.map((item,index)=>{
                return(
                    <TouchableOpacity 
                                key = {index.toString()}
                                style = {[add.dropDownItem,{marginTop : 5, padding : 5}]}
                                onPress = {()=>onClickSearchItemChild(item.product_name,item.product_id)} >
                        {item.feed_image && item.feed_image != "None" && item.feed_image != "" ?
                        <Image source = {{uri : item.feed_image}} style = {{borderRadius : 5 , width : 50 , height : 50}}/> :
                        <Avatar.Image style = {add.dropDownItemAvatar}
                        source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.product_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                        size={30}/> }  
                        <View style = {add.dropDownView}>
                            <Text style = {add.dropDownText}>{item.product_name.length > 100 ? item.product_name.substring(0,100) + " ...": item.product_name }</Text>
                        </View>
                        
                    </TouchableOpacity>
                    )})
            : null}
            </ScrollView>
            </View>
     
    )
}

export default Search

const styles = StyleSheet.create({
   
})
