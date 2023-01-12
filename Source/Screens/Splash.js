import {Image, SafeAreaView} from 'react-native';
import React, {Component} from 'react';
import {color} from '../Helper/Global';
import {POST} from '../Helper/ApiManger/Apis';
import {VERSION} from '../Helper/Global';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Splash extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  async next() {
    var patnerId = await AsyncStorage.getItem('patnerId');
    if (JSON.parse(patnerId) == null) {
      this.props.navigation.replace('Welcome');
    } else {
      this.props.navigation.replace('MyDrawer');
    }
  }
  componentDidMount() {
    var that = this;
    setTimeout(function () {
      that.version();
    }, 1000);
  }
  version() {
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    POST('version', raw)
      .then(response => {
        console.log(
          'version Response  ',
          response,
          response.result.response[0].version,
          VERSION.version,
        );
        if (response.result.response[0].version) {
          if (VERSION.version == response.result.response[0].version) {
            this.next();
          } else {
            Toast.showWithGravity(
              'Update your Application',
              Toast.SHORT,
              Toast.BOTTOM,
            );
          }
        } else {
          Toast.showWithGravity(
            'Something went wrong!',
            Toast.SHORT,
            Toast.BOTTOM,
          );
        }
      })
      .catch(err => {
        console.log('Erroorr', err);
      });
  }
  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: color.Primary,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{height: 60, width: 160}}
          source={require('../Helper/Assets/Gmaart.png')}
        />
      </SafeAreaView>
    );
  }
}
