import {TouchableOpacity, Text, Dimensions, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Mcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {Component} from 'react';
import {color} from '../../Helper/Global';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ProfileContainer extends Component {
  async onsubmit() {
    if (this.props.item.nextScreen != '') {
      if (this.props.item.name == 'Sign Out') {
        Alert.alert('', 'Are You sure want to logout?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.signOut()},
        ]);
      } else if (this.props.item.name == 'Cart') {
        this.props.navigation.push('Cart', {screenName: 'Account'});
      } else if (this.props.item.name == 'Order History') {
        this.props.navigation.push('SalesOrderHistory', {
          screenName: 'Account',
        });
      } else if (this.props.item.name == 'Delivery Address') {
        this.props.navigation.push('DeliveryAdress', {});
      } else {
        this.props.navigation.push(this.props.item.nextScreen);
      }
    }
  }
  async signOut() {
    console.log('this is sign out');
    await AsyncStorage.removeItem('orderId');
    await AsyncStorage.removeItem('patnerId');
    await AsyncStorage.removeItem('userId');

    this.props.navigation.replace('Welcome');
  }
  render() {
    const item = this.props.item;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          this.onsubmit();
          // item.nextScreen != ''
          //   ? (item.name = 'Sign Out'
          //       ? this.props.navigation.navigate(item.nextScreen)
          //       : null)
          //   : null;
        }}
        style={{
          flexDirection: 'row',
          margin: 10,
          marginLeft: 15,
        }}>
        {/* <Mcon
          style={{alignSelf: 'center', marginRight: 15}}
          name="arrow-drop-down"
          size={30}
          color={color.Primary}
        /> */}
        <Text
          style={{
            color: 'gray',
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 0,
            alignSelf: 'center',
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }
}
