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
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {Component} from 'react';
import Header from '../../Components/Header.js';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import BrandListContainer from './BrandListContainer';

export default class BrandList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      brandData: [],
      tempData: [],
    };
    console.log('categoryList props', this.props);
  }
  componentDidMount() {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.brandList();
    });
  }
  renderItem = ({item}) => (
    <BrandListContainer
      item={item}
      navigation={this.props.navigation}
      updateState={data => this.updateState(data)}
      updateOrder_id={data => {
        this.setState({order_id: data});
        console.log('order_id', data);
      }}
    />
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
  brandList() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    POST('brands', raw)
      .then(response => {
        this.setState({
          brandData: response.result.response,
          loading: false,
        });
        console.log('brand Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  searchText = e => {
    let text = e.toLowerCase();
    let trucks = this.state.brandData;
    let filteredName = trucks.filter(item => {
      return item.brand_name.toLowerCase().match(text);
    });
    if (!text || text === '') {
      this.setState({
        tempData: this.state.brandData,
      });
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        noData: true,
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({
        noData: false,
        tempData: filteredName,
      });
    }
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />
        <Header
          navigation={this.props.navigation}
          data={data => {
            console.log('search data from category', data);
            this.searchText(data);
          }}
        />

        {this.state.loading ? (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color={color.Primary}
              style={{alignSelf: 'center'}}
            />
          </View>
        ) : (
          <FlatList
            style={{marginTop: 8, width: windowWidth}}
            contentContainerStyle={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            numColumns={3}
            ListEmptyComponent={this.renderEmpty}
            data={
              this.state.tempData.length != 0
                ? this.state.tempData
                : this.state.brandData
            }
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            // ItemSeparatorComponent={this.renderSeparator}
          />
        )}
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1000,
  },
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
    marginRight: 4,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
    color: 'black',
  },
  productName: {
    marginRight: 4,
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
