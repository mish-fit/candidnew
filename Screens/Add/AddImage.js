import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { AirbnbRating } from 'react-native-ratings';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import * as Amplitude from 'expo-analytics-amplitude';
import { s3URL, uploadImageOnS3 } from '../Exports/S3';
import { add } from '../../Styles/Add';
import { URL } from '../Exports/Config';
import { backArrow, background } from '../Exports/Colors';
import { RandomContext } from '../Exports/Context';

function AddImage() {
  const [source, setSource] = React.useState(true);
  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();
  const [body, setBody] = React.useState(route?.params?.body ? route?.params?.body : {});
  const [contextName, setContextName] = React.useState(
    route?.params?.context_name ? route?.params?.context_name : ''
  );
  const [randomNo, userId] = React.useContext(RandomContext);
  const [comment, setComment] = React.useState('');
  const [productExists, setProductExists] = React.useState(true);
  const [contextExists, setContextExists] = React.useState(true);

  const [postImage, setPostImage] = React.useState('');
  const [postImageShown, setPostImageShown] = React.useState('');
  const [imageId, setImageId] = React.useState(nanoid(10));
  const [productId, setProductId] = React.useState('');
  const [contextId, setContextId] = React.useState('');
  const [isExistsProduct, setExistsProduct] = React.useState({});
  const [isExistsContext, setExistsContext] = React.useState({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //  console.log(result.uri)

    if (!result.cancelled) {
      setPostImageShown(result.uri);
      setBody({ ...body, feed_image: `${s3URL}post/${imageId}` });
      uploadImageOnS3(`post/${imageId}`, result.uri);
    }
  };

  React.useEffect(() => {
    //   console.log("IMAGE SCREEN", contextName)
    Amplitude.logEventAsync('ADD IMAGE');
    //   console.log("body in add image screen", body)
    // setBody({...body,context_name : contextName})
    pickImage();

    axios
      .get(
        `${URL}/isexists/product`,
        { params: { product_name: body.product_name, category_id: body.category_id } },
        { timeout: 3000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        if (responseData.length) {
          setProductExists(true);
          setExistsProduct(responseData[0]);
          setProductId(responseData[0].product_id);
        } else {
          setProductExists(false);
          const addNewProductBody = {
            category_id: body.category_id,
            category_name: body.category_name,
            product_name: body.product_name,
          };
          axios(
            {
              method: 'post',
              url: `${URL}/add/product`,
              data: addNewProductBody,
            },
            { timeout: 5000 }
          )
            .then((res) => {
              //      console.log("product id new created" , res.data )
              setExistsContext(addNewProductBody);
              setProductId(res.data);
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((error) => {});

    axios
      .get(
        `${URL}/isexists/context`,
        { params: { context_name: contextName, category_id: body.category_id } },
        { timeout: 3000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        if (responseData.length) {
          //  console.log("context exists", responseData[0].context_name , responseData[0].context_id)
          setContextExists(true);
          setContextId(responseData[0].context_id);
          setExistsContext(responseData[0]);
          //   setBody({...body,context_name :responseData[0].context_name, context_id:responseData[0].context_id})
        } else {
          setContextExists(false);
          const addNewContextBody = {
            category_id: body.category_id,
            category_name: body.category_name,
            context_name: contextName,
          };
          //    console.log("context does not exists", addNewContextBody)
          axios(
            {
              method: 'post',
              url: `${URL}/add/context`,
              data: addNewContextBody,
            },
            { timeout: 5000 }
          )
            .then((res) => {
              //    console.log("context id new created" , res.data )
              setExistsContext(addNewContextBody);
              setContextId(res.data);
              //     setBody({...body, context_id : res.data, context_name : contextName})
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((error) => {});
  }, []);

  const next = (rating) => {
    //   console.log("Body ins next ", body , "post image " , postImageShown , "rating" , rating , "contextExists ", isExistsContext , "productExists ", isExistsProduct , "context id" , contextId , "product id" , productId)
    navigation.navigate('AddComment', {
      body,
      contextId,
      productId,
      postImageShown,
      rating,
      contextExists: isExistsContext,
      productExists: isExistsProduct,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <View style={add.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={add.headerBack}>
          <AntDesign name="arrowleft" size={30} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={add.headerTitle} disabled>
          <Text style={add.headerTitleText}>Rate the Product</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 70 }}>
        <AirbnbRating
          ratingContainerStyle={{ backgroundColor: 'transparent' }}
          defaultRating={0}
          size={30}
          showRating={false}
          count={5}
          unSelectedColor="#DDD"
          onFinishRating={next}
        />
        <View style={[add.fixedView, { marginTop: 20 }]}>
          <View style={add.elementFixed}>
            <Text style={add.headingFixed}>{body.product_name}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20 }}>
            <View style={add.elementFixedLight}>
              <Text style={add.headingFixedLight}>{body.category_name}</Text>
            </View>
            <View style={add.elementFixedLightest}>
              <Text style={add.headingFixedLightest}>{contextName}</Text>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={{
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}
            onPress={pickImage}
          >
            {postImageShown && postImageShown != 'None' && postImageShown != '' ? (
              <ImageBackground
                source={{ uri: postImageShown }}
                style={{
                  width: Dimensions.get('screen').width * 0.92,
                  height: Dimensions.get('screen').width * 0.92,
                  marginLeft: Dimensions.get('screen').width * 0.01,
                  marginRight: Dimensions.get('screen').width * 0.01,
                }}
                imageStyle={{ borderRadius: 20 }}
              />
            ) : (
              <MaterialCommunityIcons name="image-plus" size={50} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        {/* <View  style = {add.buttonView}>
                    <TouchableOpacity 
                    style = {add.button}
                    onPress = {next}>
                        <Text style = {add.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View> */}
      </View>
    </View>
  );
}

export default AddImage;

const styles = StyleSheet.create({});
