import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobEmail: '',
      password: '',
      showPassword: false,
    };
  }
  componentDidMount() {}

  sendOTP() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mobile: this.state.mobEmail,
      },
    });
    POST('mobile/otp', raw)
      .then(response => {
        console.log('mobile/otp', response);
        this.setState({loading: false});

        if (response.result.status == 409) {
          if (
            response.result.message ==
            'no users available for this mobile number.'
          ) {
            Alert.alert('', 'Enter Your Registerd Mobile Number', [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          } else {
            Alert.alert('', response.result.message, [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          }

          // Toast.showWithGravity(
          //   response.result.message,
          //   Toast.SHORT,
          //   Toast.BOTTOM,
          // );
        } else {
          this.props.navigation.navigate('Verification', {
            otp: response.result.response.otp,
            mobile: this.state.mobEmail,
          });
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <Icon
          style={{
            position: 'absolute',
            left: 10,
            top: Platform.OS == 'ios' ? 55 : 10,
            zIndex: 111111,
          }}
          name="keyboard-backspace"
          size={30}
          color="#000"
          onPress={() =>
            this.props.navigation.replace('Welcome', {screen: 'LoginModel'})
          }
        />

        <View style={styles.forgotText}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
            Forgot Password
          </Text>
        </View>

        <Text style={{color: '#808080', textAlign: 'center', marginTop: 10}}>
          Please Enter your Mobile
        </Text>
        <Text style={{color: '#808080', textAlign: 'center'}}>
          below to receive your password reset
        </Text>
        <View style={{flex: 1}}>
          <Text style={{marginLeft: 15, marginTop: 50, color: 'black'}}>
            Mobile
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({mobEmail: val})}
            value={this.state.mobEmail}
            placeholder="Mobile"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={() => {
              this.sendOTP();
              // this.props.navigation.navigate('Verification');
            }}
            activeOpacity={0.8}
            style={styles.loginBtn}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  forgotText: {
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
    marginLeft: Platform.OS == 'ios' ? 10 : 0,
    color: 'black',
  },
});
