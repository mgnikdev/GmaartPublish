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
import Mcon from 'react-native-vector-icons/Ionicons';

import React, {Component} from 'react';
import {color} from '../../Helper/Global';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class SalesOrderHistoryContainer extends Component {
  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 10,
          borderColor: 'gray',
        }}
        onPress={() =>
          this.props.navigation.push('OrderHistory', {
            item: item.products,
            total: item.total,
            stage: item.state,
            id: item.id,
          })
        }>
        <View
          style={{
            backgroundColor: item.state == 'sale' ? 'green' : color.Primary,
            position: 'absolute',
            top: 0,
            right: 5,
            alignItems: 'center',
            alignSelf: 'flex-end',
            overflow: 'hidden',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            width: 60,
            height: 25,
          }}>
          {item.state == 'sale' && (
            <Text
              style={{
                color: 'white',
                padding: 5,
                textAlign: 'center',
                fontSize: 12,
              }}>
              Confirm
            </Text>
          )}
          {item.state == 'sent' || item.state == 'draft' ? (
            <Text
              style={{
                color: 'black',
                padding: 5,
                textAlign: 'center',
                fontSize: 12,
              }}>
              Unpaid
            </Text>
          ) : null}

          {item.state == 'cancel' && (
            <Text
              style={{
                color: 'white',
                padding: 5,
                textAlign: 'center',
                fontSize: 12,
              }}>
              Cancel
            </Text>
          )}
        </View>
        <Text style={styles.productName}>{item.customer}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}>
          <Text style={styles.rupeesText}>{item.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              style={{marginTop: 7, marginRight: 3}}
              name="calendar-month"
              size={20}
              color="black"
            />
            <Text style={styles.createdDate}>{item.create_date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  addText: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  addContainer: {
    backgroundColor: color.Primary,
    position: 'absolute',
    bottom: 20,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
  },
  rupeesText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
    color: 'black',
  },
  createdDate: {
    marginRight: 10,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
    color: 'black',
  },
  productName: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '700',
    color: 'black',
  },
  offText: {
    textAlign: 'right',
    marginTop: -3,
    marginRight: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  discountText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  discountContainer: {
    position: 'absolute',
    backgroundColor: color.Primary,
    left: 12,
    height: 35,
    width: 38,
    top: 10,
    overflow: 'hidden',
    borderRadius: 5,
  },
  productImg: {
    height: 100,
    width: windowWidth / 5,
    alignSelf: 'center',
    margin: 20,
    marginLeft: 25,
    overflow: 'hidden',
  },
  filterText: {
    alignSelf: 'center',
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
    margin: 5,
    marginRight: 10,
  },
  filterContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: 90,
    alignSelf: 'flex-end',
    borderRadius: 6,
    marginRight: 15,
    margin: 5,
  },
});
