import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {Avatar, Icon, Image, Skeleton, Rating, ListItem} from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../components/Header/index';
import Button from '../../components/Button/index';
import {useForm, Controller} from 'react-hook-form';
import {TextInput, Switch} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getAddressDelivery} from '../../stores/otherSlice';
import {useSelector, useDispatch} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/color.global';
import {useRoute} from '@react-navigation/native';
// import Keyboard from 'react-native-keyboard';
// import MapView from 'react-native-maps';
import {StyleSheet} from 'react-native';
const AddDeliveryAddress = ({navigation}) => {
  const {orientation, addressDelivery} = useSelector(state => state.other);
  const GOOGLE_PLACES_API_KEY = 'AIzaSyAnhD30Svb_cvOGS2Z399sgIcjuLGi5iCY';
  const dispatch = useDispatch();

  const {data} = useRoute().params || {};

  const [isUseKeyboard, setIsUseKeyboard] = useState(false);

  // const heightScreen = useRef(
  //   orientation != 'portrait' ? Dimensions.get('window').height : 0,
  // );

  // Đăng ký lắng nghe sự kiện mở bàn phím
  Keyboard.addListener('keyboardDidShow', () => {
    orientation == 'landscape' && setIsUseKeyboard(true);
  });

  // Đăng ký lắng nghe sự kiện đóng bàn phím
  Keyboard.addListener('keyboardDidHide', () => {
    setIsUseKeyboard(false);
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: data, // Sử dụng prop defaultValues để init giá trị từ màn hình khác
  });

  const [isViewLayout, setIsViewLayout] = useState(false);

  const addStore = data => {
    if (addressDelivery.length == 0 || data.selected == false) {
      console.log('data1');
      return [...addressDelivery, data];
    } else if (data.selected == true) {
      console.log('data2');
      return [
        ...addressDelivery.map(item => {
          return {...item, selected: false};
        }),
        data,
      ];
    }
  };

  const onSubmit = async value => {
    data
      ? !value.selected
        ? dispatch(
            getAddressDelivery(
              addressDelivery.map(item => {
                return item.id == data.id ? value : item;
              }),
            ),
          )
        : dispatch(
            getAddressDelivery(
              addressDelivery.map(item => {
                return item.id != data.id ? {...item, selected: false} : value;
              }),
            ),
          )
      : dispatch(
          getAddressDelivery(
            addStore({
              ...value,
              id: new Date().getTime(),
            }),
          ),
        );
    navigation.navigate('DeliveryAddress');
  };

  const icon = (name, size = 18, color = 'red', onPress) => {
    return (
      <Icon
        name={name}
        type="material"
        color={color}
        size={size}
        style={tw`mr-[5px]`}
        onPress={null}
      />
    );
  };

  const inputItem = ({
    field: {onChange, onBlur, value},
    placeholder,
    type = 'text',
    errors,
  }) => {
    return type != 'switch' ? (
      <View
        style={tw`flex-row items-center border ${
          errors ? 'border-red-500' : 'border-[#999]'
        } 
        rounded-[6px] text-[#333] w-full ${
          !isUseKeyboard && orientation == 'landscape' ? 'py-[10px]' : ''
        } px-[0px]`}>
        {/* {icon((name = 'person'), (size = 16))} */}
        {
          <TextInput
            spellCheck={false}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            style={tw`ml-[10px] ${
              !isUseKeyboard && orientation == 'landscape' && `text-4`
            } flex-1`}
            placeholderTextColor="#999"
          />
        }
      </View>
    ) : (
      <View
        style={tw`flex-row items-center w-full ${
          orientation != 'portrait' ? 'mr-[10px]' : 'mt-[5px]'
        }`}>
        <Text style={tw`ml-[10px] text-gray-600 flex-7 text-right`}>
          {placeholder}
        </Text>
        <Switch
          value={value}
          onValueChange={value => onChange(value)}
          onBlur={onBlur}
          // màu của switch khi bật
          thumbColor={PRIMARY_COLOR}
          trackColor={{false: '#767577', true: '#FF6666'}}
          style={tw`ml-[10px] mr-2 flex-1 py-1.5`}
        />
      </View>
    );
  };

  const [inputValue, setInputValue] = useState('');

  const handleChangeText = text => {
    setInputValue(text);
  };

  const layoutPortrait = () => {
    return (
      <View style={tw`px-[20px] flex mt-0`}>
        <View style={tw`w-full mb-[10px]`}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
              pattern: /^[^\d!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]+$/,
            }} // Không chứa số hoặc ký tự đặc biệt
            render={({field: {onChange, onBlur, value}}) =>
              inputItem({
                field: {onChange, onBlur, value},
                placeholder: 'Họ tên người nhận',
                errors: errors.name ? true : false,
              })
            }
          />
          {errors.name && (
            <Text style={tw`mt-[10px] text-red-500`}>
              Vui lòng nhập đúng định dạng tên
            </Text>
          )}
        </View>

        <View style={tw`w-full my-[10px]`}>
          <Controller
            name="numberPhone"
            control={control}
            rules={{required: true, pattern: /^(0\d{9,10})$/}} // Quy tắc yêu cầu từ 10 đến 11 chữ số
            render={({field: {onChange, onBlur, value}}) =>
              inputItem({
                field: {onChange, onBlur, value},
                placeholder: 'Số điện thoại',
                errors: errors.numberPhone ? true : false,
              })
            }
          />
          {errors.numberPhone && (
            <Text style={tw`mt-[10px] text-red-500`}>
              Vui lòng nhập số điện thoại đúng định dạng
            </Text>
          )}
        </View>

        <View style={tw`w-full my-[10px]`}>
          <Controller
            name="address"
            control={control}
            rules={{required: true}} // Quy tắc yêu cầu địa chỉ không được để trống
            render={({field: {onChange, onBlur, value}}) => (
              <View
                style={tw`flex-row items-start h-${
                  isViewLayout ? '60' : '20'
                } border ${errors.address ? 'border-red-500' : 'border-[#999]'} 
        rounded-[6px] text-[#333] w-full px-[3px]`}>
                <View style={tw`flex-1 bg-white`}>
                  <Text
                    numberOfLines={1}
                    style={tw`text-[${
                      value != null ? `#333` : `#999`
                    }] px-[10px] pt-[10px] text-[16px]`}>
                    {value != null ? value : 'Địa chỉ nhận hàng'}
                  </Text>
                  <GooglePlacesAutocomplete
                    // chiều cao của ô input
                    onLayout={() => {
                      setIsViewLayout(true);
                    }}
                    onChangeText={handleChangeText}
                    value={inputValue}
                    fetchDetails={true}
                    textInputProps={{
                      placeholder: 'Tìm kiếm địa chỉ...',
                      placeholderTextColor: '#999',
                      fontSize: 13,
                      // xuống dòng khi ô input được fEocus
                      multiline: true,
                      height: 42,
                      backgroundColor: 'white',
                      onBlur: () => {
                        setIsViewLayout(false);
                      },
                      onChangeText: value => {
                        // onChange(value);
                        value == '' && setIsViewLayout(false);
                      },
                    }}
                    onPress={(data, details = null) => {
                      onChange(data.description);
                      setIsViewLayout(false);
                    }}
                    // value={value}
                    query={{
                      key: GOOGLE_PLACES_API_KEY,
                      language: 'vi', // language of the results
                    }}
                    onFail={error => console.error(error)}
                    requestUrl={{
                      url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                      useOnPlatform: 'web',
                    }} // this in only required for use on the web. See https://git.io/JflFv more for details.
                  />
                </View>
              </View>
            )}
          />
          {errors.address && (
            <Text style={tw`mt-[10px] text-red-500`}>
              Vui lòng nhập địa chỉ nhận hàng
            </Text>
          )}
        </View>

        <View style={tw`w-full my-[10px]`}>
          <Controller
            name="selected"
            control={control}
            defaultValue={false} // Đặt giá trị mặc định là false
            render={({field: {onChange, onBlur, value}}) =>
              inputItem({
                field: {onChange, onBlur, value},
                placeholder: 'Đặt làm địa chỉ mặc định',
                type: 'switch',
                errors: errors.selected ? true : false,
              })
            }
          />
        </View>

        {/* <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 21.0285, // Ví dụ: Vị trí Hồ Gươm, Hà Nội
          longitude: 105.8542,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      />
    </View> */}
      </View>
    );
  };

  const layoutLandscape = () => {
    return (
      <View
        style={tw`px-[${!isUseKeyboard ? `20` : `10`}px] flex-row flex-1 mt-0`}>
        <View
          style={tw`px-[0px] flex-col flex-5 mr-${!isUseKeyboard ? `5` : `1`}`}>
          <View style={tw`w-full flex-col mb-[${!isUseKeyboard ? '15' : '5'}]`}>
            {!isUseKeyboard && (
              <View
                style={tw`flex-row items-center justify-between mb-1 w-full
              `}>
                <Text
                  style={tw`text-[#999] text-sm ${
                    !isUseKeyboard && orientation == 'landscape' && `text-3.5`
                  } `}>
                  Người nhận
                </Text>
                {errors.name && !isUseKeyboard && (
                  <Text style={tw` text-red-500`}>
                    Vui lòng nhập đúng định dạng tên
                  </Text>
                )}
              </View>
            )}
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
                pattern: /^[^\d!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]+$/,
              }} // Không chứa số hoặc ký tự đặc biệt
              render={({field: {onChange, onBlur, value}}) =>
                inputItem({
                  field: {onChange, onBlur, value},
                  placeholder: 'Họ tên người nhận',
                  errors: errors.name ? true : false,
                })
              }
            />
          </View>

          <View style={tw`w-full mb-[${!isUseKeyboard ? '0' : '5'}]`}>
            {!isUseKeyboard && (
              <View
                style={tw`flex-row items-center justify-between mb-1 w-full
              `}>
                <Text
                  style={tw`text-[#999] ${
                    !isUseKeyboard && orientation == 'landscape' && `text-3.5`
                  }`}>
                  SĐT
                </Text>
                {errors.numberPhone && !isUseKeyboard && (
                  <Text style={tw`text-red-500`}>
                    Vui lòng nhập đúng định dạng số điện thoại
                  </Text>
                )}
              </View>
            )}
            <Controller
              name="numberPhone"
              control={control}
              rules={{required: true, pattern: /^(0\d{9,10})$/}} // Quy tắc yêu cầu từ 10 đến 11 chữ số
              render={({field: {onChange, onBlur, value}}) =>
                inputItem({
                  field: {onChange, onBlur, value},
                  placeholder: 'Số điện thoại',
                  errors: errors.numberPhone ? true : false,
                })
              }
            />
          </View>
        </View>
        <View style={tw`px-[0px] flex-col flex-5 mt-0`}>
          {!isUseKeyboard && (
            <View
              style={tw`flex-row items-center justify-between mb-1 w-full
              `}>
              <Text
                style={tw`text-[#999] ${
                  !isUseKeyboard && orientation == 'landscape' && `text-3.5`
                }`}>
                Địa chỉ
              </Text>
              {errors.address && (
                <Text style={tw`text-red-500`}>
                  Vui lòng nhập địa chỉ nhận hàng
                </Text>
              )}
            </View>
          )}
          <View style={tw`w-full flex-5 my-[0px]`}>
            <Controller
              name="address"
              control={control}
              rules={{required: true}} // Quy tắc yêu cầu địa chỉ không được để trống
              render={({field: {onChange, onBlur, value}}) => (
                <View
                  style={tw`flex-row items-start h-${
                    isUseKeyboard ? '26.5' : '45'
                  } border ${
                    errors.address ? 'border-red-500' : 'border-[#999]'
                  } 
            rounded-[6px] text-[#333] w-full px-[3px]`}>
                  <View style={tw`flex-1 bg-white`}>
                    {!isUseKeyboard && (
                      <Text
                        numberOfLines={1}
                        style={tw`text-[${
                          value != null ? `#333` : `#999`
                        }] px-[10px] pt-[10px] ${
                          !isUseKeyboard &&
                          orientation == 'landscape' &&
                          `text-4.5`
                        }`}>
                        {value != null ? value : 'Địa chỉ nhận hàng'}
                      </Text>
                    )}
                    <GooglePlacesAutocomplete
                      // chiều cao của ô input
                      onLayout={() => {
                        setIsViewLayout(true);
                      }}
                      onChangeText={handleChangeText}
                      value={inputValue}
                      fetchDetails={true}
                      textInputProps={{
                        placeholder: 'Tìm kiếm địa chỉ...',
                        placeholderTextColor: '#999',
                        fontSize: !isUseKeyboard ? 13 : 14,
                        // xuống dòng khi ô input được fEocus
                        multiline: true,
                        height: !isUseKeyboard ? 38 : 35,
                        style: tw`px-[10px] mt-0 mb-0 pt-0 pb-0 text-[16px]`,
                        backgroundColor: 'white',
                        onBlur: () => {
                          setIsViewLayout(false);
                        },
                        onChangeText: value => {
                          // onChange(value);
                          value == '' && setIsViewLayout(false);
                        },
                      }}
                      onPress={(data, details = null) => {
                        onChange(data.description);
                        setIsViewLayout(false);
                      }}
                      // value={value}
                      query={{
                        key: GOOGLE_PLACES_API_KEY,
                        language: 'vi', // language of the results
                      }}
                      onFail={error => console.error(error)}
                      requestUrl={{
                        url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                        useOnPlatform: 'web',
                      }} // this in only required for use on the web. See https://git.io/JflFv more for details.
                    />
                  </View>
                </View>
              )}
            />
          </View>
          <View style={tw`w-full flex-1`}></View>
        </View>
        {/* <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 21.0285, // Ví dụ: Vị trí Hồ Gươm, Hà Nội
              longitude: 105.8542,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          />
        </View> */}
      </View>
    );
  };

  const inputArea = () => {
    return orientation == 'portrait' ? layoutPortrait() : layoutLandscape();
  };

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: 200,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header
          title={!data ? 'Địa chỉ mới' : 'Thay đổi thông tin'}
          navigation={navigation}
        />
      </View>
      <View
        style={tw`flex-1 bg-[#f5f5f5] flex-${
          orientation == 'portrait' ? `col` : `row`
        } justify-center`}>
        <View style={tw`flex-10 flex-col`}>
          {!isUseKeyboard && (
            <View style={tw`flex-row justify-between items-end bg-white pb-2`}>
              <Text
                onPress={() =>
                  !data &&
                  onSubmit({
                    name: 'Nguyễn Văn A',
                    numberPhone: '0123456789',
                    address: '123 Điện BiCM',
                    selected: true,
                  })
                }
                style={tw`text-[#333]  flex-1 text-[18px] font-bold px-[20px] pt-[30px] ${
                  !data ? 'pb-[10px]' : 'pb-[0px]'
                }`}>
                Thông tin giao hàng
              </Text>
              {data && (
                <Text style={tw` flex-1 text-[15px] font-bold`}>
                  ID: {data.id}
                </Text>
              )}
              {orientation != 'portrait' && (
                <View
                  style={tw`flex flex-2 p-0
              `}>
                  <Controller
                    name="selected"
                    control={control}
                    defaultValue={false} // Đặt giá trị mặc định là false
                    render={({field: {onChange, onBlur, value}}) =>
                      inputItem({
                        field: {onChange, onBlur, value},
                        placeholder: 'Đặt làm địa chỉ mặc định',
                        type: 'switch',
                        errors: errors.selected ? true : false,
                      })
                    }
                  />
                </View>
              )}
            </View>
          )}
          <View style={tw`flex-1 flex bg-white flex-col py-2 `}>
            {inputArea()}
          </View>
        </View>

        {orientation == 'portrait' ? (
          <View
            // disabled={true}
            style={tw`flex-1 flex-row justify-center mt-1 items-center bg-white`}>
            <Button
              title="HOÀN THÀNH"
              disabled={false}
              type="line"
              size="thin"
              icon={() => icon('check', 20, PRIMARY_COLOR)}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={tw`flex-1 flex-row justify-center bg-red-200 mt-0 items-center`}>
            <Icon
              name="checkmark-circle-outline"
              type="ionicon"
              color={PRIMARY_COLOR}
              size={40}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddDeliveryAddress;
