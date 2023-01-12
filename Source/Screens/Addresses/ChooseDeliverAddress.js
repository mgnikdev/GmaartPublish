import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Dimensions,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SavedAddressContainer from './SavedAddressContainer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ChooseDeliverAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      addressArray: [],
    };
  }
  componentDidMount() {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.addressList();
    });
  }
  async addressList() {
    this.setState({loading: true});
    var patnerId = await AsyncStorage.getItem('patnerId');

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: JSON.parse(patnerId),
      },
    });
    console.log('raw', raw);

    POST('user/addresses', raw)
      .then(response => {
        this.setState({addressArray: response.result.response[0]});
        console.log('addresses Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItem = ({item}) => (
    <SavedAddressContainer item={item} navigation={this.props.navigation} />
  );

  renderSeparator = () => (
    <View
      style={{
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'gray',
        height: 0.5,
      }}
    />
  );
  renderEmpty = () => (
    <Text
      style={{
        fontSize: 18,
        marginTop: 20,
        fontWeight: '600',
        color: 'gray',
        alignItems: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      You have no Address
    </Text>
  );
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />

        <View style={styles.headerContainer}>
          <Icon
            style={styles.backBtn}
            name="keyboard-backspace"
            size={30}
            color="white"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerText}>Choose Delivery Address</Text>
        </View>
        <View style={{backgroundColor: 'white'}}>
          <View style={styles.searchBar}>
            <Ionicons
              name="ios-search"
              size={25}
              color="#000"
              style={{alignSelf: 'center', marginLeft: 10}}
            />
            <TextInput
              style={styles.input}
              onChangeText={text => this.setState({search: text})}
              value={this.state.search}
              placeholder="Search"
              placeholderTextColor="gray"
            />
            {/* <Icon
              name="qrcode"
              size={30}
              color="#000"
              style={{alignSelf: 'center', marginRight: 10}}
            /> */}
          </View>
        </View>

        <View style={styles.liveMainLocation}>
          {/* <View style={styles.liveLocation}>
            <Ionicons
              name="md-location-sharp"
              size={25}
              color={color.Primary}
              style={{alignSelf: 'center', marginLeft: 10, marginRight: 5}}
            />
            <Text
              style={{
                color: 'gray',
                fontWeight: '500',
                fontSize: 18,
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              Choose current location
            </Text>
          </View> */}
        </View>
        <Text style={styles.saveText}>SAVED ADDRESS</Text>

        <FlatList
          style={{backgroundColor: 'white'}}
          data={this.state.addressArray}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListEmptyComponent={this.renderEmpty}
        />

        {/* {this.state.addressArray.length == 0 && (
          <TouchableOpacity
            style={styles.addAddress}
            onPress={() => this.props.navigation.navigate('AddAddress')}>
            <Ionicons
              name="add"
              size={28}
              color={color.Primary}
              style={{alignSelf: 'center', marginLeft: 10, marginRight: 5}}
            />
            <Text
              style={{
                color: 'gray',
                fontWeight: '500',
                fontSize: 18,
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              Add Address
            </Text>
          </TouchableOpacity>
        )} */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  saveText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
    margin: 15,
  },
  liveMainLocation: {
    backgroundColor: 'white',
    marginTop: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    overflow: 'hidden',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
  },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Primary,
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
  liveLocation: {
    height: 50,
    width: '93%',
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  searchBar: {
    height: 50,
    backgroundColor: '#dcdcdc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '80%',
    padding: 10,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
    color: 'black',
  },
});
