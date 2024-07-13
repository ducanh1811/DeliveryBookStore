import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import {Avatar, Icon, Image, Skeleton, Rating, Dialog} from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../components/Header/index';

import {PRIMARY_COLOR} from '../../styles/color.global';
import Button from '../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';
import {color} from '@rneui/themed/dist/config';
import {apiDeleteFavorites, apiGetVouchersForMe} from '../../apis/data';
import {getFavorites, getVouchers} from '../../stores/dataSlice';
import CustomDialog from '../../components/CustomDialog';

const Language = ({navigation}) => {
  const {loading, vouchers} = useSelector(state => state.data);
  const {user, token, isLoggedIn} = useSelector(state => state.user);
  const [completeLoading, setCompleteLoading] = useState(false);
  // Check hướng điện thoại
  // Check hướng điện thoại
  const {orientation} = useSelector(state => state.other);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //console.log('1dsa', token, user?._id);
    const response = await apiGetVouchersForMe(token + user?._id);
    //console.log('respons2e21', response.status, response.data.data);
    if (response.status === 200) {
      dispatch(getVouchers(response?.data?.data));
      setRefreshing(false);
    }
    setRefreshing(false);
  }, []);

  const [language, setLanguage] = useState([
    {
      nation: 'Việt Nam',
      choose: true,
    },
    {
      nation: 'English',
      choose: false,
    },
  ]);

  const icon = (name, size = 18, color = 'white', onPress) => {
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

  useEffect(() => {
    // sau 10 giây sẽ tắt loading
    setTimeout(() => {
      setCompleteLoading(true);
    }, 15000);
  }, []);

  // useEffect(() => {
  //   const onChange = ({window}) => {
  //     const {width, height} = window;
  //     setOrientation(width > height ? 'landscape' : 'portrait');
  //   };

  //   Dimensions.addEventListener('change', onChange);

  //   // return () => {
  //   //   Dimensions.removeEventListener('change', onChange);
  //   // };
  // }, []);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  // console.log('favorites111', favorites);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header title="Ngôn ngữ" navigation={navigation} />
      </View>

      <CustomDialog
        visible={visible}
        toggleDialog={toggleDialog}
        text="'Ứng dụng sẽ khởi động lại để tiến hành thay đổi ngôn ngữ"
        title="Thông báo"
        actions={[
          {
            text: 'Hủy',
            onPress: () => {
              setVisible(!visible);
            },
          },
          {
            text: 'Đồng ý',
            onPress: () => {
              setLanguage(
                language.map((item, index) => {
                  return index === index
                    ? {...item, choose: !item.choose}
                    : {...item, choose: false};
                }),
              );
              setVisible(!visible);
            },
          },
        ]}
      />

      {/* <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Thông báo" />
        <Text>
          {'Ứng dụng sẽ khởi động lại để tiến hành thay đổi ngôn ngữ'}
        </Text>
        <View style={tw`flex-row justify-end items-center mt-2`}>
          <TouchableOpacity
            style={tw`px-3`}
            onPress={() => {
              setVisible(!visible);
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: PRIMARY_COLOR,
              }}>
              Hủy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`px-3 py-2`}
            onPress={() => {
              // setVisible(!visible);
              setLanguage(
                language.map((item, index) => {
                  return index === index
                    ? {...item, choose: !item.choose}
                    : {...item, choose: false};
                }),
              );
              setVisible(!visible);
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: PRIMARY_COLOR,
              }}>
              Đồng ý
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog> */}
      <ScrollView>
        <View style={tw`bg-white`}>
          {language.map((item, index) => {
            return (
              <TouchableOpacity
                disabled={item.choose}
                key={index}
                style={tw`flex-row justify-between items-center py-3 px-4 border-b border-gray-100`}
                onPress={() => {
                  setVisible(!visible);
                }}>
                <Text style={tw`text-base text-[#333]`}>{item.nation}</Text>
                {item.choose ? (
                  <Icon
                    name="check"
                    type="material"
                    color={PRIMARY_COLOR}
                    size={20}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Language;
