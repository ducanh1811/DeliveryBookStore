import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import {Avatar, Icon, ListItem} from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../components/Header/index';
import Button from '../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../../stores/userSlice';
import Toast from 'react-native-toast-message';
import Timeline from '../../components/TimeLine';
// import {useNavigation} from '@react-navigation/native';

const Account = ({navigation}) => {
  const {user, isLoggedIn} = useSelector(state => state.user);
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  // Check hướng điện thoại
  const {orientation} = useSelector(state => state.other);

  const handleToLogin = () => {
    navigation.navigate('Login');
  };

  const handleToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const icon = name => {
    return (
      <Icon
        name={name}
        type="material"
        color="gray"
        size={18}
        style={tw`mr-[5px]`}
        //onPress={handleLogout}
      />
    );
  };

  const menu = [
    {
      title: 'Sản phẩm yêu thích',
      icon: 'favorite',
      onPress: () => {
        navigation.navigate('Favorite');
      },
    },
    {
      title: 'Đơn hàng của tôi',
      icon: 'shopping-cart',
      onPress: () => {
        navigation.navigate('MyOrder');
      },
    },
    {
      title: 'Địa chỉ giao hàng',
      icon: 'map',
      onPress: () => {
        navigation.navigate('DeliveryAddress');
      },
    },
    {
      title: 'Voucher của tôi',
      icon: 'receipt',
      onPress: () => {
        navigation.navigate('Voucher');
      },
    },
    {
      title: 'Săn điểm TAS',
      icon: 'sports',
      onPress: () => {
        navigation.navigate('TASHunting');
      },
    },
    {
      title: 'Ngôn ngữ',
      icon: 'language',
      onPress: () => {
        navigation.navigate('Language');
      },
    },
    {
      title: 'Hỗ trợ',
      icon: 'help',
      onPress: () => {
        navigation.navigate('Support');
      },
    },
  ];

  // screen khi da dang nhap
  const screenWhenLoggedIn = () => {
    const point = 100;
    return (
      <View
        style={tw`flex-1 flex-${
          orientation == 'portrait' ? 'col' : 'row'
        } justify-center items-center`}>
        <View
          style={tw`flex-${orientation == 'portrait' ? '1' : '2'} flex-${
            orientation == 'portrait' ? 'row' : 'col'
          }  justify-between items-center bg-white w-full ${
            orientation != 'portrait' ? `pt-7` : `pl-4 pr-2 py-3`
          }`}>
          <Avatar
            onPress={() => {
              console.log(orientation);
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
              Điểm tích lũy{' '}
              {
                // năm nay
                new Date().getFullYear()
              }
              :
            </Text>

            <View
              style={tw`flex flex-row  ${
                orientation != 'portrait' ? 'justify-evenly' : 'justify-between'
              } items-center w-full`}>
              <Text style={tw`text-xl font-bold`}> {point} TAS</Text>
              <TouchableOpacity
                onPress={() => {
                  handleLogout();
                }}
                style={tw`flex flex-row border border-gray-400 p-2 my-1 rounded bg-gray-100`}>
                {icon('logout')}
                <Text style={tw`text-gray-500`}>Đăng xuất</Text>
              </TouchableOpacity>
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
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row justify-start items-center`}>
                  {icon('person')}
                  <Text style={tw`text-lg`}>Thông tin cá nhân</Text>
                </View>
                <TouchableOpacity
                  onPress={handleToEditProfile}
                  style={tw`flex flex-row border border-gray-400 p-2 my-1 rounded bg-gray-100`}>
                  {icon('edit')}
                  <Text style={tw`text-gray-500`}>Chỉnh sửa</Text>
                </TouchableOpacity>
              </View>
              <View style={tw`flex flex-row justify-between`}>
                <View style={tw`flex-4 flex-col justify-between items-center`}>
                  <ListItem
                    style={tw`flex justify-start pr-[5px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        console.log(user);
                      }}
                      style={tw`w-full`}>
                      Địa chỉ:{' '}
                      {user?.address
                        ? user?.address + (user?.city && `, ${user?.city}`)
                        : 'Chưa cập nhật'}
                    </Text>
                  </ListItem>
                  <ListItem
                    style={tw`flex justify-start pr-[5px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        console.log(user);
                      }}
                      style={tw`my-[0.2px] w-full `}>
                      SDT:{' '}
                      {user?.phoneNumber ? user?.phoneNumber : 'Chưa cập nhật'}
                    </Text>
                  </ListItem>
                  <ListItem
                    style={tw`flex justify-start pr-[5px]`}
                    bottomDivider>
                    <Text
                      onPress={() => {
                        console.log(user);
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
                  <ListItem style={tw`flex justify-start pr-[5px]`}>
                    <Text
                      onPress={() => {
                        console.log(user);
                      }}
                      style={tw`my-[0.2px] w-full `}>
                      Sinh nhật: {user?.birth ? user?.birth : 'Chưa cập nhật'}
                    </Text>
                  </ListItem>
                </View>
                <View style={tw`flex-6 flex-col justify-between items-center`}>
                  <Timeline point={point} />
                </View>
              </View>
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
      </View>
    );
  };

  const screenWhenLoggedOut = () => {
    return (
      <View
        style={tw`flex-1 justify-center items-center flex-${
          orientation == 'portrait' ? 'col' : 'row'
        }`}>
        <View
          style={tw`flex-col flex-${
            orientation == 'portrait' ? '12' : '9'
          } h-full bg-white w-full justify-center items-center`}>
          <Text style={tw`my-[20px]`}>
            Vui lòng đăng nhập để xem thông tin tài khoản
          </Text>
          <Button title="Đăng nhập" type="line" onPress={handleToLogin} />
        </View>
        <View style={tw`flex-2.5 ${orientation == 'portrait' ? '' : 'ml-1'}`}>
          <View
            style={tw`flex-col px-4 w-full bg-white mt-1 ${
              orientation == 'portrait'
                ? ''
                : ' justify-center items-center h-full'
            }`}>
            {menu
              .filter(
                item => item.title == 'Hỗ trợ' || item.title == 'Ngôn ngữ',
              )
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={item.onPress}
                  style={tw`flex-row w-full py-3 border-b border-gray-100 justify-between items-center`}>
                  <View style={tw`flex-row justify-start items-center`}>
                    {icon(item.icon)}
                    <Text style={tw`text-lg ml-2`}>{item.title}</Text>
                  </View>
                  {orientation == 'portrait' ? (
                    <Text style={tw`text-sm ml-2 text-gray-500`}>Xem thêm</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    Toast.show({
      type: 'success',
      text1: 'Đăng xuất thành công!',
    });
    setTimeout(() => {
      navigation.navigate('TabBottom');
    }, 500);
  };

  return (
    <View style={tw`flex-1`}>
      <Header title="Thông tin tài khoản" />
      {isLoggedIn ? screenWhenLoggedIn() : screenWhenLoggedOut()}
    </View>
  );
};

export default Account;
