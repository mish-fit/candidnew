import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";

import Feed from './Home/Feed';
import MySummary from './Rewards/MySummary';
import MyDetails from './User/MyDetails';
import React from 'react';
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


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator()

const AuthStack = ({navigation}) => {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeTab" component={HomeStack}  /> 
        <Stack.Screen name="Login" component ={Login} />
      </Stack.Navigator>
  );
}

const HomeStack = () => {
  const [randomNo,userId] = React.useContext(RandomContext)
  return (
    <Stack.Navigator 
      screenOptions={{headerShown: false}}
      initialRouteName = {userId === "" ? "Auth" : "Blank"}>
      <Stack.Screen name="Home" component={Feed} />
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
      <Stack.Screen name="Auth" component={AuthStack} /> 
      <Stack.Screen name="Signout" component={Signout} /> 
      <Stack.Screen name="ProfileInfo" component={ProfileInfo} /> 
      <Stack.Screen name="Blank" component={Blank} /> 
      <Stack.Screen name="Browser" component={InApp} /> 
    </Stack.Navigator>
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