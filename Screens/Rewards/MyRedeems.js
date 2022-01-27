import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

import { FontAwesome5 } from 'react-native-vector-icons';

import axios from 'axios';
import moment from 'moment';
import * as Amplitude from 'expo-analytics-amplitude';
import { URL } from '../Exports/Config';
import { mySummaryStyle } from '../../Styles/MySummary';
import { RandomContext } from '../Exports/Context';
import { colorsArray } from '../Exports/Colors';

function BurnItemComponent({ item, id }) {
  const [randomNo, userId] = React.useContext(RandomContext);

  function GiftVoucher({ coins_value, cash_value, company_name, company_logo, redeemed_at }) {
    return (
      <View style={[mySummaryStyle.activityComponent, { flexDirection: 'row' }]}>
        <View style={{ height: 50, width: 50 }}>
          <Image
            source={{ uri: `${company_logo}?${moment().format('YYYY-MM-DD')}` }}
            style={{ height: 50, width: 50 }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={mySummaryStyle.activity}>
            <Text style={mySummaryStyle.activityText}>
              Redeemed{' '}
              <Text
                style={[
                  mySummaryStyle.coinsValue,
                  { color: colorsArray[(randomNo + id) % (colorsArray.length - 1)] },
                ]}
              >
                {coins_value}
              </Text>{' '}
              <FontAwesome5 name="coins" color="#D9A760" /> for{' '}
              <Text style={mySummaryStyle.username}>
                Rs.{cash_value} {company_name} Gift Voucher
              </Text>{' '}
            </Text>
          </View>
          <View style={mySummaryStyle.date}>
            <Text style={mySummaryStyle.dateText}>
              {moment(redeemed_at, 'YYYY-MM-DD hh:mm:ss')
                .add(5, 'hours')
                .add(30, 'minutes')
                .fromNow()}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <GiftVoucher
      coins_value={item.coins_value}
      cash_value={item.cash_value}
      company_name={item.company_name}
      company_logo={item.company_logo}
      redeemed_at={item.redeemed_at}
    />
  );
}

function MyRedeems({ user_id }) {
  const [burnRewards, setBurnRewards] = React.useState([]);

  React.useEffect(() => {
    Amplitude.logEventAsync('MY REDEEMS');
    axios
      .get(`${URL}/rewards/user/burn`, { params: { user_id } }, { timeout: 5000 })
      .then((res) => res.data)
      .then((responseData) => {
        // console.log(responseData)
        setBurnRewards(responseData);
      })
      .catch((error) => {});
  }, []);

  function BurnItem({ item, index }) {
    return (
      <View key={index.toString()}>
        <BurnItemComponent item={item} id={index} />
      </View>
    );
  }

  const emptyComponent = () => (
    <View style={{ padding: 20 }}>
      <Text>
        You haven't redeemed your coins yet. Click on REDEEM NOW or icon in the bottom for exciting
        gift vouchers
      </Text>
    </View>
  );

  return (
    <View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 0 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={burnRewards}
        renderItem={BurnItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={emptyComponent}
      />
    </View>
  );
}

export default MyRedeems;

const styles = StyleSheet.create({});
