import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import axios from 'axios';

import 'react-native-get-random-values';
import { add } from '../../Styles/Add';
import { URL } from '../Exports/Config';
import { backArrow } from '../Exports/Colors';
import { RandomContext } from '../Exports/Context';

function AddCategory() {
  const navigation = useNavigation();
  const route = useRoute();
  const progress = React.useRef(new Animated.Value(0)).current;
  const [randomNo, userId] = React.useContext(RandomContext);

  const [loading, setLoading] = React.useState(false);
  const [masterCategorySelected, setMasterCategorySelected] = React.useState(false);

  const [masterCategoryArray, setMasterCategoryArray] = React.useState([]);
  const [categoryArray, setCategoryArray] = React.useState([]);
  const [categoryFilteredArray, setCategoryFilteredArray] = React.useState([]);

  const headerHeight = 50;

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`${URL}/all/categories`, { params: { limit: 200 } }, { timeout: 3000 })
      .then((res) => res.data)
      .then((responseData) => {
        setLoading(false);
        setCategoryArray(responseData);
        //    console.log([...new Map(responseData.map(item => [item['master_category_name'], item])).values()])
        setMasterCategoryArray([
          ...new Map(responseData.map((item) => [item.master_category_name, item])).values(),
        ]);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={{ backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }}>
      <Animated.View style={add.headerView}>
        <TouchableOpacity
          onPress={() => {
            if (masterCategorySelected) {
              setMasterCategorySelected(false);
            } else {
              navigation.goBack();
            }
          }}
          style={add.headerBack}
        >
          {masterCategorySelected ? (
            <AntDesign name="arrowleft" size={20} color={backArrow} />
          ) : (
            <AntDesign name="close" size={20} color="#AAA" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={add.headerTitle} disabled>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>What do you want to add ? </Text>
        </TouchableOpacity>
      </Animated.View>
      {!masterCategorySelected ? (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 50,
            padding: Dimensions.get('screen').width * 0.02,
          }}
        >
          {masterCategoryArray.map((item, index) => (
            <Pressable
              key={index.toString()}
              onPress={() => {
                //       console.log(categoryArray.filter((item1)=>item1.master_category_name==item.master_category_name))
                setCategoryFilteredArray(
                  categoryArray.filter(
                    (item1) => item1.master_category_name === item.master_category_name
                  )
                );
                setMasterCategorySelected(true);
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                width: Dimensions.get('screen').width * 0.3,
                height: Dimensions.get('screen').width * 0.3,
                marginHorizontal: Dimensions.get('screen').width * 0.01,
                marginVertical: Dimensions.get('screen').width * 0.02,
              }}
            >
              <ImageBackground
                source={{ uri: item.master_category_image }}
                resizeMode="cover"
                style={{
                  flex: 1,
                  padding: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#888',
                  borderRadius: 20,
                }}
                imageStyle={{ borderRadius: 20, opacity: 0.7 }}
              >
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                  {item.master_category_name}
                </Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 50,
            padding: Dimensions.get('screen').width * 0.02,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {categoryFilteredArray.map((item, index) => (
            <Pressable
              key={index.toString()}
              onPress={() => {
                navigation.navigate('AddReview1', {
                  category_id: item.category_id,
                  category_name: item.category_name,
                });
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                width: Dimensions.get('screen').width * 0.3,
                height: Dimensions.get('screen').width * 0.3,
                marginHorizontal: Dimensions.get('screen').width * 0.01,
                marginVertical: Dimensions.get('screen').width * 0.02,
              }}
            >
              <ImageBackground
                source={{ uri: item.category_image }}
                resizeMode="cover"
                style={{
                  flex: 1,
                  padding: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#888',
                  borderRadius: 20,
                }}
                imageStyle={{ borderRadius: 20, opacity: 0.7 }}
              >
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                  {item.category_name}
                </Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default AddCategory;

const styles = StyleSheet.create({});
