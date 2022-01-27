import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Animated, View, Text, Easing, Dimensions, Pressable, Share } from 'react-native';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import * as Amplitude from 'expo-analytics-amplitude';
import { RandomContext } from '../Exports/Context';
import { background, themeLight, theme } from '../Exports/Colors';

function PostShare() {
  const progress = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();
  const [randomNo, userId] = React.useContext(RandomContext);
  const [isVisible, setVisible] = React.useState(true);
  const [body, setBody] = React.useState(route?.params?.body);

  React.useEffect(() => {
    Amplitude.logEventAsync('ADD SHARE POST');
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const onModalClose = () => {
    navigation.navigate('Home');
  };

  const share = async () => {
    console.log(body);
    Amplitude.logEventWithPropertiesAsync('REFERRAL', { userId: body.user_name });
    try {
      const result = await Share.share({
        message: `Shop from the amazing products I recommended on https://www.getcandid.app/user?user_name=${body.user_name} . Use my referral code : ${body.coupon}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          //     console.log(result.activityType)
        } else {
          //  console.log(result)
        }
      } else if (result.action === Share.dismissedAction) {
        onModalClose();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: background }}>
      <View>
        <LottieView
          progress={progress}
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').width * 0.5,
          }}
          source={require('../../assets/animation/celebration.json')}
          autoPlay
        />
      </View>
      <Modal
        isVisible={isVisible}
        deviceWidth={Dimensions.get('screen').width}
        deviceHeight={Dimensions.get('screen').height}
        onBackdropPress={onModalClose}
        onSwipeComplete={onModalClose}
        swipeDirection="left"
        style={{ marginHorizontal: 20, marginTop: Dimensions.get('screen').height * 0.6 }}
      >
        <View style={{ borderRadius: 20, backgroundColor: 'white' }}>
          <View style={{ padding: 10 }}>
            <Text style={{ color: themeLight }}>
              Share this post on your social handles and earn exciting rewards !
            </Text>
          </View>
          <Pressable
            android_ripple={{ color: 'black' }}
            onPress={share}
            style={{
              backgroundColor: theme,
              borderRadius: 20,
              padding: 10,
              alignItems: 'center',
              margin: 10,
            }}
          >
            <Text style={{ color: 'white', marginRight: 10 }}>Share</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

export default PostShare;
