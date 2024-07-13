import React, {useState, useMemo, useEffect, memo, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
  Touchable,
  TouchableNativeFeedback,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import tw from 'twrnc';
import {
  BLUE_COLOR,
  GREEN_COLOR,
  PRIMARY_COLOR,
  RED_COLOR,
} from '../../styles/color.global';
import {Icon} from '@rneui/themed';
import {getAddressDelivery} from '../../stores/otherSlice';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import CustomDialog from '../CustomDialog/index';
import {inCome} from '../../constants';
import {formatToVND} from '../../comon';

const SwipeToDeleteEditItem = memo(
  ({func, index, updateAddressDelivery, addressDelivery}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [panX, setPanX] = useState(0);
    const [visible, setVisible] = useState(false);

    // console.log(addressDelivery, 'addressDelivery');

    const isLated = () => {
      const date = new Date();
      const createDate = new Date(addressDelivery[index].createdAt);
      let endDate = new Date(createDate);
      // cộng ngày createDate thêm 1 ngày nữa
      endDate.setDate(createDate.getDate() + 1);
      // const hours = date.getHours();
      return date > endDate;
    };

    const frameItem = () => {
      return (
        <View
          style={tw`bg-${
            index % 2 == 0 ? 'red-50' : 'white'
          } px-2 py-1 border-b border-gray-200 flex flex-row`}>
          <View style={tw`flex-3 flex-col flex py-[10px] px-[7px]`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`flex-3 flex-col flex justify-center items-start`}>
                <Text
                  numberOfLines={2}
                  style={[tw`text-[${BLUE_COLOR}] flex-8 font-bold text-base`]}>
                  Mã đơn:{' '}
                  {addressDelivery[index]?._id == null
                    ? 'Không có thông tin '
                    : addressDelivery[index]?._id}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[tw`text-[#333] flex-8 font-bold text-lg`]}>
                  {addressDelivery[index]?.name == null
                    ? 'Không có thông tin '
                    : addressDelivery[index]?.name}
                </Text>
              </View>
              {addressDelivery[index].selected && (
                <Text
                  style={tw`text-[${PRIMARY_COLOR}] w-20 text-sm border border-[${PRIMARY_COLOR}] rounded-[5] py-1 px-2 text-center`}>
                  Mặc định
                </Text>
              )}
            </View>
            {/* <Text style={tw`text-[#666] text-sm`}>
            Ngày đặt:{' '}
            {addressDelivery[index].phone == null
              ? '[Không có thông tin]'
              : '(+84) ' + addressDelivery[index].phone.slice(1)}
          </Text> */}
            {/* {
            // đường kẻ ngang
            <View style={tw`w-70 h-0.8 bg-gray-200 mb-2`} />
          } */}
            <Text style={tw`text-[#666] text-sm`}>
              Số lượng:{' '}
              {addressDelivery[index].quantity == null
                ? '[Không có thông tin]'
                : addressDelivery[index].quantity + ' sản phẩm'}
            </Text>
            <Text style={tw`text-[#666] text-sm`}>
              Đặt lúc:{' '}
              {addressDelivery[index].date == null
                ? '[Không có thông tin]'
                : addressDelivery[index].date}
            </Text>
            <Text style={tw`text-[#666] text-sm`}>
              Dự kiến giao:{' '}
              {!addressDelivery[index]?.deliveryDate ||
              addressDelivery[index]?.deliveryDate == "null"
                ? '[Không có thông tin]'
                : addressDelivery[index]?.deliveryDate.includes('Ngày mai')
                ? 'Ngày mai, 1 ngày kể từ khi đặt'
                : addressDelivery[index].deliveryDate}
              <Text
                style={tw`text-[${
                  isLated() ? RED_COLOR : GREEN_COLOR
                }] text-sm`}>
                {isLated() ? ' (Trễ hạn)' : ''}
              </Text>
            </Text>

            <Text style={tw`text-[#666] text-sm`}>
              Địa chỉ:{' '}
              {`${addressDelivery[index].address}, ${addressDelivery[index].wards}, ${addressDelivery[index].districs}, ${addressDelivery[index].city}`}
            </Text>
            {/* <View style={tw`w-70 h-0.5 bg-gray-200 mt-2 ml-18 pr-20`} /> */}
            <Text
              style={tw`text-[${GREEN_COLOR}] text-2xl text-right flex flex
          justify-center items-center pr-2
          `}>
              {`+${formatToVND(addressDelivery[index].shippingCost * inCome)}`}
            </Text>
          </View>
        </View>
      );
    };

    const navigation = useNavigation();

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponderCapture: () => true,
          onPanResponderMove: (_, gestureState) => {
            const {dx} = gestureState;
            setPanX(dx);
            Animated.event([null, {dx: pan.x}], {useNativeDriver: false})(
              _,
              gestureState,
            );
          },
          onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx < -100) {
              handleEdit();
            } else if (gestureState.dx > 100) {
              handleDelete();
            } else {
              resetPosition();
            }
          },
        }),
      [addressDelivery],
    );

    const resetPosition = () => {
      Animated.spring(pan, {
        toValue: {x: 0, y: 0},
        // duration: 400, // Thời gian để di chuyển mục

        useNativeDriver: false,
      }).start();

      // tăng/giảm độ sáng của thanh XÓA
      pan.addListener(value => {
        setPanX(value.x);
      });
    };

    const handleDelete = () => {
      Animated.timing(pan, {
        toValue: {x: Dimensions.get('window').width, y: 0},
        duration: 400, // Thời gian để di chuyển mục
        useNativeDriver: false,
      }).start(() => {
        resetPosition();
        func(addressDelivery[index]._id);
      });
      pan.addListener(value => {
        setPanX(value.x);
      });
    };

    const handleEdit = () => {
      Animated.timing(pan, {
        toValue: {x: -Dimensions.get('window').width, y: 0},
        duration: 400, // Thời gian để di chuyển mục
        useNativeDriver: false,
      }).start(() => {
        // navigation.navigate('AddAddress', {
        //   address: addressDelivery[index],
        // });
        func(addressDelivery[index]._id);
        resetPosition();
      });
    };

    const toggleDialog = () => {
      setVisible(!visible);
    };

    return (
      <View style={tw`flex-1 flex-row`}>
        {/* <CustomDialog
          visible={visible}
          title="Xác nhận"
          toggleDialog={toggleDialog}
          text="Bạn muốn đặt làm địa chỉ mặc định?"
          actions={[
            {
              text: 'Hủy',
              onPress: () => {
                toggleDialog();
              },
            },
            {
              text: 'Đồng ý',
              onPress: () => {
                updateAddressDelivery(addressDelivery[index]);
                toggleDialog();
              },
            },
          ]}
        /> */}
        {panX < 0 ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              height: '100%',
              flex: 1,
              backgroundColor: `rgb(${255 + panX * 0.7}, ${
                255 + panX * 0.7
              }, 255)`,
            }}>
            <Text style={tw`text-white text-8 mr-2`}>Lấy hàng</Text>
            <Icon
              style={tw`text-white mr-8`}
              name="dice-outline"
              type="ionicon"
              size={30}
              color="white"
            />
          </View>
        ) : (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              flex: 1,
              // backgroundColor: `rgb(${255 - panX * 0.8}, 255, ${
              //   255 - panX * 0.8
              // })`,
              backgroundColor: `rgb(${255 - panX * 0.7}, ${
                255 - panX * 0.7
              }, 255)`,
            }}>
            <Icon
              style={tw`text-white ml-6`}
              name="dice-outline"
              type="ionicon"
              size={30}
              color="white"
            />
            <Text style={tw`text-white text-8 ml-2`}>Lấy hàng</Text>
          </View>
        )}
        <Animated.View
          style={{
            transform: [{translateX: pan.x}],
          }}
          {...panResponder.panHandlers}>
          <TouchableOpacity
            // chỉnh độ opacity khi click vào item
            onPress={
              addressDelivery[index].selected
                ? null
                : () => {
                    setVisible(true);
                  }
            }
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            {frameItem()}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  },
);

export default SwipeToDeleteEditItem;
