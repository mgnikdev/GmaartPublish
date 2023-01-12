import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
      // mobEmail: 'api@meghsundar.com',
      // password: 'Api@123321',
      mobEmail: '',
      password: '',

      loading: false,
    };
  }
  validationField() {
    if (this.state.mobEmail == '') {
      Toast.showWithGravity(
        'Please Enter Email/Mobile ',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password == '') {
      Toast.showWithGravity(
        'Please Enter Password ',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else {
      this.login();
    }
  }
  login() {
    // alert('Logggin Call');
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        login: this.state.mobEmail,
        password: this.state.password,
        // db: 'website_test_v14', /////testing DB
        db: 'website', ////Live Server
        // db: 'website_test',///////Production DB
      },
    });
    console.log('auth raw ', raw);

    POST('web/session/authenticate', raw)
      .then(async response => {
        this.setState({loading: false});

        if (response.error) {
          // Toast.showWithGravity(
          //   response.error.message,
          //   Toast.SHORT,
          //   Toast.BOTTOM,
          // );
          if (response.error.data.arguments[0] == 'Access Denied') {
            Alert.alert('', 'Your Id or Password is Incorrect', [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          } else {
            Alert.alert('', response.error.data.arguments[0], [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          }
        }

        console.log('auth Response ', response);
        await AsyncStorage.setItem(
          'patnerId',
          JSON.stringify(response.result.partner_id),
        );
        await AsyncStorage.setItem(
          'userId',
          JSON.stringify(response.result.user_id[0]),
        );
        // this.props.navigation.reset({
        //   index: 0,
        //   routes: [{name: 'MyDrawer'}],
        // });
        this.props.navigation.replace('MyDrawer');
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        {this.state.loading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color="#000"
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        <Icon
          style={{
            position: 'absolute',
            left: 10,
            top: Platform.OS == 'ios' ? 55 : 10,
            zIndex: 11111111,
          }}
          name="keyboard-backspace"
          size={30}
          color="#000"
          onPress={() => this.props.data(false)}
        />

        <View style={styles.loginTextContainer}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
            LOG IN
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={{marginLeft: 15, marginTop: 50, color: 'black'}}>
            Mobile or Email
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({mobEmail: text})}
            value={this.state.mobEmail}
            placeholder="Mobile or Email"
            placeholderTextColor="gray"
          />
          <View>
            <Text style={{marginLeft: 15, marginTop: 20, color: 'black'}}>
              Password
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={this.state.showPassword ? false : true}
            />
            {this.state.showPassword == false ? (
              <Mcon
                style={{position: 'absolute', right: 25, top: 50}}
                name="ios-eye-off-outline"
                size={20}
                color="#000"
                onPress={() =>
                  this.setState({showPassword: !this.state.showPassword})
                }
              />
            ) : (
              <Mcon
                style={{position: 'absolute', right: 25, top: 50}}
                name="eye-outline"
                size={20}
                color="#000"
                onPress={() =>
                  this.setState({showPassword: !this.state.showPassword})
                }
              />
            )}
          </View>

          <Pressable
            activeOpacity={0.8}
            style={styles.loginBtn}
            onPress={() => this.validationField()}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
              LOG IN
            </Text>
          </Pressable>

          <Text
            style={styles.forgotText}
            onPress={() => {
              this.props.data(false);
              this.props.navigation.replace('ForgotPasswordStack');
            }}>
            Forget Password?
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.accountText}>
            Don't have an account?{' '}
            <Text
              style={{color: color.Primary, fontWeight: '700'}}
              onPress={() => {
                // this.props.data(false);
                this.props.signUpData(true);
                // this.props.data(false);

                // this.props.navigation.navigate('SignUp');
              }}>
              Sign Up
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activityLoader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 1000,
  },
  accountText: {
    textAlign: 'center',
    color: '#808080',
    fontSize: 16,
    marginTop: 30,
  },
  fbConatiner: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    backgroundColor: 'white',
    width: windowWidth / 2.5,
    margin: 10,
    borderRadius: 10,
  },
  googleContainer: {
    backgroundColor: 'white',
    width: windowWidth / 2.5,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  socialContainer: {
    flexDirection: 'row',
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  socialText: {
    textAlign: 'center',
    color: '#808080',
    fontSize: 16,
    marginTop: 20,
  },
  forgotText: {
    color: '#808080',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 10,
  },
  loginBtn: {
    backgroundColor: color.Primary,
    marginTop: 35,
    margin: 15,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    zIndex: 111111,
  },
  loginTextContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    // marginTop: 5,
    height: 45,
    width: Platform.OS == 'ios' ? '92%' : '95%',
    borderBottomWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    color: 'black',
  },
});
