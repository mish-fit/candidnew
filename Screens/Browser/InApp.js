import React from 'react'
import { StyleSheet, Text, View ,Animated, Easing } from 'react-native'
import { WebView } from 'react-native-webview';
import {useNavigation, useRoute} from '@react-navigation/native'
import { add } from '../../Styles/Add';
import {AntDesign} from 'react-native-vector-icons'
import { colorsArray } from '../Exports/Colors';
import * as Amplitude from 'expo-analytics-amplitude';

const InApp = () => {

    const navigation = useNavigation()
    const route = useRoute()

    const [url,setUrl] = React.useState(route?.params?.url ? route.params.url : "")

    const EmptyComponent = () => {
        return(
            <View>
                <Text>Webpage doesn't exist</Text>
            </View>
        )
    }

    return (
        <View>
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
                            Shop
                        </Text>
                    </TouchableOpacity>
            </Animated.View>
            {url != "" && url != "none" ?
            <WebView source={{ uri: url}} /> :
            <EmptyComponent /> }
        </View>
    )
}

export default InApp

const styles = StyleSheet.create({})
