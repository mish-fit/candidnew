import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Easing,
  Pressable,
  Linking,
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import * as Amplitude from 'expo-analytics-amplitude';
import LinearGradient from 'react-native-linear-gradient';
import { dataRetrieve, URL } from '../Exports/Config';
import { add } from '../../Styles/Add';
import { RandomContext } from '../Exports/Context';
import { backArrow, colorsArray, themeLight } from '../Exports/Colors';

function FeedItemComponent({ item, id, userInfo }) {
  const [randomNo, userId] = React.useContext(RandomContext);
  const [colorNo, setColorNo] = React.useState(0);
  const [tempFollow, setTempFollow] = React.useState(false);
  const [like, setLike] = React.useState(item.activity_like);
  const [dislike, setDislike] = React.useState(item.activity_dislike);
  const [buys, setBuys] = React.useState(item.activity_buy);
  const [result, setResult] = React.useState();

  const navigation = useNavigation();

  React.useEffect(() => {
    setColorNo((randomNo + id) % (colorsArray.length - 1));

    //   console.log(userInfo)
  }, []);

  const followUser = () => {
    setTempFollow(true);
  };

  const likePost = () => {
    setLike(!like);
    const body = {
      user_id: userId,
      feed_id: item.feed_id,
      feed_user_id: item.user_id,
      user_name: userInfo.user_name,
      activity_like: !like,
      activity_dislike: dislike,
      activity_buy: buys,
    };

    axios(
      {
        method: 'post',
        url: `${URL}/engagement/engagepost`,
        data: body,
      },
      { timeout: 5000 }
    )
      .then((res) => {
        //    console.log(res)
      })
      .catch((e) => console.log(e));
  };

  const dislikePost = () => {
    setDislike(!dislike);
    const body = {
      user_id: userId,
      feed_id: item.feed_id,
      feed_user_id: item.user_id,
      user_name: userInfo.user_name,
      activity_like: like,
      activity_dislike: !dislike,
      activity_buy: buys,
    };

    axios(
      {
        method: 'post',
        url: `${URL}/engagement/engagepost`,
        data: body,
      },
      { timeout: 5000 }
    )
      .then((res) => {
        //    console.log(res)
      })
      .catch((e) => console.log(e));
  };

  const redirect = async (buyURL) => {
    try {
      Linking.openURL(buyURL);
    } catch (error) {
      Amplitude.logEventWithPropertiesAsync('BUY URL ERROR', { buy_url: buyURL });
      alert('Browser not reachable');
    }
  };

  const buyItem = (buyURL) => {
    Amplitude.logEventWithPropertiesAsync('BUY URL', {
      user_id: userId,
      feed_id: item.feed_id,
      feed_user_id: item.user_id,
      user_name: userInfo.user_name,
    });

    //   console.log(buyURL)
    redirect(buyURL);
    setBuys(buys + 1);

    const body = {
      user_id: userId,
      feed_id: item.feed_id,
      feed_user_id: item.user_id,
      user_name: userInfo.user_name,
      activity_like: like,
      activity_dislike: dislike,
      activity_buy: buys + 1,
    };

    axios(
      {
        method: 'post',
        url: `${URL}/engagement/engagepost`,
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
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,
        flex: 1,
      }}
    >
      <View
        style={{ marginTop: 5, marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-start' }}
      >
        <View style={{ marginRight: 10 }}>
          {item.user_image && item.user_image !== 'None' ? (
            <Image
              source={{ uri: `${item.user_image}?${new Date()}` }}
              style={{ width: 40, height: 40, borderRadius: 40, marginTop: 5, marginLeft: 5 }}
            />
          ) : (
            <Avatar.Image
              style={{ marginTop: 5, marginLeft: 5 }}
              source={{
                uri: `https://ui-avatars.com/api/?rounded=true&name=${item.user_name}&size=64&background=D7354A&color=fff&bold=true`,
              }}
              size={40}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginLeft: 5 }}>
            <TouchableOpacity
              onPress={() => {
                //   console.log(" user info ",userInfo, " item " , item)
                navigation.navigate('UserPage', {
                  homeUserName: userInfo.user_name,
                  userName: item.user_name,
                  userId: item.user_id,
                  isFollowing: item.isFollowing,
                });
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.user_name}</Text>
            </TouchableOpacity>
            {item.isFollowing ? null : tempFollow ? (
              <View>
                <Text style={{ color: '#AAA', marginLeft: 10 }}>Following</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={followUser}>
                <Text style={{ color: 'skyblue', marginLeft: 10 }}>Follow</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ marginTop: 5, marginLeft: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 12, color: '#555' }}>{item.product_name}</Text>
          </View>
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
              userInfo,
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
          {item.buy_url ? (
            <LinearGradient
              colors={['#ed4b60', '#E7455A', '#D7354A']}
              style={{
                position: 'absolute',
                bottom: 10,
                left: Dimensions.get('screen').width * 0.15,
                width: Dimensions.get('screen').width * 0.62,
                backgroundColor: colorsArray[colorNo],
                alignItems: 'center',
                padding: 5,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity onPress={() => buyItem(item.buy_url)}>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>BUY</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : null}
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
          {item.buy_url ? (
            <LinearGradient
              colors={['#ed4b60', '#E7455A', '#D7354A']}
              style={{
                width: Dimensions.get('screen').width * 0.3,
                backgroundColor: colorsArray[colorNo],
                alignItems: 'center',
                marginRight: 20,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity onPress={() => buyItem(item.buy_url)}>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>BUY</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : null}
        </View>
      )}
      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: Dimensions.get('screen').width * 0.05,
          borderRadius: 5,
        }}
      >
        <TouchableOpacity disabled={dislike} onPress={likePost}>
          <AntDesign name="like2" color={like ? 'green' : dislike ? '#EEE' : '#AAA'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity disabled={like} onPress={dislikePost}>
          <AntDesign name="dislike2" color={dislike ? 'red' : like ? '#EEE' : '#AAA'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 5, paddingHorizontal: 10, marginBottom: 10 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Post', { item, id, userInfo })}
        >
          <Text>
            {item.title}
            <Text style={{ color: '#2980b9' }}>
              {item.comment.length > 20 ? ' .. Read More' : ''}
            </Text>
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

function FeedItemSummaryComponent({ item, id, contextClickCallback }) {
  const [randomNo] = React.useContext(RandomContext);
  const [colorNo, setColorNo] = React.useState(0);
  const [tempFollow, setTempFollow] = React.useState(false);
  const [like, setLike] = React.useState(item.like);
  const [dislike, setDislike] = React.useState(item.dislike);

  const contextClick = (product_id) => {
    contextClickCallback(product_id);
  };

  React.useEffect(() => {
    setColorNo((randomNo + id) % (colorsArray.length - 1));
  }, []);

  const followUser = () => {
    setTempFollow(true);
  };

  const redirect = async (buyURL) => {
    try {
      Linking.openURL(buyURL);
    } catch (error) {
      Amplitude.logEventWithPropertiesAsync('BUY URL ERROR', { buy_url: buyURL });
      alert('Sorry ! Link invalid');
    }
  };

  return (
    <View
      style={{
        marginLeft: 10,
        flexDirection: 'row',
        marginRight: 10,
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
      }}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{ uri: item.feed_summary_image }}
          style={{
            width: Dimensions.get('screen').width * 0.46,
            height: Dimensions.get('screen').width * 0.46,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          flexShrink: 1,
        }}
      >
        <View
          style={{
            paddingTop: 5,
            paddingLeft: 5,
            flexDirection: 'row',
            flexWrap: 'wrap',
            flexShrink: 1,
          }}
        >
          <Text style={{ flexShrink: 1, fontWeight: 'bold', fontSize: 12, color: '#555' }}>
            {item.product_name}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 5, paddingVertical: 2, flexShrink: 1 }}>
          <Text style={{ fontSize: 13, fontStyle: 'italic', flexShrink: 1 }}>
            {item.feed_recommendations} friends recommended this
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => contextClick(item.product_id)}
          >
            <Text
              style={{
                fontSize: 10,
                fontStyle: 'italic',
                flexShrink: 1,
                borderBottomWidth: 1,
                borderBottomColor: 'red',
              }}
            >
              Split by context
            </Text>
          </TouchableOpacity>
        </View>
        {item.buy_url ? (
          <LinearGradient
            colors={['#ed4b60', '#E7455A', '#D7354A']}
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              padding: 5,
              height: 30,
              borderBottomRightRadius: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Amplitude.logEventWithPropertiesAsync('BUY URL FROM CATEGORY FEED SUMMARY', {
                  product_name: item.product_name,
                });
                redirect(item.buy_url);
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 16,
                  color: colorsArray[colorNo],
                }}
              >
                BUY
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : null}
      </View>
    </View>
  );
}

function FollowItemComponent() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text>Name</Text>
      <Text>Follow Button</Text>
    </View>
  );
}

function Category() {
  const progress = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef(null);

  const [headerHeight, setHeaderHeight] = React.useState(50);
  const [randomNo, userId] = React.useContext(RandomContext);

  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = React.useState(route.params?.userInfo);
  const [userName, setUserName] = React.useState(route.params?.userName);
  const [categoryName, setCategoryName] = React.useState(route.params?.categoryName);
  const [categoryId, setCategoryId] = React.useState(route.params?.categoryId);
  const [categoryArray, setCategoryArray] = React.useState([route.params?.categoryId]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [feedData, setFeedData] = React.useState([]);
  const [feedSummary, setFeedSummary] = React.useState([]);

  const scrollY = React.useRef(new Animated.Value(0));
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
    { useNativeDriver: true }
  );
  const scrollYClamped = Animated.diffClamp(scrollY.current, 0, headerHeight);
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });
  const translateYNumber = React.useRef();
  translateY.addListener(({ value }) => {
    translateYNumber.current = value;
  });

  const [splitContextModalVisible, setSplitContextModalVisible] = React.useState(false);
  const [filterContextModalVisible, setFilterContextModalVisible] = React.useState(false);
  const [categoriesChecked, setCategoriesChecked] = React.useState([]);
  const [categoriesRequest, setCategoriesRequest] = React.useState([]);
  const [toggled, setToggled] = React.useState(false);
  const [contextSplitData, setContextSplitData] = React.useState([]);

  const categoryCheckFunc = (index, name, type) => {
    //  console.log(index , name , type)
    if (type) {
      const newArray = [...categoriesChecked];
      newArray[index] = true;
      setCategoriesChecked([...newArray]);
      const newArray1 = [...categoriesRequest];
      newArray1.push(name);
      setCategoriesRequest([...newArray1]);
    } else {
      const newArray = [...categoriesChecked];
      newArray[index] = false;
      setCategoriesChecked([...newArray]);

      const newarray1 = [...categoriesRequest];
      const index1 = newarray1.indexOf(name);
      if (index1 !== -1) {
        newarray1.splice(index1, 1);
        setCategoriesRequest(newarray1);
      }
    }
  };

  React.useEffect(() => {
    console.log(categoryArray);
    Amplitude.logEventWithPropertiesAsync('CATEGORY PAGE', {
      category_id: JSON.stringify(categoryArray),
      user_id: userId.slice(1, 13),
    });
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (dataRetrieve && categoryArray.length && userId) {
      console.log(categoryArray, userId);
      axios
        .get(
          `${URL}/feedsummary/bycategory`,
          { params: { category_id: JSON.stringify(categoryArray), user_id: userId.slice(1, 13) } },
          { timeout: 5000 }
        )
        .then((res) => res.data)
        .then((responseData) => {
          console.log(responseData);
          setFeedSummary(responseData);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    axios
      .get(
        `${URL}/feed/category`,
        {
          params: {
            category_id: JSON.stringify(categoryArray),
            page: pageNumber,
            user_id: userId.slice(1, 13),
          },
        },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        console.log(responseData);
        setFeedData(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [categoriesChecked]);

  const contextClickCallback = (product_id) => {
    //  console.log(product_id)
    axios
      .get(`${URL}/feed/product`, { params: { product_id, page: 0 } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        //   console.log("FeedProduct",responseData)
        setContextSplitData(responseData);
        setSplitContextModalVisible(true);
      })
      .catch((error) => {
        //  console.log(error)
      });
  };

  function FeedItemSummary({ item, index }) {
    return (
      <View key={index.toString()}>
        <FeedItemSummaryComponent
          item={item}
          id={index}
          contextClickCallback={(contextName) => contextClickCallback(contextName)}
        />
      </View>
    );
  }

  function FeedItem({ item, index }) {
    return (
      <View key={index.toString()}>
        <FeedItemComponent item={item} id={index} userInfo={userInfo} />
      </View>
    );
  }

  function FollowItem({ item, index }) {
    return (
      <View key={index.toString()}>
        <FollowItemComponent item={item} id={index} />
      </View>
    );
  }

  const filterContextFunc = () => {
    axios
      .get(
        `${URL}/all/categories/context`,
        { params: { category_id: categoryId, page: 0 } },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        //   console.log("FeedProduct",responseData)
        setContexts(responseData);
        setFilterContextModalVisible(!filterContextModalVisible);
      })
      .catch((error) => {
        //  console.log(error)
      });
  };

  // const HeaderComponent = () => {
  //     return(<View style = {{flex : 1 }}>
  //             <Pressable
  //                     onPress = {filterContextFunc}
  //                     style = {{alignItems : 'flex-start', paddingLeft : 10, justifyContent :'center', borderWidth : 1, borderColor : "#EEE" , flex : 1 , borderRadius : 10 , marginLeft : 10 , marginRight : 10 , height  : 40  }}>
  //                         <Text style = {{color : "#888", fontSize : 16, fontStyle : 'italic'}}>Filter by Context</Text>
  //             </Pressable>
  //     </View>)
  // }

  // const [isFollowing,setFollowing] = React.useState(true)
  // const followCategory = () => {
  //     setFollowing(!isFollowing)
  //     const body = {
  //         "user_name": userName,
  //         "user_id": userId,
  //         "category_id": categoryId,
  //         "category_name": categoryName,
  //         "isFollowing": !isFollowing
  //     }
  //   console.log("POST BODY", body)

  //     axios({
  //         method: 'post',
  //         url: URL + '/engagement/followcategory',
  //         data: body
  //       }, {timeout : 5000})
  //     .then(res => {

  //     })
  //     .catch((e) => console.log(e))

  // }

  const [contexts, setContexts] = React.useState([]);
  const [contextsChecked, setContextsChecked] = React.useState([]);
  const [contextsRequest, setContextsRequest] = React.useState([]);

  const contextCheckFunc = (index, name, type) => {
    //  console.log(index , name , type)
    if (type) {
      const newArray = [...contextsChecked];
      newArray[index] = true;
      setContextsChecked([...newArray]);
      const newArray1 = [...contextsRequest];
      newArray1.push(name);
      setContextsRequest([...newArray1]);
    } else {
      const newArray = [...contextsChecked];
      newArray[index] = false;
      setContextsChecked([...newArray]);

      const newarray1 = [...contextsRequest];
      const index1 = newarray1.indexOf(name);
      if (index1 !== -1) {
        newarray1.splice(index1, 1);
        setContextsRequest(newarray1);
      }
    }
  };

  const onContextModalClose = () => {
    //  console.log(categoryId, contextsRequest)
    if (contextsRequest.length) {
      axios
        .get(
          `${URL}/feedsummary/bycategory/context`,
          { params: { category_id: categoryId, context_id: JSON.stringify(contextsRequest) } },
          { timeout: 5000 }
        )
        .then((res) => res.data)
        .then((responseData) => {
          //   console.log("context",responseData[0])
          setFeedData(responseData);

          setFilterContextModalVisible(false);
        })
        .catch((error) => {
          //   console.log(error)
        });
    } else {
      setFilterContextModalVisible(false);
    }
  };

  const redirect = async (buyURL) => {
    try {
      Linking.openURL(buyURL);
    } catch (error) {
      Amplitude.logEventWithPropertiesAsync('BUY URL ERROR', { buy_url: buyURL });
      alert('Browser not reachable');
    }
  };

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
          <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
            Uh Oh! No Posts on this category yet
          </Text>
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

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          backgroundColor: 'white',
          flex: 1,
          height: headerHeight,
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
          style={{ marginRight: 40, flex: 1, justifyContent: 'center', alignItems: 'center' }}
          disabled
        >
          <Text style={add.headerTitleText}>{categoryName}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Modal
        isVisible={filterContextModalVisible}
        deviceWidth={Dimensions.get('screen').width}
        deviceHeight={Dimensions.get('screen').height}
        onBackdropPress={onContextModalClose}
        onSwipeComplete={onContextModalClose}
        swipeDirection="left"
        style={{ marginHorizontal: 20, marginVertical: 40 }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {contexts.map((item, index) =>
            contextsChecked[index] ? (
              <Pressable
                android_ripple={{ color: 'black' }}
                onPress={() => contextCheckFunc(index, item.context_id, false)}
                style={{
                  backgroundColor: 'red',
                  flexDirection: 'row',
                  borderRadius: 20,
                  padding: 10,
                  alignItems: 'center',
                  margin: 10,
                }}
              >
                <Text style={{ color: 'white', marginRight: 10 }}>{item.context_name}</Text>
                <AntDesign name="check" size={15} color="white" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => contextCheckFunc(index, item.context_id, true)}
                android_ripple={{ color: 'red' }}
                style={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'green',
                  padding: 10,
                  margin: 10,
                }}
              >
                <Text style={{ color: 'blue', marginRight: 10 }}>{item.context_name}</Text>
                <AntDesign name="plus" size={15} color="red" />
              </Pressable>
            )
          )}
        </View>
      </Modal>
      <Modal
        isVisible={splitContextModalVisible}
        deviceWidth={Dimensions.get('screen').width}
        deviceHeight={Dimensions.get('screen').height}
        onBackdropPress={() => setSplitContextModalVisible(false)}
        onSwipeComplete={() => setSplitContextModalVisible(false)}
        swipeDirection="left"
        style={{
          flex: 1,
          borderRadius: 30,
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width * 0.9,
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 30,
            backgroundColor: 'white',
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width * 0.9,
          }}
        >
          <TouchableOpacity
            onPress={() => setSplitContextModalVisible(false)}
            style={{ position: 'absolute', top: 10, right: 20 }}
          >
            <AntDesign name="closecircleo" size={20} color="#666" />
          </TouchableOpacity>
          <ScrollView style={{ marginTop: 30 }}>
            {contextSplitData.length
              ? contextSplitData.map((item, index) => (
                  <View
                    key={index.toString()}
                    style={{
                      flexDirection: 'row',
                      padding: 5,
                      marginTop: 5,
                      borderWidth: 1,
                      borderColor: '#EEE',
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>{item.user_name}</Text>
                    <Text style={{ flex: 1 }}>{item.context_name}</Text>
                    {item.buy_url ? (
                      <LinearGradient
                        colors={['#ed4b60', '#E7455A', '#D7354A']}
                        style={{
                          borderRadius: 10,
                          backgroundColor: 'red',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            Amplitude.logEventWithPropertiesAsync(
                              'BUY URL FROM CONTEXT MODAL IN CATEGORY ',
                              {
                                context_name: item.context_name,
                                user_name: item.user_name,
                                product_name: item.product_name,
                              }
                            );
                            redirect(item.buy_url);
                          }}
                        >
                          <Text style={{ color: 'white' }}>BUY</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    ) : null}
                  </View>
                ))
              : null}
          </ScrollView>
        </View>
      </Modal>

      <Animated.FlatList
        keyExtractor={(item, index) => index.toString()}
        ref={ref}
        style={{}}
        contentContainerStyle={{ paddingTop: headerHeight }}
        data={feedData}
        renderItem={FeedItem}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyComponent}
      />
      {/* <TouchableOpacity 
            onPress = {()=>navigation.navigate("AddPost")}
            style = {{width: 50 , height : 50 , 
            backgroundColor : colorsArray[randomNo+1], 
            borderRadius : 60 , justifyContent : 'center', alignItems : 'center', position : 'absolute' , bottom : 60 , right : 20  }}>
                <View>
                    <AntDesign name = "plus" size = {40} color = "white" />
                </View>
            </TouchableOpacity> */}
      {/* <View 
            style = {{width: width, height : 40,
            backgroundColor : themeLightest, 
            justifyContent : 'space-around', alignItems : 'center', position : 'absolute' , bottom : 0 , left : 0  }}>
                <View style = {{flexDirection : 'row'}}>
                    <View style = {{  justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{color : theme, fontSize : 18,marginRight : 5 , fontWeight : !toggled ? 'bold' :'normal'}}>Summary</Text>
                    </View>
                    <View style = {{  justifyContent : 'center', alignItems : 'center'}}>
                        <Switch
                            trackColor={{ true: theme , false: "white" }}
                            thumbColor={!toggled ? theme : 'white'}
                            onValueChange={()=>setToggled(!toggled)}
                            value={toggled}
                        />
                    </View>
                    <View style = {{ justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{color : theme, fontSize : 18,marginLeft : 5, fontWeight : !toggled ? 'normal' :'bold'}}>All Reviews</Text>
                    </View>
                </View>
            </View> */}
    </View>
  );
}

export default Category;

const styles = StyleSheet.create({});
