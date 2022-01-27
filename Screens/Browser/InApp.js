import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from 'react-native-vector-icons';
import { add } from '../../Styles/Add';
import { colorsArray } from '../Exports/Colors';

function InApp() {
  const navigation = useNavigation();
  const route = useRoute();

  const [url, setUrl] = React.useState(route?.params?.url ? route.params.url : '');

  function EmptyComponent() {
    return (
      <View>
        <Text>Webpage doesn't exist</Text>
      </View>
    );
  }

  return (
    <View>
      <Animated.View style={add.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={add.headerBack}>
          <AntDesign name="arrowleft" size={30} color={colorsArray[randomNo]} />
        </TouchableOpacity>
        <TouchableOpacity style={add.headerTitle} disabled>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: colorsArray[randomNo - 1] }}>
            Shop
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {url != '' && url != 'none' ? <WebView source={{ uri: url }} /> : <EmptyComponent />}
    </View>
  );
}

export default InApp;

const styles = StyleSheet.create({});
