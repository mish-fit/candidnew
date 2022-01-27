import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Easing,
  ScrollView,
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import * as Amplitude from 'expo-analytics-amplitude';
import { RandomContext } from '../Exports/Context';
import { backArrow, theme } from '../Exports/Colors';
import { URL } from '../Exports/Config';
import { add } from '../../Styles/Add';

function AddProduct() {
  const [source, setSource] = React.useState(true);
  const [buyURL, setBuyURL] = React.useState('https://www.amazon.in');

  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();
  const [buy_url, set_buy_url] = React.useState(
    route?.params?.buy_url ? route?.params?.buy_url : ''
  );
  const [randomNo, userId] = React.useContext(RandomContext);
  const [myRewardsCoins, setMyRewardsCoins] = React.useState(7000);

  const [comment, setComment] = React.useState('');

  const [primaryCommentSubmitted, setPrimaryCommentSubmitted] = React.useState(false);
  const [secondaryCommentSubmitted, setSecondaryCommentSubmitted] = React.useState(false);

  const [inputFocus, setInputFocus] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [searchTextProduct, setSearchTextProduct] = React.useState('');
  const [searchArray, setSearchArray] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [plusDisable, setPlusDisable] = React.useState(true);

  const [body, setBody] = React.useState({
    user_name: '',
    user_id: userId.slice(1, 13),
    user_image: '',
    category_id: 0,
    category_name: '',
    context_id: 0,
    context_name: '',
    product_id: 0,
    product_name: '',
    title: 'Public',
    feed_image: '',
    buy_url: 'https://www.amazon.in',
    comment: '',
    coupon: '',
  });

  React.useEffect(() => {
    if (buy_url) {
      setBody({ ...body, buy_url });
    }
    //  console.log("body in add product use effect", body)
    Amplitude.logEventAsync('ADD PRODUCT');
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    axios
      .get(`${URL}/user/info`, { params: { user_id: userId.slice(1, 13) } }, { timeout: 3000 })
      .then((res) => res.data)
      .then((responseData) => {
        setBody({
          ...body,
          user_name: responseData[0].user_name,
          coupon: responseData[0].coupon,
          user_image: responseData[0].user_profile_image,
        });
      })
      .catch((error) => {
        setSearchLoading(false);
        console.log(error);
      });

    axios
      .get(`${URL}/search/product`, { params: { product_text: '' } }, { timeout: 3000 })
      .then((res) => res.data)
      .then((responseData) => {
        //    console.log("SearchArray",responseData)
        setSearchLoading(false);
        setSearchArray(responseData);
        //    console.log("Reached Here response")
      })
      .catch((error) => {
        setSearchLoading(false);
        //    console.log("Reached Here error")
      });
  }, []);

  const onClickSearchItemChild = (product_name, product_id) => {
    //    console.log("body in add product select search", body)
    Amplitude.logEventWithPropertiesAsync('ADDED NEW PRODUCT', { product_name });
    setSearchTextProduct(product_name);
    //    console.log(product_name)
    navigation.navigate('AddCategory', { body, product_name, product_id });
  };

  const searchProduct = (text) => {
    if (text.length > 1) {
      setPlusDisable(false);
    }
    setSearchTextProduct(text);
    setSearchLoading(true);

    axios
      .get(`${URL}/search/product`, { params: { product_text: text } }, { timeout: 3000 })
      .then((res) => res.data)
      .then((responseData) => {
        //     console.log("SearchArray",responseData)
        setSearchLoading(false);
        setSearchArray(responseData);
        //    console.log("Reached Here response")
      })
      .catch((error) => {
        setSearchLoading(false);
        //    console.log("Reached Here error")
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Animated.View style={add.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={add.headerBack}>
          <AntDesign name="arrowleft" size={30} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={add.headerTitle} disabled>
          <Text style={add.headerTitleText}>Add Product</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={{ margin: 10, marginTop: 60 }}>
        <View style={add.element}>
          <Text style={add.heading}>Buy URL</Text>
          <TextInput
            placeholder="Share website link of the product. For supporting websites, visit How To Earn section "
            value={body.buy_url}
            onChangeText={(text) => setBody({ ...body, buy_url: text })}
            multiline
            style={{
              fontStyle: 'italic',
              color: '#999',
              marginTop: 5,
              borderBottomWidth: 1,
              borderBottomColor: '#AAA',
            }}
          />
        </View>
        <View style={add.element}>
          <Text style={add.heading}>Product Name</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'space-between',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#EEE',
              paddingHorizontal: 5,
            }}
          >
            <TextInput
              style={{ fontSize: 12 }}
              placeholder="Search for Product or Add Product"
              onChangeText={(text) => searchProduct(text)}
              value={searchTextProduct}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
            <TouchableOpacity
              style={{ padding: 2, paddingLeft: 10, paddingRight: 10 }}
              disabled={plusDisable}
              onPress={() => onClickSearchItemChild(searchTextProduct, 0)}
            >
              <AntDesign name="plus" size={24} color={theme} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={add.dropDownList} contentContainerStyle={{ paddingBottom: 60 }}>
          {searchArray.length
            ? searchArray.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={add.dropDownItem}
                  onPress={() => onClickSearchItemChild(item.product_name, item.product_id)}
                >
                  {item.product_image && item.product_image !== 'None' ? (
                    <Image source={{ uri: item.product_image }} style={add.dropDownItemImage} />
                  ) : (
                    <Avatar.Image
                      style={add.dropDownItemAvatar}
                      source={{
                        uri: `https://ui-avatars.com/api/?rounded=true&name=${item.product_name}&size=64&background=D7354A&color=fff&bold=true`,
                      }}
                      size={30}
                    />
                  )}
                  <View style={add.dropDownView}>
                    <Text style={add.dropDownText}>{item.product_name}</Text>
                  </View>
                </TouchableOpacity>
              ))
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
  );
}

export default AddProduct;

const styles = StyleSheet.create({});
