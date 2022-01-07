import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Feed from './Home/Feed';
import MySummary from './Rewards/MySummary';
import MyDetails from './User/MyDetails';
import React, { useState } from 'react';
import ByCategory from './Search/ByCategory';
import Category from './Page/Category';

import User from './Page/User';

import Redemptions from './Rewards/Redemptions';
import Login from './Onboarding/Login';
import { RandomContext } from './Exports/Context';
import Signout from './Onboarding/Signout';
import ProfileInfo from './Onboarding/ProfileInfo';
import DrawerContent from './DrawerContent';

import AddProduct from './Add/AddProduct'
import AddCategory from './Add/AddCategory';
import AddContext from './Add/AddContext';
import AddImage from './Add/AddImage';
import AddComment from './Add/AddComment';
import PostShare from './Add/PostShare';
import Blank from './Blank';
import InApp from './Browser/InApp';
import Coupon from './Onboarding/Coupon';
import EditProfile from './User/EditProfile';
import HowToEarn from './Rewards/HowToEarn';
import Post from './Home/Post';
import FeedAlt from './Home/FeedAlt';
import CategoryAlt from './Page/CategoryAlt';
import Product from './Page/Product';
import Search from './Home/Search';
import UserLink from './Page/UserLink';
import AltAdd from './Add/AltAdd';
import AltAdd1 from './Add/AltAdd1';
import AddReview from './Add/AddReview';
import AddReview1 from './Add/AddReview1';
import { Animated, Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { alttheme, altthemeLight, altthemeLightest, backArrow, background, theme, themeLightest } from './Exports/Colors';
import {FontAwesome5} from 'react-native-vector-icons'
import MySummaryTab from './Rewards/MySummaryTab';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator();

const totalWidth = Dimensions.get("window").width;
const TAB_BAR_HEIGHT = 50
const TAB_ICON_SIZE = 20
const TAB_SLIDER_HEIGHT = 2
// const TAB_SLIDER_COLOR = "#C51E3A"
const TAB_SLIDER_COLOR = themeLightest
const TAB_ACTIVE_COLOR = 'white'
const TAB_INACTIVE_COLOR = altthemeLightest


const BottomMenu = ({iconName,isCurrent,label,value,index}) => {
  return(
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor :  alttheme,
        margin : 0,
        padding : 0,
      }}
    >
      <FontAwesome5
        name={iconName}
        size={TAB_ICON_SIZE}
        style={{ color:  isCurrent ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR }}
      />
      <Text 
      style = {{ color:  isCurrent ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR }}
      >{label}</Text>
    </View>
  )}





const TabBar = ({state,descriptors,navigation}) => {
  const [randomNo,userId] = React.useContext(RandomContext)


  const [translateValue] = useState(new Animated.Value(0));
  const tabWidth = totalWidth / state.routes.length;
  return (
  <View style={[style.tabContainer, { width: totalWidth }]}>
    <View style={{ flexDirection: "row" }}>
    <Animated.View
        style={[
          style.slider,
          {
            transform: [{ translateX: translateValue }],
            width: tabWidth - 30,
          },
        ]}
      />
      {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
              Animated.spring(translateValue, {
                  toValue: index * tabWidth,
                  velocity: 10,
                  useNativeDriver: true,
                }).start();
          }
          const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };
          return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ["selected"] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
                key={index}
              >   
                  <BottomMenu
                  iconName={label.toString()}
                  isCurrent={isFocused}
                  label = {options.title}
                  value = {0}
                  index = {index}
                />
              </TouchableOpacity>
            )
          })}
    </View>
  </View>
  )
}


const AuthStack = ({navigation}) => {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeTab" component={HomeStack}  /> 
        <Stack.Screen name="Login" component ={Login} />
        <Stack.Screen name="Signout" component ={Signout} />
        <Stack.Screen name="UserLink" component ={UserLink} />
      </Stack.Navigator>
  );
}

