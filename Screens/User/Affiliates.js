import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { AntDesign } from 'react-native-vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { backArrow } from '../Exports/Colors';
import { URL } from '../Exports/Config';
import { RandomContext } from '../Exports/Context';

function Affiliates() {
  const navigation = useNavigation();
  const route = useRoute();
  const [randomNo, userId] = React.useContext(RandomContext);
  const [inputs, setInputs] = React.useState([
    { user_id: userId.slice(1, 13), brand_id: '', brand_name: '', affiliate_code: '' },
  ]);

  const [searchArray, setSearchArray] = React.useState([]);

  const [plusDisable, setPlusDisable] = React.useState(true);

  const addHandler = () => {
    const _inputs = [...inputs];
    _inputs.push({ user_id: userId.slice(1, 13), brand_name: '', affiliate_code: '', brand_id: 0 });
    setInputs(_inputs);
  };

  const deleteHandler = (key) => {
    const _inputs = inputs.filter((input, index) => index != key);
    setInputs(_inputs);
  };

  const inputNameHandler = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].brand_name = text;
    setInputs(_inputs);
    axios
      .get(`${URL}/search/brand`, { params: { brand_text: text } }, { timeout: 3000 })
      .then((res) => res.data)
      .then((responseData) => {
        setSearchArray(responseData);
      })
      .catch((error) => {});
  };

  const onSelectBrandName = (brand_name, brand_id, key) => {
    const _inputs = [...inputs];
    _inputs[key].brand_name = brand_name;
    _inputs[key].brand_id = brand_id;
    setInputs(_inputs);
    setSearchArray([]);
  };

  const inputCodeHandler = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].affiliate_code = text;
    setInputs(_inputs);
    if (_inputs[key].value != '' && _inputs[key].code != '') {
      setPlusDisable(false);
    }
  };

  const done = () => {
    console.log(inputs.filter((item, index) => item.value != '' && item.code != '' && id != 0));
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 20,
            height: 40,
            marginLeft: 20,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AntDesign name="arrowleft" size={20} color={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 20,
            marginRight: 0,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          disabled
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Add Affiliate Codes</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.inputsContainer} contentContainerStyle={{}}>
        {inputs.map((input, key) => (
          <View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  width: Dimensions.get('screen').width * 0.45,
                  height: 40,
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                }}
              >
                <TextInput
                  placeholder="Brand Name"
                  value={input.brand_name}
                  onChangeText={(text) => inputNameHandler(text, key)}
                />
              </View>
              <View
                style={{
                  width: Dimensions.get('screen').width * 0.35,
                  height: 40,
                  marginLeft: 10,
                  marginRight: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                }}
              >
                <TextInput
                  placeholder="Affiliate Code"
                  value={input.affiliate_code}
                  onChangeText={(text) => inputCodeHandler(text, key)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteHandler(key)}
                style={{
                  width: Dimensions.get('screen').width * 0.05,
                  height: 40,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
              >
                <AntDesign name="close" color="red" size={20} />
              </TouchableOpacity>
            </View>
            {searchArray &&
              key == inputs.length - 1 &&
              searchArray.length > 0 &&
              searchArray.map((item, index) => (
                <TouchableOpacity
                  style={{ padding: 5 }}
                  onPress={() => onSelectBrandName(item.brand_name, item.brand_id, key)}
                >
                  <Text>{item.brand_name}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
        <TouchableOpacity
          onPress={addHandler}
          disabled={plusDisable}
          style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}
        >
          <AntDesign name="pluscircleo" size={30} />
        </TouchableOpacity>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 20 }}>
          <LinearGradient
            colors={['#ed4b60', '#E7455A', '#D7354A']}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: Dimensions.get('screen').width * 0.3,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <TouchableOpacity onPress={done}>
              <Text style={{ color: 'white' }}>Done</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default Affiliates;
