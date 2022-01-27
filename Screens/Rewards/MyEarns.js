import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { FontAwesome5 } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import axios from 'axios';
import moment from 'moment';
import * as Amplitude from 'expo-analytics-amplitude';
import { URL } from '../Exports/Config';
import { mySummaryStyle } from '../../Styles/MySummary';
import { RandomContext } from '../Exports/Context';
import { theme } from '../Exports/Colors';

function EarnItemComponent({ item, id }) {
  const [randomNo, userId] = React.useContext(RandomContext);

  function Onboarding({ reward_type, coins_value, created_at }) {
    return (
      <View style={mySummaryStyle.activityComponent}>
        <View style={mySummaryStyle.activity}>
          <Text style={mySummaryStyle.activityText}>
            You earned{' '}
            <Text style={[mySummaryStyle.coinsValue, { color: theme }]}>{coins_value}</Text>{' '}
            <FontAwesome5 name="coins" color="#D9A760" /> for {reward_type}
          </Text>
        </View>
        <View style={mySummaryStyle.date}>
          <Text style={mySummaryStyle.dateText}>
            {moment(created_at, 'YYYY-MM-DD hh:mm:ss').add(5, 'hours').add(30, 'minutes').fromNow()}
          </Text>
        </View>
      </View>
    );
  }

  function Referral({ reward_type, coins_value, engaged_user_name, created_at }) {
    return (
      <View style={mySummaryStyle.activityComponent}>
        <View style={mySummaryStyle.activity}>
          <Text style={mySummaryStyle.activityText}>
            <Text style={mySummaryStyle.username}>{engaged_user_name}</Text> {reward_type}. You
            earned <Text style={[mySummaryStyle.coinsValue, { color: theme }]}>{coins_value}</Text>{' '}
            <FontAwesome5 name="coins" color="#D9A760" />{' '}
          </Text>
        </View>
        <View style={mySummaryStyle.date}>
          <Text style={mySummaryStyle.dateText}>
            {moment(created_at, 'YYYY-MM-DD hh:mm:ss').add(5, 'hours').add(30, 'minutes').fromNow()}
          </Text>
        </View>
      </View>
    );
  }

  function Engagement({
    reward_type,
    coins_value,
    engaged_user_name,
    engaged_product_name,
    created_at,
  }) {
    return (
      <View style={mySummaryStyle.activityComponent}>
        <View style={mySummaryStyle.activity}>
          <Text style={mySummaryStyle.activityText}>
            <Text style={mySummaryStyle.username}>{engaged_user_name}</Text> {reward_type} on{' '}
            {engaged_product_name}. You earned{' '}
            <Text style={[mySummaryStyle.coinsValue, { color: theme }]}>{coins_value}</Text>{' '}
            <FontAwesome5 name="coins" color="#D9A760" />{' '}
          </Text>
        </View>
        <View style={mySummaryStyle.date}>
          <Text style={mySummaryStyle.dateText}>
            {moment(created_at, 'YYYY-MM-DD hh:mm:ss').add(5, 'hours').add(30, 'minutes').fromNow()}
          </Text>
        </View>
      </View>
    );
  }

  function PostReview({
    reward_type,
    coins_value,
    engaged_user_name,
    engaged_product_name,
    created_at,
  }) {
    return (
      <View style={mySummaryStyle.activityComponent}>
        <View style={mySummaryStyle.activity}>
          <Text style={mySummaryStyle.activityText}>
            <Text style={mySummaryStyle.username}>{engaged_user_name}</Text> {reward_type} on{' '}
            {engaged_product_name}. You earned{' '}
            <Text style={[mySummaryStyle.coinsValue, { color: theme }]}>{coins_value}</Text>{' '}
            <FontAwesome5 name="coins" color="#D9A760" />{' '}
          </Text>
        </View>
        <View style={mySummaryStyle.date}>
          <Text style={mySummaryStyle.dateText}>
            {moment(created_at, 'YYYY-MM-DD hh:mm:ss').add(5, 'hours').add(30, 'minutes').fromNow()}
          </Text>
        </View>
      </View>
    );
  }

  return item.engaged_product_name ? (
    <Engagement
      reward_type={item.reward_type}
      coins_value={item.coins_value}
      engaged_user_name={item.engaged_user_name}
      engaged_product_name={item.engaged_product_name}
      created_at={item.created_at}
    />
  ) : item.engaged_user_name ? (
    <Referral
      reward_type={item.reward_type}
      coins_value={item.coins_value}
      engaged_user_name={item.engaged_user_name}
      created_at={item.created_at}
    />
  ) : (
    <Onboarding
      reward_type={item.reward_type}
      coins_value={item.coins_value}
      engaged_user_name={item.engaged_user_name}
      created_at={item.created_at}
    />
  );
}

function MyEarns({ user_id }) {
  const navigation = useNavigation();
  const route = useRoute();

  const [userSummary, setUserSummary] = React.useState({});
  const [userInfo, setUserInfo] = React.useState({});
  const [randomNo, userId] = React.useContext(RandomContext);
  const [earnRewards, setEarnRewards] = React.useState([]);

  React.useEffect(() => {
    Amplitude.logEventAsync('MY EARNS');
    axios
      .get(`${URL}/rewards/user/earn`, { params: { user_id } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        //     console.log(responseData)
        setEarnRewards(responseData);
      })
      .catch((error) => {});
  }, []);

  function EarnItem({ item, index }) {
    return (
      <View key={index.toString()}>
        <EarnItemComponent item={item} id={index} />
      </View>
    );
  }

  const emptyComponent = () => (
    <View style={{ padding: 20 }}>
      <Text>
        You haven't earned any coins yet. Click on "How to Earn" to learn exciting ways to get
        rewards
      </Text>
    </View>
  );

  return (
    <View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 0, marginLeft: 10 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={earnRewards}
        renderItem={EarnItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={emptyComponent}
      />
    </View>
  );
}

export default MyEarns;

const styles = StyleSheet.create({});
