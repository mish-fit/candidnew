import React from 'react'
import {Animated, Easing, FlatList,  StyleSheet, Text, View , TouchableOpacity, Dimensions, Image} from 'react-native'
import { background, colorsArray, theme } from '../Exports/Colors'

import { RandomContext } from '../Exports/Context'

import {AntDesign , FontAwesome5} from 'react-native-vector-icons'
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';

import axios from 'axios'
import { URL } from '../Exports/Config'
import moment from 'moment'
import { mySummaryStyle } from '../../Styles/MySummary'
import * as Amplitude from 'expo-analytics-amplitude';

const BurnItemComponent = ({item , id}) => {

    const [randomNo, userId] = React.useContext(RandomContext)
    
    const GiftVoucher = ({coins_value, cash_value, company_name, company_logo, redeemed_at}) => {
        return(
            <View style = {[mySummaryStyle.activityComponent,{flexDirection : 'row' ,}]}>
                <View style = {{height : 50 , width : 50 , }}>
                    <Image 
                        source = {{uri : company_logo + "?" + new Date()}}
                        style = {{height : 50 , width : 50 , }}
                    />
                </View>
                <View style = {{flex : 1, marginLeft : 10 , }}>
                    <View style = {mySummaryStyle.activity}>
                        <Text style = {mySummaryStyle.activityText}>Redeemed <Text style = {[mySummaryStyle.coinsValue,{color : colorsArray[(randomNo+id)%(colorsArray.length-1)]}]}>{coins_value}</Text> <FontAwesome5 name = "coins" color = "#D9A760"/> for <Text style = {mySummaryStyle.username}>Rs.{cash_value} {company_name} Gift Voucher</Text> </Text>
                    </View>
                    <View style = {mySummaryStyle.date}>
                        <Text style = {mySummaryStyle.dateText}>{moment(redeemed_at,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>
                    </View>
                </View>
            </View>
        )
    }
        
    return(
        <GiftVoucher 
            coins_value = {item.coins_value} 
            cash_value = {item.cash_value}
            company_name = {item.company_name}
            company_logo = {item.company_logo}
            redeemed_at = {item.redeemed_at}
        /> 
    )
}




const MyRedeems = ({user_id}) => {
  
    const [burnRewards,setBurnRewards] = React.useState([])
    
    React.useEffect(()=>{  
            Amplitude.logEventAsync('MY REDEEMS')          
            axios.get(URL + "/rewards/user/burn",{params:{user_id : user_id}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
       // console.log(responseData)
                setBurnRewards(responseData)
            })
            .catch(function(error) {
              
            });

    },[])
    

    const BurnItem = ({item,index}) => (
        <View key = {index.toString()}>
            <BurnItemComponent item = {item} id = {index}/>
        </View> 
    )

    const emptyComponent = () => {
        return(
            <View style = {{padding : 20 }}>
                <Text>You haven't redeemed your coins yet. Click on REDEEM NOW in the bottom for exciting gift vouchers</Text>
            </View>
        )
    }


    return (
        <View>
            <FlatList
                keyExtractor = {(item,index)=>index.toString()}
                style = {{marginTop : 0,  }}
                contentContainerStyle = {{paddingBottom : 80}}
                data = {burnRewards}
                renderItem = {BurnItem}
                showsVerticalScrollIndicator = {false}
                ListEmptyComponent={emptyComponent}
                />
        </View>
    )
}

export default MyRedeems

const styles = StyleSheet.create({})
