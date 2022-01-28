import React, { useState } from 'react';
import {
  Animated,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  StyleSheet,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { useNavigation, useRoute } from '@react-navigation/native';

import { AntDesign, Entypo } from 'react-native-vector-icons';

import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';
import * as Amplitude from 'expo-analytics-amplitude';
import LinearGradient from 'react-native-linear-gradient';
import { backArrow, theme } from '../Exports/Colors';
import { s3URL, uploadImageOnS3 } from '../Exports/S3';
import { URL } from '../Exports/Config';

function ProfileImage() {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6);
  const navigation = useNavigation();
  const route = useRoute();
  const progress = React.useRef(new Animated.Value(0)).current;
  const [imageUrl, setImageUrl] = useState('');
  const [profileImageChange, setProfileImageChange] = useState(false);
  const [image, setImage] = React.useState(route.params?.image ? route.params?.image : '');

  const [phoneNumber, setPhoneNumber] = React.useState(route.params?.phoneNumber);
  const [userName, setUserName] = React.useState(route.params?.userName);
  const [refereeId, setRefereeId] = React.useState(
    route.params?.refereeId ? route.params?.refereeId : ''
  );
  const [refereeName, setRefereeName] = React.useState(route.params?.refereeName || '');
  const [coinsValue, setCoinsValue] = React.useState(route.params?.coinsValue || 0);
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmitOnboarding = () => {
    Amplitude.logEventAsync('NEW USER PROFILE SUBMITTED');
    setSubmitted(true);
    if (profileImageChange) {
      uploadImageOnS3(`${phoneNumber.slice(1, 13)}/profile`, image);
    }

    const userbody = {
      user_id: route.params?.phoneNumber.slice(1, 13),
      user_name: userName,
      user_profile_image: profileImageChange
        ? `${s3URL + (route.params?.phoneNumber || '').slice(1, 13)}/profile`
        : '',
      user_phone_number: route.params?.phoneNumber,
      user_gender: '',
      user_email: '',
      user_dob: '',
      expo_token: route.params?.expoToken,
      device_token: route.params?.deviceToken,
      instagram_user_name: '',
      country_name: 'India',
      state_name: '',
      city_name: '',
      pin_code: 0,
      twitter_user_name: '',
      social_handles: {},
      coupon: nanoid(),
    };
    //  console.log("USER BODY",userbody)

    const userPoints = {
      user_id: route.params?.phoneNumber.slice(1, 13),
      user_name: route.params?.userName,
      reward_type: 'completed Onboarding',
      coins_value: coinsValue,
      reward_type_id: 1,
      engaged_post_id: '',
      engaged_user_id: '',
      engaged_user_name: '',
      engaged_product_name: '',
    };

    const refereePoints = {
      user_id: refereeId,
      user_name: refereeName,
      reward_type: 'Signed up using your referral code',
      coins_value: coinsValue,
      reward_type_id: 2,
      engaged_post_id: '',
      engaged_user_id: '',
      engaged_product_name: '',
      engaged_user_name: userName,
    };

    //   console.log("USER POINTS",userPoints)
    //   console.log("REFEREE POINTS",refereePoints)

    axios
      .get(`${URL}/user/info`, { params: { user_id: phoneNumber.slice(1, 13) } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        if (responseData.length > 0) {
          axios({
            method: 'post',
            url: `${URL}/user/new`,
            data: userbody,
          })
            .then((res) => {
              ToastAndroid.show('Details updated', ToastAndroid.LONG);
              setTimeout(() => {
                navigation.navigate('Home', { source: 'Onboarding', body: userbody });
              }, 300);
            })
            .catch((e) => {
              ToastAndroid.show('Error updating details. Please try later', ToastAndroid.SHORT);
              setSubmitted(false);
            });
        } else {
          axios({
            method: 'post',
            url: `${URL}/user/new`,
            data: userbody,
          })
            .then((res) => {
              axios({
                method: 'post',
                url: `${URL}/rewards/earn`,
                data: userPoints,
              })
                .then((res) => {
                  //       console.log(res)
                })
                .catch((e) => {
                  console.log(e);
                });
              if (refereeId) {
                axios({
                  method: 'post',
                  url: `${URL}/rewards/earn`,
                  data: refereePoints,
                })
                  .then((res) => {
                    //          console.log(res)
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }

              ToastAndroid.show(`Hi ${userbody.user_name}`, ToastAndroid.LONG);
              setTimeout(() => {
                navigation.navigate('Home', { source: 'Onboarding', body: userbody });
              }, 300);
            })
            .catch((e) => {
              ToastAndroid.show('Error updating details. Please try later', ToastAndroid.SHORT);
              setSubmitted(false);
            });
        }
      })
      .catch((error) => {
        setSubmitted(false);
      });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      //   console.log(result.uri)
      setImage(result.uri);
      setProfileImageChange(true);
      //   console.log("I am reaching here")
    }
  };

  const pickProfilePhoto = () => {
    //  console.log("image picker")
    pickImage();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          height: 50,
          position: 'absolute',
          zIndex: 100,
          width: '100%',
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 30,
            height: 30,
            marginLeft: 10,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AntDesign name="arrowleft" size={20} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 0,
            marginRight: 20,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          disabled
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile Image</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: Dimensions.get('screen').width,
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').width,
        }}
      >
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: Dimensions.get('screen').width * 0.1,
            left: Dimensions.get('screen').width * 0.1,
            width: Dimensions.get('screen').width * 0.8,
            height: Dimensions.get('screen').width * 0.8,
            borderRadius: Dimensions.get('screen').width * 0.8,
          }}
          onPress={pickProfilePhoto}
        >
          <ImageBackground
            source={
              image && image !== 'None'
                ? { uri: image }
                : { uri: 'https://ui-avatars.com/api/?rounded=true&name&size=512' }
            }
            style={{
              width: Dimensions.get('screen').width * 0.8,
              height: Dimensions.get('screen').width * 0.8,
            }}
            imageStyle={{ borderRadius: Dimensions.get('screen').width * 0.8 }}
          />
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 20,
              bottom: 0,
              right: 0,
              margin: 15,
              zIndex: 150,
            }}
          >
            <Entypo name="edit" size={20} color={theme} />
          </View>
        </TouchableOpacity>
        {!image ? (
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
            onPress={pickProfilePhoto}
          >
            <Text style={{ color: '#555', fontWeight: 'bold', fontSize: 20 }}>
              Pick a profile image
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={{
          marginTop: 30,
          width: Dimensions.get('screen').width * 0.9,
          position: 'absolute',
          bottom: 30,
          right: 30,
          alignItems: 'flex-end',
        }}
      >
        <LinearGradient
          colors={
            submitted
              ? ['rgba(200,200,200,0.5)', 'rgba(225,225,225,0.5)', 'rgba(250,250,250,0.5)']
              : ['#ed4b60', '#E7455A', '#D7354A']
          }
          style={{
            width: 100,
            height: 40,
            borderRadius: 10,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={onSubmitOnboarding} disabled={submitted}>
            <Text style={{ color: 'white' }}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

export default ProfileImage;

const styles = StyleSheet.create({
  imageContainer: {},

  image: {},
});
