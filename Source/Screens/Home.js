import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, {Component} from 'react';
import Header from '../Components/Header.js';
import {color} from '../Helper/Global';
import {SliderBox} from 'react-native-image-slider-box';
import {POST} from '../Helper/ApiManger/Apis';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 1,
      loading: false,
      interval: null,
      images: [
        // 'https://www.homebethe.com/image/home_page/2020/october/Grocery-Banner.png',
        // 'https://cdn1.vectorstock.com/i/1000x1000/28/15/shopping-basket-with-grocery-products-sale-banner-vector-33852815.jpg', // Network image
        // 'https://media.istockphoto.com/vectors/grocery-shopping-promotional-sale-banner-vector-id1198467447',
        // require('./assets/images/girl.jpg'),          // Local image
      ],
      productData: [],
      data: [],
      tempData: [],
      showText: true,
      bannerList: [],
      isloading: false,
      brandData: [],
      staticBannerData: [],
    };
  }

  // componentWillMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  // }

  onBackPress = () => {
    //Code to display alert message when use click on android device back button.
    Alert.alert(
      'Exit From App',
      ' Do you want to exit From App ?',
      [
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
        {text: 'No', onPress: () => console.log('NO Pressed')},
      ],
      {cancelable: false},
    );

    // Return true to enable back button over ride.
    return true;
  };
  componentDidMount() {
    this.setState({isloading: true}, () => {
      this.brandList();
      this.categoryList();
      this.staticBanner();
      this.bannerImgs(false);
    });
    const interval = setInterval(() => {
      this.setState({showText: !this.state.showText});
    }, 3500);
    return () => clearInterval(interval);
  }

  searchText = e => {
    let text = e.toLowerCase();
    let trucks = this.state.productData;
    let filteredName = trucks.filter(item => {
      return item.name.toLowerCase().match(text);
    });
    if (!text || text === '') {
      this.setState({
        tempData: this.state.productData,
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

  staticBanner() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    console.log('staticBanner raw ', raw);

    POST('static/banners', raw)
      .then(response => {
        console.log('static banners Response ', response);

        this.setState({
          staticBannerData: response.result.response,
          loading: false,
        });
      })
      .catch(err => {
        this.setState({loading: false, isloading: false});

        console.log('Erroorr', err);
      });
  }

  bannerImgs() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    console.log('bannerImgs raw ', raw);

    POST('banners', raw)
      .then(response => {
        console.log('banners Response ', response);

        const imagesList = response.result.response.map(
          value => `data:image/png;base64,${value.image}`,
        );
        this.setState({
          images: imagesList,
          isloading: false,
          bannerList: response.result.response,
        });
        // this.setState({productData: response.result.response, loading: false});
      })
      .catch(err => {
        this.setState({loading: false, isloading: false});

        console.log('Erroorr', err);
      });
  }

  categoryList() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    console.log('categoryList raw ', raw);

    POST('categories', raw)
      .then(response => {
        console.log('category Response ', response);

        this.setState({
          productData: response.result.response,
          loading: false,
        });
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  brandList() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    console.log('brandList raw ', raw);

    POST('brands', raw)
      .then(response => {
        console.log('brand Response ', response);

        if (response.error) {
          if (response.error.message == 'Odoo Session Expired') {
            this.props.navigation.replace('Welcome');
            Toast.showWithGravity(
              response.error.message,
              Toast.SHORT,
              Toast.BOTTOM,
            );
          }
        } else {
          this.setState({
            brandData: response.result.response,
            loading: false,
          });
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  selectBrand(id) {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        brand_id: id,
      },
    });
    console.log('raw  ', raw);

    POST('filter/brand', raw)
      .then(response => {
        this.next(response.result.response, 'BrandGrid', id);
        console.log('selectBrand Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  selectCategory(id) {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        // public_categ_id: parseInt(this.state.categorySelectedId),
        public_categ_id: id,
      },
    });
    console.log('raw  ', raw);

    POST('filter/category', raw)
      .then(response => {
        this.setState({loading: false});
        this.next(response.result.response, 'CategoryGrid', id);
        console.log('selectCategory Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  next(item, screenName, id) {
    this.props.navigation.push('ProductList', {
      item: item,
      loading: true,
      screenName: screenName,
      id: id,
    });
  }

  renderItem = ({item}) => (
    <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={() => {
        this.selectCategory(item.id);
      }}>
      <View
        style={{
          height: 70,
          width: windowWidth / 4,
          alignSelf: 'center',
          marginTop: 5,
          marginRight: 5,
          marginLeft: 5,
          backgroundColor: '#E0E0E0',
        }}>
        <Image
          style={{
            height: 60,
            width: windowWidth / 4,
            alignSelf: 'center',
          }}
          source={
            item.image
              ? {
                  uri: `data:image/png;base64,${item.image}`,
                }
              : require('../Helper/Assets/Gmaart.png')
          }
          resizeMode={'contain'}
        />
      </View>

      <Text
        style={{
          marginTop: 5,
          marginBottom: 10,
          // marginLeft: 10,
          color: 'black',
          fontWeight: '500',
          textAlign: 'center',
          alignSelf: 'center',
          width: 90,
        }}>
        {item.name}
      </Text>
      {/* </ImageBackground> */}
    </TouchableOpacity>
  );
  renderBrandItem = ({item}) => (
    <TouchableOpacity
      // style={{marginLeft: 10}}
      onPress={() => {
        this.selectBrand(item.id);
      }}>
      <Image
        style={{
          height: 100,
          width: windowWidth / 4,
          alignSelf: 'center',
          marginTop: 5,
          marginRight: 5,
          marginLeft: 5,
        }}
        source={
          item.image
            ? {
                uri: `data:image/png;base64,${item.image}`,
              }
            : require('../Helper/Assets/Gmaart.png')
        }
        resizeMode={'contain'}
      />
      <Text
        style={{
          marginTop: 5,
          marginLeft: 10,
          color: 'black',
          fontWeight: '500',
          textAlign: 'center',
        }}>
        {item.brand_name}
      </Text>
      {/* </ImageBackground> */}
    </TouchableOpacity>
  );
  renderItemStaticBanner = ({item}) => (
    <TouchableOpacity
      // style={{backgroundColor: '#D0D0D0'}}
      onPress={() => {
        // alert('hhellooo');
        this.props.navigation.push('ProductList', {
          item: item.products,
          loading: true,
          screenName: 'Home',
        });
      }}>
      <Image
        style={[styles.banner]}
        source={
          item.image
            ? {
                uri: `data:image/png;base64,${item.image}`,
              }
            : require('../Helper/Assets/Gmaart.png')
        }
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
  renderFooter = () => (
    <TouchableOpacity
      style={styles.footer}
      onPress={() => this.props.navigation.navigate('CategoryListStack')}>
      <Text style={{color: color.Primary, fontWeight: '700', marginRight: 5}}>
        Load More...
      </Text>
    </TouchableOpacity>
  );
  renderBrandFooter = () => (
    <TouchableOpacity
      style={styles.footer}
      onPress={() => this.props.navigation.navigate('BrandStack')}>
      <Text style={{color: color.Primary, fontWeight: '700', marginRight: 5}}>
        Load More...
      </Text>
    </TouchableOpacity>
  );
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.Primary}}>
        <StatusBar backgroundColor={color.Primary} />
        <View style={{flex: 1, backgroundColor: color.secondary}}>
          {this.state.loading ||
            (this.state.isloading && (
              // <View style={styles.activityLoader}>
              <ActivityIndicator
                size="large"
                color={color.secondary}
                style={[styles.activityLoader, {alignSelf: 'center'}]}
              />
              // </View>
            ))}
          <Header
            navigation={this.props.navigation}
            data={data => {
              console.log('search data from home', data);
              this.searchText(data);
            }}
            screenName={'Home'}
          />

          <ScrollView>
            {this.state.images.length == 0 ? (
              <View
                style={[
                  styles.banner,
                  {
                    height: 220,
                    backgroundColor: color.Primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <Image
                  style={{
                    display: this.state.showText ? 'none' : 'flex',
                    height: 80,
                    width: 100,
                  }}
                  source={require('../Helper/Assets/Gmaart.png')}
                  resizeMode="center"
                />
              </View>
            ) : (
              <SliderBox
                // style={{backgroundColor: 'white'}}
                ImageComponentStyle={{width: '100%'}}
                onCurrentImagePressed={index => {
                  console.log(`image ${index} pressed`);

                  let data = this.state.bannerList.filter(function (item) {
                    let value = item.id == index + 1;
                    return value;
                  });
                  console.log('data', data, data[0].products);
                  this.props.navigation.push('ProductList', {
                    item: data[0].products,
                    screenName: 'Home',
                    loading: true,
                  });
                  // this.next(data[0].products);
                }}
                images={this.state.images}
                // resizeMode={'contain'}
                sliderBoxHeight={220}
                width={windowWidth}
                activeOpacity={0.5}
              />
            )}
            {/* <View style={styles.tag2Container}>
              <Text style={styles.tag2Text}>
                Extra <Text style={{color: 'red'}}>10% </Text> Cashback{' '}
              </Text>
              <View style={{borderRightWidth: 1, margin: 5}} />
              <Text style={styles.tag2}>
                UPTO <Text style={{color: 'red'}}>RS.250 </Text> CASHBACK
                EVERYDAY{' '}
              </Text>
            </View> */}
            <FlatList
              // style={{marginBottom: 20}}
              data={this.state.staticBannerData}
              renderItem={this.renderItemStaticBanner}
              keyExtractor={item => item.id}
            />
            {/* <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ProductList');
              }}>
              <Image
                style={styles.banner}
                source={require('../Helper/Assets/banner2.jpeg')}
              />
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ProductList');
              }}>
              <Image
                style={styles.banner}
                source={{
                  uri: 'https://thumbs.dreamstime.com/z/online-shopping-banner-ecommerce-concept-flat-vector-illustration-75874174.jpg',
                }}
              />
            </TouchableOpacity> */}
            <Text style={styles.categoryStyle}>SHOP BY ALL CATEGORY </Text>

            <FlatList
              style={{marginBottom: 20, width: windowWidth}}
              contentContainerStyle={{alignSelf: 'center'}}
              numColumns={3}
              maxToRenderPerBatch={6}
              // horizontal
              data={
                this.state.tempData.length != 0
                  ? this.state.tempData
                  : this.state.productData.slice(0, 6)
              }
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              ListFooterComponent={this.renderFooter}
            />
            <Text style={styles.categoryStyle}>SHOP BY BRAND </Text>

            <FlatList
              style={{marginBottom: 20, width: windowWidth}}
              contentContainerStyle={{alignSelf: 'center'}}
              numColumns={3}
              maxToRenderPerBatch={6}
              data={
                this.state.tempData.length != 0
                  ? this.state.tempData
                  : this.state.brandData.slice(0, 6)
              }
              renderItem={this.renderBrandItem}
              keyExtractor={item => item.id}
              ListFooterComponent={this.renderBrandFooter}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
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
  categoryStyle: {
    marginTop: 10,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
    marginLeft: 5,
    fontSize: 18,
    fontWeight: '600',
  },
  tag2: {
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
    marginLeft: 5,
    fontWeight: '400',
  },
  tag2Text: {
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
    marginLeft: 5,
    fontWeight: '400',
  },
  tag2Container: {
    backgroundColor: '#FFCF39',
    height: 35,
    flexDirection: 'row',
    marginTop: 5,
  },
  banner: {
    height: 200,
    width: windowWidth,
    alignSelf: 'center',
    // margin: 10,
  },
  tagContainer: {
    backgroundColor: '#c8c8c8',
    height: 40,
    flexDirection: 'row',
  },
  tagText: {
    textAlign: 'center',
    alignSelf: 'center',
    color: '#606060',
    fontSize: 18,
    fontWeight: '600',
  },
});
