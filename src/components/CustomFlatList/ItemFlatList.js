import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
  Image,
  Linking,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
// import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import {getAuthInstance} from '../../utils/storage';
import {useSelector, useDispatch} from 'react-redux';
import {Avatar, Icon, Skeleton, Rating, ListItem, Dialog} from '@rneui/themed';
import tw from 'twrnc';
import {
  PRIMARY_COLOR,
  GREEN_COLOR,
  RED_COLOR,
  BORDER_COLOR,
  PINK_COLOR,
  BLUE_COLOR,
} from '../../styles/color.global';
import CustomDialog from '../CustomDialog/index';
import Clipboard from '@react-native-clipboard/clipboard';
import {set} from 'react-hook-form';
import {apiGetAllOrderForMe, apiUpdateOrder} from '../../apis/data';
import {
  getAllMyOrder,
  getCompleteMyOrderTodayNum,
} from '../../stores/dataSlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useRef} from 'react';
import {useMemo} from 'react';
import {inCome} from '../../constants';
import Toast from 'react-native-toast-message';
import Loading from '../loaders/Loading';
import {apiUpdateUser} from '../../apis/user';
import {update} from '../../stores/userSlice';
import {getDetailTimeInVietnam, getTimeInVietnam} from '../../comon';
import ActionButton from '../ActionButton';
// import MapView, {Marker} from 'react-native-maps';
// const MapScreen = ({location}) => {
//   // const [address, setAddress] = React.useState('');
//   const [googleMapsLink, setGoogleMapsLink] = useState('');

//   // Function to generate Google Maps link
//   const getGoogleMapsLink = () => {
//     // Replace with your address, city, district logic
//     // const location = '1600 Amphitheatre Parkway, Mountain View, CA';
//     const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//       location,
//     )}`;
//     // setAddress(googleMapsLink);
//     setGoogleMapsLink(link);
//   };

//   return (
//     <View style={{flex: 1}}>
//       {/* <MapView
//         style={{ flex: 1 }}
//         initialRegion={{
//           latitude: 37.78825,
//           longitude: -122.4324,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker
//           coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
//           title="Marker"
//           description="This is a marker"
//         />
//       </MapView> */}
//       <TouchableOpacity
//         onPress={getGoogleMapsLink}
//         style={{padding: 10, backgroundColor: 'blue', alignItems: 'center'}}>
//         <Text style={{color: 'white'}}>Get Google Maps Link</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={handlePressButton}
//         style={{padding: 10, backgroundColor: 'green', alignItems: 'center'}}>
//         <Text style={{color: 'white'}}>Open Google Maps</Text>
//       </TouchableOpacity>
//       {/* <Text style={{padding: 10}}>{address}</Text> */}
//     </View>
//   );
// };

