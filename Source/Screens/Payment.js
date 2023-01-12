import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/MaterialIcons';

import React, {Component} from 'react';
import Header from '../Components/Header.js';
import {color} from '../Helper/Global';
import {SliderBox} from 'react-native-image-slider-box';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 1,
      interval: null,
    };
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={color.Primary} />

        <View style={styles.headerContainer}>
          <Icon
            style={styles.backBtn}
            name="keyboard-backspace"
            size={30}
            color="white"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
            Payment
          </Text>
        </View>
        <ScrollView style={{paddingBottom: 200}}>
          <View style={{backgroundColor: 'white'}}>
            <Text style={styles.optionText}>Payment Options</Text>
            <Text style={styles.upiText}>UPI Apps</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.payContainer}>
                <Image
                  resizeMode={'center'}
                  style={{
                    height: 20,
                    width: 80,
                    alignSelf: 'center',
                    margin: 20,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri: 'data:image/png;base64,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',
                  }}
                />
              </View>
              <View style={[{marginLeft: 15}, styles.payContainer]}>
                <Image
                  resizeMode="cover"
                  style={{
                    height: 60,
                    width: 60,
                    alignSelf: 'center',
                    margin: 20,
                    marginLeft: 25,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri: 'https://vinron.in/wp-content/uploads/2021/07/Phone-pe-logo.png',
                  }}
                />
              </View>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: 5, marginBottom: 20}}>
              <Text style={{color: 'gray', fontSize: 14, marginLeft: 20}}>
                Google Pay
              </Text>
              <Text style={{color: 'gray', fontSize: 14, marginLeft: 30}}>
                Phonepe
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.typesContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{alignSelf: 'center'}}
                  name="credit-card"
                  size={30}
                  color="black"
                />
                <Text style={styles.typeText}>Credit/Debit Card</Text>
              </View>
              <Mcon
                style={{alignSelf: 'center'}}
                name="arrow-right"
                size={30}
                color="black"
                onPress={() => this.props.navigation.goBack()}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.typesContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{alignSelf: 'center'}}
                  name="credit-card"
                  size={30}
                  color="black"
                />
                <Text style={styles.typeText}>Wallet</Text>
              </View>
              <Mcon
                style={{alignSelf: 'center'}}
                name="arrow-right"
                size={30}
                color="black"
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.typesContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{alignSelf: 'center'}}
                  name="credit-card"
                  size={30}
                  color="black"
                />
                <Text style={styles.typeText}>Net Banking</Text>
              </View>
              <Mcon
                style={{alignSelf: 'center'}}
                name="arrow-right"
                size={30}
                color="black"
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.typesContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{alignSelf: 'center'}}
                  name="credit-card"
                  size={30}
                  color="black"
                />
                <Text style={styles.typeText}>Cash on Delivery</Text>
              </View>
              <Mcon
                style={{alignSelf: 'center'}}
                name="arrow-right"
                size={30}
                color="black"
              />
            </View>
            <View style={styles.separator} />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 10,
            backgroundColor: color.Primary,
            width: '95%',
            paddingBottom: 10,
            paddingTop: 10,
            flexDirection: 'row',
            alignSelf: 'center',
            borderRadius: 5,
            justifyContent: 'center',
          }}
          onPress={() => {
            this.props.navigation.navigate('HomeStack');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 18,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.32,
              shadowRadius: 5.46,

              elevation: 9,
            }}>
            BACK TO HOME
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  separator: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '93%',
    alignSelf: 'center',
  },
  typeText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
    marginLeft: 15,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  payContainer: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 15,

    justifyContent: 'center',
  },
  upiText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
    margin: 15,
    marginBottom: 20,
  },
  optionText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    margin: 15,
    marginBottom: 0,
  },
  backBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    overflow: 'hidden',
  },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Primary,
  },
});
