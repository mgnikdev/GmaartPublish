import React, {Component} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../Screens/Home';
import ProductList from '../Screens/ProductList/ProductList';
import CategoryList from '../Screens/CategoryList/CategoryList';
import DrawerComponent from '../Components/drawerComponent';
import DiscoverMore from '../Screens/DiscoverMore';
import ProfileStack from './ProfileStack';
import MyListStack from './MyListStack';
import AllProductList from '../Screens/AllProductList/AllProductList';
import BrandList from '../Screens/BrandList/BrandList';
import SalesOrderHistory from '../Screens/OrderHistory/SalesOrderHistory';
import OrderHistoryStack from './OrderHistoryStack';
import CategoryListStack from './CategoryListStack';
import BrandStack from './BrandStack';
import HomeStack from './HomeStack';
import Profile from '../Screens/Profile/Profile';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      drawerContent={props => <DrawerComponent {...props} />}
      drawerStyle={{width: '100%'}}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="CategoryListStack" component={CategoryListStack} />

      <Drawer.Screen name="ProductList" component={ProductList} />
      <Drawer.Screen name="BrandStack" component={BrandStack} />

      <Drawer.Screen name="AllProductList" component={AllProductList} />
      <Drawer.Screen name="OrderHistoryStack" component={OrderHistoryStack} />

      <Drawer.Screen name="DiscoverMore" component={DiscoverMore} />
      {/* <Drawer.Screen name="ProfileStack" component={ProfileStack} /> */}
      <Drawer.Screen name="Profile" component={Profile} />

      <Drawer.Screen name="MyListStack" component={MyListStack} />
    </Drawer.Navigator>
  );
}

export default MyDrawer;
