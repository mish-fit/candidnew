import { NavigationContainer , useNavigation , useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Animated, Text, View,Image, TextInput, TouchableOpacity, Easing, Pressable , ScrollView, ImageBackground, Dimensions, Keyboard, ToastAndroid} from 'react-native'
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { RandomContext } from '../Exports/Context'
import { backArrow, background, colorsArray } from '../Exports/Colors'
import LottieView from 'lottie-react-native';
import {theme} from '../Exports/Colors'
import axios from 'axios'
import {URL} from '../Exports/Config'
import { add } from '../../Styles/Add'
import {Avatar} from 'react-native-paper'
import { KeyboardAvoidingView } from 'native-base'
import * as Amplitude from 'expo-analytics-amplitude';


const AddComment = () => {

    const [source,setSource] = React.useState(true)
    const progress = React.useRef(new Animated.Value(0)).current
    const navigation = useNavigation()
    const route = useRoute()

    const [fullBody,setFullBody] = React.useState([])
    
    const [randomNo,userId] = React.useContext(RandomContext)
    const [comment,setComment] = React.useState("")

    const [postImage,setPostImage] = React.useState("")
    const [submitted,setSubmitted] = React.useState(false)
    
 
    const {body,contextId,productId,postImageShown,rating,contextExists,productExists} = route?.params


    React.useEffect(()=>{
        console.log(route?.params)
        Amplitude.logEventAsync('ADD COMMENT')
        console.log("body in add comment screen", body)
        setFullBody({...body, context_id : contextId, product_id : productId, context_name : contextExists.context_name , product_name : productExists.product_name})
    },[])

    const submit = () => {
        setSubmitted(true)
        console.log('submit full body', fullBody)
        const addProductImageBody = {
            "product_id" : fullBody.product_id,
            "product_image" : fullBody.feed_image
        }

        const addContextImageBody = {
            "context_id" : fullBody.context_id,
            "context_image" : fullBody.feed_image
        }

        const addPostBody = {
            ...fullBody, 
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
                ToastAndroid.show("Wohoo!! It's posted. Share it on your social pages and start earning coins.", ToastAndroid.SHORT)
                navigation.navigate("PostShare", {body : addPostBody})
            })
        .catch((e) => {
            ToastAndroid.show("Error posting your critic. Please try again later!!", ToastAndroid.SHORT)
        })

    


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
                            Critique
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
                    disabled = {submitted}
                    style = {add.button}
                    onPress = {submit}>
                        <Text style = {add.buttonText}>POST</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{position : 'absolute', left : 30 , bottom : 30 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
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
