import { NavigationContainer , useNavigation , useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Animated, Text, View,Image, TextInput, TouchableOpacity, Easing, Pressable , ScrollView} from 'react-native'
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { RandomContext } from '../Exports/Context'
import { backArrow, background, colorsArray } from '../Exports/Colors'
import LottieView from 'lottie-react-native';
import {theme} from '../Exports/Colors'
import axios from 'axios'
import {URL} from '../Exports/Config'
import { add } from '../../Styles/Add'
import {Avatar} from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude';

const AddContext = () => {

    const [source,setSource] = React.useState(true)
  

    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()

    const [body, setBody] = React.useState(route?.params?.body ? route?.params?.body : {} )
    const [categoryName, setCategoryName] = React.useState(route?.params?.category_name ? route?.params?.category_name : "")
    const [categoryId, setCategoryId] = React.useState(route?.params?.category_id ? route?.params?.category_id : "")
    const [productName, setProductName] = React.useState(route?.params?.product_name ? route?.params?.product_name : "")
    const [productId, setProductId] = React.useState(route?.params?.product_id ? route?.params?.product_id : "")
    const [randomNo,userId] = React.useContext(RandomContext)
    const [comment,setComment] = React.useState("")
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")
    const [searchTextProduct,setSearchTextProduct] = React.useState("")
    const [searchArray,setSearchArray] = React.useState([])
    const [searchLoading,setSearchLoading] = React.useState(false)
    const [plusDisable,setPlusDisable] = React.useState(true)

    React.useEffect(()=>{
     //   console.log("Body in add context use effect", body , " product id and product name and category id and category name", productId, productName , categoryId , categoryName)
        Amplitude.logEventAsync('ADD CONTEXT')
        setBody({...body, category_name : categoryName , category_id : categoryId , product_name : productName, product_id : productId})
        Animated.timing(progress, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver : true
            },).start();

        axios.get(URL + "/search/context", {params:{context_text : "" , category_name : categoryName }} , {timeout : 3000})
        .then(res => res.data).then(function(responseData) {
      //      console.log("SearchArray",responseData)
            setSearchLoading(false)
            setSearchArray(responseData)
        })
        .catch(function(error) {
            setSearchLoading(false)
            console.log(error)
        });
    },[])


    const onClickSearchItemChild = (name) => {
        Amplitude.logEventWithPropertiesAsync('ADDED NEW CONTEXT', {context_name : name })
        setSearchTextProduct(name)
      //  console.log(name)
        navigation.navigate("AddImage", {body : body , context_name : name })
    }

    const searchProduct = (text) => {
        if(text.length > 1) {
            setPlusDisable(false)
        }
        setSearchTextProduct(text)
        setSearchLoading(true)
        
        axios.get(URL + "/search/context", {params:{context_text : text , category_name : body.category_name}} , {timeout : 3000})
          .then(res => res.data).then(function(responseData) {
            //  console.log("SearchArray",responseData)
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
        <View style = {{flex : 1, backgroundColor : background}}>
            <Animated.View 
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
                        <Text style = {add.headerTitleText}>
                            Add Context
                        </Text>
                    </TouchableOpacity>
            </Animated.View>
            <View style = {{margin : 10 ,marginTop : 60,}}>
                <View style={add.fixedView}>
                    <View style={add.elementFixed}>
                        <Text style = {add.headingFixed}>{body.product_name}</Text>
                    </View>
                    <View style = {{flexDirection :'row', justifyContent :'space-between', marginRight : 20,}}>
                        <View style={add.elementFixedLight}>
                            <Text style = {add.headingFixedLight}>{body.category_name}</Text>
                        </View>
                    </View>
                </View>
                <View style={add.element}>
                    {/* <Text style = {add.heading}>Context Name</Text> */}
                    <View style = {{flexDirection : 'row', marginTop : 10, justifyContent : 'space-between', borderRadius : 10, borderWidth : 1, borderColor : '#DDD', paddingHorizontal : 5, paddingVertical : 5,}}>
                        <TextInput style = {{fontSize : 16}}
                            placeholder = "Add Context"
                            onChangeText = {(text) => searchProduct(text)}
                            value = {searchTextProduct}
                            onFocus = {()=>setInputFocus(true)}
                            onBlur = {()=>setInputFocus(false)}
                        />
                        <TouchableOpacity 
                            disabled = {plusDisable}
                            style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                            onPress = {()=>onClickSearchItemChild(searchTextProduct)} >
                            <AntDesign name = "plus" size = {24} color = {theme} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style = {add.dropDownList} contentContainerStyle = {{paddingBottom : 60}}>
                { searchArray.length ?
                searchArray.map((item,index)=>{
                    return(
                        <TouchableOpacity 
                                    key = {index.toString()}
                                    style = {add.dropDownItem}
                                    onPress = {()=>onClickSearchItemChild(item.context_name)} >
                            {item.context_image && item.context_image != "None" && item.context_image != "" ?
                            <Image source = {{uri : item.context_image}} style = {add.dropDownItemImage}/> :
                            <Avatar.Image style = {add.dropDownItemAvatar}
                            source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.context_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                            size={30}/> }  
                            <View style = {add.dropDownView}>
                                <Text style = {add.dropDownText}>{item.context_name}</Text>
                            </View>
                            
                        </TouchableOpacity>
                       )})
                : null}
                </ScrollView>
            </View>
            {/* <View style = {{position : 'absolute', left : 30 , bottom : 30 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Home")}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <AntDesign name = "home" size = {30} color = 'white' />
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export default AddContext

const styles = StyleSheet.create({
   
})
