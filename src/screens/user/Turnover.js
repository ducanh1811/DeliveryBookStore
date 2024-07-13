import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import {Avatar, ListItem, Slider} from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../components/Header/index';
import Button from '../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';
import {logout, update} from '../../stores/userSlice';
import Toast from 'react-native-toast-message';
import Timeline from '../../components/TimeLine';
import {ButtonGroup} from '@rneui/themed';
import {formatDetailToVND, formatToVND, getTimeInVietnam} from '../../comon';

import {apiGetAllOrderForMe} from '../../apis/data';
import {
  PRIMARY_COLOR,
  SMALL_COLOR,
  GREEN_COLOR,
  BLUE_COLOR,
  BORDER_COLOR,
  LIGHT_COLOR,
  RED_COLOR,
  YELLOW_COLOR,
  PINK_COLOR,
  TEXT_COLOR_SECONDARY,
} from '../../styles/color.global';
import {set} from 'react-hook-form';
import {Dialog, Icon} from '@rneui/themed';
import {color} from '@rneui/themed/dist/config';
// import {useNavigation} from '@react-navigation/native';
import {
  getAllMyOrder,
  getDeliveryMyOrder,
  getCompleteMyOrder,
  getCancelMyOrder,
  getTimeOrderType,
  getCompleteMyOrderTodayNum,
} from '../../stores/dataSlice';
import {inCome} from '../../constants';
import ActionButton from '../../components/ActionButton';
import {getIsUseKeyBoard} from '../../stores/otherSlice';
import {apiUpdateUser} from '../../apis/user';
const Turnover = ({navigation}) => {
  const {user, token, isLoggedIn} = useSelector(state => state.user);
  const {completeMyOrderTodayNum} = useSelector(state => state.data);
  
  const [orders, setOrders] = useState([]);
  const [drawMoney, setDrawMoney] = useState('');
  const [isSeenDetail, setIsSeenDetail] = useState(false);
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  // Check hướng điện thoại
  const {orientation} = useSelector(state => state.other);
  const [refreshing, setRefreshing] = useState(false);
  const [infoDoanhThu, setInfoDoanhThu] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [value, setValue] = useState(0);
  // const [horValue, setHorValue] = useState(0);

  const handleToLogin = () => {
    navigation.navigate('Login');
  };

  const handleToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const titleBig = (title, icon) => {
    return (
      <View style={tw`flex-row justify-start items-center`}>
        {icon}
        <Text style={[tw`text-5`, {color: GREEN_COLOR}]}>{title}</Text>
      </View>
    );
  };

  const icon = (name, size, onPress, color) => {
    return (
      <Icon
        name={name}
        type="material"
        color={color ? color : 'gray'}
        size={size ? size : 18}
        style={tw`mr-[5px]`}
        onPress={onPress ? onPress : () => {}}

        //onPress={handleLogout}
      />
    );
  };

  const infoTurnover = [
    {
      title: 'Thu nhập',
      value: formatToVND(infoDoanhThu[0]),
    },
    {
      title: 'Tổng đơn hàng',
      value: infoDoanhThu[1],
    },
    {
      title: 'Đang giao',
      value: infoDoanhThu[2],
    },
    {
      title: 'Hoàn thành',
      value: infoDoanhThu[3],
    },
    {
      title: 'Không hoàn thành',
      value: infoDoanhThu[4],
    },
  ];

  const formatMoney = value => {
    // Xóa tất cả ký tự không phải số
    const cleanedValue = value.replace(/[^0-9]/g, '');

    // Định dạng số với dấu chấm
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedValue;
  };

  const menu = [
    // {
    //   title: 'Sản phẩm yêu thích',
    //   icon: 'favorite',
    //   onPress: () => {
    //     navigation.navigate('Favorite');
    //   },
    // },
    // {
    //   title: 'Đơn hàng của tôi',
    //   icon: 'shopping-cart',
    //   onPress: () => {
    //     navigation.navigate('MyOrder');
    //   },
    // },
    // {
    //   title: 'Địa chỉ giao hàng',
    //   icon: 'map',
    //   onPress: () => {
    //     navigation.navigate('DeliveryAddress');
    //   },
    // },
    // {
    //   title: 'Voucher của tôi',
    //   icon: 'receipt',
    //   onPress: () => {
    //     navigation.navigate('Voucher');
    //   },
    // },
    // {
    //   title: 'Săn điểm TAS',
    //   icon: 'sports',
    //   onPress: () => {
    //     navigation.navigate('TASHunting');
    //   },
    // },
    // {
    //   title: 'Ngôn ngữ',
    //   icon: 'language',
    //   onPress: () => {
    //     navigation.navigate('Language');
    //   },
    // },
    {
      title: 'Hỗ trợ',
      icon: 'help',
      onPress: () => {
        navigation.navigate('Support');
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiGetAllOrderForMe(token, user._id, -1, -1);
        //console.log(data.data.data);
        setOrders(data.data.data);
        // đẩy số đơn hoàn thành hôm nay lên store

        // dispatch(getAllMyOrder(data?.data?.data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        //console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Gọi hàm async từ hàm fetchData
  }, [refreshing]);

  function getStartAndEndOfWeek(date) {
    // Copy date để không thay đổi ngày gốc
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ngày đầu tuần
    const startOfWeek = new Date(d.setDate(diff));
    const endOfWeek = new Date(d.setDate(diff + 6)); // Ngày cuối tuần

    return {
      startOfWeek,
      endOfWeek,
    };
  }

  const interpolate = (start, end) => {
    let k = (value - 0) / 100; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  // const mucthuong = [
  //   {
  //     title: '1'
  //   }
  // ]

  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    // lọc theo ngày
    let ordersFilter = orders;
    if (selectedIndex == 0) {
      ordersFilter = orders.filter(item => {
        const day = getTimeInVietnam(new Date());
        const itemDay = getTimeInVietnam(item.updatedAt);
        //console.log(day, itemDay, day == itemDay)
        return day == itemDay;
      });
    }

    // lọc theo tuần
    if (selectedIndex == 1) {
      ordersFilter = orders.filter(item => {
        // Sử dụng hàm để lấy ngày đầu tuần và cuối tuần từ ngày hiện tại
        const currentDate = new Date(); // Ngày bất kỳ
        const weekBounds = getStartAndEndOfWeek(currentDate);
        console.log(weekBounds.startOfWeek, weekBounds.endOfWeek);
        return (
          new Date(item.updatedAt) <= weekBounds.endOfWeek &&
          new Date(item.updatedAt) >= weekBounds.startOfWeek
          // &&
          // new Date(item.updatedAt).getFullYear() == new Date().getFullYear()
        );
      });
    }

    console.log('orders', ordersFilter);

    // lọc theo tháng
    if (selectedIndex == 2) {
      ordersFilter = orders.filter(item => {
        return (
          new Date(item.updatedAt).getMonth() == new Date().getMonth() &&
          new Date(item.updatedAt).getFullYear() == new Date().getFullYear()
        );
      });
    }

    const canCelNumber = ordersFilter.filter(
      item => item.status == 'DAHUY',
    ).length;
    // tổng số đơn hàng
    const totalNumber = ordersFilter.length;
    const completeNumber = ordersFilter.filter(
      item => item.status == 'HOANTHANH',
    ).length;
    if (selectedIndex == 0) {
      dispatch(getCompleteMyOrderTodayNum(completeNumber));
    }
    const pendingNumber = ordersFilter.filter(
      item => item.status == 'DANGGIAO',
    ).length;

    // tổng doanh thu * income
    const tongDoanhThu =
      ordersFilter
        .filter(item => item.status == 'HOANTHANH')
        .reduce((total, item) => {
          return total + parseInt(item.shippingCost);
        }, 0) * inCome;

    console.log(tongDoanhThu);

    // dispatch(getAllMyOrder(ordersFilter));

    // dispatch(
    //   getDeliveryMyOrder(
    //     ordersFilter.filter(item => item.status == 'DANGGIAO'),
    //   ),
    // );

    // dispatch(
    //   getCompleteMyOrder(
    //     ordersFilter.filter(item => item.status == 'HOANTHANH'),
    //   ),
    // );

    // dispatch(
    //   getCancelMyOrder(ordersFilter.filter(item => item.status == 'DAHUY')),
    // );

    // const currentDate = new Date(); // Ngày bất kỳ
    // const weekBounds = getStartAndEndOfWeek(currentDate);

    dispatch(
      getTimeOrderType(
        `${
          selectedIndex == 0
            ? getTimeInVietnam(new Date())
            : selectedIndex == 1
            ? getStartAndEndOfWeek(new Date())
                .startOfWeek.toLocaleDateString()
                .slice(0, 10) +
              ' - ' +
              getStartAndEndOfWeek(new Date())
                .endOfWeek.toLocaleDateString()
                .slice(0, 10)
            : selectedIndex == 2
            ? `Tháng ${new Date().getMonth() + 1}`
            : 'Tất cả'
        }`,
      ),
    );

    setInfoDoanhThu([
      tongDoanhThu,
      totalNumber,
      pendingNumber,
      completeNumber,
      canCelNumber,
    ]);
  }, [orders, selectedIndex]);

  const handleDrawMoney = async () => {
    let draw = drawMoney.replace(/[^0-9]/g, '');
    try {
      if (draw == '') {
        Toast.show({
          type: 'error',
          text1: 'Thông báo hệ thống',
          text2: 'Số tiền rút không được để trống',
          visibilityTime: 2000,
        });
        return;
      }
      if (parseInt(draw) > user.money) {
        Toast.show({
          type: 'info',
          text1: 'Thông báo hệ thống',
          text2: 'Số tiền rút không được lớn hơn số dư',
          visibilityTime: 2000,
        });
        return;
      }
      setLoading(true);
      const data = await apiUpdateUser(
        {
          isDraw: true,
          drawingMoney: parseInt(draw),
        },
        user._id,
        token,
      );

      //console.log(data.data.data);
      if (data.data.status === 'OK') {
        dispatch(update(data.data.data));
        setDrawMoney('');
        setVisible(false);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Thông báo hệ thống',
          text2: 'Yêu cầu rút tiền thành công',
          visibilityTime: 2000,
        });
      } else {
        setLoading(false);
        setVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Thông báo hệ thống',
          text2: 'Rút tiền thất bại',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      setLoading(false);
      setVisible(false);
      //console.error('Error fetching data:', error);
      Toast.show({
        type: 'error',
        text1: 'Thông báo hệ thống',
        text2: 'Lỗi rút tiền: ' + error,
        visibilityTime: 2000,
      });
    }
  };

  // screen khi da dang nhap
  const screenWhenLoggedIn = () => {
    const point = 100;
    return (
      <View
        style={tw`flex-1 flex-${
          orientation == 'portrait' ? 'col' : 'row'
        } justify-center items-center
        `}>
        <View
          style={tw`flex-${orientation == 'portrait' ? '1' : '2'} flex-${
            orientation == 'portrait' ? 'row' : 'col'
          }  justify-between items-center bg-white w-full ${
            orientation != 'portrait' ? `pt-7` : `pl-4 pr-2 py-3`
          }`}>
          <Avatar
            onPress={() => {
              //console.log(orientation);
            }}
            size={100}
            rounded
            source={user.images ? {uri: user.images} : {}}
          />
          <View
            style={tw`flex-1 px-2 items-${
              orientation != 'portrait' ? 'center' : 'start'
            }`}>
            <Text style={tw`my-[0px] text-lg`}>{user?.fullName}</Text>
            {/* <Timeline /> */}
            <Text style={tw`my-[0px] text-sm`}>{user?.email}</Text>
            <Text style={tw`my-[0px] text-sm`}>
              Số dư hiện tại{' '}
              {/* {
                // năm nay
                new Date().getFullYear() 
              } */}
              :
            </Text>

            <View
              style={tw`flex flex-row  ${
                orientation != 'portrait' ? 'justify-evenly' : 'justify-between'
              } items-center w-full`}>
              <Text
                style={tw`text-xl font-bold text-[${PRIMARY_COLOR}] p-1 rounded w-1/2 text-center
                  
                `}>
                {' '}
                {formatToVND(user?.money)}
              </Text>
              <ActionButton
                title="Đăng xuất"
                icon="logout"
                onPress={handleLogout}
              />
              {/* <TouchableOpacity
                onPress={}
                style={tw`flex flex-row border border-gray-400 p-2 my-1 rounded bg-gray-100`}>
                {icon('logout')}
                <Text style={tw`text-gray-500`}></Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        <View
          style={tw`flex-5 justify-center items-center w-full ${
            orientation == 'portrait' ? `mt-1` : `ml-1`
          }`}>
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={tw`flex-col p-4 w-full bg-white`}>
              <View
                style={tw`flex-row justify-between items-center 
                  
                `}>
                {/* <View style={tw`flex-row justify-start items-center`}>
                  {icon('person')}
                  <Text style={tw`text-lg`}>Thông tin cá nhân</Text>
                </View> */}
                {titleBig(
                  'Thông tin cá nhân',
                  icon('person', 25, () => {}, GREEN_COLOR),
                )}
                {/* <TouchableOpacity
                  onPress={handleToEditProfile}
                  style={tw`flex flex-row border border-gray-400 p-2 my-1 rounded bg-gray-100`}>
                  {icon('edit')}
                  <Text style={tw`text-gray-500`}>Chỉnh sửa</Text>
                </TouchableOpacity> */}
                <ActionButton
                  title="Chỉnh sửa"
                  icon="edit"
                  onPress={handleToEditProfile}
                />
              </View>
              <View style={tw`flex flex-row justify-between`}>
                <View style={tw`flex-4 flex-col justify-between items-center`}>
                  <ListItem
                    style={tw`flex justify-start pr-[3px] h-[70px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        //console.log(user);
                      }}
                      style={tw`w-full`}>
                      Thành phố: {user?.city}
                    </Text>
                  </ListItem>
                  <ListItem
                    style={tw`flex justify-start pr-[3px] h-[70px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        //console.log(user);
                      }}
                      style={tw`my-[0.2px] w-full `}>
                      SDT:{' '}
                      {user?.phoneNumber ? user?.phoneNumber : 'Chưa cập nhật'}
                    </Text>
                  </ListItem>
                  {isSeenDetail && (
                    <>
                      <ListItem
                        style={tw`flex justify-start pr-[3px] h-[70px]`}
                        bottomDivider>
                        <Text
                          onPress={() => {
                            //console.log(user);
                          }}
                          style={tw`my-[0.2px] w-full`}>
                          Giới tính:{' '}
                          {user?.gender
                            ? user?.gender == 'male'
                              ? 'Nam'
                              : 'Nữ'
                            : 'Chưa cập nhật'}
                        </Text>
                      </ListItem>
                      <ListItem
                        style={tw`flex justify-start pr-[3px] h-[70px]`}>
                        <Text
                          onPress={() => {
                            //console.log(user);
                          }}
                          style={tw`my-[0.2px] w-full `}>
                          Sinh nhật:{' '}
                          {user?.birth ? user?.birth : 'Chưa cập nhật'}
                        </Text>
                      </ListItem>
                    </>
                  )}
                </View>
                <View style={tw`flex-4 flex-col justify-between items-center`}>
                  <ListItem
                    style={tw`flex justify-start pr-[3px] h-[70px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        //console.log(user);
                      }}
                      style={tw`w-full`}>
                      Trạng thái:{' '}
                      {!user?.isActive ? 'Đã kích hoạt' : 'Chưa kiểm duyệt'}
                    </Text>
                  </ListItem>
                  <ListItem
                    style={tw`flex justify-start pr-[3px] h-[70px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        //console.log(user);
                      }}
                      style={tw`my-[0.2px] w-full `}>
                      Ngân hàng: {user?.bankName ? user?.bankName : 'Không'}
                    </Text>
                  </ListItem>
                  {isSeenDetail && (
                    <>
                      <ListItem
                        style={tw`flex justify-start pr-[3px] h-[70px]`}
                        bottomDivider>
                        <Text
                          onPress={() => {
                            //console.log(user);
                          }}
                          style={tw`my-[0.2px] w-full`}>
                          STK:{' '}
                          {user?.bankNumber
                            ? user?.bankNumber
                            : 'Chưa cập nhật'}
                        </Text>
                      </ListItem>
                      <ListItem
                        style={tw`flex justify-start pr-[3px] h-[70px]`}>
                        <Text
                          onPress={() => {
                            //console.log(user);
                          }}
                          style={tw`my-[0.2px] w-full `}>
                          Yêu cầu rút: {user?.isDraw ? 'Đang xử lý' : 'Không'}
                        </Text>
                      </ListItem>
                    </>
                  )}
                </View>
              </View>

              {/* {icon(
                !isSeenDetail ? 'expand-more' : 'expand-less',
                25,
                () => {},
              )} */}
              {/* <View style={tw`flex-row bg-red-200 justify-center items-center`}> */}
              <ActionButton
                title={!isSeenDetail ? 'Mở' : 'Ẩn'}
                icon={!isSeenDetail ? 'expand-more' : 'expand-less'}
                onPress={() => {
                  setIsSeenDetail(!isSeenDetail);
                }}
              />
              {/* </View> */}
            </View>
            <View style={tw`flex-col p-4 w-full bg-white mt-1`}>
              <View style={tw`flex-row justify-between items-center`}>
                {/* <View style={tw`flex-row justify-start items-center`}>
                  {icon('paid')}
                  <Text style={tw`text-lg`}></Text>
                </View> */}
                {titleBig(
                  'Thống kê doanh thu',
                  icon('paid', 25, () => {}, GREEN_COLOR),
                )}
                {/* <TouchableOpacity
                  onPress={handleToEditProfile}
                  style={tw`flex flex-row border border-gray-400 p-2 my-1 rounded bg-gray-100`}>
                  {icon('edit')}
                  <Text style={tw`text-gray-500`}>Chỉnh sửa</Text>
                </TouchableOpacity> */}
                {/* {icon('refresh', 25, () => {}, loading ? BLUE_COLOR : 'gray')} */}
                <ActionButton
                  icon="refresh"
                  onPress={() => {
                    setRefreshing(!refreshing);
                  }}
                  bgColor={!loading ? BLUE_COLOR : GREEN_COLOR}
                />
              </View>
              <View style={tw`flex-col justify-between items-center`}>
                <ButtonGroup
                  buttons={['NGÀY', 'TUẦN', 'THÁNG', 'TẤT CẢ']}
                  selectedButtonStyle={{backgroundColor: BLUE_COLOR}}
                  selectedIndex={selectedIndex}
                  onPress={value => {
                    setSelectedIndex(value);
                  }}
                  containerStyle={{
                    // căn giữa
                    marginVertical: 15,
                    alignItems: 'center',
                    width: '100%',
                  }}
                />
              </View>

              <View style={tw`flex flex-row justify-between`}>
                <View style={tw`flex-4 flex-col justify-between items-center`}>
                  {infoTurnover.map((item, index) => (
                    <ListItem
                      key={index}
                      style={[tw`flex justify-start pr-[5px]`]}
                      bottomDivider={index != infoTurnover.length - 1}>
                      <Text
                        onPress={() => {
                          //console.log(user);
                        }}
                        style={tw`w-full`}>
                        {item.title}: {item.value}
                        {/* {user?.address
                        ? user?.address + (user?.city && `, ${user?.city}`)
                        : 'Chưa cập nhật'}  */}
                      </Text>
                    </ListItem>
                  ))}
                </View>
                {/* <View style={tw`flex-6 flex-col justify-between items-center`}>
                  <Timeline point={point} />
                </View> */}
              </View>
              {/* <View style={tw`flex-col justify-center items-center`}>
                <Button
                  color={['#FFA07A', '#FF6347']}
                  title="Xem chi tiết"
                  fontSize={5}
                  onPress={() => {
                    navigation.navigate('MyOrder');
                  }}
                />
              </View> */}
            </View>
            <View style={tw`flex-col p-4 w-full bg-white mt-1`}>
              <View style={tw`flex-row justify-between items-center`}>
                {/* <View style={tw`flex-row justify-start items-center`}>
                  {icon('paid')}
                  <Text style={tw`text-lg`}></Text>
                </View> */}
                {titleBig(
                  'Rút tiền về ngân hàng',
                  icon('savings', 25, () => {}, GREEN_COLOR),
                )}
                {/* <TouchableOpacity
                  onPress={handleToEditProfile}
                  style={tw`flex flex-row border border-gray-400 p-2 my-1 rounded bg-gray-100`}>
                  {icon('edit')}
                  <Text style={tw`text-gray-500`}>Chỉnh sửa</Text>
                </TouchableOpacity> */}
                {/* {icon(
                  'refresh',
                  25,
                  () => {
                    setRefreshing(!refreshing);
                  },
                  loading ? BLUE_COLOR : 'gray',
                )} */}
              </View>
              <View style={tw`flex-col justify-between items-center mt-3 mb-3`}>
                <View style={tw`flex-row w-90 justify-between items-center`}>
                  <Text style={tw`text-lg`}>Số dư hiện tại</Text>
                  <Text style={tw`text-2xl font-bold text-[${PRIMARY_COLOR}]`}>
                    {formatToVND(user.money)}
                  </Text>
                </View>
                <View style={tw`flex-row w-90 justify-between items-center`}>
                  <Text style={tw`text-lg`}>Số tiền rút</Text>
                  <TextInput
                    // lắng nghe sự kiện mở bàn phím
                    onFocus={e => {
                      dispatch(getIsUseKeyBoard(true));
                    }}
                    // lắng nghe sự kiện đóng bàn phím
                    onBlur={e => {
                      dispatch(getIsUseKeyBoard(false));
                    }}
                    keyboardType="phone-pad"
                    placeholder="--"
                    value={drawMoney}
                    // defaultValue={user.bankNumber}
                    onChangeText={value => {
                      let checkedValue = value.replace(/[^0-9]/g, '');
                      console.log(checkedValue);
                      if (checkedValue > user.money) {
                        Toast.show({
                          type: 'info',
                          text1: 'Thông báo hệ thống',
                          text2: 'Số tiền rút không được lớn hơn số dư',
                          visibilityTime: 2000,
                        });
                        return;
                      }
                      setDrawMoney(formatMoney(value));

                      // checkedValue = checkedValue > user.money ? user.money : checkedValue;
                    }}
                    style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[5px] w-40 text-lg text-[#333] text-right`}
                    // autoFocus={true}
                  />
                  {/* <Text style={tw`text-lg`}>VNĐ</Text> */}
                </View>
              </View>
              {/* <TouchableOpacity onPress={() => setVisible(true)}>
                <Text
                  style={tw`text-center border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${BLUE_COLOR}] text-white text-lg pl-3 pr-3`}>
                  Rút tiền
                </Text>
              </TouchableOpacity> */}
              <ActionButton
                disabled={drawMoney == '' ? true : false}
                title="Rút tiền"
                onPress={() => {
                  let checkedValue = drawMoney.replace(/[^0-9]/g, '');
                  console.log(parseInt(checkedValue));
                  if (parseInt(checkedValue) < 1000) {
                    Toast.show({
                      type: 'info',
                      text1: 'Thông báo hệ thống',
                      text2: 'Số tiền rút không được nhỏ hơn 1000 VNĐ',
                      visibilityTime: 2000,
                    });
                    return;
                  }
                  if (user?.isDraw) {
                    Toast.show({
                      type: 'info',
                      text1: 'Thông báo hệ thống',
                      text2: 'Hệ thống đang xử lý yêu cầu rút tiền trước đó!',
                      visibilityTime: 2000,
                    });
                    return;
                  }
                  setVisible(true);
                }}
              />

              {/* <View style={tw`flex-col justify-center items-center`}>
                <Button
                  color={['#FFA07A', '#FF6347']}
                  title="Xem chi tiết"
                  fontSize={5}
                  onPress={() => {
                    navigation.navigate('MyOrder');
                  }}
                />
              </View> */}
            </View>
            <View style={tw`flex-col p-4 w-full bg-white mt-1`}>
              <View style={tw`flex-row justify-between items-center`}>
                {titleBig(
                  'Phần thưởng hôm nay',
                  icon('savings', 25, () => {}, GREEN_COLOR),
                )}
              </View>
              <View style={tw`flex-col justify-between items-center mt-3 mb-3`}>
                <View style={[styles.contentView]}>
                  <Slider
                    value={completeMyOrderTodayNum}
                    onValueChange={value => {
                      return setValue(value);
                      // Không thay đổi giá trị
                      // return;
                    }}
                    disabled
                    maximumValue={100}
                    minimumValue={0}
                    step={1}
                    allowTouchTrack={false}
                    // containerStyle={{
                    //   backgroundColor: 'blue',
                    // }}
                    // allowTouchTrackOnValueChange={false}
                    //không cho phép thay đổi giá trị khi kéo thanh slider

                    trackStyle={{
                      height: 15,
                      // rounded: '10',
                      backgroundColor: 'blue',
                    }}
                    thumbStyle={{
                      height: 20,
                      width: 20,
                      backgroundColor: {PRIMARY_COLOR},
                    }}
                    thumbProps={{
                      children: (
                        <Icon
                          name="gift"
                          type="font-awesome"
                          size={20}
                          reverse
                          containerStyle={{bottom: 20, right: 20}}
                          color={color()}
                        />
                      ),
                      // icon('person', 35, () => {}, GREEN_COLOR),
                    }}
                  />
                </View>
                {completeMyOrderTodayNum >= 20 && (
                  <View>
                    <Text
                      style={tw`
                    text-center text-6 text-[${PRIMARY_COLOR}]
                    `}>
                      Đã đạt mức thưởng{' '}
                      {completeMyOrderTodayNum > 100
                        ? '3'
                        : completeMyOrderTodayNum > 50
                        ? '2'
                        : completeMyOrderTodayNum > 20
                        ? '1'
                        : '0'}
                    </Text>
                    <Text
                      style={tw`
                    text-center text-6 text-[${GREEN_COLOR}]
                    `}>
                      {completeMyOrderTodayNum > 100
                        ? '+' + formatToVND(100000)
                        : completeMyOrderTodayNum > 50
                        ? '+' + formatToVND(50000)
                        : completeMyOrderTodayNum > 20
                        ? '+' + formatToVND(20000)
                        : '0'}
                    </Text>
                  </View>
                )}
                <View style={tw`flex-col justify-start items-start w-90 mt-1`}>
                  <Text
                    style={tw`
                    text-left text-lg
                    `}>
                    Hiện tại: {completeMyOrderTodayNum} đơn
                  </Text>
                  {completeMyOrderTodayNum <= 100 ? (
                    <Text
                      style={tw`
                    text-left text-sm
                    `}>
                      Hoàn thành thêm{' '}
                      {completeMyOrderTodayNum > 50
                        ? 100 - completeMyOrderTodayNum
                        : completeMyOrderTodayNum > 20
                        ? 50 - completeMyOrderTodayNum
                        : 20 - completeMyOrderTodayNum}{' '}
                      đơn để đạt mức{' '}
                      {completeMyOrderTodayNum > 100
                        ? 'tối đa'
                        : completeMyOrderTodayNum > 50
                        ? '3'
                        : completeMyOrderTodayNum > 20
                        ? '2'
                        : '1'}{' '}
                    </Text>
                  ) : (
                    <Text
                      style={tw`
                    text-left text-sm
                    `}>
                      Bạn đã đạt mức thưởng tối đa
                    </Text>
                  )}
                  {/* <Text style={tw`text-lg`}>VNĐ</Text> */}
                </View>
              </View>

              <ActionButton
                // disabled={drawMoney == '' ? true : false}
                title="Chi tiết"
                onPress={() => {
                  setVisible2(true);
                }}
              />
            </View>
            <View style={tw`flex-col px-4 w-full bg-white mt-1`}>
              {menu.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={item.onPress}
                  style={tw`flex-row w-full py-3 border-b border-gray-100 justify-between items-center`}>
                  <View style={tw`flex-row justify-start items-center`}>
                    {icon(item.icon)}
                    <Text style={tw`text-lg ml-2`}>{item.title}</Text>
                  </View>
                  <Text style={tw`text-sm ml-2 text-gray-500`}>Xem thêm</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <Dialog
          isVisible={visible}
          onBackdropPress={() => {
            setVisible(false);
          }}>
          <Dialog.Title
            title={'Thông tin người nhận'}
            titleStyle={tw`text-center border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${PINK_COLOR}] m-0 text-xl font-bold text-[${PRIMARY_COLOR}]`}
          />
          <ListItem
            containerStyle={{
              borderRadius: 8,
            }}>
            <ListItem.Content>
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Ngân hàng:{' '}
                <ListItem.Subtitle>{user?.bankName}</ListItem.Subtitle>
              </ListItem.Title>
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                STK: <ListItem.Subtitle>{user?.bankNumber}</ListItem.Subtitle>
              </ListItem.Title>
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Chủ sở hữu:{' '}
                <ListItem.Subtitle>{user?.bankUser}</ListItem.Subtitle>
              </ListItem.Title>
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Số tiền:{' '}
                <ListItem.Subtitle>
                  {formatDetailToVND(drawMoney.replace(/[^0-9]/g, ''))}
                </ListItem.Subtitle>
              </ListItem.Title>
              {/* <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Chủ sở hữu:{' '}
                <ListItem.Subtitle>{user?.bankUser}</ListItem.Subtitle>
              </ListItem.Title> */}
            </ListItem.Content>
          </ListItem>
          <View
            style={tw`flex-row justify-between items-center
             items-center`}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text
                style={tw`text-center w-30 border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${PRIMARY_COLOR}] text-white text-lg pl-3 pr-3`}>
                Hủy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDrawMoney()}>
              <Text
                style={tw`text-center w-30 border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${GREEN_COLOR}] text-white text-lg pl-3 pr-3`}>
                Chuyển
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog>
        <Dialog
          isVisible={visible2}
          onBackdropPress={() => {
            setVisible2(false);
          }}>
          <View
            style={tw`text-center flex-col border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${PINK_COLOR}]
             m-0 text-xl font-bold text-[${PRIMARY_COLOR}] rounded-[8px] p-3
            `}>
            <Dialog.Title
              title={'Chi tiết phần thưởng'}
              titleStyle={tw`text-center border-b border-[${BORDER_COLOR}] bg-[${PINK_COLOR}] mb-2 pb-2 text-xl font-bold text-[${PRIMARY_COLOR}]`}
            />
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-center text-4 text-[${BLUE_COLOR}]`}>
                Mức 1
              </Text>
              <Text
                style={tw`text-center text-4 text-[${TEXT_COLOR_SECONDARY}]`}>
                20 đơn
              </Text>
              <Text style={tw`text-center text-4 text-[${GREEN_COLOR}]`}>
                +{formatDetailToVND(20000)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-center text-4 text-[${BLUE_COLOR}]`}>
                Mức 2
              </Text>
              <Text
                style={tw`text-center text-4 text-[${TEXT_COLOR_SECONDARY}]`}>
                50 đơn
              </Text>
              <Text style={tw`text-center text-4 text-[${GREEN_COLOR}]`}>
                +{formatDetailToVND(50000)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-center text-4 text-[${BLUE_COLOR}]`}>
                Mức 3
              </Text>
              <Text
                style={tw`text-center text-4 text-[${TEXT_COLOR_SECONDARY}]`}>
                100 đơn
              </Text>
              <Text style={tw`text-center text-4 text-[${GREEN_COLOR}]`}>
                +{formatDetailToVND(100000)}
              </Text>
            </View>
          </View>
          <ListItem
            containerStyle={{
              borderRadius: 8,
            }}>
            <ListItem.Content>
              <ListItem.Title style={{fontWeight: '700', marginBottom: 5}}>
                Mức đã đạt:{' '}
                <ListItem.Subtitle>
                  {completeMyOrderTodayNum > 100
                    ? '3'
                    : completeMyOrderTodayNum > 50
                    ? '2'
                    : completeMyOrderTodayNum > 20
                    ? '1'
                    : '0'}
                </ListItem.Subtitle>
              </ListItem.Title>
              <ListItem.Title style={{fontWeight: '700'}}>
                Tổng tiền thưởng:{' '}
                <ListItem.Subtitle>
                  {completeMyOrderTodayNum > 100
                    ? formatDetailToVND(175000)
                    : completeMyOrderTodayNum > 50
                    ? formatDetailToVND(75000)
                    : completeMyOrderTodayNum > 20
                    ? formatDetailToVND(20000)
                    : formatDetailToVND(0)}
                </ListItem.Subtitle>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ActionButton title="Đóng" onPress={() => setVisible2(false)} />

          {/* <View
            style={tw`flex-row justify-between items-center bg-red-200
             items-center`}>
            <TouchableOpacity onPress={() => setVisible2(false)}>
              <Text
                style={tw`text-center w-30 border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${BLUE_COLOR}] text-white text-lg pl-3 pr-3`}>
                Đóng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDrawMoney()}>
              <Text
                style={tw`text-center w-30 border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${GREEN_COLOR}] text-white text-lg pl-3 pr-3`}>
                Đóng
              </Text>
            </TouchableOpacity>
          </View> */}
        </Dialog>
      </View>
    );
  };

  // const screenWhenLoggedOut = () => {
  //   return (
  //     <View
  //       style={tw`flex-1 justify-center items-center flex-${
  //         orientation == 'portrait' ? 'col' : 'row'
  //       }`}>
  //       <View
  //         style={tw`flex-col flex-${
  //           orientation == 'portrait' ? '12' : '9'
  //         } h-full bg-white w-full justify-center items-center`}>
  //         <Text style={tw`my-[20px]`}>
  //           Vui lòng đăng nhập để xem thông tin tài khoản
  //         </Text>
  //         <Button title="Đăng nhập" type="line" onPress={handleToLogin} />
  //       </View>
  //       <View style={tw`flex-2.5 ${orientation == 'portrait' ? '' : 'ml-1'}`}>
  //         <View
  //           style={tw`flex-col px-4 w-full bg-white mt-1 ${
  //             orientation == 'portrait'
  //               ? ''
  //               : ' justify-center items-center h-full'
  //           }`}>
  //           {menu
  //             .filter(
  //               item => item.title == 'Hỗ trợ' || item.title == 'Ngôn ngữ',
  //             )
  //             .map((item, index) => (
  //               <TouchableOpacity
  //                 key={index}
  //                 onPress={item.onPress}
  //                 style={tw`flex-row w-full py-3 border-b border-gray-100 justify-between items-center`}>
  //                 <View style={tw`flex-row justify-start items-center`}>
  //                   {icon(item.icon)}
  //                   <Text style={tw`text-lg ml-2`}>{item.title}</Text>
  //                 </View>
  //                 {orientation == 'portrait' ? (
  //                   <Text style={tw`text-sm ml-2 text-gray-500`}>Xem thêm</Text>
  //                 ) : null}
  //               </TouchableOpacity>
  //             ))}
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  const handleLogout = () => {
    dispatch(logout());
    Toast.show({
      type: 'success',
      text1: 'Đăng xuất thành công!',
    });
    navigation.navigate('Login');
  };

  useEffect(() => {
    !isLoggedIn && handleToLogin();
    return;
  }, [isLoggedIn]);

  return (
    <View
      style={[
        tw`flex-1`,
        // {
        //   backgroundColor: SMALL_COLOR,
        // },
      ]}>
      <Header title="NHÂN VIÊN GIAO HÀNG" />
      {isLoggedIn && screenWhenLoggedIn()}
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  verticalContent: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    height: 500,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  subHeader: {
    backgroundColor: '#2089dc',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
});

export default Turnover;
