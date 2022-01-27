import React from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as Amplitude from 'expo-analytics-amplitude';
import { theme, background } from '../Exports/Colors';
import { firebaseConfig } from '../Exports/Config';

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  // ignore app already initialized error in snack
}

function Signout() {
  const navigation = useNavigation();
  const route = useRoute();

  const signoutToHome = async () => {
    Amplitude.logEventAsync('SIGN OUT');
    console.log('Reached Singout ');

    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate('Auth');
        ToastAndroid.show('Logged Out succesfully. Please restart the app!!', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const noToHome = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Do you want to signout ? </Text>
        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: theme, padding: 10, borderRadius: 20 }}
          onPress={signoutToHome}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}
          onPress={noToHome}
        >
          <Text style={{ color: theme, fontSize: 18 }}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Signout;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: background,
  },
  button: {
    backgroundColor: background,
    padding: 10,
    borderRadius: 3,
    margin: 10,
    width: 100,
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
  },
  text: {
    fontSize: 15,
    color: theme,
  },
  button1: {
    backgroundColor: theme,
    padding: 10,
    borderRadius: 3,
    margin: 10,
    width: 100,
    alignItems: 'center',
  },
  text1: {
    color: background,
  },
});
