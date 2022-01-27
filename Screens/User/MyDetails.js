import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Easing,
  ToastAndroid,
  Alert,
  Share,
} from 'react-native';
import { AntDesign, Entypo, FontAwesome } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import LottieView from 'lottie-react-native';
import { AirbnbRating } from 'react-native-ratings';
import { Avatar, Snackbar, Title } from 'react-native-paper';
import * as Amplitude from 'expo-analytics-amplitude';
import { TAB_BAR_HEIGHT, width, height } from '../Exports/Constants';
import { RandomContext } from '../Exports/Context';
import { URL } from '../Exports/Config';
import {
  background,
  borderColor,
  theme,
  themeLight,
  themeLightest,
  backArrow,
  alttheme,
} from '../Exports/Colors';

function FriendsCarousel({ DATA, onClickItem }) {
  const [data, setData] = React.useState([...DATA]);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const ITEM_SIZE = 50;
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  const renderItem = ({ item, index }) => {
    const itemClick = (item) => {
      onClickItem(item.user_id, item.user_name, true);
    };

    const inputRange = [ITEM_SIZE * (index - 1), ITEM_SIZE * index];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1],
    });

    return (
      <Animated.View style={({ borderWidth: 0, flex: 1 }, { transform: [{ scale }] })}>
        <TouchableOpacity
          style={{ borderWidth: 0, flex: 1, marginRight: 10 }}
          onPress={() => {
            itemClick(item);
          }}
        >
          <View
            style={{
              flex: 1,
              height: 60,
              width: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.user_profile_image ? (
              <Image
                source={{ uri: `${item.user_profile_image}?${new Date()}` }}
                style={{
                  opacity: 1,
                  backgroundColor: 'red',
                  flex: 1,
                  justifyContent: 'center',
                  borderRadius: 20,
                  height: 60,
                  width: 60,
                }}
              />
            ) : (
              <Avatar.Image
                style={{}}
                source={{
                  uri: `https://ui-avatars.com/api/?rounded=true&name=${item.user_name}&size=64&background=D7354A&color=fff&bold=true`,
                }}
                size={ITEM_SIZE}
              />
            )}
          </View>
          <View style={{ backgroundColor: background, height: 40, width: ITEM_SIZE }}>
            <Text
              style={[
                home.mainViewCarouselScrollableItemText,
                { margin: 1, fontSize: 10, color: borderColor },
              ]}
            >
              {item.user_name.length > 20
                ? `${item.user_name.substring(0, 20)}...`
                : item.user_name}
            </Text>
          </View>
          {item && item.count_posts && item.count_posts > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: alttheme,
                borderRadius: 20,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 8, color: 'white' }}>{item.count_posts}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      style={{
        marginLeft: Dimensions.get('screen').width * 0.03,
        width: Dimensions.get('screen').width * 0.94,
        paddingTop: 10,
        marginRight: Dimensions.get('screen').width * 0.03,
      }}
      contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      })}
      snapToInterval={ITEM_SIZE + 5}
      showsHorizontalScrollIndicator={false}
    />
  );
}

