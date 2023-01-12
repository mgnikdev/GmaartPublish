import {
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import LoginModal from '../AuthScreens/LoginModal';
import SignUpModal from '../AuthScreens/SignUpModal';
export default class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModal: false,
      signUpModal: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;

    // this.focusListener = navigation.addListener('focus', () => {
    //   if (this.props.route.params != undefined) {
    //     if (this.props.route.params.screen == 'LoginModel') {
    //       this.setState({loginModal: true});
    //     }
    //   }
    // });
  }

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: color.Primary,
          flex: 1,
        }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{height: 60, width: 160}}
            source={require('../../Helper/Assets/Gmaart.png')}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              textAlign: 'center',
            }}>
            Welcome to
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              textAlign: 'center',
            }}>
            <Text style={{fontWeight: '900'}}> G maart </Text> Shopping
          </Text>
          <View style={{marginTop: 40, marginBottom: 30}}>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={() => this.props.navigation.push('Login')}
              onPress={() =>
                this.setState({loginModal: !this.state.loginModal})
              }
              style={{
                width: 100,
                height: 30,
                backgroundColor: '#fff',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: color.Primary,
                  fontWeight: '600',
                }}>
                LOG IN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={() => this.props.navigation.push('SignUp')}
              onPress={() => this.setState({signUpModal: true})}
              style={{
                width: 100,
                height: 30,
                borderColor: '#fff',
                justifyContent: 'center',
                borderRadius: 5,
                borderWidth: 1.5,
                marginTop: 10,
              }}>
              <Text style={{color: '#fff', textAlign: 'center'}}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="none"
          visible={this.state.signUpModal}
          onRequestClose={() => {
            this.setState({signUpModal: false});
          }}>
          <SignUpModal
            navigation={this.props.navigation}
            data={data => {
              console.log('signupModal', data);
              this.setState({signUpModal: data, loginModal: false});
            }}
            loginData={e => {
              this.setState({loginModal: e, signUpModal: false});
            }}
          />
        </Modal>
        <Modal
          animationType="none"
          visible={this.state.loginModal}
          onRequestClose={() => {
            this.setState({loginModal: false});
          }}>
          <LoginModal
            navigation={this.props.navigation}
            data={data => {
              console.log('signupModal', data);
              this.setState({loginModal: data});
            }}
            signUpData={e => {
              this.setState({signUpModal: e, loginModal: false});
            }}
          />
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
