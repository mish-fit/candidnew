import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { URL } from './Exports/Config';
import { LoadingPage } from './Exports/Pages';

function Blank() {
  const navigation = useNavigation();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        axios
          .get(
            `${URL}/user/info`,
            { params: { user_id: user.phoneNumber.slice(1, 13) } },
            { timeout: 5000 }
          )
          .then((res) => res.data)
          .then(async (responseData) => {
            if (responseData.length && responseData[0].user_name) {
              navigation.navigate('Home', { phoneNumber: user.phoneNumber, body: responseData[0] });
            } else {
              navigation.navigate('ProfileInfo', { phoneNumber: user.phoneNumber });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LoadingPage />
    </View>
  );
}

export default Blank;

const styles = StyleSheet.create({});
