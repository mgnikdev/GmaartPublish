import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {POST} from '../../Helper/ApiManger/Apis';
import {color} from '../../Helper/Global';
export default class SavedAddressContainer extends Component {
  async deleteAddress() {
    this.setState({loading: true});
    var patnerId = await AsyncStorage.getItem('patnerId');

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: this.props.item.id,
      },
    });
    console.log('delete address raw ', raw);

    POST('user/delete/address', raw)
      .then(response => {
        console.log('address delete Response ', response);

        this.props.updateData(true);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  updateData(val) {
    console.log('updateData Saved', val);
    this.props.updateData(val);
  }
  render() {
    const item = this.props.item;
    var street = item.street == false ? '' : item.street;

    var street2 = item.street2 == false ? '' : item.street2;
    console.log(street, 'street');
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 8,
          marginLeft: 12,
          marginRight: 12,
          marginTop: 10,
        }}
        // onPress={() => this.props.navigation.navigate('MyListStack')}
      >
        <Text style={{fontWeight: '800', margin: 10}}>
          {item.name == '' ? item.display_name : item.name}
        </Text>
        {item.street != '' && (
          <Text style={{marginLeft: 10, marginRight: 10, color: 'black'}}>
            {street}
          </Text>
        )}

        <Text style={{marginLeft: 10, marginRight: 10, color: 'black'}}>
          {item.street2 != '' && `${street2}, `}
          {item.city != '' && `${item.city}, `}
          {item.zip != '' && `${item.zip}, `}
          {item.state_id != '' && `${item.state_id[1]}`}
        </Text>

        {/* <Text
          style={{
            marginLeft: 10,
            marginRight: 10,
            color: 'black',
            marginBottom: 10,
          }}>
          India
        </Text> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 40,
            alignItems: 'center',
            marginRight: 10,
            marginLeft: 10,
            marginBottom: 15,
          }}>
          <TouchableOpacity
            style={{
              width: 150,
              height: 35,

              justifyContent: 'center',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'gray',
              backgroundColor: color.Primary,
            }}
            onPress={() =>
              this.props.navigation.replace('AddAddress', {
                item: this.props.item,
                updateData: this.updateData.bind(this),
                screenName: 'SavedContainer',
              })
            }>
            <Text style={{alignSelf: 'center', fontSize: 16, color: 'white'}}>
              Edit{' '}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              width: 150,
              height: 35,
              borderColor: 'gray',

              borderRadius: 5,
              borderWidth: 1,

              justifyContent: 'center',
            }}
            onPress={() => this.deleteAddress()}>
            <Text style={{alignSelf: 'center', fontSize: 16, color: 'gray'}}>
              Delete{' '}
            </Text>
          </TouchableOpacity> */}
        </View>
        {/* <Text style={{marginLeft: 10, marginRight: 10, color: 'black'}}>
        Phone number: 
        </Text> */}
      </TouchableOpacity>
    );
  }
}
