import { NavigationContainer , useNavigation , useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Animated, Text, View,Image, TextInput, TouchableOpacity, Easing, Pressable , ScrollView, ImageBackground, Dimensions, Keyboard, ToastAndroid} from 'react-native'
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { RandomContext } from '../Exports/Context'
import { background, colorsArray } from '../Exports/Colors'
import LottieView from 'lottie-react-native';
import {theme} from '../Exports/Colors'
import axios from 'axios'
import {URL} from '../Exports/Config'
import { add } from '../../Styles/Add'
import {Avatar} from 'react-native-paper'
import { KeyboardAvoidingView } from 'native-base'



const AddComment = () => {

    const [source,setSource] = React.useState(true)
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()
    const [body, setBody] = React.useState(route?.params?.body ? route?.params?.body : {})
    const [rating, setRating] = React.useState(route?.params?.rating ? route?.params?.rating : {})
    const [postImageShown, setPostImageShown] = React.useState(route?.params?.postImageShown ? route?.params?.postImageShown : {})
    
    const [randomNo,userId] = React.useContext(RandomContext)
    const [comment,setComment] = React.useState("")
    const [productExists,setProductExists] = React.useState(true)
    const [contextExists,setContextExists] = React.useState(true)
    const [productId,setProductId] = React.useState(0)
    const [contextId,setContextId] = React.useState(0)
    const [postImage,setPostImage] = React.useState("")
    
 

    React.useEffect(()=>{
        
    
    },[])

    const submit = () => {
        const addProductImageBody = {
            "product_id" : body.product_id,
            "product_image" : body.feed_image
        }

        const addContextImageBody = {
            "context_id" : body.context_id,
            "context_image" : body.feed_image
        }

        const addPostBody = {
            ...body, 
            "comment": comment,
            "rating" : rating
          }

        axios({
            method: 'post',
            url: URL + '/add/contextimage',
            data: addContextImageBody
        }, {timeout : 5000})
        .then(res => {
            
            })
        .catch((e) => console.log(e))

        axios({
            method: 'post',
            url: URL + '/add/productimage',
            data: addProductImageBody
        }, {timeout : 5000})
        .then(res => {
            
            })
        .catch((e) => console.log(e))

        axios({
            method: 'post',
            url: URL + '/add/post',
            data: addPostBody
        }, {timeout : 5000})
        .then(res => {
                console.log(res)
                ToastAndroid.show("Wohoo! It's Posted. Share it on your social pages and start earning coins.", ToastAndroid.SHORT)
                navigation.navigate("PostShare", {body : addPostBody})
            })
        .catch((e) => console.log(e))

    


    }


  

    return (
        <View style = {{flex : 1, backgroundColor : background}}>
            <Animated.View 
            style = {add.headerView}>
                    <TouchableOpacity 
                    onPress = {()=>navigation.goBack()}
                    style = {add.headerBack}>
                        <AntDesign name = "arrowleft" size = {30} color = {colorsArray[randomNo]}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {add.headerTitle}
                        disabled
                        >
                        <Text style = {{fontWeight : 'bold', fontSize : 20, color : colorsArray[randomNo-1]}}>
                            Review
                        </Text>
                    </TouchableOpacity>
            </Animated.View>
            <View style = {{margin : 10 ,marginTop : 20,}}>
                <View style={{}}>
                    <TextInput 
                        style = {{borderBottomWidth : 1 , borderColor : "#DDD", color : "#555", fontSize : 15, marginTop : 20 , paddingTop: 20, paddingLeft : 10 , textAlign : 'left' ,   textAlignVertical : 'top'}}
                        multiline
                        numberOfLines = {15}
                        autoFocus
                        onChangeText = {(text)=>setComment(text)}
                        value={comment}
                    />
                </View>
                <View  style = {add.buttonView}>
                    <TouchableOpacity 
                    style = {add.button}
                    onPress = {submit}>
                        <Text style = {add.buttonText}>POST</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{position : 'absolute', left : 30 , bottom : 30 , width : 60 , height : 60 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Home")}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <AntDesign name = "home" size = {30} color = 'white' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddComment

const styles = StyleSheet.create({
   
})