function FollowingCarousel({ DATA, isFollowing, onClickItem, onClickFollow }) {
  const [data, setData] = React.useState([...DATA]);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    //    console.log("Following",isFollowing)
  }, []);

  const ITEM_SIZE = 100;
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  const renderItem = ({ item, index }) => {
    const itemClick = () => {
      onClickItem(item.user_id, item.user_name, false);
    };

    const itemFollow = () => {
      onClickFollow(item.user_id, item.user_name, index);
    };

    const inputRange = [ITEM_SIZE * (index - 1), ITEM_SIZE * index];
    const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1],
    });
    const opacity = scrollX.interpolate({
      inputRange: opacityInputRange,
      outputRange: [1, 1, 1, 0],
    });

    return (
      <Animated.View
        style={[
          home.mainViewCarouselScrollableItemContainer,
          { borderWidth: 0 },
          { transform: [{ scale }] },
        ]}
      >
        <TouchableOpacity
          style={[home.mainViewCarouselScrollableItemButton, { borderWidth: 0 }]}
          onPress={() => {
            itemClick(item);
          }}
        >
          <View style={{ flex: 1, width: ITEM_SIZE, backgroundColor: background }}>
            {item.user_profile_image ? (
              <Image
                source={{ uri: `${item.user_profile_image}?${new Date()}` }}
                style={[
                  home.mainViewCarouselScrollableItemImageBackground,
                  {
                    opacity: 1,
                    backgroundColor: background,
                    borderRadius: ITEM_SIZE - 20,
                    width: ITEM_SIZE - 20,
                    height: ITEM_SIZE - 20,
                    marginLeft: 10,
                  },
                ]}
              />
            ) : (
              <Avatar.Image
                style={{ marginTop: 10, marginLeft: 20 }}
                source={{
                  uri: `https://ui-avatars.com/api/?rounded=true&name=${item.user_name}&size=64&background=D7354A&color=fff&bold=true`,
                }}
                size={ITEM_SIZE - 40}
              />
            )}
          </View>
          <View
            style={{
              backgroundColor: background,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
            }}
          >
            <Text
              style={[
                home.mainViewCarouselScrollableItemText,
                { margin: 1, fontSize: 10, color: borderColor },
              ]}
            >
              {item.user_name.length > 20
                ? `${item.user_name.substring(0, 20)}...`
                : item.user_name}
            </Text>
          </View>
          <TouchableOpacity
            disabled={isFollowing[index]}
            onPress={itemFollow}
            style={{
              backgroundColor: isFollowing[index] ? '#888' : themeLight,
              borderRadius: 5,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: 'white', alignSelf: 'center' }}>
              {isFollowing[index] ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.following_user_id.toString()}
      horizontal
      style={{ width: Dimensions.get('screen').width * 0.94 }}
      contentContainerStyle={home.mainViewCarouselScrollableItem}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      })}
      snapToInterval={ITEM_SIZE}
      showsHorizontalScrollIndicator={false}
    />
  );
}

