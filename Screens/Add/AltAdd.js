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
  Dimensions,
} from 'react-native';
import { AntDesign, Entypo, MaterialCommunityIcons } from 'react-native-vector-icons';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import * as Amplitude from 'expo-analytics-amplitude';
import { AirbnbRating } from 'react-native-ratings';

import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import * as ImagePicker from 'expo-image-picker';
import { add } from '../../Styles/Add';
import { URL } from '../Exports/Config';
import { theme, alttheme, backArrow } from '../Exports/Colors';
import { RandomContext } from '../Exports/Context';
import { s3URL, uploadImageOnS3 } from '../Exports/S3';

function AltAdd() {
  const navigation = useNavigation();
  const route = useRoute();

  const [source, setSource] = React.useState(true);
  const [buyURL, setBuyURL] = React.useState('https://www.amazon.in');

  const progress = React.useRef(new Animated.Value(0)).current;

  const [url, setURL] = React.useState(route?.params?.buy_url ? route?.params?.buy_url : '');
  const [randomNo, userId] = React.useContext(RandomContext);
  const [myRewardsCoins, setMyRewardsCoins] = React.useState(0);

  const [comment, setComment] = React.useState('');

  const [inputFocus, setInputFocus] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [searchTextProduct, setSearchTextProduct] = React.useState('');
  const [searchArray, setSearchArray] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [plusDisable, setPlusDisable] = React.useState(true);

  const [productSelected, setProductSelected] = React.useState(false);
  const [ratingSelected, setRatingSelected] = React.useState(false);
  const [detailedReviewAdde, setDetailedReviewAdded] = React.useState(false);

  const [showLongComment, setShowLongComment] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [postImage, setPostImage] = React.useState('');
  const [postImageShown, setPostImageShown] = React.useState('');
  const [imageId, setImageId] = React.useState(nanoid(10));

  const [submitted, setSubmitted] = React.useState(false);
  const [imageAdded, setImageAdded] = React.useState(false);

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
    title: '',
    feed_image: '',
    buy_url: 'https://www.amazon.in',
    comment: '',
    coupon: '',
  });

  React.useEffect(() => {
    //   console.log("body in add product use effect", body)
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
        //      console.log(responseData)
        if (url && url != '') {
          setBody({
            ...body,
            user_name: responseData[0].user_name,
            coupon: responseData[0].coupon,
            user_image: responseData[0].user_profile_image,
            buy_url: url,
          });
        } else {
          setBody({
            ...body,
            user_name: responseData[0].user_name,
            coupon: responseData[0].coupon,
            user_image: responseData[0].user_profile_image,
          });
        }
      })
      .catch((error) => {
        setSearchLoading(false);
        console.log(error);
      });
  }, []);

  const onClickSearchItemChild = (product_name, product_id) => {
    //     console.log("body in add product select search", body)
    Amplitude.logEventWithPropertiesAsync('ADDED NEW PRODUCT', { product_name });
    setBody({ ...body, product_name, product_id });
    setSearchTextProduct(product_name);
    setProductSelected(true);
  };
  const searchProduct = (text) => {
    //    console.log(productSelected)
    if (text.length > 1) {
      setPlusDisable(false);
    }
    setSearchTextProduct(text);
    setSearchLoading(true);
    axios
      .get(`${URL}/search/product`, { params: { product_text: text } }, { timeout: 3000 })
      .then((res) => res.data)
      .then((responseData) => {
        //         console.log(responseData)
        setSearchLoading(false);
        setSearchArray(responseData);
      })
      .catch((error) => {
        setSearchLoading(false);
      });
  };

  const rating = (rating) => {
    setBody({ ...body, rating });
    setRatingSelected(true);
  };

  const longReview = () => {
    setShowLongComment(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //   console.log(result.uri)

    if (!result.cancelled) {
      setImageAdded(true);
      setPostImageShown(result.uri);
      setBody({ ...body, feed_image: `${s3URL}post/${imageId}` });
      uploadImageOnS3(`post/${imageId}`, result.uri);
    }
  };

  const done = () => {
    setBody({ ...body, comment });
    setShowLongComment(false);
  };

  const longReviewBack = () => {
    setShowLongComment(false);
    setComment('');
  };

  const next = () => {
    navigation.navigate('AltAdd1', { body });
  };

  return !showLongComment ? (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Animated.View style={add.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={add.headerBack}>
          <AntDesign name="arrowleft" size={30} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={add.headerTitle} disabled>
          <Text style={add.headerTitleText}>Post Review (1/2)</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={{ marginTop: 50, borderTopColor: '#EEE', borderTopWidth: 2, flex: 1 }}>
        <View style={add.element}>
          {!productSelected ? (
            <View
              style={{
                paddingVertical: 10,
                marginHorizontal: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#888',
                paddingHorizontal: 5,
              }}
            >
              <TextInput
                style={{ fontSize: 16 }}
                placeholder="Search / Add Product by clicking '+'"
                onChangeText={(text) => searchProduct(text)}
                value={searchTextProduct}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
              />
              <TouchableOpacity
                style={{
                  padding: 2,
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={plusDisable}
                onPress={() => onClickSearchItemChild(searchTextProduct, 0)}
              >
                <AntDesign name="plus" size={24} color={theme} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                paddingVertical: 5,
                marginHorizontal: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ color: theme, fontSize: 15, fontWeight: 'bold' }}>
                {searchTextProduct}
              </Text>
              <TouchableOpacity
                style={{
                  padding: 2,
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setProductSelected(false)}
              >
                <AntDesign name="edit" size={15} color={theme} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {searchArray.length && !productSelected ? (
          <ScrollView style={add.dropDownList} contentContainerStyle={{ paddingBottom: 60 }}>
            {searchArray.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={add.dropDownItem}
                onPress={() => onClickSearchItemChild(item.product_name, item.product_id)}
              >
                {item.product_image && item.product_image != 'None' && item.product_image != '' ? (
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
            ))}
          </ScrollView>
        ) : null}
        {productSelected ? (
          <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
            <View>
              <AirbnbRating
                ratingContainerStyle={{ backgroundColor: 'transparent' }}
                defaultRating={0}
                size={30}
                showRating={false}
                count={5}
                unSelectedColor="#DDD"
                onFinishRating={rating}
              />
            </View>
            <View
              style={{
                marginTop: 20,
                borderColor: '#AAA',
                borderWidth: 1,
                padding: 10,
                borderRadius: 3,
              }}
            >
              <TextInput
                style={{
                  fontSize: 14,
                  flexWrap: 'wrap',
                  textAlignVertical: 'top',
                  fontWeight: 'bold',
                  color: '#555',
                }}
                placeholder="Most important thing about this product in 250 characters or less"
                onChangeText={(text) => {
                  setBody({ ...body, title: text });
                  setTitle(text);
                }}
                value={title}
                numberOfLines={4}
                multiline
              />
            </View>
            {imageAdded ? (
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flexDirection: 'row',
                  borderRadius: 2,
                  marginTop: 10,
                  height: 50,
                  borderWidth: 1,
                  borderColor: '#EEE',
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: alttheme,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginLeft: 0,
                    fontSize: 15,
                  }}
                >
                  Image Added
                </Text>
                <Image
                  source={{ uri: postImageShown }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 5,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#bbb',
                  backgroundColor: 'rgba(200,200,200,0.2)',
                  borderRadius: 2,
                  padding: 5,
                  marginTop: 10,
                  height: 50,
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="image-plus" size={30} color="#666" />
                <Text
                  style={{ color: '#222', fontWeight: 'bold', textAlign: 'left', marginLeft: 10 }}
                >
                  Pick Image from Gallery
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={longReview}
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: '#bbb',
                backgroundColor: '#EEE',
                borderRadius: 2,
                padding: 5,
                marginTop: 10,
                height: 50,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#999' }}>
                Add a detailed review (More than 500 characters)
              </Text>

              <TouchableOpacity
                style={{
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingLeft: 5,
                  paddingRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}
                onPress={longReview}
              >
                <Entypo name="text-document" size={20} color={theme} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ) : null}
        {productSelected && ratingSelected ? (
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginTop: 15,
              marginRight: 10,
            }}
          >
            <TouchableOpacity
              disabled={submitted}
              onPress={next}
              style={{
                backgroundColor: theme,
                borderRadius: 5,
                width: Dimensions.get('screen').width * 0.3,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Animated.View style={add.headerView}>
        <TouchableOpacity onPress={longReviewBack} style={add.headerBack}>
          <AntDesign name="arrowleft" size={30} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={add.headerTitle} disabled>
          <Text style={add.headerTitleText}>Post Review (1/2)</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={{ marginTop: 50, borderTopColor: '#EEE', borderTopWidth: 2, flex: 1 }}>
        <View style={{}}>
          <TextInput
            style={{
              color: '#555',
              fontSize: 15,
              marginTop: 20,
              padding: 10,
              textAlign: 'left',
              textAlignVertical: 'top',
            }}
            multiline
            numberOfLines={20}
            autoFocus
            onChangeText={(text) => setComment(text)}
            value={comment}
          />
        </View>
        <View style={{ position: 'absolute', bottom: 30, right: 40 }}>
          <TouchableOpacity style={{ borderRadius: 5 }} onPress={done}>
            <Text style={{ fontWeight: 'bold', color: theme, fontSize: 20 }}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default AltAdd;

const styles = StyleSheet.create({});
