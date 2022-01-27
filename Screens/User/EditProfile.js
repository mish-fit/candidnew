import React, { useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ToastAndroid,
  ScrollView,
  Pressable,
} from 'react-native';

import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { useNavigation, useRoute } from '@react-navigation/native';

import { AntDesign, Entypo } from 'react-native-vector-icons';

import * as Amplitude from 'expo-analytics-amplitude';
import { TextInputMask } from 'react-native-masked-text';
import { style } from '../../Styles/ProfileInfo';
import { URL } from '../Exports/Config';
import { RandomContext } from '../Exports/Context';
import { backArrow, theme } from '../Exports/Colors';
import { s3URL, uploadImageOnS3 } from '../Exports/S3';
import 'react-native-get-random-values';

function EditProfile() {
  const navigation = useNavigation();

  const route = useRoute();

  const progress = React.useRef(new Animated.Value(0)).current;

  const [profileImageChange, setProfileImageChange] = useState(false);
  const [image, setImage] = React.useState('');

  const [randomNo, userId] = React.useContext(RandomContext);

  const [userInfo, setUserInfo] = React.useState([]);

  const [submitted, setSubmitted] = React.useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [refresh, setRefresh] = React.useState(false);

  const [userNameAccepted, setUserNameAccepted] = React.useState(true);
  const [userNameRefreshBoolean, setUserNameRefreshBoolean] = React.useState(false);

  const [userName, setUserName] = React.useState('');
  const [userDob, setUserDob] = useState('');
  const [userImage, setUserImage] = React.useState('');
  const [gender, setGender] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [socialHandles, setSocialHandles] = React.useState({});
  const [aboutMe, setAboutMe] = React.useState('');
  const [aboutMeFocus, setAboutMeFocus] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setUserDob(moment(date).format('DD/MM/YYYY'));
    hideDatePicker();
  };

  const [genderValues, setGenderValues] = React.useState(['Male', 'Female']);

  useEffect(() => {
    Amplitude.logEventWithPropertiesAsync('EDIT PROFILE', { user_id: userId.slice(1, 13) });

    //    console.log(userId)
    const getUserInfo = () => {
      axios
        .get(`${URL}/user/info`, { params: { user_id: userId.slice(1, 13) } }, { timeout: 5000 })
        .then((res) => res.data)
        .then((responseData) => {
          console.log('USER INFO', responseData[0]);
          console.log('USER INFO1', JSON.parse(responseData[0].social_handles).aboutme);
          setUserInfo(responseData);
          setUserName(responseData[0].user_name);
          setImage(responseData[0].user_profile_image);
          setUserImage(responseData[0].user_profile_image);
          setUserDob(moment(responseData[0].user_dob).format('DD/MM/YYYY'));
          setGender(responseData[0].user_gender);
          setInstagram(responseData[0].instagram_user_name);
          setTwitter(responseData[0].twitter_user_name);
          setSocialHandles(responseData[0].social_handles);
          setAboutMe(JSON.parse(responseData[0].social_handles).aboutme);
        })
        .catch((error) => {
          //
        });
    };
    getUserInfo();
  }, [refresh]);

  const userNameRefresh = () => {
    setUserNameRefreshBoolean(!userNameRefreshBoolean);
    if (userNameRefreshBoolean) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
    ToastAndroid.show('Username should contain minimum 5 characters', ToastAndroid.SHORT);
  };

  const onSubmitOnboarding = () => {
    setSubmitted(true);
    if (profileImageChange) {
      uploadImageOnS3(`${userId.slice(1, 13)}/profile`, image);
    }

    const userbody = {
      user_id: userId.slice(1, 13),
      user_name: userName,
      user_profile_image: profileImageChange
        ? `${s3URL + userId.slice(1, 13)}/profile`
        : userImage != ''
        ? `${s3URL + userId.slice(1, 13)}/profile`
        : '',
      user_gender: gender,
      user_dob: userDob,
      instagram_user_name: instagram,
      twitter_user_name: twitter,
      social_handles: socialHandles,
    };
    console.log('USER BODY', userbody);

    axios({
      method: 'post',
      url: `${URL}/user/edit`,
      data: userbody,
    })
      .then((res) => {
        //       console.log(res)
        ToastAndroid.show('Your Details are updated', ToastAndroid.LONG);
        setTimeout(() => {
          navigation.navigate('Home', { source: 'Edit', body: userbody });
        }, 300);
      })
      .catch((e) => {
        ToastAndroid.show('Error updating details. Please try later');
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

  const userNameChange = (text) => {
    setUserName(text);
    axios
      .get(`${URL}/isexists/username`, { params: { user_name: text } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        //      console.log("username" , userName , "Check", responseData)
        if (responseData.length == 0 && text.length > 4) {
          setUserNameAccepted(true);
        } else {
          setUserNameAccepted(false);
        }
      })
      .catch((error) => {
        //
      });
  };

  return (
    <ScrollView
      contentContainerStyle={style.mainViewContentContainer}
      style={style.mainViewContainer}
    >
      <Animated.View
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
          onPress={() => navigation.navigate('Home')}
          style={{
            width: 20,
            height: 40,
            marginLeft: 20,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AntDesign name="arrowleft" size={20} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 20,
            marginRight: 60,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          disabled
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ paddingTop: 30 }}>
        <View style={style.editUserDetailsDisplayContainer}>
          <TouchableOpacity
            style={style.editUserDetailsDisplayImageButton}
            onPress={pickProfilePhoto}
          >
            <ImageBackground
              source={
                image && image != 'None'
                  ? { uri: `${image}?${new Date()}` }
                  : { uri: 'https://ui-avatars.com/api/?rounded=true&name&size=512' }
              }
              style={style.editUserDetailsDisplayImage}
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
              <Entypo name="edit" size={10} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        {!image ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pick a profile image</Text>
          </View>
        ) : null}

        <View style={style.editUserDetailsInputContainer}>
          <Text style={style.editUserProfileHeader}>Profile Info</Text>
          <View style={style.editUserDetailsElementContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={style.editUserDetailsElementText}>UserName *</Text>
              <View style={{ marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}>
                {userNameAccepted ? (
                  <AntDesign name="checkcircle" color="green" size={20} />
                ) : (
                  <AntDesign name="closecircle" color="#888" size={20} />
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder={userName || 'username'}
                style={[style.editUserDetailsElementTextInput, { flex: 1 }]}
                onChangeText={(text) => userNameChange(text)}
                value={userName}
              />

              {/* <TouchableOpacity
                  style = {{justifyContent : 'center', alignItems : 'center'}}
                  onPress = {userNameRefresh}
                  >
                    <LottieView
                      progress = {progress}
                      style={{width : 20 , height : 20, marginRight : 10}}
                      source={require('../../assets/animation/refresh.json')}
                      />
                  </TouchableOpacity> */}
            </View>
          </View>
          <View style={style.editUserDetailsElementContainer}>
            <Text style={style.editUserDetailsElementText}>About Me</Text>
            <View
              style={{
                marginTop: 5,
                borderColor: '#AAA',
                borderWidth: 1,
                padding: 10,
                borderRadius: 3,
              }}
            >
              <TextInput
                style={{ fontSize: 14, flexWrap: 'wrap', textAlignVertical: 'top', color: '#555' }}
                placeholder="Tell us more about you.  "
                onChangeText={(text) => {
                  setAboutMe(text);
                  setSocialHandles({ ...socialHandles, aboutme: text });
                }}
                value={aboutMe}
                numberOfLines={4}
                multiline
                onFocus={() => setAboutMeFocus(true)}
                onBlur={() => setAboutMeFocus(false)}
              />
            </View>
          </View>
          <View style={style.editUserDetailsElementContainer}>
            <Text style={style.editUserDetailsElementText}>Instagram(@)</Text>
            <TextInput
              style={style.editUserDetailsElementTextInput}
              onChangeText={(text) => {
                setInstagram(text);
                setSocialHandles({ ...socialHandles, instagram });
              }}
              value={instagram}
            />
          </View>
          <View style={style.editUserDetailsElementContainer}>
            <Text style={style.editUserDetailsElementText}>Twitter(@)</Text>
            <TextInput
              style={style.editUserDetailsElementTextInput}
              onChangeText={(text) => {
                setTwitter(text);
                setSocialHandles({ ...socialHandles, twitter });
              }}
              value={twitter}
            />
          </View>

          <View style={style.editUserDetailsElementContainer}>
            <Text style={style.editUserDetailsElementText}>Birthday (dd/mm/yyyy)</Text>
            <View style={{ flexDirection: 'row' }}>
              {/* <Text style = {[style.editUserDetailsElementTextInput,{flex : 1}]}> 
                      { userDob && userDob != "0000-00-00" ? userDob.replace('"','').substring(0,10) : ""} 
                  </Text>
                  <TouchableOpacity style = {style.datepicker} onPress={showDatePicker}>
                      <EvilIcons name = "calendar" size = {24} color = {theme}/>
                  </TouchableOpacity>  
                  <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                  /> */}
              <TextInputMask
                style={{ borderBottomColor: '#EEE', borderBottomWidth: 1 }}
                type="datetime"
                options={{
                  format: 'DD/MM/YYYY',
                }}
                value={userDob}
                onChangeText={(text) => setUserDob(text)}
              />
            </View>
          </View>
          <View style={style.editUserDetailsElementContainer}>
            <Text style={style.editUserDetailsElementText}>Gender</Text>
            {/* <View style = {{flexDirection : 'row' ,  justifyContent : 'flex-end', alignItems : 'flex-end' }}>
                  <Text style = {{ borderBottomWidth : 1 ,borderBottomColor : "#CCC",flex : 1 , paddingBottom : 5,}}> 
                      { gender && gender != "NA" ? gender : ""} 
                  </Text>
                  <Picker
                    selectedValue={gender}
                    style = {{width : 50, }}
                    onValueChange={(value) => setGender(value)}
                    dropdownIconColor = {theme}
                    itemStyle = {{fontSize : 12, color : theme}}
                  >
                    
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Others" value="Others" />
                    <Picker.Item label="Prefer not to say" value="Prefer Not to say" />
                  </Picker>
                </View>  */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              {genderValues.map((item, index) => (
                <Pressable
                  onPress={() => setGender(item)}
                  style={{
                    width: Dimensions.get('screen').width * 0.4,
                    borderRadius: 4,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      gender == 'Male' && item == 'Male'
                        ? '#d42a40'
                        : gender == 'Female' && item == 'Female'
                        ? '#dd6b8e'
                        : '#EEE',
                  }}
                >
                  <Text style={{ color: gender == item ? 'white' : 'black' }}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          {/* <View style = {{marginTop : 20, flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                <TouchableOpacity style = {{borderBottomColor : "#888", borderBottomWidth : 1}}
                onPress={()=>navigation.navigate("Affiliates")}
                >
                  <Text style = {{color : '#AAA', fontSize : 10, textAlign : 'center'}}>Click here to enter your affiliate codes !!</Text>
                </TouchableOpacity>
              </View> */}
          <View
            style={{
              marginTop: 30,
              width: Dimensions.get('screen').width * 0.9,
              alignItems: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={onSubmitOnboarding}
              disabled={!userNameAccepted}
              style={{
                backgroundColor: !userNameAccepted ? '#DDD' : theme,
                width: 100,
                height: 40,
                borderRadius: 10,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: !userNameAccepted ? '#888' : 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default EditProfile;