function FeedItemComponent({ item, id, userInfo, deleteItem }) {
  const [randomNo, userId] = React.useContext(RandomContext);
  const [colorNo, setColorNo] = React.useState(0);
  const navigation = useNavigation();
  React.useEffect(() => {}, []);

  const editPost = () => {};

  const deletePost = () => {
    console.log(item);

    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => deleteAction() },
    ]);
  };

  const deleteAction = () => {
    {
      console.log(item);
      const body = {
        feed_id: item.feed_id,
      };
      axios(
        {
          method: 'post',
          url: `${URL}/delete`,
          data: body,
        },
        { timeout: 5000 }
      )
        .then((res) => {
          console.log(res.data);
          ToastAndroid.show('Post is deleted', ToastAndroid.SHORT);
          deleteItem(item.feed_id);
        })
        .catch((e) => {
          console.log(e);
          ToastAndroid.show('Error deleting the post ', ToastAndroid.SHORT);
        });
    }
  };

  const sharePost = async () => {
    //   console.log(userInfo)
    Amplitude.logEventWithPropertiesAsync('SHARE Post', { userName: userInfo.user_name });
    try {
      const result = await Share.share({
        message: `Hey, I reviewed ${item.product_name} at https://www.getcandid.app/post?id=${item.feed_id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          //     console.log(result.activityType)
        } else {
          //  console.log(result)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,
      }}
    >
      <View
        style={{
          marginTop: 5,
          marginLeft: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            marginTop: 5,
            marginLeft: 5,
            marginRight: 15,
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
          }}
        >
          <Text style={{ flexShrink: 1, fontWeight: 'bold', fontSize: 12, color: '#555' }}>
            {item.product_name.length > 100
              ? `${item.product_name.substring(0, 100)} ...`
              : item.product_name}
          </Text>
        </View>
        <View style={{ padding: 15, marginRight: 0 }}>
          <Menu style={{}}>
            <MenuTrigger>
              <Entypo name="dots-three-vertical" size={15} color="#AAA" />
            </MenuTrigger>
            <MenuOptions style={{}}>
              <MenuOption onSelect={sharePost}>
                <Text>Share</Text>
              </MenuOption>
              <MenuOption onSelect={deletePost}>
                <Text>Delete</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: 20,
          marginVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryPage', {
              categoryId: item.category_id,
              categoryName: item.category_name,
              userName: userInfo.user_name,
            })
          }
          style={{
            paddingHorizontal: 5,
            paddingVertical: 2,
            backgroundColor: '#888',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontStyle: 'italic' }}>
            {item.category_name}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            borderWidth: 1,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderColor: '#CCC',
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{item.context_name}</Text>
        </View>
      </View>
      {item.feed_image && item.feed_image !== 'None' ? (
        <View style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: item.feed_image }}
            style={{
              width: Dimensions.get('screen').width * 0.92,
              height: Dimensions.get('screen').width * 0.92,
              borderRadius: 40,
            }}
          />

          <AirbnbRating
            ratingContainerStyle={{
              position: 'absolute',
              top: 10,
              left: Dimensions.get('screen').width * 0.25,
              backgroundColor: 'transparent',
            }}
            defaultRating={item.rating}
            readOnly
            size={30}
            showRating={false}
            isDisabled
            count={5}
            unSelectedColor="rgba(200,200,200,0.9)"
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <AirbnbRating
            ratingContainerStyle={{
              width: Dimensions.get('screen').width * 0.7,
              backgroundColor: 'transparent',
              flex: 1,
            }}
            defaultRating={item.rating}
            readOnly
            size={15}
            showRating={false}
            isDisabled
            count={5}
            unSelectedColor="rgba(200,200,200,0.9)"
          />
        </View>
      )}
      <View style={{ marginTop: 5, paddingHorizontal: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      </View>
      <View style={{ marginTop: 5, paddingHorizontal: 10, marginBottom: 10 }}>
        <Text>{item.comment}</Text>
      </View>
    </View>
  );
}

function MyDetails() {
  const [randomNo, userId] = React.useContext(RandomContext);
  const navigation = useNavigation();
  const route = useRoute();
  const progress = React.useRef(new Animated.Value(0)).current;

  const [myFriends, setMyFriends] = React.useState([]);
  const [myFollowers, setMyFollowers] = React.useState([]);
  const [userSummary, setUserSummary] = React.useState([]);
  const [userEngagement, setUserEngagement] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState([]);
  const [userImage, setUserImage] = React.useState('');
  const [feedData, setFeedData] = React.useState([]);
  const [isFollowing, setFollowing] = React.useState([]);

  const [trustSnackVisible, setTrustSnackVisible] = React.useState(false);

  const onToggleSnackBar = () => setTrustSnackVisible(!trustSnackVisible);

  const onDismissSnackBar = () => setTrustSnackVisible(false);

  React.useEffect(() => {
    Amplitude.logEventAsync('MyDetails');

    const a = [];
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    axios
      .get(
        `${URL}/feed/user`,
        { params: { following_user_id: userId.slice(1, 13), page: 0, user_id: 1 } },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        //    console.log("USER",responseData)
        setFeedData(responseData);
      })
      .catch((error) => {});

    axios
      .get(`${URL}/user/info`, { params: { user_id: userId.slice(1, 13) } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        setUserInfo(responseData[0]);
        setUserImage(responseData[0].user_profile_image);
      })
      .catch((error) => {
        //  console.log(error)
      });

    axios
      .get(`${URL}/user/summary`, { params: { user_id: userId.slice(1, 13) } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        //    console.log(responseData)
        setUserSummary(responseData[0]);
      })
      .catch((error) => {});

    axios
      .get(
        `${URL}/user/engagement`,
        { params: { user_id: userId.slice(1, 13) } },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        //  console.log(responseData)
        setUserEngagement(responseData[0]);
      })
      .catch((error) => {});

    axios
      .get(
        `${URL}/user/myfollowers`,
        { params: { user_id: userId.slice(1, 13) } },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        //    console.log("MY FOLLOWERS",responseData)
        setMyFollowers(responseData);
      })
      .catch((error) => {
        console.log(error);
      });

    // axios.get(URL + "/user/followingusers",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
    // .then(res => res.data).then(function(responseData) {
    //     console.log("MY FIENDS",responseData)
    //     setMyFriends(responseData)
    // })
    // .catch(function(error) {

    // });

    // axios.get(URL + "/user/getpeopletofollow",{params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
    // .then(res => res.data).then(function(responseData) {
    //     console.log(responseData)
    //     setPeopleYouCanFollow(responseData)
    //     responseData.map(()=>{
    //         console.log("a",a)
    //         console.log("following",isFollowing)
    //         a.push(false)
    //     })
    // })
    // .then(()=>setFollowing(a))
    // .catch(function(error) {

    // });
  }, []);

  const share = async () => {
    //   console.log(userInfo)
    Amplitude.logEventWithPropertiesAsync('SHARE PROFILE', { userName: userInfo.user_name });
    try {
      const result = await Share.share({
        message: `Shop from the amazing products I recommended on https://www.getcandid.app/user?user_name=${userInfo.user_name} . Use my referral code : ${userInfo.coupon}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          //     console.log(result.activityType)
        } else {
          //  console.log(result)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function HeaderComponent() {
    return (
      <View style={{ paddingTop: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
            paddingTop: 10,
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
            <AntDesign name="arrowleft" size={30} color={backArrow} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 15 }} onPress={share}>
              <FontAwesome name="share" size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <FontAwesome name="edit" size={15} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 10,
            borderBottomColor: '#EEE',
            borderBottomWidth: 2,
            paddingVertical: 10,
          }}
        >
          <View style={{}}>
            {userImage && userImage !== 'None' ? (
              <Image
                source={{ uri: `${userImage}?${new Date()}` }}
                style={{ width: 100, height: 100, borderRadius: 100 }}
              />
            ) : userInfo.user_name ? (
              <Avatar.Image
                source={{
                  uri: `https://ui-avatars.com/api/?rounded=true&name=${userInfo.user_name.replace(
                    ' ',
                    '+'
                  )}&size=512&background=D7354A&color=fff`,
                }}
                size={100}
              />
            ) : (
              <Avatar.Image
                source={{
                  uri: 'https://ui-avatars.com/api/?rounded=true&background=D7354A&color=fff&size=512',
                }}
                size={100}
              />
            )}
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
              }}
            >
              <Title style={{ textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>
                {userInfo.user_name}
              </Title>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: '#EEE',
                borderBottomWidth: 1,
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.navigate('MyRewards', { source: 'My Details' })}
              >
                <View style={home.headingHeaderView}>
                  <Text style={[home.headingHeader, { color: theme }]}>Reward Coins</Text>
                </View>
                <View style={home.headingTitleView}>
                  <Text style={home.headingTitle}>
                    {userSummary && userSummary.coins_available ? userSummary.coins_available : '0'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  onToggleSnackBar();
                  //   ToastAndroid.show("Post Authentic reviews to get higher trust score and rewards",ToastAndroid.LONG)
                }}
              >
                <View style={home.headingHeaderView}>
                  <Text style={[home.headingHeader, { color: theme }]}>Trust Score</Text>
                </View>
                <View style={home.headingTitleView}>
                  <Text style={home.headingTitle}>
                    {userSummary && userSummary.trust_score ? userSummary.trust_score : '100'}%
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity style={{}}>
                <View style={home.headingTitleView}>
                  <Text style={home.headingTitle}>
                    {userEngagement && userEngagement.followers ? userEngagement.followers : '0'}
                  </Text>
                </View>
                <View style={home.headingHeaderView}>
                  <Text style={[home.headingHeader, { color: themeLightest }]}>Followers</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{}}>
                <View style={home.headingTitleView}>
                  <Text style={home.headingTitle}>
                    {userEngagement && userEngagement.count_feed ? userEngagement.count_feed : '0'}
                  </Text>
                </View>
                <View style={home.headingHeaderView}>
                  <Text style={[home.headingHeader, { color: themeLightest }]}>Posts</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{}}>
                <View style={home.headingTitleView}>
                  <Text style={home.headingTitle}>
                    {userEngagement && userEngagement.sales ? userEngagement.sales : '0'}
                  </Text>
                </View>
                <View style={home.headingHeaderView}>
                  <Text style={[home.headingHeader, { color: themeLightest }]}>Sales Made</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {userInfo &&
        userInfo.social_handles &&
        JSON.parse(userInfo.social_handles) &&
        JSON.parse(userInfo.social_handles).aboutme ? (
          <View style={{ flex: 1, paddingTop: 10, paddingHorizontal: 10, paddingBottom: 10 }}>
            <View style={{ marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold', color: '#555' }}>About</Text>
            </View>
            <View>
              <Text style={{}}>
                {userInfo &&
                userInfo.social_handles &&
                JSON.parse(userInfo.social_handles) &&
                JSON.parse(userInfo.social_handles).aboutme
                  ? JSON.parse(userInfo.social_handles).aboutme
                  : ''}
              </Text>
            </View>
          </View>
        ) : null}
        {myFollowers.length ? (
          <View>
            <Text
              style={{
                fontSize: 18,
                borderTopWidth: 3,
                borderTopColor: '#EEE',
                fontWeight: 'bold',
                fontSize: 18,
                paddingLeft: 10,
                paddingTop: 10,
              }}
            >
              My Followers
            </Text>

            <View style={{ backgroundColor: '#FFF', marginBottom: 5 }}>
              <FriendsCarousel
                DATA={myFollowers}
                onClickItem={(id, name, following) => goToUser(id, name, following)}
              />
            </View>
          </View>
        ) : null}
        <View>
          <Text
            style={{
              fontSize: 18,
              borderTopWidth: 3,
              borderTopColor: '#EEE',
              fontWeight: 'bold',
              fontSize: 18,
              paddingLeft: 10,
              paddingTop: 10,
            }}
          >
            My Posts
          </Text>
        </View>
      </View>
    );
  }

  function EmptyComponent() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ justifyContent: 'center' }}>
          <LottieView
            progress={progress}
            style={{
              width: Dimensions.get('screen').width * 0.4,
              height: Dimensions.get('screen').width * 0.4,
            }}
            source={require('../../assets/animation/astronaut.json')}
            autoPlay
          />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 25 }}>Uh Oh! No Posts yet</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddCategory', {
                user_id: userId.slice(1, 13),
                user_name: userInfo.user_name,
                user_image: userInfo.user_image,
              })
            }
          >
            <Text style={{ marginTop: 10, color: themeLight }}>Start Reviewing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const deletePostItem = (id) => {
    Amplitude.logEventWithPropertiesAsync('DELETE POST', { feed_id: id });
    setFeedData(feedData.filter((item, index) => item.feed_id !== id));
  };

  function FeedItem({ item, index }) {
    return (
      <View key={index.toString()}>
        <FeedItemComponent
          item={item}
          id={index}
          userInfo={userInfo}
          deleteItem={(id) => deletePostItem(id)}
        />
      </View>
    );
  }

  const goToUser = (id, name, following) => {
    //    console.log(id, name , following)
    Amplitude.logEventWithPropertiesAsync('GO TO USER FROM DETAILS', {
      homeUserName: userInfo.user_name,
      userName: name,
      userId: id,
      isFollowing: following,
    });
    navigation.navigate('UserPage', {
      homeUserName: userInfo.user_name,
      userName: name,
      userId: id,
      isFollowing: following,
    });
  };

  const followUser = (id, name, index) => {
    Amplitude.logEventWithPropertiesAsync('FOLLOW USER IN MY DETAILS', {
      user_name: userInfo.user_name,
      user_id: userInfo.user_id,
      following_user_id: id,
      following_user_name: name,
    });
    const newArr = [...isFollowing]; // copying the old datas array
    newArr[index] = true; // replace e.target.value with whatever you want to change it to
    setFollowing(newArr);
    const body = {
      user_name: userInfo.user_name,
      user_id: userInfo.user_id,
      following_user_id: id,
      following_user_name: name,
      isFollowing: true,
    };

    axios(
      {
        method: 'post',
        url: `${URL}/engagement/followuser`,
        data: body,
      },
      { timeout: 5000 }
    )
      .then((res) => {
        //    console.log(res)
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={{}}
        contentContainerStyle={{ paddingBottom: 60 }}
        data={feedData}
        renderItem={FeedItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={HeaderComponent}
        ListHeaderComponentStyle={{ marginTop: 0 }}
        ListEmptyComponent={EmptyComponent}
      />

      {/* <View style = {{position : 'absolute', left : 20 , bottom : 20 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Home")}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <AntDesign name = "home" size = {30} color = 'white' />
                </TouchableOpacity>
            </View> */}
      {/* <TouchableOpacity 
            onPress = {()=>navigation.navigate("AddPost")}
            style = {{width: 50 , height : 50 , 
            backgroundColor : colorsArray[randomNo+1], 
            borderRadius : 60 , justifyContent : 'center', alignItems : 'center', position : 'absolute' , bottom : 20 , right : 20  }}>
                <View>
                    <AntDesign name = "plus" size = {30} color = "white" />
                </View>
            </TouchableOpacity> */}

      <Snackbar
        visible={trustSnackVisible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        action={{
          label: 'OK',
          onPress: () => {
            // Do something
          },
        }}
      >
        Post Authentic reviews to get higher trust score and rewards
      </Snackbar>
    </View>
  );
}

export default MyDetails;

const home = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
  },
  // ACTIVITY AND MODAL
  modalContainer: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    backgroundColor: background,
    width,
    height,
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  modalText: {
    color: borderColor,
  },

  // userDetails
  userDetailsContainer: {},
  userDetailsUserNameContainer: {
    margin: 10,
    alignItems: 'center',
  },
  userDetailsUserNameText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  userDetailsUserNameTextInput: {
    width,
    marginLeft: 10,
    marginRight: 10,
    color: borderColor,
    textAlign: 'center',
    marginTop: 20,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    fontSize: 20,
    fontFamily: 'Roboto',
  },
  userDetailsElementContainer: {
    flexDirection: 'column',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    margin: 5,
  },
  userDetailsElementText: {
    margin: 10,
    flex: 1,
    fontFamily: 'Roboto',
  },
  userDetailsElementTextInput: {
    flex: 1,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    textAlign: 'center',
    width,
    fontFamily: 'Roboto',
    paddingRight: 5,
  },
  userDetailsGenderView: {},
  userDetailsGenderHeading: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'black',
    margin: 10,
    fontFamily: 'Roboto',
  },
  userDetailsGenderRadioContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  userDetailsGenderRadioButtonContainerStyle: {
    borderWidth: 1,
    borderColor: '#AAA',
    padding: 5,
    borderRadius: 10,
    height: 30,
    margin: 10,
    marginTop: 0,
    width: 100,
  },
  userDetailsGenderRadioButtonTextStyle: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  userDetailsGenderRadioButtonContainerActiveStyle: {
    backgroundColor: theme,
  },
  userDetailsGenderRadioButtonContainerInactiveStyle: {},
  userDetailsGenderRadioButtonTextActiveStyle: {},
  userDetailsGenderRadioButtonTextInactiveStyle: {},
  userDetailsUserNameCouponValid: {},
  userDetailsSubmitContainer: {
    alignItems: 'flex-end',
  },
  userDetailsDisabledSubmitButton: {
    backgroundColor: background,
    width: width * 0.3,
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  userDetailsSubmitButton: {
    backgroundColor: 'white',
    width: width * 0.3,
    marginTop: 20,
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme,
    elevation: 1,
  },
  userDetailsSubmitText: {
    color: theme,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  // ScrollableMainView
  mainViewScrollableContentContainer: {
    alignItems: 'center',
    marginBottom: TAB_BAR_HEIGHT,
  },
  mainViewScrollableContainer: {
    marginBottom: TAB_BAR_HEIGHT,
  },
  mainViewHeroBannerContainer: {
    backgroundColor: background,
    flex: 1,
    width,
    height: Dimensions.get('screen').height * 0.25,
  },
  mainViewHeroBannerImage: {
    width,
    height: width * 0.8,
  },
  // CAROUSEL
  mainViewCarouselContainer: {
    margin: 5,
    flex: 1,
    // borderWidth : 2,
    // borderColor : "#AAA",
    // borderRadius : 5,
  },
  mainViewCarouselTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: theme,
    marginLeft: 10,
    fontFamily: 'Roboto',
  },
  mainViewCarouselChild: {
    marginLeft: 10,
    marginTop: 10,
  },
  mainViewCarouselChildHeading: {
    fontWeight: 'bold',
    marginLeft: 20,
  },
  mainViewCarouselScrollableItem: {},
  mainViewCarouselScrollableItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#666',
    // position : 'relative',
    opacity: 1,
    height: 125,
    width: 100,
    backgroundColor: background,
    //  elevation : 1,
  },
  mainViewCarouselScrollableItemButton: {},
  mainViewCarouselScrollableItemImageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 10,
    opacity: 0.4,
    backgroundColor: 'black',
  },
  mainViewCarouselScrollableItemTextContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  mainViewCarouselScrollableItemText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Roboto',
  },
  headingHeaderView: { justifyContent: 'center', alignItems: 'center' },
  headingHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#CCC',
  },
  headingTitleView: { justifyContent: 'center', alignItems: 'center' },
  headingTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
