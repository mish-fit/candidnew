import { NavigationContainer , useNavigation , useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Animated, Text, View,Image, TextInput, TouchableOpacity, Easing, Pressable , ScrollView, Dimensions} from 'react-native'
import {AntDesign , FontAwesome5, Entypo,MaterialCommunityIcons} from 'react-native-vector-icons'
import { RandomContext } from '../Exports/Context'
import { alttheme, backArrow, background, colorsArray, themeLightest } from '../Exports/Colors'
import LottieView from 'lottie-react-native';
import {theme} from '../Exports/Colors'
import axios from 'axios'
import {URL} from '../Exports/Config'
import { add } from '../../Styles/Add'
import {Avatar} from 'react-native-paper'
import * as Amplitude from 'expo-analytics-amplitude';
import { Rating, AirbnbRating } from 'react-native-ratings';

import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import * as ImagePicker from 'expo-image-picker';
import { s3URL, uploadImageOnS3 } from '../Exports/S3'


const AddReview = () => {


    const navigation = useNavigation()
    const route = useRoute()

    const [source,setSource] = React.useState(true)
    const [buyURL, setBuyURL] = React.useState("www.amazon.in")

    const progress = React.useRef(new Animated.Value(0)).current

    const [url,setURL] = React.useState(route?.params?.buy_url ? route?.params?.buy_url : "")
    const [randomNo,userId] = React.useContext(RandomContext)
    const [myRewardsCoins,setMyRewardsCoins] = React.useState(0)

    const [comment,setComment] = React.useState("")

    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")
    const [searchTextProduct,setSearchTextProduct] = React.useState("")
    const [searchArray,setSearchArray] = React.useState([])
    const [searchLoading,setSearchLoading] = React.useState(false)
    const [plusDisable,setPlusDisable] = React.useState(true)
    
    const [productSelected,setProductSelected] = React.useState(false)
    const [ratingSelected,setRatingSelected] = React.useState(false)
    const [detailedReviewAdde,setDetailedReviewAdded] = React.useState(false)

    const [showLongComment,setShowLongComment] = React.useState(false)

    const [title,setTitle] = React.useState("")
    const [postImage,setPostImage] = React.useState("")
    const [postImageShown,setPostImageShown] = React.useState("")
    const [imageId,setImageId] = React.useState(nanoid(10))

    const [submitted,setSubmitted] = React.useState(false)
    const [imageAdded,setImageAdded] = React.useState(false)

    const [plusCategoryDisable,setPlusCategoryDisable] = React.useState(true)
    const [inputCategoryFocus,setInputCategoryFocus] = React.useState(false)
    const [searchCategoryText,setSearchCategoryText] = React.useState("")
    const [searchTextCategory,setSearchTextCategory] = React.useState("")
    const [searchCategoryArray,setSearchCategoryArray] = React.useState([])
    const [searchCategoryLoading,setSearchCategoryLoading] = React.useState(false)

    const [contextArray,setContextArray] = React.useState([])
    const [contextsChecked,setContextsChecked] = React.useState([])

    const [categorySelected,setCategorySelected] = React.useState(false)
    const [addContextFlag,setAddContextFlag] = React.useState(false)
    const [newContext,setNewContext] = React.useState("")
    const [plusContextDisable,setPlusContextDisable] = React.useState(true)
    const [titleInputFocus,setTitleInputFocus] = React.useState(false)
    const [ratingValue,setRatingValue] = React.useState(0)
    const [newProduct,setNewProduct] = React.useState(false)

    const [body,setBody] = React.useState({
        "user_name": "",
        "user_id": userId.slice(1,13),
        "user_image": "",
        "category_id": 0,
        "category_name": "",
        "context_id": 0,
        "context_name": "",
        "product_id": 0,
        "product_name": "",
        "title": "",
        "feed_image": "",
        "buy_url": "www.amazon.in",
        "comment": "",
        "coupon" : ""
    })

    React.useEffect(()=>{
        
        console.log("body in add product use effect", body)
        Amplitude.logEventAsync('ADD PRODUCT')
        Animated.timing(progress, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver : true
            },).start();

        axios.get(URL + "/user/info", {params:{user_id : userId.slice(1,13) }} , {timeout : 3000})
        .then(res => res.data).then(function(responseData) {
            console.log(responseData)
            if (url && url != "") {
                setBody({...body, user_name : responseData[0].user_name , coupon : responseData[0].coupon , user_image : responseData[0].user_profile_image, buy_url : url})
            } else {
            setBody({...body, user_name : responseData[0].user_name , coupon : responseData[0].coupon , user_image : responseData[0].user_profile_image})
        }})
        .catch(function(error) {
            setSearchLoading(false)
            console.log(error)
        });  
    },[])
    
    const onClickSearchItemChild = (name, id) => {
        console.log("body in add product select search", name , id)
        Amplitude.logEventWithPropertiesAsync('ADDED NEW PRODUCT', {product_name : name })
        setProductSelected(true)

        if(id > 0) {
            setBody((body) => ({...body, product_name : name, product_id : id}))
            axios.get(URL + "/search/category/byproduct", {params:{product_id : id }} , {timeout : 3000})
            .then(res => res.data).then(function(responseData) {
               console.log("search category by product",responseData)
               setSearchLoading(false)
                if(responseData.length) { 
                    setSearchTextProduct(responseData[0].product_name)
                    onClickSearchItemChildCategory(responseData[0].category_name,responseData[0].category_id)
                } else {
                    setSearchTextProduct(name)
                    setBody({...body, product_name : name, product_id : id})
                }
            })
            .catch(function(error) {
                setBody({...body, product_name : name, product_id : id})
                setSearchLoading(false)
            });
    
            axios.get(URL + "/search/category", {params:{product_text : "" }} , {timeout : 3000})
            .then(res => res.data).then(function(responseData) {
                
                setSearchLoading(false)
                setSearchCategoryArray(responseData)
            })
            .catch(function(error) {
                setSearchLoading(false)
            });
        } 
        else {
            axios.get(URL + "/isexists/product", {params:{product_name : body.product_name}} , {timeout : 3000})
            .then(res => res.data).then(function(responseData) {
                setSearchCategoryLoading(false)
                if(responseData.length) {
                    setBody((body) => ({...body, product_name : responseData[0].product_name, product_id : responseData[0].product_id}))
                    setSearchTextCategory(responseData[0].category_name)
                    onClickSearchItemChildCategory(responseData[0].category_name,responseData[0].category_id)
                } else {
                    setBody((body) => ({...body, product_name : name}))
                    setNewProduct(true)
                }
            })
            .catch(function(error) {
               
            });
        }
    }

    const searchProduct = (text) => {
        console.log(productSelected)
        if(text.length > 1) {
            setPlusDisable(false)
        }
        setSearchTextProduct(text)
        setSearchLoading(true)
        axios.get(URL + "/search/product", {params:{product_text : text }} , {timeout : 3000})
          .then(res => res.data).then(function(responseData) {
              
              setSearchLoading(false)
              setSearchArray(responseData)
        })
        .catch(function(error) {
              setSearchLoading(false)
        });
    }


    const onClickSearchItemChildCategory = (category_name, category_id ) => {
        if(category_id > 0) {
            console.log("Category BOdy", body)
            Amplitude.logEventWithPropertiesAsync('ADDED NEW CATEGORY', {category_name : category_name })
            setSearchTextCategory(category_name)
            setCategorySelected(true)
            setBody((body) => ({...body, category_name : category_name , category_id : category_id}))
            axios.get(URL + "/search/context", {params:{context_text : "" , category_name : category_name }} , {timeout : 3000})
            .then(res => res.data).then(function(responseData) {
                console.log("SearchArray",responseData)
                setContextArray(responseData)
            })
            .catch(function(error) {
                console.log(error)
            });
        } else {
            setSearchTextCategory(category_name)
            setCategorySelected(true)
            setBody((body) => ({...body, category_name : category_name }))
        }
       
    }

    const searchCategory = (text) => {
        if(text.length > 1) {
            setPlusCategoryDisable(false)
        }
        setSearchTextCategory(text)
        setSearchCategoryLoading(true)
        axios.get(URL + "/search/category", {params:{category_text : text }} , {timeout : 3000})
          .then(res => res.data).then(function(responseData) {
                setSearchCategoryLoading(false)
                setSearchCategoryArray(responseData)
        })
        .catch(function(error) {
              setSearchCategoryLoading(false)
        });
    }



    const rating = (rating) => {
            setRatingValue(rating)
            console.log(body)
            setBody({...body, rating : rating})
            setRatingSelected(true)
    }

    const longReview = () => {
        setShowLongComment(true)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        console.log(result.uri)
    
        if (!result.cancelled) {
            setImageAdded(true)
            setPostImageShown(result.uri)
            setBody({...body,feed_image : s3URL + "post/"+ imageId  });
            uploadImageOnS3("post/"+ imageId , result.uri)
        }
    }; 

    const done = () => {
        setBody({...body, comment : comment})
        setShowLongComment(false)
    }

    const longReviewBack = () => {
        setShowLongComment(false)
        setComment("")
    }

    const next = () => {
        console.log("NEXT ", body)
        if(newProduct && body.category_id > 0 && body.category_name.length > 1 && body.product_name.length > 1) {
            const addNewProductBody = {
                "category_id": body.category_id,
                "category_name": body.category_name,
                "product_name": body.product_name
            }
            axios({
                method: 'post',
                url: URL + '/add/product',
                data: addNewProductBody
            }, {timeout : 5000})
            .then(res => {
                console.log("product id new created" , res.data )
                navigation.navigate("AltAdd1", {body : body , product_id : res.data})
            })
            .catch((e) => console.log(e))
        }
        else {
            navigation.navigate("AltAdd1", {body : body , product_id : body.product_id})
        }

        
    }

    const contextCheckFunc = (index, id,name, type ) => {
        console.log(body)
        if(type) {
            let newArray = []
            newArray[index] = true
            setContextsChecked([...newArray])
            setBody({...body, context_name : name , context_id : id})
        } else {
            let newArray = []
            newArray[index] = false
            setContextsChecked([...newArray])
            setBody({...body, context_name : "" , context_id : 0})
        }
    }


    const addContext = () => {
        setAddContextFlag(true)
        let newArray = []
        setContextsChecked([...newArray])

    }

    const addContextDone = () => {
        
        setAddContextFlag(false)
        axios.get(URL + "/isexists/context", {params:{context_name : newContext , category_id : body.category_id}} , {timeout : 3000})
        .then(res => res.data).then(function(responseData) {
            if(responseData.length) {
                alert("Context already exists")
            } else { 
                const addNewContextBody = {
                    "category_id": body.category_id,
                    "category_name": body.category_name,
                    "context_name": newContext
                }
                console.log("context does not exists", addNewContextBody)
                axios({
                    method: 'post',
                    url: URL + '/add/context',
                    data: addNewContextBody
                  }, {timeout : 5000})
                .then(res => {
                    let newArray = []
                    newArray[contextArray.length] = true
                    console.log("context id new created" , res.data )
                    setBody({...body, context_id : res.data, context_name : newContext})
                    setContextArray([...contextArray, {context_id : res.data, context_name : newContext}])
                    setContextsChecked([...newArray])
                })
                .catch((e) => console.log(e))

            }
        })
        .catch(function(error) {
           
        });

    

    }

    

    return (
        !showLongComment ? <View style = {{flex : 1 ,backgroundColor : 'white'}}>
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
                    <Text style = {add.headerTitleText}>Post Review</Text>
                </TouchableOpacity>
            </Animated.View>
            <View style = {{marginTop : 50 , borderTopColor : "#EEE" , borderTopWidth : 2, flex : 1}}>
                <View style={add.element}>
                    {!productSelected ? 
                    <View style = {{paddingVertical: 10, marginHorizontal : 5, flexDirection : 'row', justifyContent : 'space-between', borderRadius : 10, borderWidth : 1, borderColor : '#888', paddingHorizontal : 5}}>
                        <TextInput style = {{fontSize : 16,}}
                            placeholder = "Search / Add Product by clicking '+'"
                            onChangeText = {(text) => searchProduct(text)}
                            value = {searchTextProduct}
                            onFocus = {()=>setInputFocus(true)}
                            onBlur = {()=>setInputFocus(false)}
                        />
                        <TouchableOpacity 
                            style = {{padding : 2 ,  marginRight : 10, justifyContent :'center', alignItems:'center',}}
                            disabled = {plusDisable}
                            onPress = {()=>onClickSearchItemChild(searchTextProduct,0)} >
                            <AntDesign name = "plus" size = {24} color = {theme} />
                        </TouchableOpacity>
                    </View> :
                    <View style = {{paddingVertical: 5, marginHorizontal : 5, flexDirection : 'row', justifyContent : 'space-between',  paddingHorizontal : 5}}>
                        <Text style = {{color : theme, fontSize : 18 , fontWeight : 'bold'}}>{searchTextProduct}</Text>
                        <TouchableOpacity 
                            style = {{padding : 2 ,  marginRight : 10, justifyContent :'center', alignItems:'center',}}
                            onPress = {()=>setProductSelected(false)} >
                            <AntDesign name = "edit" size = {15} color = {theme} />
                        </TouchableOpacity>
                    </View>
                    }
                </View>
                { searchArray.length && !productSelected ?
                <ScrollView style = {add.dropDownList} contentContainerStyle = {{paddingBottom : 60}}>
                {
                searchArray.map((item,index)=>{
                    return(
                    <TouchableOpacity 
                                key = {index.toString()}
                                style = {add.dropDownItem}
                                onPress = {()=>onClickSearchItemChild(item.product_name,item.product_id)} >
                        {item.product_image && item.product_image != "None" && item.product_image != "" ?
                        <Image source = {{uri : item.product_image}} style = {add.dropDownItemImage}/> :
                        <Avatar.Image style = {add.dropDownItemAvatar}
                        source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.product_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                        size={30}/> }  
                        <View style = {add.dropDownView}>
                            <Text style = {add.dropDownText}>{item.product_name}</Text>
                        </View>
                    </TouchableOpacity>
                       )})
                }
                </ScrollView> 
                : null}
               
                {productSelected && !categorySelected ? 
                <View style = {{paddingVertical: 10, marginHorizontal : 5, flexDirection : 'row', justifyContent : 'space-between', borderRadius : 10, borderWidth : 1, borderColor : '#888', paddingHorizontal : 5, marginTop : 5,}}>
                    <TextInput style = {{fontSize : 14,}}
                        placeholder = "Search / Add Category by clicking '+'"
                        onChangeText = {(text) => searchCategory(text)}
                        value = {searchTextCategory}
                        onFocus = {()=>setInputFocus(true)}
                        onBlur = {()=>setInputFocus(false)}
                    />
                    <TouchableOpacity 
                        style = {{padding : 2 ,  marginRight : 10, justifyContent :'center', alignItems:'center',}}
                        disabled = {plusDisable}
                        onPress = {()=>onClickSearchItemChildCategory(searchTextCategory,0)} >
                        <AntDesign name = "plus" size = {24} color = {theme} />
                    </TouchableOpacity>
                </View> : productSelected && categorySelected ?
                <View style = {{marginHorizontal: 5, marginTop : 5,  paddingVertical: 5,  flexDirection : 'row', justifyContent : 'space-between',  paddingHorizontal : 5 , borderRadius : 5, borderWidth : 1, borderColor : "#EEE", backgroundColor : 'rgba(200,200,200,0.2)'}}>
                    <Text style = {{color : theme, fontSize : 16 , fontWeight : 'bold'}}>{searchTextCategory}</Text>
                    <TouchableOpacity 
                        style = {{padding : 2 ,  marginRight : 10, justifyContent :'center', alignItems:'center',}}
                        onPress = {()=>setCategorySelected(false)} >
                        <AntDesign name = "edit" size = {15} color = {theme} />
                    </TouchableOpacity>
                </View> : null
                }
                { searchCategoryArray.length && productSelected && !categorySelected ?
                <ScrollView style = {add.dropDownList} contentContainerStyle = {{paddingBottom : 60}}>
                <Text style = {{fontWeight : 'bold', marginTop : 5, marginLeft : 5 }}>Top Categories</Text>
                {
                searchCategoryArray.map((item,index)=>{
                    return(
                        <TouchableOpacity 
                                    key = {index.toString()}
                                    style = {add.dropDownItem}
                                    onPress = {()=>onClickSearchItemChildCategory(item.category_name,item.category_id)} >
                            {item.category_image && item.category_image != "None" && item.category_image != "" ?
                            <Image source = {{uri : item.category_image}} style = {add.dropDownItemImage}/> :
                            <Avatar.Image style = {add.dropDownItemAvatar}
                            source={{uri: 'https://ui-avatars.com/api/?rounded=false&name='+ item.category_name + '&size=64&background=D7354A&color=fff&bold=true'}} 
                            size={30}/> }  
                            <View style = {add.dropDownView}>
                                <Text style = {add.dropDownText}>{item.category_name}</Text>
                            </View>
                            
                        </TouchableOpacity>
                       )})
                }
                </ScrollView> : null}


                {productSelected && categorySelected? 
                <View style = {{marginHorizontal : 5, marginVertical : 5, }}>
                {contextArray.length > 0 ? 
                <View style = {{borderColor : "#AAA" , borderWidth : 1 , borderRadius : 3, padding : 5, }} >
                    <Text style = {{fontWeight : 'bold' , marginTop : 0 , color : "#555", fontSize : 15, textAlign : 'left', marginBottom : 10, }}>Usage Context</Text>
                    <View style = {{flexDirection : 'row' , flexWrap : 'wrap' , }}>
                    {contextArray.map((item,index)=>{
                        return(
                        contextsChecked[index]  == true ?
                            <Pressable 
                            key = {index.toString()}
                            android_ripple = {{color : themeLightest}}
                            onPress = {()=> contextCheckFunc(index, item.context_id , item.context_name, false)}
                            style = {{backgroundColor : themeLightest ,flexDirection : 'row' , borderWidth : 1, borderColor : themeLightest, borderRadius : 10 , padding : 5 , alignItems : 'center', marginRight : 5 , marginTop : 5,paddingHorizontal : 10, }}>
                                <Text style = {{color : theme, fontWeight : 'bold'}}>{item.context_name}</Text> 
                            </Pressable>:
                            <Pressable 
                            key = {index.toString()}
                            onPress = {()=> contextCheckFunc(index, item.context_id,   item.context_name , true)}
                            android_ripple = {{color : themeLightest}}
                            style = {{backgroundColor : 'white', flexDirection : 'row' , borderRadius : 10 , borderWidth : 1, borderColor : '#AAA', padding : 5 , marginRight : 5, marginTop : 5, paddingHorizontal : 10, }}>
                                <Text style = {{color : 'black' }}>{item.context_name}</Text>
                            </Pressable>
                    )                  
                    })}
                    {!addContextFlag ?
                    <TouchableOpacity 
                    onPress = {addContext}
                    style = {{flexDirection : 'row' , borderRadius : 10 , padding : 5 , alignItems : 'center', marginRight : 5 , marginTop : 5,paddingHorizontal : 10,}}>
                        <Text style = {{color : alttheme, fontWeight : 'bold'}}>Add Context</Text>
                    </TouchableOpacity> : 
                    <View style = {{flexDirection : 'row', justifyContent : 'space-between' , width : Dimensions.get('screen').width-25 ,
                    borderRadius : 10 , borderWidth : 1, borderColor : '#AAA', padding : 5 , marginTop : 5,
                     }}>
                        <TextInput 
                        placeholder = "Context Name"
                        value = {newContext}
                        onChangeText = {(text)=>{
                            if(text.length>1) {
                                setPlusContextDisable(false)
                            } else {
                                setPlusContextDisable(true)
                            }
                            setNewContext(text)
                        }}
                        multiline
                        style = {{fontStyle : 'normal', color : '#555' ,  }} />
                        <TouchableOpacity 
                            style = {{padding : 2 ,  marginRight : 10, justifyContent :'center', alignItems:'center',}}
                            disabled = {plusContextDisable}
                            onPress = {addContextDone} >
                            {plusContextDisable ?
                            <AntDesign name = "plus" size = {24} color = {"#DDD"} /> :
                            <AntDesign name = "plus" size = {24} color = {alttheme} /> }
                        </TouchableOpacity>
                    </View>
                    }
                    </View>
                    </View>
                    : null}
                    
                    <View style = {{marginTop : 20}}>
                        <Text style = {{fontWeight : 'bold', fontSize : 18, textAlign : 'center', color : "#555"}}>Rating</Text>
                        <View style = {{marginTop : 10}}>
                            <AirbnbRating
                            ratingContainerStyle = {{backgroundColor : 'transparent'}}
                            defaultRating = {ratingValue}
                            size={30}
                            showRating = {false}
                            count = {5}
                            unSelectedColor = "#DDD"
                            onFinishRating = {rating}
                            />
                        </View>
                        <View style = {{marginTop : 20, borderColor : "#AAA", borderWidth : 1, padding : 10 , borderRadius : 3}}>
                            <TextInput style = {{fontSize : 14, flexWrap : 'wrap', textAlignVertical: 'top', fontWeight : 'bold', color : "#555"}}
                                placeholder = "Most important thing about this product in 250 characters or less"
                                onChangeText = {(text) => {
                                    setBody({...body, title : text})
                                    setTitle(text)
                                }}
                                value = {title}
                                numberOfLines={4}
                                multiline={true}
                                onFocus={()=>setTitleInputFocus(true)}
                                onBlur={()=>setTitleInputFocus(false)}
                            />
                        </View>
                        {imageAdded ? <TouchableOpacity onPress = {pickImage}
                            style = {{flexDirection : 'row' ,
                            borderRadius : 2, marginTop : 30, height : 50, borderWidth : 1 , borderColor : '#EEE', paddingHorizontal : 10,justifyContent : 'space-between',
                            alignItems:'center'}}>
                            <Text style = {{color : alttheme, fontWeight : 'bold', textAlign : 'left', marginLeft : 0, fontSize : 15}}>
                            Image Added
                            </Text>
                            <Image source = {{uri : postImageShown}} 
                            style = {{
                                width : 40,
                                height: 40,
                                borderRadius : 5, 
                            }} 
                            />
                        </TouchableOpacity>:
                        <TouchableOpacity onPress = {pickImage}
                            style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : 'rgba(200,200,200,0.2)' ,
                            borderRadius : 2, padding : 5, marginTop : 30, height : 50, 
                            alignItems:'center'}}>
                            <MaterialCommunityIcons name = "image-plus" size = {30} color = "#666"/>
                            <Text style = {{color : "#222", fontWeight : 'bold',textAlign : 'left', marginLeft : 10,}}>
                                Pick Image from Gallery
                            </Text>
                        </TouchableOpacity>
                        }
                        <TouchableOpacity onPress = {longReview}
                            style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                            borderRadius : 2, padding : 5, marginTop : 10, height : 50, justifyContent: 'space-between', 
                            alignItems:'center'}}>
                            <Text style = {{color : "#999"}}>
                                Add a detailed review (More than 500 characters)
                            </Text>

                            <TouchableOpacity 
                            style = {{ paddingTop : 2, paddingBottom : 2, paddingLeft : 5, paddingRight: 5, justifyContent : 'center' , alignItems : 'center', borderRadius : 5 }}
                            onPress = {longReview}
                            >
                            <Entypo name = "text-document" size = {20} color = {theme} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View> : null }
                {productSelected && categorySelected && ratingSelected ? 
                <View style = {{justifyContent : 'flex-end', alignItems :'flex-end', marginTop : 15,marginRight : 10}}>
                <TouchableOpacity 
                disabled = {submitted}
                onPress = {next}
                style = {{backgroundColor : theme, borderRadius : 5 , width : Dimensions.get('screen').width * 0.3, padding : 10, justifyContent :'center', alignItems : 'center'}}>
                    <Text style = {{color : 'white', fontWeight : 'bold' }}>Next</Text>
                </TouchableOpacity>
                </View>
                 : null
                }
            </View>
        </View> :
        <View style = {{flex : 1 ,backgroundColor : 'white'}}>
            <Animated.View 
        style = {add.headerView}>
                <TouchableOpacity 
                onPress = {longReviewBack}
                style = {add.headerBack}>
                    <AntDesign name = "arrowleft" size = {30} color = {backArrow}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {add.headerTitle}
                    disabled
                    >
                    <Text style = {add.headerTitleText}>Post Review (1/2)</Text>
                </TouchableOpacity>
        </Animated.View>
        <View style = {{marginTop : 50 , borderTopColor : "#EEE" , borderTopWidth : 2, flex : 1}}>
            <View style={{}}>
                <TextInput 
                    style = {{color : "#555", fontSize : 15, marginTop : 20 , padding : 10 , textAlign : 'left' ,   textAlignVertical : 'top'}}
                    multiline
                    numberOfLines = {20}
                    autoFocus
                    onChangeText = {(text)=>setComment(text)}
                    value={comment}
                />
            </View>
            <View  style = {{position : 'absolute' , bottom : 30 , right : 40 }}>
                <TouchableOpacity 
                style = {{borderRadius : 5,}}
                onPress = {done}>
                    <Text style = {{fontWeight : 'bold' , color: theme, fontSize : 20}}>DONE</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    )
}

export default AddReview

const styles = StyleSheet.create({
   
})