import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Easing,
  Dimensions,
  StyleSheet,
} from 'react-native';
import LottieView from 'lottie-react-native';
import * as Amplitude from 'expo-analytics-amplitude';
import { colorsArray } from './Colors';
import { RandomContext } from './Context';

export function RewardsComponent({ rewards, source, userSummary, userInfo }) {
  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [randomNo] = React.useContext(RandomContext);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <TouchableOpacity
      style={{ marginRight: 30, flexDirection: 'row-reverse' }}
      onPress={() => {
        Amplitude.logEventWithPropertiesAsync('Clicked on Rewards section ', { source });
        navigation.navigate('MyRewards', { source });
      }}
    >
      <View style={{ justifyContent: 'center', marginLeft: 5, marginRight: 10 }}>
        <Text style={{ color: colorsArray[randomNo - 1], fontSize: 15, fontWeight: '700' }}>
          {rewards}
        </Text>
      </View>
      <View style={{ justifyContent: 'center', marginLeft: 10 }}>
        <LottieView
          progress={progress}
          style={{ width: 40, height: 40 }}
          source={require('../../assets/animation/coins-money.json')}
          autoPlay
        />
      </View>
    </TouchableOpacity>
  );
}

export function GiftComponent() {
  const progress = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <View style={{ justifyContent: 'center' }}>
      <LottieView
        progress={progress}
        style={{ width: 200, height: 200 }}
        source={require('../../assets/animation/gift.json')}
      />
    </View>
  );
}

export function EmptyComponent() {
  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [randomNo] = React.useContext(RandomContext);

  React.useEffect(() => {
    Amplitude.logEventAsync('Empty Component Shown');
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
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
  );
}

export function ErrorComponent() {
  return (
    <View style={{ justifyContent: 'center' }}>
      <Text>Uh Oh!</Text>
      <Text>Something's not right</Text>
      <Text>
        We will investigate it and fix this error. Please try the following in the meantime:
      </Text>
      <View style={styles.errorView}>
        <Text style={styles.errorTopic}>
          We will investigate it and fix this error. Please try the following in the meantime:
        </Text>
        <Text style={styles.errorText}>
          We will investigate it and fix this error. Please try the following in the meantime:
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorView: {},
  errorTopic: {},
  errorText: {},
});