const ItemFlatList = memo(({item, index, onRefresh}) => {
  // console.log('day ne troi121 ', item);
  const {user, token} = useSelector(state => state.user);
  const {completeMyOrderTodayNum} = useSelector(state => state.data);
  const navigation = useNavigation();
  const [visible6, setVisible6] = useState(false);
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // console.log('completeMyOrderTodayNum', completeMyOrderTodayNum);

  const formatToVND = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(number);
  };
  useEffect(() => {
    // Replace with your address, city, district logic
    const location = `${item?.address}, ${item?.wards}, ${item?.districs}, ${item?.city}`;
    const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location,
    )}`;
    // setAddress(googleMapsLink);
    setGoogleMapsLink(link);
  }, []);

  // Function to handle pressing the button
  const handlePressButton = () => {
    if (googleMapsLink) {
      Linking.openURL(googleMapsLink);
    } else {
      alert('Địa chỉ không tồn tại!');
    }
  };
  const toggleDialog = () => {
    setVisible(!visible);
  };

  // const getCompleteTodayOrder = () => {
  //   ordersFilter = orders.filter(item => {
  //     const day = getTimeInVietnam(new Date());
  //     const itemDay = getTimeInVietnam(item.updatedAt);
  //     //console.log(day, itemDay, day == itemDay)
  //     return day == itemDay;
  //   });
  //   const completeNumber = ordersFilter.filter(
  //     item => item.status == 'HOANTHANH',
  //   ).length;
  //   dispatch(getCompleteMyOrderTodayNum(completeNumber));
  // };

  const icon = (name, size = 18, color = 'white', onPress) => {
    return (
      <Icon
        name={name}
        type="ionicon"
        color={color}
        size={size}
        style={tw`mr-[5px]`}
        onPress={null}
      />
    );
  };
  // console.log('item1222 ', index);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('ProductDetail', {item: item});
          item?.status !== 'CHOXACNHAN'
            ? setVisible6(true)
            : Toast.show({
                type: 'info',
                position: 'top',
                text1: 'Chính sách bảo vệ thông tin khách hàng!',
                text2: 'Không thể xem chi tiết đơn đã giao hoặc bị hủy!',
              });
        }}
        key={index}
        style={tw`px-2 py-1 h-38 ${
          index % 2 == 0 ? 'bg-gray-200' : 'bg-white'
        } border-b border-gray-100 flex flex-row`}>
        <View style={tw`flex-3 flex-col flex py-[10px] px-[7px]`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Text style={[tw`text-[#333] flex-2 font-bold text-base`]}>
              STT {index + 1}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                tw`text-[#333] flex-8 font-bold text-base`,
                {height: 25, overflow: 'hidden'},
              ]}>
              Mã đơn:{' '}
              {item?._id == null ? '[Sản phẩm không còn tồn tại]' : item?._id}
            </Text>
            <TouchableOpacity style={tw`flex-col items-center flex-1`}>
              <Icon
                name={'copy-outline'}
                type="ionicon"
                color="gray"
                size={22}
                style={tw`mr-[1px]`}
                onPress={() => {
                  ToastAndroid.show(
                    'Đã sao chép mã đơn hàng',
                    ToastAndroid.SHORT,
                  );
                  Clipboard.setString(item?._id);
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-[#666] text-sm`}>
            Người nhận: {!item?.name ? '[không có thông tin]' : item?.name}
          </Text>
          {item?.status != 'HOANTHANH' ? (
            <Text style={tw`text-[#666] text-sm`}>
              Thời gian đặt:{' '}
              {item?.date == null ? '[không có thông tin]' : item?.date}
            </Text>
          ) : (
            <Text style={tw`text-[#666] text-sm`}>
              Thời gian giao:{' '}
              {item?.updatedAt == null
                ? '[không có thông tin]'
                : getDetailTimeInVietnam(item?.updatedAt)}
            </Text>
          )}
          <Text style={tw`text-[#666] text-sm`}>
            Địa chỉ:{' '}
            {item?.address == null ? '[không có thông tin]' : item?.address} ...
          </Text>
          <View style={tw`flex-row justify-between items-center`}>
            <Text
              style={[
                tw`text-[#666] text-${
                  item?.status == 'DANGGIAO' ? `4.5` : `xl`
                } `,
                {color: GREEN_COLOR},
              ]}>
              {item?.status == 'HOANTHANH'
                ? `+${
                    !item?.shippingCost == null
                      ? '[Trống]'
                      : formatToVND(item?.shippingCost * inCome)
                  }`
                : item?.status == 'DANGGIAO'
                ? 'Nhấn vào để xem'
                : formatToVND(0)}
            </Text>
            {/* <TouchableOpacity style={tw`flex-col items-center flex-1`}>
            <Icon
              name={'information-circle-outline'}
              type="ionicon"
              color="gray"
              size={22}
              style={tw`mr-[1px]`}
              onPress={() => {
                ToastAndroid.show(
                  'Đã sao chép mã đơn hàng',
                  ToastAndroid.SHORT,
                );
                Clipboard.setString(item?._id);
              }}
            />
          </TouchableOpacity> */}
            <TouchableOpacity
              disabled={true}
              style={[
                tw`flex-row w-32 items-center rounded h-10 justify-center`,
                {
                  backgroundColor:
                    item?.status == 'CHOXACNHAN'
                      ? '#FFA500'
                      : item?.status == 'DANGGIAO'
                      ? '#FF4500'
                      : item?.status == 'HOANTHANH'
                      ? '#32CD32'
                      : '#FF0000',
                },
              ]}>
              {icon(
                (name =
                  item?.status == 'CHOXACNHAN'
                    ? 'cube-outline'
                    : item?.status == 'DANGGIAO'
                    ? 'airplane-outline'
                    : item?.status == 'HOANTHANH'
                    ? 'checkmark-circle-outline'
                    : 'close-circle-outline'),
                (size = 20),
              )}
              <Text style={tw`text-white text-sm`}>
                {item?.status == 'CHOXACNHAN'
                  ? 'Chờ xác nhận'
                  : item?.status == 'DANGGIAO'
                  ? 'Đang giao'
                  : item?.status == 'HOANTHANH'
                  ? 'Hoàn thành'
                  : 'Đã hủy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <Dialog
        isVisible={visible6}
        // backdropStyle={tw`bg-black bg-opacity-50`}
        // style={tw`bg-red-200 rounded-lg`}
        // containerStyle={tw`p-0 rounded-lg`}
        // height={500}
        onBackdropPress={() => {
          setVisible6(false);
        }}>
        <Dialog.Title
          title={'Chi tiết đơn giao'}
          titleStyle={tw`text-center border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${PINK_COLOR}] m-0 text-xl font-bold text-[${
            PRIMARY_COLOR
            // }]
          }]`}
        />
        {/* {userlist.map((l, i) => ( */}
        <ListItem
          // key={i}
          containerStyle={{
            // marginHorizontal: -10,
            borderRadius: 8,
            // margin: 0,
            // marginVertical: 5,
            // backgroundColor: 'red',
          }}>
          {/* <Avatar rounded source={{uri: l.avatar_url}} /> */}
          <ListItem.Content>
            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Người nhận: <ListItem.Subtitle>{item?.name}</ListItem.Subtitle>
            </ListItem.Title>
            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Địa chỉ:{' '}
              <ListItem.Subtitle>
                {item?.address == null
                  ? '[không có thông tin]'
                  : item?.address +
                    ', ' +
                    item?.wards +
                    ', ' +
                    item?.districs +
                    ', ' +
                    item?.city}
              </ListItem.Subtitle>
            </ListItem.Title>
            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              SDT: <ListItem.Subtitle>{item?.phone}</ListItem.Subtitle>
            </ListItem.Title>

            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Số lượng:{' '}
              <ListItem.Subtitle>{item?.quantity} sản phẩm</ListItem.Subtitle>
            </ListItem.Title>

            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Giá trị:{' '}
              <ListItem.Subtitle>{formatToVND(item?.price)}</ListItem.Subtitle>
            </ListItem.Title>

            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Ghi chú:{' '}
              <ListItem.Subtitle>
                {item?.message != '' ? item?.message : '[Không có ghi chú]'}
              </ListItem.Subtitle>
            </ListItem.Title>

            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Phương thức thanh toán:{' '}
              <ListItem.Subtitle>
                {item?.payment_method != ''
                  ? item?.payment_method
                  : '[Không có thông tin]'}
              </ListItem.Subtitle>
            </ListItem.Title>

            <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
              Thời gian đặt:{' '}
              <ListItem.Subtitle>
                {item?.date != '' ? item?.date : '[Không có thông tin]'}
              </ListItem.Subtitle>
            </ListItem.Title>

            {item?.status == 'DANGGIAO' ? (
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Thời gian giao (dự kiến):{' '}
                <ListItem.Subtitle>
                  {item?.deliveryDate != '' && item?.deliveryDate != 'null'
                    ? item?.deliveryDate + ' (tính từ lúc đặt hàng)'
                    : '[Không có thông tin]'}
                </ListItem.Subtitle>
              </ListItem.Title>
            ) : item?.status == 'HOANTHANH' ? (
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Thời gian giao:{' '}
                <ListItem.Subtitle>
                  {item?.updatedAt != '' && item?.updatedAt != 'null'
                    ? getDetailTimeInVietnam(item?.updatedAt)
                    : '[Không có thông tin]'}
                </ListItem.Subtitle>
              </ListItem.Title>
            ) : (
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Thời gian hủy:{' '}
                <ListItem.Subtitle>
                  {item?.updatedAt != '' && item?.updatedAt != 'null'
                    ? getDetailTimeInVietnam(item?.updatedAt)
                    : '[Không có thông tin]'}
                </ListItem.Subtitle>
              </ListItem.Title>
            )}
            {item?.status != 'DAHUY' && (
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Thưởng giao hàng:{' '}
                <ListItem.Subtitle
                  style={{
                    color: GREEN_COLOR,
                    fontWeight: 'bold',
                  }}>
                  {item?.shippingCost != ''
                    ? formatToVND(item?.shippingCost * inCome)
                    : '[Không có thông tin]'}
                </ListItem.Subtitle>
              </ListItem.Title>
            )}
          </ListItem.Content>
        </ListItem>
        {/* <MapScreen /> */}
        {/* ))} */}
        {item?.status == 'DANGGIAO' && (
          <View style={tw`flex-row justify-center items-center `}>
            <TouchableOpacity onPress={() => handlePressButton()}>
              <Text
                style={tw`text-center border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${BLUE_COLOR}] text-white text-lg pl-3 pr-3`}>
                Xem bản đồ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(true)}>
              <Text
                style={tw`text-center border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${GREEN_COLOR}] text-white text-lg pl-3 pr-3`}>
                Đã giao hàng
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Dialog>
      <CustomDialog
        visible={visible}
        title="Xác nhận giao hàng"
        toggleDialog={toggleDialog}
        text="Mọi hành vi gian lận sẽ bị xử lý nghiêm ngặt!"
        actions={[
          {
            text: 'Chưa giao',
            onPress: () => {
              toggleDialog();
            },
          },
          {
            text: 'Đã giao',
            onPress: async () => {
              setLoading(true);
              setVisible6(false);
              toggleDialog();
              await apiUpdateOrder(
                'HOANTHANH',
                token,
                item._id,
                user?._id,
                // user?.city,
              );

              const response = await apiUpdateUser(
                {
                  money:
                    completeMyOrderTodayNum == 19
                      ? Number(user?.money) +
                        Number(item?.shippingCost) * inCome +
                        20000
                      : completeMyOrderTodayNum == 49
                      ? Number(user?.money) +
                        Number(item?.shippingCost) * inCome +
                        50000
                      : completeMyOrderTodayNum == 81
                      ? Number(user?.money) +
                        Number(item?.shippingCost) * inCome +
                        100000
                      : Number(user?.money) +
                        Number(item?.shippingCost) * inCome +
                        0,
                },
                user?._id,
                token,
              );
              if (
                completeMyOrderTodayNum == 19 ||
                completeMyOrderTodayNum == 49 ||
                completeMyOrderTodayNum == 99
              ) {
                Toast.show({
                  type: 'success',
                  position: 'top',
                  text1: 'Thông báo hệ thống',
                  text2:
                    'Xin chúc mừng, bạn vừa nhận ' +
                    formatToVND(
                      completeMyOrderTodayNum == 19
                        ? 20000
                        : completeMyOrderTodayNum == 49
                        ? 50000
                        : completeMyOrderTodayNum == 99
                        ? 100000
                        : 0,
                    ),
                });
              }
              dispatch(update(response.data.data));
              dispatch(getCompleteMyOrderTodayNum(completeMyOrderTodayNum + 1));
              setLoading(false);
              onRefresh();
            },
          },
        ]}
      />
      {/* {loading && <Loading />} */}
    </View>
  );
});

const styles = StyleSheet.create({
  itemWrapperStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemImageStyle: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  contentWrapperStyle: {
    justifyContent: 'space-around',
  },
  txtNameStyle: {
    fontSize: 16,
  },
  txtEmailStyle: {
    color: '#777',
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export default ItemFlatList;
