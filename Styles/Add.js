import {Dimensions, StyleSheet} from 'react-native'
import { colorsArray, theme, themeLight, themeLightest } from '../Screens/Exports/Colors'


export const add = StyleSheet.create({
    dropDownList : {marginBottom : 20,},
    dropDownItem : {marginTop : 10 , padding : 5, flexDirection : 'row' , borderWidth : 1, borderRadius : 10 , borderColor : '#EEE' },
    dropDownView : { justifyContent : 'center', marginLeft : 10,flex : 1, },
    dropDownItemImage : {width : 30, height : 30 , borderRadius : 30 , marginLeft : 5 },
    dropDownItemAvatar : {marginLeft : 5},
    dropDownText : {color : 'black'},
    heading : {
        fontWeight : 'bold',
        color : theme,
        fontSize : 18
    },
    element : {
        marginTop : 15, 
    },

    headerView : {
        backgroundColor : 'white', flex : 1 ,
        height : 50 , 
        position: 'absolute',  zIndex: 100, width: '100%',  left: 0,right: 0,
        flexDirection : 'row',  justifyContent : 'space-between', alignItems : 'center'},
    headerBack : {width: 40 , height : 40 , marginLeft : 20,
        borderRadius : 60 , justifyContent : 'center', alignItems : 'center' },
    headerTitle : {marginRight : 40,flex : 1 , justifyContent :'center', alignItems :'center'},
    headerTitleText : {fontWeight : 'bold', fontSize : 20, color : '#333'},
    headingFixed : {fontSize : 14 ,  color : 'black'},
    headingFixedLight : {fontSize : 15 , color : themeLight},
    headingFixedLightest : {fontSize : 13 , color : 'white', fontStyle :'italic',},
    elementFixed : {
        marginTop : 5,
        borderRadius : 0,
        backgroundColor : 'white',
        padding : 5,
        paddingLeft : 10,
    },
    elementFixedLight : {
        marginTop : 5,
        borderRadius : 10,
        backgroundColor : 'white',
        padding : 5 ,
        paddingLeft : 10,
    },
    elementFixedLightest : {
        marginTop : 5,
        borderRadius : 20,
        padding : 5 ,
        paddingLeft : 5,
        backgroundColor : '#AAA',
        borderRadius : 10,
    },
    elementVariable : {
        marginTop : 20,
    },
    fixedView : {
       marginLeft : 10,
    },
    buttonView : {
        justifyContent : 'flex-end',
        alignItems : 'flex-end',

        width : Dimensions.get('screen').width
    },
    button : { 
        backgroundColor : theme , 
        marginTop : 30,
        borderRadius : 10 , 
        width : Dimensions.get('screen').width * 0.4 , 
        alignItems :'center',
        marginRight : 20 , 
        padding : 5 , 
        justifyContent : 'center'
    },
    buttonText : { color : '#EEE', }

})