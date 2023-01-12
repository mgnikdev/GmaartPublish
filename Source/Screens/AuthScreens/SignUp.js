import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobEmail: '',
      name: '',
      mobile: '',
      password: '',
      showPassword: false,
      showconfirmPassword: false,
      confirmPassword: '',
      loading: false,
    };
  }
  validationField() {
    if (this.state.name == '') {
      Toast.showWithGravity(
        'Please enter Name first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.mobEmail == '') {
      Toast.showWithGravity(
        'Please enter Email first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.mobile == '') {
      Toast.showWithGravity(
        'Please enter Mobile number first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password == '') {
      Toast.showWithGravity(
        'Please enter password first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.confirmPassword == '') {
      Toast.showWithGravity(
        'Please enter confirm password first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password != this.state.confirmPassword) {
      Toast.showWithGravity(
        'Password and Confirm Password not same',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else {
      this.signup();
    }
  }
  signup() {
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
        this.setState({loading: false});

        if (response.result.status == 409) {
          // Toast.showWithGravity(
          //   response.result.message,
          //   Toast.SHORT,
          //   Toast.BOTTOM,
          // );
          Alert.alert('', response.result.message, [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        } else if (response.result.status == 200) {
          this.props.navigation.replace('Verification', {
            otp: response.result.response.otp,
            name: this.state.name,
            mobEmail: this.state.mobEmail,
            mobile: this.state.mobile,
            password: this.state.password,
            ScreenName: 'SignUp',
          });
          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );
        } else {
          Toast.showWithGravity(
            'something went wrong',
            Toast.SHORT,
            Toast.BOTTOM,
          );
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
    // var raw = JSON.stringify({
    //   jsonrpc: '2.0',
    //   params: {
    //     name: this.state.name,
    //     login: this.state.mobEmail,
    //     mobile: this.state.mobile,
    //     password: this.state.password,
    //     city: 'Ahm',
    //     state_id: 14,
    //   },
    // });
    // POST('create/user', raw)
    //   .then(async response => {
    //     this.setState({loading: false});
    //     await AsyncStorage.setItem(
    //       'patnerId',
    //       JSON.stringify(response.result.partner_id),
    //     );
    //     await AsyncStorage.setItem(
    //       'userId',
    //       JSON.stringify(response.result.user_id[0]),
    //     );
    //     console.log('signup Response ', response);
    //     // this.props.navigation.replace('MyDrawer');
    //   })
    //   .catch(err => {
    //     this.setState({loading: false});

    //     console.log('Erroorr', err);
    //   });
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
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10,
            top: Platform.OS == 'ios' ? 55 : 10,
            zIndex: 111111111,
          }}
          onPress={() => this.props.navigation.goBack()}>
          <Icon name="keyboard-backspace" size={30} color="#000" />
        </TouchableOpacity>

        <View
          style={{
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
            SIGN UP
          </Text>
        </View>
        <View style={{}}>
          <Text style={{marginLeft: 15, marginTop: 50, color: 'black'}}>
            Name
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({name: val})}
            value={this.state.name}
            placeholder="Name"
            placeholderTextColor="gray"
          />
          <Text style={{marginLeft: 15, marginTop: 20, color: 'black'}}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({mobEmail: val})}
            value={this.state.mobEmail}
            placeholder="Email"
            placeholderTextColor="gray"
          />
          <Text style={{marginLeft: 15, marginTop: 20, color: 'black'}}>
            Mobile
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({mobile: val})}
            value={this.state.mobile}
            placeholder="Mobile"
            placeholderTextColor="gray"
            maxLength={10}
            keyboardType="numeric"
          />
          <View>
            <Text style={{marginLeft: 15, marginTop: 20, color: 'black'}}>
              Password
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({password: val})}
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

          <View>
            <Text style={{marginLeft: 15, marginTop: 20, color: 'black'}}>
              Confirm Password
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({confirmPassword: val})}
              value={this.state.confirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              secureTextEntry={this.state.showconfirmPassword ? false : true}
            />
            {this.state.showconfirmPassword == false ? (
              <Mcon
                style={{position: 'absolute', right: 25, top: 50}}
                name="ios-eye-off-outline"
                size={20}
                color="#000"
                onPress={() =>
                  this.setState({
                    showconfirmPassword: !this.state.showconfirmPassword,
                  })
                }
              />
            ) : (
              <Mcon
                style={{position: 'absolute', right: 25, top: 50}}
                name="eye-outline"
                size={20}
                color="#000"
                onPress={() =>
                  this.setState({
                    showconfirmPassword: !this.state.showconfirmPassword,
                  })
                }
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              this.validationField();
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
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>

        {/* <Text
          style={{
            textAlign: 'center',
            color: '#808080',
            fontSize: 16,
          }}>
          Log in with social account
        </Text> */}
        {/* <View
          style={{
            flexDirection: 'row',
            width: windowWidth,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
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
            }}>
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

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
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
            }}>
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
        <Text
          style={{
            textAlign: 'center',
            color: '#808080',
            fontSize: 16,
            marginTop: 30,
          }}>
          You have an account?{' '}
          <Text
            style={{color: color.Primary, fontWeight: '700'}}
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}>
            Log In
          </Text>
        </Text>
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
    fontSize: 18,
    // marginTop: 5,
    height: 45,
    width: '95%',
    borderBottomWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    color: 'black',
    marginLeft: Platform.OS == 'ios' ? 10 : 0,
  },
});
