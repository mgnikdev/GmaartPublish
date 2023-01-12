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
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import Toast from 'react-native-simple-toast';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // mobEmail: 'api@meghsundar.com',
      // password: 'Api@123321',
      showPassword: false,
      // mobEmail: 'developer1@meghsundar.com',
      // password: '123456',
      mobEmail: '8511930928',
      password: '1234',
      loading: false,
    };
  }
  validationField() {
    if (this.state.mobEmail == '') {
      Toast.showWithGravity(
        'Please enter Email/Mobile first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password == '') {
      Toast.showWithGravity(
        'Please enter Password first',
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
            Alert.alert('', 'User id or password wrong', [
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
          }}
          name="keyboard-backspace"
          size={30}
          color="#000"
          onPress={() => this.props.navigation.goBack()}
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

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.loginBtn}
            onPress={() => this.validationField()}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
              LOG IN
            </Text>
          </TouchableOpacity>

          <Text
            style={styles.forgotText}
            onPress={() => {
              this.props.navigation.navigate('ForgotPasswordStack');
            }}>
            Forget Password?
          </Text>
        </View>

        <View style={{flex: 1}}>
          {/* <Text style={styles.socialText}>Log in with social account</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.googleContainer}>
              <Image
                style={{
                  height: 52,
                  width: 90,
                  alignSelf: 'center',
                }}
                source={{
                  uri: 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png',
                }}
                resizeMode={'contain'}

                // source={require('../../Helper/Assets/google.jpg')}
              />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.fbConatiner}>
              <Image
                style={{
                  height: 52,
                  width: 90,
                  alignSelf: 'center',
                }}
                source={{
                  uri: 'data:image/png;base64,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',
                }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View> */}
          <Text style={styles.accountText}>
            Don't have an account?{' '}
            <Text
              style={{color: color.Primary, fontWeight: '700'}}
              onPress={() => {
                this.props.navigation.navigate('SignUp');
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
    width: '95%',
    borderBottomWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    color: 'black',
  },
});
