import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POST} from '../../Helper/ApiManger/Apis';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Verification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
      otp: false,
      showPassword: false,
      mobile: '',
      name: '',
      mobEmail: '',
      password: '',
      loading: false,
    };
    console.log('props for otp', this.props);
  }
  componentDidMount() {
    if (this.props.route.params !== undefined) {
      if (this.props.route.params.ScreenName == 'SignUp') {
        this.setState({
          otp: this.props.route.params.otp,
          mobile: this.props.route.params.mobile,
          name: this.props.route.params.name,
          mobEmail: this.props.route.params.mobEmail,
          password: this.props.route.params.password,
        });
      } else {
        this.setState({
          otp: this.props.route.params.otp,
          mobile: this.props.route.params.mobile,
        });
      }
    }
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.replace('Welcome');
    // Return true to enable back button over ride.
    return true;
  };
  resentOtpforgotPassword() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mobile: this.state.mobile,
      },
    });
    POST('mobile/otp', raw)
      .then(response => {
        this.setState({loading: false});

        console.log('mobile/otp', response);
        this.props.navigation.navigate('Verification', {
          otp: response.result.response.otp,
          mobile: this.state.mobEmail,
        });
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  resendOtp() {
    this.setState({loading: true});
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mobile: this.state.mobile,
      },
    });
    POST('register/mobile/otp', raw)
      .then(async response => {
        console.log('signup Response ', response);
        if (response.result.status == 409) {
          this.setState({loading: false});

          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );
        } else {
          this.setState({otp: response.result.response.otp, loading: false});

          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  login() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        login: this.state.mobile,
        password: this.state.password,
        db: 'website', ////Live Server
      },
    });
    console.log('auth raw ', raw);

    POST('web/session/authenticate', raw)
      .then(async response => {
        this.setState({loading: false});
        console.log('authenticate Response ', response);

        if (response.error) {
          Alert.alert('', response.error.message, [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          // Toast.showWithGravity(
          //   response.error.message,
          //   Toast.SHORT,
          //   Toast.BOTTOM,
          // );
        } else {
          console.log('auth Response ', response);
          await AsyncStorage.setItem(
            'patnerId',
            JSON.stringify(response.result.partner_id),
          );
          await AsyncStorage.setItem(
            'userId',
            JSON.stringify(response.result.user_id[0]),
          );

          this.props.navigation.replace('MyDrawer');
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  signup() {
    var otp2 =
      this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4;
    if (this.state.otp == otp2) {
      this.setState({loading: true});
      var raw = JSON.stringify({
        jsonrpc: '2.0',
        params: {
          name: this.state.name,
          login: this.state.mobEmail,
          mobile: this.state.mobile,
          password: this.state.password,
          city: 'Ahm',
          state_id: 14,
        },
      });
      console.log('signup Response ', raw);

      POST('create/user', raw)
        .then(async response => {
          console.log('signup Response ', response);

          this.setState({loading: false});
          if (response.error) {
            Toast.showWithGravity(
              'Something went wrong',
              Toast.SHORT,
              Toast.BOTTOM,
            );
          }
          if (response.result.status == 409) {
            Alert.alert('', response.result.message, [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
            // Toast.showWithGravity(
            //   response.result.message,
            //   Toast.SHORT,
            //   Toast.BOTTOM,
            // );
          } else {
            await AsyncStorage.setItem(
              'patnerId',
              JSON.stringify(response.result.response[0].partner_id),
            );
            // Toast.showWithGravity(
            //   response.result.message,
            //   Toast.SHORT,
            //   Toast.BOTTOM,
            // );
            this.login();
          }
          // await AsyncStorage.setItem(
          //   'userId',
          //   JSON.stringify(response.result.user_id[0]),
          // );
        })
        .catch(err => {
          this.setState({loading: false});

          console.log('Erroorr', err);
        });
    } else {
      Alert.alert('', 'Enter valid OTP', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      // Toast.showWithGravity('Enter valid OTP', Toast.SHORT, Toast.BOTTOM);
      this.setState({code1: '', code2: '', code3: '', code4: ''});
    }
  }
  next() {
    var otp2 =
      this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4;
    console.log('otp verify', otp2);
    if (this.state.otp == otp2) {
      this.props.navigation.navigate('RecoveryPassword', {
        mobile: this.state.mobile,
      });
    } else {
      Alert.alert('', 'Enter valid OTP', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      // Toast.showWithGravity('Enter valid OTP', Toast.SHORT, Toast.BOTTOM);
      this.setState({code1: '', code2: '', code3: '', code4: ''});
    }
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
          style={{position: 'absolute', left: 10, top: 10}}
          name="keyboard-backspace"
          size={30}
          color="#000"
          onPress={() =>
            this.props.route.params.ScreenName == 'SignUp'
              ? this.props.navigation.replace('Welcome')
              : this.props.navigation.goBack()
          }
        />

        <View
          style={{
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
            Verification
          </Text>
        </View>

        <Text style={{color: '#808080', textAlign: 'center', marginTop: 10}}>
          Please check you message for a Four-
        </Text>
        <Text style={{color: '#808080', textAlign: 'center'}}>
          digit security code and enter it below.
        </Text>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              style={styles.input}
              maxLength={1}
              textAlign={'center'}
              onChangeText={val => {
                this.setState({code1: val});
                if (val) this.refs.input_2.focus();
              }}
              value={this.state.code1}
              placeholder="0"
              placeholderTextColor="#D3D3D3"
              ref="input_1"
              returnKeyType="next"
              keyboardType="phone-pad"
              autoFocus
            />
            <TextInput
              style={styles.input}
              maxLength={1}
              textAlign={'center'}
              onChangeText={val => {
                this.setState({code2: val}, () => {
                  if (val == '') this.refs.input_1.focus();
                });
                if (val) this.refs.input_3.focus();
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  this.refs.input_1.focus();
                  //this.setState({otp1:''})
                }
              }}
              value={this.state.code2}
              placeholder="0"
              placeholderTextColor="#D3D3D3"
              ref="input_2"
              returnKeyType="next"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              maxLength={1}
              textAlign={'center'}
              onChangeText={val => {
                this.setState({code3: val}, () => {
                  if (val == '') this.refs.input_2.focus();
                });
                if (val) this.refs.input_4.focus();
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  this.refs.input_2.focus();
                  //this.setState({otp2:''})
                }
              }}
              value={this.state.code3}
              placeholder="0"
              placeholderTextColor="#D3D3D3"
              ref="input_3"
              returnKeyType="next"
              keyboardType="phone-pad"
            />
            <TextInput
              ref="input_4"
              style={styles.input}
              maxLength={1}
              textAlign={'center'}
              onChangeText={val => {
                this.setState({code4: val}, () => {
                  if (val == '') this.refs.input_3.focus();
                });
                // if (val) this.refs.input_5.focus();
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  this.refs.input_3.focus();
                  //this.setState({otp3:''})
                }
              }}
              value={this.state.code4}
              placeholder="0"
              placeholderTextColor="#D3D3D3"
              returnKeyType="next"
              keyboardType="phone-pad"
            />
            {/* <TextInput
              style={styles.input}
              maxLength={1}
              textAlign={'center'}
              onChangeText={val => {
                this.setState({code5: val}, () => {
                  if (val == '') this.refs.input_4.focus();
                });
                if (val) this.refs.input_6.focus();
              }}
              value={this.state.code5}
              placeholder="0"
              placeholderTextColor="#D3D3D3"
              ref="input_5"
              returnKeyType="next"
              keyboardType="phone-pad"
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  this.refs.input_4.focus();
                  //this.setState({otp4:''})
                }
              }}
            />
            <TextInput
              style={styles.input}
              maxLength={1}
              textAlign={'center'}
              onChangeText={val => {
                this.setState({code6: val}, () => {
                  if (val == '') this.refs.input_5.focus();
                });
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  this.refs.input_5.focus();
                  //this.setState({otp5:''})
                }
              }}
              value={this.state.code6}
              placeholder="0"
              placeholderTextColor="#D3D3D3"
              ref="input_6"
              returnKeyType="next"
              keyboardType="phone-pad"
            /> */}
          </View>
          <View
            style={{
              marginTop: 50,
              marginBottom: 50,
              borderBottomWidth: 1,
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#000',
            }}
          />
          <Text style={{textAlign: 'center', color: '#000'}}>
            Didn't get a code?{' '}
            <Text
              style={{color: color.Primary, fontWeight: '600'}}
              onPress={() =>
                this.state.name.length == 0
                  ? this.resentOtpforgotPassword()
                  : this.resendOtp()
              }>
              Send again
            </Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.state.name.length == 0 ? this.next() : this.signup();
            }}
            activeOpacity={0.8}
            style={{
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
            }}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
              VERIFY
            </Text>
          </TouchableOpacity>
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
  input: {
    // marginTop: 5,
    height: 65,
    width: '13%',
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: 'center',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 35,
    margin: 5,
    marginTop: 40,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
