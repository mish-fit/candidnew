import { NavigationContainer , useNavigation , useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Animated, Text, View,Image, TextInput, TouchableOpacity, Easing, Pressable , ScrollView, Dimensions, ToastAndroid} from 'react-native'
import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { RandomContext } from '../Exports/Context'
import { alttheme, backArrow, background, colorsArray, themeLightest } from '../Exports/Colors'
import LottieView from 'lottie-react-native';
import {theme} from '../Exports/Colors'
import axios from 'axios'
import {URL} from '../Exports/Config'
import { add } from '../../Styles/Add'
import {Avatar} from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude';


const AltAdd1 = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const [body, setBody] = React.useState(route?.params?.body ? route?.params?.body : {} )
    const [productId, setProductId] = React.useState(route?.params?.product_id ? route?.params?.product_id : 0 )
    const [submitted,setSubmitted] = React.useState(false)
 
    React.useEffect(()=>{
     //   console.log("Body in add category use effect", body , " product id and product name", body.product_id, body.product_name)
        setBody((body)=>({...body, product_id : productId}))
    },[])

    const submit = () => {
        setSubmitted(true)
    //    console.log("Body",body)

        axios({
            method: 'post',
            url: URL + '/add/post',
            data: body
        }, {timeout : 5000})
        .then(res => {
         //       console.log(res)
                ToastAndroid.show("Wohoo!! It's posted. Coins will be credited within 48 hours.", ToastAndroid.SHORT)
                navigation.navigate("PostShare", {body : body})
            })
        .catch((e) => {
            ToastAndroid.show("Error posting your critic. Please try again later!!", ToastAndroid.SHORT)
        })
    }

    return (
        <View style = {{flex : 1 ,backgroundColor : 'white'}}>
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
                    <Text style = {add.headerTitleText}>Post Review (2/2)</Text>
                </TouchableOpacity>
            </Animated.View>
            <View style = {{marginTop : 50 , paddingHorizontal : 10 , borderTopColor : "#EEE" , borderTopWidth : 2, flex : 1}}>
                <View style={add.element}>
                    <Text>
                        <Text style = {{fontWeight : 'bold' , marginTop : 20 , color : alttheme, fontSize : 18}}>Buy URL</Text>
                        <Text style = {{color : alttheme, fontSize : 15}}> ( You can earn coins when someone buy using this list from your post ) </Text>
                    </Text>
                    <TextInput 
                    placeholder = "Share products to whatsapp and copy and paste website links here starting with https://. For supporting websites, visit How To Earn section "
                    value = {body.buy_url}
                    onChangeText = {(text)=>setBody({...body, buy_url : text})}
                    multiline
                    style = {{fontStyle : 'normal', color : '#999' , marginTop : 0, borderBottomWidth : 1 , borderBottomColor : "#AAA" }} />
                </View>
                <View style = {{justifyContent : 'flex-end', alignItems :'flex-end', marginTop : 15,marginRight : 10}}>
                    <TouchableOpacity 
                    disabled = {submitted}
                    onPress = {submit}
                    style = {{backgroundColor : submitted ? "#888" : theme, borderRadius : 5 , width : Dimensions.get('screen').width * 0.3, padding : 10, justifyContent :'center', alignItems : 'center'}}>
                        <Text style = {{color : 'white', fontWeight : 'bold' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AltAdd1

const styles = StyleSheet.create({})
