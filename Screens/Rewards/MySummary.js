import React from 'react';
import { Animated, Easing, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios';
import { URL } from '../Exports/Config';
import MyEarns from './MyEarns';
import MyRedeems from './MyRedeems';
import { RandomContext } from '../Exports/Context';
import { RewardsComponent } from '../Exports/Components';
import { alttheme, backArrow, background, theme, themeLightest } from '../Exports/Colors';

const Tab = createMaterialTopTabNavigator();
function Tabs({ user_id }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { color: theme },
        tabBarStyle: { backgroundColor: background },
        tabBarIndicatorStyle: { backgroundColor: theme },
      }}
    >
      <Tab.Screen name="Coins Earned" children={() => <MyEarns user_id={user_id} />} />
      <Tab.Screen name="Coins Redeemed" children={() => <MyRedeems user_id={user_id} />} />
    </Tab.Navigator>
  );
}

function MySummary() {
  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();

  const [userSummary, setUserSummary] = React.useState({});
  const [userInfo, setUserInfo] = React.useState({});
  const [recentBurn, setRecentBurn] = React.useState({
    user_id: 0,
    coins_value: 0,
  });
  const [randomNo, userId] = React.useContext(RandomContext);
  const [earnRewards, setEarnRewards] = React.useState([]);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    axios
      .get(`${URL}/user/summary`, { params: { user_id: userId.slice(1, 13) } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        //        console.log(responseData)
        setUserSummary(responseData[0]);
      })
      .catch((error) => {});
    axios
      .get(`${URL}/user/info`, { params: { user_id: userId.slice(1, 13) } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        //         console.log(responseData)
        setUserInfo(responseData[0]);
      })
      .catch((error) => {});

    axios
      .get(
        `${URL}/rewards/user/today/burn`,
        { params: { user_id: userId.slice(1, 13) } },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        //         console.log(responseData)
        setRecentBurn(...recentBurn, responseData[0]);
      })
      .catch((error) => {});

    axios
      .get(
        `${URL}/rewards/user/earn`,
        { params: { user_id: userId.slice(1, 13) } },
        { timeout: 5000 }
      )
      .then((res) => res.data)
      .then((responseData) => {
        //         console.log(responseData)
        setEarnRewards(responseData);
      })
      .catch((error) => {});
  }, []);

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
            {userInfo && userInfo.user_name
              ? userInfo.user_name.length > 15
                ? userInfo.user_name
                : userInfo.user_name.slice(0, 15)
              : ''}
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
      <View style={{ height: 40, backgroundColor: themeLightest, marginTop: 50 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HowToEarn', { userSummary, userInfo, recentBurn })}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderBottomColor: '#888',
            borderBottomWidth: 1,
            borderStyle: 'dashed',
          }}
        >
          <Text style={{ color: alttheme, fontWeight: 'bold' }}>How to Earn ?</Text>
        </TouchableOpacity>
      </View>

      <NavigationContainer independent>
        <Tabs user_id={userId.slice(1, 13)} />
      </NavigationContainer>
      <View style={{ height: 40, backgroundColor: 'white' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Redeem', { userSummary, userInfo, recentBurn })}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderColor: '#EEE',
            borderWidth: 1,
            borderStyle: 'dashed',
          }}
        >
          <Text style={{ color: theme, fontWeight: 'bold', fontSize: 18 }}>REDEEM NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MySummary;

const styles = StyleSheet.create({});
