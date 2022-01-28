import React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  ScrollView,
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';
import axios from 'axios';
import * as Amplitude from 'expo-analytics-amplitude';
import moment from 'moment';
import { LoadingPage } from '../Exports/Pages';
import { URL } from '../Exports/Config';
import { RandomContext } from '../Exports/Context';
import { RewardsComponent } from '../Exports/Components';
import { backArrow, colorsArray } from '../Exports/Colors';

function Redemptions() {
  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();

  const [userInfo, setUserInfo] = React.useState(route?.params?.userInfo);
  const [userSummary, setUserSummary] = React.useState(route?.params?.userSummary);
  const [recentBurn, setRecentBurn] = React.useState(route?.params?.recentBurn);

  const [myRewardsCoins, setMyRewardsCoins] = React.useState();
  const [randomNo] = React.useContext(RandomContext);

  const [pageLoading, setPageLoading] = React.useState(false);

  const [redeemMapping, setRedeemMapping] = React.useState([]);
  // [
  // {company : "Amazon",
  // company_logo:"https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/q/p/qpgc.png"
  // ,coins_value : 4000,cash_value : 250},
  // {company : "BookMyShow",
  // company_logo:"https://in-aps.bmscdn.com/gv/gift_my_show_25412019034153_480x295.jpg"
  // ,coins_value : 7000,cash_value : 500},
  // {company : "Tanishq",
  // company_logo:"https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1465394428/a9ohccgnrekwa10sayjk.png",
  // coins_value : 10000,cash_value : 1000}])

  React.useEffect(() => {
    setMyRewardsCoins(userSummary && userSummary.coins_available ? userSummary.coins_available : 0);
    Amplitude.logEventAsync('REDEMPTIONS');
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    axios
      .get(`${URL}/all/rewards`, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        console.log(responseData);
        setRedeemMapping(responseData);
      })
      .catch((error) => {});
  }, []);

  const redeemPoints = (reward_id, company_name, company_logo, coins_value, cash_value) => {
    setPageLoading(true);
    const body = {
      reward_id,
      user_id: userInfo.user_id,
      user_name: userInfo.user_name,
      company_name,
      company_logo,
      coins_value,
      cash_value,
    };

    const updatebody = {
      user_id: userInfo.user_id,
      coins_available: userSummary.coins_available - coins_value,
    };
    //    console.log(body)
    Alert.alert(
      'Redeem ?',
      `Do you want to redeem ${company_name} voucher? You can redeem only one voucher per day`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            axios(
              {
                method: 'post',
                url: `${URL}/rewards/redeem`,
                data: body,
              },
              { timeout: 5000 }
            )
              .then((res) => {
                //    console.log(res)
                setPageLoading(false);
                ToastAndroid.show(
                  'Your voucher code will be sent to your mobile.',
                  ToastAndroid.LONG
                );
                axios(
                  {
                    method: 'post',
                    url: `${URL}/rewards/updatecoin`,
                    data: updatebody,
                  },
                  { timeout: 5000 }
                )
                  .then((res) => {
                    //    console.log(res)
                    navigation.navigate('Home');
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => {
                setPageLoading(false);
                console.log(e);
              });
          },
        },
      ]
    );
  };

  const importantInstructions = () => {
    //    console.log("Instructions Modal")
  };

  const howToUse = () => {
    //   console.log("How to use modal")
  };

  return pageLoading ? (
    <LoadingPage />
  ) : (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      contentContainerStyle={{ paddingBottom: 60, paddingTop: 50 }}
    >
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
        <View
          style={{ marginLeft: 10, height: 30, alignItems: 'center', justifyContent: 'center' }}
        >
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={20} color={backArrow} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ marginLeft: 10, flex: 1 }}
          onPress={() => {
            navigation.navigate('MyDetails', { userInfo, userSummary });
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: backArrow }}>
            {(() => {
              if (!userInfo?.user_name) return '';

              return userInfo?.user_name?.length > 15
                ? userInfo.user_name.slice(0, 15)
                : userInfo.user_name;
            })()}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row-reverse',
            marginRight: 10,
          }}
        >
          <RewardsComponent
            rewards={userSummary && userSummary.coins_available ? userSummary.coins_available : 0}
            source="Feed"
            userInfo={userInfo}
            userSummary={userSummary}
          />
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
        <View style={{ margin: 10 }}>
          {redeemMapping.map((item, index) => (
            <View
              key={index.toString()}
              style={{
                backgroundColor: myRewardsCoins < item.coins_value ? 'rgba(0,0,0,0.2)' : 'white',
                flexDirection: 'row',
                margin: 10,
                padding: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#EEE',
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <View>
                  <Image
                    source={{ uri: `${item.company_logo}?${moment().format('YYYY-MM-DD')}` }}
                    style={{
                      width: 100,
                      height: 100,
                      opacity: myRewardsCoins < item.coins_value ? 0.3 : 1,
                    }}
                  />
                </View>
                <View
                  style={{
                    height: 50,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    padding: 5,
                    borderColor: '#AAA',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: myRewardsCoins < item.coins_value ? '#888' : '#222',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                  >
                    {item.company_name} Gift Card worth Rs.{item.cash_value}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: myRewardsCoins < item.coins_value ? '#888' : '#222',
                      fontSize: 40,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.coins_value}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    userInfo.user_id && userInfo.user_name
                      ? redeemPoints(
                          item.reward_id,
                          item.company_name,
                          item.company_logo,
                          item.coins_value,
                          item.cash_value
                        )
                      : alert('Sorry! User Error. Please restart the app')
                  }
                  disabled={myRewardsCoins < item.coins_value}
                  style={{
                    height: 50,
                    backgroundColor:
                      myRewardsCoins >= item.coins_value
                        ? colorsArray[(randomNo + index) % (colorsArray.length - 1)]
                        : '#AAA',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >
                    REDEEM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* <View style = {{position : 'absolute', left : 30 , bottom : 30 , width : 50 , height : 50 , borderRadius : 60 , backgroundColor : colorsArray[randomNo] }}>
                <TouchableOpacity onPress = {()=>navigation.navigate("Home")}
                style = {{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <AntDesign name = "home" size = {30} color = 'white' />
                </TouchableOpacity>
            </View> */}
    </ScrollView>
  );
}

export default Redemptions;

const styles = StyleSheet.create({});