const HomeStack = () => {
  const [randomNo,userId] = React.useContext(RandomContext)
  return (
    <Stack.Navigator 
      screenOptions={{headerShown: false}}
      initialRouteName = {userId === "" ? "Auth" : "Blank"}>
      <Stack.Screen name="Home" component={MyTabs} />
      <Stack.Screen name="Home1" component={Feed} />
      <Stack.Screen name="HomeHome" component={FeedAlt} />
      <Stack.Screen name="AddPost" component={AddProduct} />
      <Stack.Screen name="AddCategory" component={AddCategory} />
      <Stack.Screen name="AddContext" component={AddContext} />
      <Stack.Screen name="AddImage" component={AddImage} />
      <Stack.Screen name="PostShare" component={PostShare} />
      <Stack.Screen name="AddComment" component={AddComment} />
      <Stack.Screen name="MyDetails" component={MyDetails} />
      <Stack.Screen name="MyRewards" component={MySummary} />
      <Stack.Screen name="Redeem" component={Redemptions} />
      <Stack.Screen name="SearchByCategory" component={ByCategory} /> 
      <Stack.Screen name="CategoryPage" component={Category} /> 
      <Stack.Screen name="UserPage" component={User} /> 
      <Stack.Screen name="ProductPage" component={Product} /> 
      <Stack.Screen name="Auth" component={AuthStack} /> 
      <Stack.Screen name="Signout" component={Signout} /> 
      <Stack.Screen name="ProfileInfo" component={ProfileInfo} /> 
      <Stack.Screen name="Blank" component={Blank} /> 
      <Stack.Screen name="Browser" component={InApp} /> 
      <Stack.Screen name="Coupon" component={Coupon} /> 
      <Stack.Screen name="EditProfile" component={EditProfile} /> 
      <Stack.Screen name="HowToEarn" component={HowToEarn} /> 
      <Stack.Screen name="Post" component={Post} /> 
      <Stack.Screen name="CategoryAlt" component={CategoryAlt} /> 
      <Stack.Screen name="Search" component={Search} /> 
      <Stack.Screen name="UserLink" component={UserLink} /> 
      <Stack.Screen name="AltAdd" component={AltAdd} /> 
      <Stack.Screen name="AltAdd1" component={AltAdd1} /> 
      <Stack.Screen name="AddReview" component={AddReview} /> 
      <Stack.Screen name="AddReview1" component={AddReview1} /> 
    </Stack.Navigator>
  );
}

const MyTabs = () => {
  return (
    <Tab.Navigator 
     screenOptions = {{
        "tabBarActiveTintColor": "green",
        "tabBarStyle": [{"display": "flex"},null],
        "headerShown" : false,
      }}
        sceneContainerStyle={{backgroundColor: 'white'}}
        options = {{unmountOnBlur : true , tabBarHideOnKeyboard : false }}
        tabBar={props => <TabBar {...props} />}
        initialRouteName = "TabHome"  >
      <Tab.Screen name="TabHome" component={FeedAlt} options = {tab1Options} />
      <Tab.Screen name="Feed" component={Feed} options = {tab2Options} />
      <Tab.Screen name="Rewards" component={MySummaryTab} options = {tab3Options} />
    </Tab.Navigator>
  );
}

const Navigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown : false}}
      drawerContent = {props => <DrawerContent {...props}/>}
      >
      <Drawer.Screen name="HomeStack" component={HomeStack} />
      <Drawer.Screen name="SignOut" component={Signout} />
    </Drawer.Navigator>
  );
}


export default Navigator



const style = StyleSheet.create({
  tabContainer: {
    height: TAB_BAR_HEIGHT,
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.0,
    backgroundColor: 'white',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    elevation: 5,
    position: "absolute",
    bottom: 0,
  },
  slider: {
    height: TAB_SLIDER_HEIGHT,
    position: "absolute",
    top: 0,
    left: 13,
    backgroundColor: TAB_SLIDER_COLOR,
    borderRadius: 10,
    width: 50
},

  container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
   },
   contentContainer: {
      flex: 1,
      paddingLeft: 50
   },
   bottomSheetTitle: {
       fontSize: 24,
       fontWeight: '500'
   }

});


const tab1Options = {
  tabBarLabel: 'home',
  title : "Home",
  tabBarColor: 'orange',
  tabBarHideOnKeyboard : false
    }

const tab2Options = {
//  tabBarLabel: 'card-plus',
  tabBarLabel: 'stream',
  title : "Feed",
  tabBarColor: 'purple',
  tabBarHideOnKeyboard : true,
  tabBarStyle : {display : 'none'}
}

const tab3Options = {
  tabBarLabel: 'coins',
  title : "Rewards",
  tabBarColor: 'orange',
  tabBarHideOnKeyboard : false
    }

const tab4Options = {
//  tabBarLabel: 'card-plus',
  tabBarLabel: 'user-alt',
  title : "User",
  tabBarColor: 'purple',
  tabBarHideOnKeyboard : true,
  tabBarStyle : {display : 'none'}
}


