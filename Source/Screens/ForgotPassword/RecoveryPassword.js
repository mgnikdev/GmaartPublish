import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class RecoveryPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resetCode: '',
      password: '',
      confirPassword: '',
      showconfirmPassword: false,
      showPassword: false,
      mobile: '',
    };
    console.log('Recovery props', this.props);
  }
  componentDidMount() {
    if (this.props.route.params !== undefined) {
      this.setState({
        mobile: this.props.route.params.mobile,
      });
    }
  }
  RecoveryPassword() {
    if (this.state.password == '' || this.state.confirPassword == '') {
      Toast.showWithGravity(
        'Fill the all field first',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else if (this.state.password != this.state.confirPassword) {
      Toast.showWithGravity(
        'Your Password and Confirm Password Are Not Same',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else {
      this.setState({loading: true});

      var raw = JSON.stringify({
        jsonrpc: '2.0',
        params: {
          mobile: this.state.mobile,
          password: this.state.password,
        },
      });
      POST('set/user/password', raw)
        .then(response => {
          console.log('set/user/password', response);
          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );

          this.props.navigation.replace('Welcome');
        })
        .catch(err => {
          this.setState({loading: false});

          console.log('Erroorr', err);
        });
    }
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <Icon
          style={{position: 'absolute', left: 10, top: 10}}
          name="keyboard-backspace"
          size={30}
          color="#000"
          onPress={() => this.props.navigation.goBack()}
        />

        <View
          style={{
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
            New Password
          </Text>
        </View>

        <Text
          style={{
            color: '#808080',
            textAlign: 'center',
            marginTop: 10,
            color: 'black',
          }}>
          Please Enter a New Password and Create a New One.
        </Text>
        <Text style={{color: '#808080', textAlign: 'center', color: 'black'}}>
          Make sure your Password must be diffrent from previous used password
        </Text>

        <View style={{flex: 1}}>
          {/* <Text style={{marginLeft: 15, marginTop: 50, color: 'black'}}>
            Reset Code
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({resetCode: val})}
            value={this.state.resetCode}
            placeholder="Reset Code"
            placeholderTextColor="gray"
          /> */}
          <View>
            <Text style={{marginLeft: 15, marginTop: 20, color: 'black'}}>
              Password
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={val => {
                this.setState({password: val});
              }}
              value={this.state.password}
              placeholder="Password"
              secureTextEntry={this.state.showPassword ? false : true}
              placeholderTextColor="gray"
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
              onChangeText={val => this.setState({confirPassword: val})}
              value={this.state.confirPassword}
              placeholder="Confirm Password"
              secureTextEntry={this.state.showconfirmPassword ? false : true}
              placeholderTextColor="gray"
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
            activeOpacity={0.8}
            style={{
              backgroundColor: color.Primary,
              marginTop: 85,
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
            }}
            onPress={() => this.RecoveryPassword()}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
              CHANGE PASSWORD
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
