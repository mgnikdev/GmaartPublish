import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MultiSelect, Dropdown} from 'react-native-element-dropdown';
import Mcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {toExpression} from '@babel/types';

export default class AddAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      search: '',
      pincode: '',
      flatHouse: '',
      floorNo: '',
      towerNo: '',
      apartment: '',
      address: '',
      landmark: '',
      city: '',
      number: '',
      stateList: [],
      zipList: [],
      selectedStateId: '',
      selectedZipId: '',
      addressType: [{name: 'Home'}, {name: 'Work'}, {name: 'Other'}],
      editMode: false,
      screenName: '',
      address2: '',
      zipCode: '',
    };
    console.log('add address props', this.props);
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      var params = this.props.route.params;
      const street =
        params.item.street == '' || params.item.street == false
          ? ''
          : params.item.street;
      const street2 =
        params.item.street2 == '' || params.item.street2 == false
          ? ''
          : params.item.street2;
      console.log('flatHouse', street, street2);
      if (params.item.zip_id != false) {
        if (params.item.zip_id[1] == '382330') {
          this.setState({landmark: 'naroda'});
          this.setState({city: 'Ahmedabad'});
        } else if (params.item.zip_id[1] == '388210') {
          this.setState({landmark: 'Ahima'});
          this.setState({city: 'Umreth'});
        } else if (params.item.zip_id[1] == '388220') {
          this.setState({landmark: 'Umreth'});
          this.setState({city: 'Umreth'});
        } else if (params.item.zip_id[1] == '387115') {
          this.setState({landmark: 'Alindra'});
          this.setState({city: 'Umreth'});
        } else if (params.item.zip_id[1] == '388250') {
          this.setState({landmark: 'Thasara'});
          this.setState({city: 'Umreth'});
        } else if (params.item.zip_id[1] == '388205') {
          this.setState({landmark: 'Bhalej'});
          this.setState({city: 'Umreth'});
        } else if (params.item.zip_id[1] == '382110') {
          this.setState({landmark: 'sanand'});
          this.setState({city: 'Ahmedabad'});
        } else if (params.item.zip_id[1] == '382481') {
          this.setState({landmark: 'gota'});
          this.setState({city: 'Ahmedabad'});
        } else if (params.item.zip_id[1] == '380024') {
          this.setState({landmark: 'bapungar'});
          this.setState({city: 'Ahmedabad'});
        } else if (params.item.zip_id[1] == '380023') {
          this.setState({landmark: 'Rakhiyal'});
          this.setState({city: 'Ahmedabad'});
        } else if (params.item.zip_id[1] == '382210 ') {
          this.setState({landmark: 'sanathal'});
          this.setState({city: 'Ahmedabad'});
        } else if (params.item.zip_id[1] == '383001') {
          this.setState({city: 'himatnagar'});
          this.setState({landmark: 'himatnagar'});
        } else if (params.item.zip_id[1] == '382305') {
          this.setState({city: 'Ahmedabad'});

          this.setState({landmark: 'dehgam'});
        } else if (params.item.zip_id[1] == '363421') {
          this.setState({landmark: 'limbdi city'});
          this.setState({city: 'Limbdi'});
        } else if (params.item.zip_id[1] == '363410') {
          this.setState({landmark: 'chuda'});
          this.setState({city: 'Limbdi'});
        } else if (params.item.zip_id[1] == '390020') {
          this.setState({city: 'Baroda'});

          this.setState({landmark: 'Akota'});
        } else if (params.item.zip_id[1] == '391410') {
          this.setState({landmark: 'Bhaili'});
          this.setState({city: 'Baroda'});
        } else if (params.item.zip_id[1] == '382345') {
          this.setState({city: 'Ahmedabad'});

          this.setState({landmark: 'Krishnanagar'});
        }
      }
      this.setState({
        screenName: params.screenName,
        name: params.item.name,

        address: street,
        address2: street2,
        city: params.item.city == false ? '' : params.item.city.trim(),
        selectedZipId: params.item.zip_id == false ? '' : params.item.zip_id[0],
        zipCode: params.item.zip_id == false ? '' : params.item.zip_id[1],
        selectedStateId:
          params.item.state_id == false ? 588 : params.item.state_id[0],
        editMode: true,
        parent_id: params.item.id,
      });
    }
    console.log('flatHouse1', this.state.flatHouse);

    this.addressStateList();
    this.zipcodeList();
  }
  validation() {
    if (this.state.address == '' && this.state.landmark == '') {
      Toast.showWithGravity('Enter Address First', Toast.SHORT, Toast.BOTTOM);
    } else if (this.state.city == '') {
      Toast.showWithGravity('Enter Your City', Toast.SHORT, Toast.BOTTOM);
    } else if (
      this.state.selectedStateId == 0 ||
      this.state.selectedStateId == null
    ) {
      Toast.showWithGravity('Select Your State ', Toast.SHORT, Toast.BOTTOM);
    } else if (
      this.state.selectedZipId == 0 ||
      this.state.selectedZipId == null
    ) {
      Toast.showWithGravity('Select Your zipcode', Toast.SHORT, Toast.BOTTOM);
    } else {
      this.editAddress();
      // this.props.navigation.goBack();
      // this.state.editMode ? this.editAddress() : this.addAddress();
    }
  }
  addressStateList() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    POST('getstate', raw)
      .then(response => {
        const newStateList = response.result.response.map(value => ({
          label: value.state_name,
          value: value.id,
        }));

        this.setState({
          stateList: newStateList,
          loading: false,
          selectedStateId: 588,
        });
        console.log('getstate Response ', response, newStateList);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  zipcodeList() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    POST('zip', raw)
      .then(response => {
        const newStateList = response.result.response.map(value => ({
          label: value.name,
          value: value.id,
        }));

        this.setState({zipList: newStateList, loading: false});

        console.log('zip Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  async addAddress() {
    this.setState({loading: true});

    var patnerId = await AsyncStorage.getItem('patnerId');

    var address = this.state.address;
    if (this.state.flatHouse != '') {
      flatHouse = `${this.state.flatHouse},`;
    }
    if (this.state.floorNo != '') {
      floorNo = `${this.state.floorNo},`;
    }
    if (this.state.apartment != '') {
      apartment = `${this.state.apartment},`;
    }
    if (this.state.address != '') {
      address = `${this.state.address},`;
    }
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: JSON.parse(patnerId),
        name: this.state.name,
        // type: 'invoice or delivery',
        type: 'delivery',

        street: `${flatHouse}${floorNo}${this.state.towerNo}`,
        street2: `${apartment}${address}${this.state.landmark}`,
        city: this.state.city,
        state_id: parseInt(this.state.selectedStateId),
        // country_id: 12,
        zip_id: parseInt(this.state.selectedZipId),
      },
    });
    console.log('address raw ', raw);

    POST('user/create/address', raw)
      .then(response => {
        console.log('address Response ', response);
        Toast.showWithGravity(
          response.result.message,
          Toast.SHORT,
          Toast.BOTTOM,
        );
        this.props.navigation.goBack();
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  async editAddress() {
    this.setState({loading: true});
    var patnerId = await AsyncStorage.getItem('patnerId');
    // var flatHouse = this.state.flatHouse;
    // var floorNo = this.state.floorNo;
    // var apartment = this.state.apartment;
    // var address = this.state.address;
    // if (this.state.flatHouse != '') {
    //   flatHouse = `${this.state.flatHouse},`;
    // }
    // if (this.state.floorNo != '') {
    //   floorNo = `${this.state.floorNo},`;
    // }
    // if (this.state.apartment != '') {
    //   apartment = `${this.state.apartment},`;
    // }
    // if (this.state.address != '') {
    //   address = `${this.state.address},`;
    // }
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: this.state.parent_id,

        lines: {
          name: this.state.name,
          // type: 'invoice or delivery',
          type: 'delivery',

          street: this.state.address,
          street2: this.state.address2,
          city: this.state.city,
          state_id: parseInt(this.state.selectedStateId),
          // country_id: 12,
          zip_id: parseInt(this.state.selectedZipId),
        },
      },
    });
    console.log('edit address raw ', raw);

    POST('user/edit/address', raw)
      .then(response => {
        console.log('address Response ', response);
        Toast.showWithGravity(
          response.result.message,
          Toast.SHORT,
          Toast.BOTTOM,
        );

        if (this.state.screenName == 'SavedContainer') {
          this.props.route.params.updateData({
            updateData: true,
          });
          this.props.navigation.replace('Profile');
        } else {
          this.props.navigation.pop();
        }
        this.props.navigation.goBack();
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItemDiscover = ({item}) => (
    <View style={styles.discoverMainContainer}>
      <Text style={styles.discoverName}>{item.name}</Text>
    </View>
  );

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />

        <View style={styles.headerContainer}>
          <Icon
            style={styles.backIcon}
            name="keyboard-backspace"
            size={30}
            color="white"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerText}>
            {this.state.editMode ? `Edit Address` : `Add Address`}
          </Text>
        </View>
        <ScrollView style={{backgroundColor: color.secondary}}>
          <View style={{marginBottom: 5}}>
            <Text style={styles.addressDetailText}>Address Details</Text>
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({name: val})}
              value={this.state.name}
              placeholder="Name"
              placeholderTextColor="gray"
              editable={false}
            />
            {/* <TextInput
              style={styles.input}
              onChangeText={val => this.setState({number: val})}
              value={this.state.number}
              placeholder="Number"
              placeholderTextColor="gray"
            /> */}
            {/* <TextInput
              style={styles.input}
              onChangeText={val => this.setState({pincode: val})}
              value={this.state.pincode}
              placeholder="Pin Code"
              placeholderTextColor="gray"
            /> */}
            {/* <TextInput
              style={styles.input}
              onChangeText={val => this.setState({flatHouse: val})}
              value={this.state.flatHouse}
              placeholder="Flat/House no."
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({floorNo: val})}
              value={this.state.floorNo}
              placeholder="Floor No."
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({towerNo: val})}
              value={this.state.towerNo}
              placeholder="Tower No."
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({apartment: val})}
              value={this.state.apartment}
              placeholder="Building/Apartment Name"
              placeholderTextColor="gray"
            /> */}
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({address: val})}
              value={this.state.address}
              placeholder="House no/Appartment Name"
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({address2: val})}
              value={this.state.address2}
              placeholder="Address"
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.input}
              onChangeText={val => {
                this.setState({landmark: val});
              }}
              value={this.state.landmark}
              placeholder="Landmark/Area"
              placeholderTextColor="gray"
            />
            <TextInput
              style={styles.input}
              onChangeText={val => {
                if (this.state.zipCode == '383001') {
                  this.setState({city: 'himatnagar'});
                } else if (this.state.zipCode == '363421') {
                  this.setState({city: 'Limbdi'});
                } else if (this.state.zipCode == '363410') {
                  this.setState({city: 'Limbdi'});
                } else if (this.state.zipCode == '388220') {
                  this.setState({city: 'Umreth'});
                } else if (this.state.zipCode == '390020') {
                  this.setState({city: 'Baroda'});
                } else if (this.state.zipCode == '391410') {
                  this.setState({city: 'Baroda'});
                } else {
                  this.setState({city: val});
                }
              }}
              value={this.state.city}
              placeholder="City"
              placeholderTextColor="gray"
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              search
              data={this.state.zipList}
              labelField="label"
              valueField="value"
              placeholder="Zip Code"
              placeholderTextColor="gray"
              searchPlaceholder="Search..."
              value={this.state.selectedZipId}
              onChange={item => {
                console.log('item', item);
                // this.selectBrand(item.value);
                this.setState(
                  {selectedZipId: item.value, zipCode: item.label},
                  () => {},
                );

                if (item.label == '382330') {
                  this.setState({landmark: 'naroda'});
                  this.setState({city: 'Ahmedabad'});
                } else if (item.label == '388210') {
                  this.setState({landmark: 'Ahima'});
                  this.setState({city: 'Umreth'});
                } else if (item.label == '388220') {
                  this.setState({landmark: 'Umreth'});
                  this.setState({city: 'Umreth'});
                } else if (item.label == '387115') {
                  this.setState({landmark: 'Alindra'});
                  this.setState({city: 'Umreth'});
                } else if (item.label == '388250') {
                  this.setState({landmark: 'Thasara'});
                  this.setState({city: 'Umreth'});
                } else if (item.label == '388205') {
                  this.setState({landmark: 'Bhalej'});
                  this.setState({city: 'Umreth'});
                } else if (item.label == '382110') {
                  this.setState({landmark: 'sanand'});
                  this.setState({city: 'Ahmedabad'});
                } else if (item.label == '382481') {
                  this.setState({landmark: 'gota'});
                  this.setState({city: 'Ahmedabad'});
                } else if (item.label == '380024') {
                  this.setState({landmark: 'bapungar'});
                  this.setState({city: 'Ahmedabad'});
                } else if (item.label == '380023') {
                  this.setState({landmark: 'Rakhiyal'});
                  this.setState({city: 'Ahmedabad'});
                } else if (item.label == '382210 ') {
                  this.setState({landmark: 'sanathal'});
                  this.setState({city: 'Ahmedabad'});
                } else if (item.label == '383001') {
                  this.setState({city: 'himatnagar'});
                  this.setState({landmark: 'himatnagar'});
                } else if (item.label == '382305') {
                  this.setState({city: 'Ahmedabad'});

                  this.setState({landmark: 'dehgam'});
                } else if (item.label == '363421') {
                  this.setState({landmark: 'limbdi city'});
                  this.setState({city: 'Limbdi'});
                } else if (item.label == '363410') {
                  this.setState({landmark: 'chuda'});
                  this.setState({city: 'Limbdi'});
                } else if (item.label == '390020') {
                  this.setState({city: 'Baroda'});

                  this.setState({landmark: 'Akota'});
                } else if (item.label == '391410') {
                  this.setState({landmark: 'Bhaili'});
                  this.setState({city: 'Baroda'});
                } else if (item.label == '382345') {
                  this.setState({city: 'Ahmedabad'});

                  this.setState({landmark: 'Krishnanagar'});
                }
              }}
              renderRightIcon={() => (
                <Mcon
                  style={{alignSelf: 'center'}}
                  name="arrow-drop-down"
                  size={30}
                  color="black"
                />
              )}
              selectedStyle={styles.selectedStyle}
            />
            <Dropdown
              style={[styles.dropdown, {marginBottom: 30}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              search
              data={this.state.stateList}
              labelField="label"
              valueField="value"
              placeholder="State"
              searchPlaceholder="Search..."
              placeholderTextColor="gray"
              value={this.state.selectedStateId}
              onChange={item => {
                console.log('item', item);
                // this.selectBrand(item.value);
                this.setState({selectedStateId: item.value});
              }}
              renderRightIcon={() => (
                <Mcon
                  style={{alignSelf: 'center'}}
                  name="arrow-drop-down"
                  size={30}
                  color="black"
                />
              )}
              selectedStyle={styles.selectedStyle}
            />
            {/* <View style={styles.addressTypeContainer}>
              <Text
                style={{color: 'black', fontWeight: '600', marginRight: 100}}>
                Save as
              </Text>
              <FlatList
                horizontal
                style={{backgroundColor: 'white'}}
                contentContainerStyle={{alignSelf: 'flex-end'}}
                data={this.state.addressType}
                renderItem={this.renderItemDiscover}
                //   keyExtractor={item => item.id}
              />
            </View> */}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => {
            this.validation();
          }}>
          <Text style={styles.footerBtnText}>SAVE ADDRESS</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  dropdown: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
  },
  placeholderStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  footerBtnText: {
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
  },
  footerBtn: {
    // position: 'absolute',
    // bottom: 10,
    backgroundColor: color.Primary,
    width: '95%',
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    margin: 17,
    marginTop: 3,
    alignItems: 'center',
  },
  addressDetailText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    margin: 15,
    marginBottom: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
  },
  backIcon: {
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
  discoverName: {
    margin: 6,
    color: 'black',
    fontWeight: '600',
    paddingRight: 5,
    paddingLeft: 5,
  },
  discoverMainContainer: {
    backgroundColor: '#E0E0E0',
    margin: 6,
    height: 30,
    borderRadius: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
  addAddress: {
    height: 50,
    width: '93%',
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    color: 'black',
  },
});
