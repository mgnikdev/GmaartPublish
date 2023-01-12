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

export default class SignUpModal extends Component {
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
      Toast.showWithGravity('Enter Your Name', Toast.SHORT, Toast.BOTTOM);
    } else if (this.state.mobEmail == '') {
      Toast.showWithGravity('Enter Your Email', Toast.SHORT, Toast.BOTTOM);
    } else if (this.state.mobile == '') {
      Toast.showWithGravity(
        'Enter Your Mobile Number ',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password == '') {
      Toast.showWithGravity('Enter Your Password ', Toast.SHORT, Toast.BOTTOM);
    } else if (this.state.confirmPassword == '') {
      Toast.showWithGravity(
        'Enter Your Confirm Password ',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password != this.state.confirmPassword) {
      Toast.showWithGravity(
        'Your Password and Confirm Password Are Not Same',
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
          //   onPress={() => this.props.navigation.goBack()}>
          onPress={() => this.props.data(false)}>
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
              this.props.loginData(true);
              // this.props.data(false);
              // this.props.navigation.navigate('Login');
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
