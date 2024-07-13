import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  PanResponder,
  Touchable,
  ImageBackground,
} from 'react-native';
import React, {memo, useRef} from 'react';
import {useState, useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {
  Avatar,
  Icon,
  ListItem,
  Dialog,
  Skeleton,
  LinearProgress,
  Image,
  Rating,
} from '@rneui/themed';
import Swiper from 'react-native-swiper';
import tw from 'twrnc';
import Header from '../../../components/Header/index';
import SwipeToDeleteEditItem from '../../../components/SwipeToDeleteEditItem/index';
import {PRIMARY_COLOR} from '../../../styles/color.global';
import Button from '../../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';

import {StyleSheet} from 'react-native';
import {YELLOW_COLOR} from '../../../styles/color.global';
import {color} from '@rneui/themed/dist/config';
import {apiDeleteFavorites, apiGetFavoritesForMe} from '../../../apis/data';
import {getFavorites} from '../../../stores/dataSlice';
import CustomDialog from '../../../components/CustomDialog';
import {getAddressDelivery} from '../../../stores/otherSlice';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
const TASHunting = ({navigation}) => {
  const {user, token, isLoggedIn} = useSelector(state => state.user);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);
  const {addressDelivery, orientation} = useSelector(state => state.other);
  const [deleteItem, setDeleteItem] = useState(null);

  const dispatch = useDispatch();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // chờ 1s để hiển thị loading
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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

  const onDelete = item => {
    dispatch(
      getAddressDelivery(addressDelivery.filter(data => data.id != item.id)),
    );
  };

  const updateAddressDelivery = item => {
    // console.log('item12');
    dispatch(
      getAddressDelivery(
        addressDelivery.map(data => {
          return data.id == item.id
            ? {...data, selected: !data.selected}
            : {...data, selected: false};
        }),
      ),
    );
  };

  useEffect(() => {
    console.log('setDeleteItem', deleteItem);
    deleteItem &&
      dispatch(
        getAddressDelivery(
          addressDelivery.filter(data => data.id != deleteItem),
        ),
      );
  }, [deleteItem]);
  // screen khi da dang nhap
  const fameItem = (item, index) => {
    return (
      <View
        key={index}
        style={tw`flex-row justify-between items-center bg-white border-b border-[#f5f5f5]`}>
        <SwipeToDeleteEditItem
          index={index}
          onDelete={onDelete}
          updateAddressDelivery={updateAddressDelivery}
          addressDelivery={addressDelivery}
          func={setDeleteItem}
        />
      </View>
    );
  };

  const itemSwiper = [
    {
      id: 1,
      title: 'Săn điểm TAS',
      images: require(`../../../assets/images/banner/hunting/baner1.jpg`),
    },
    {
      id: 2,
      title: 'Quay số trúng TAS',
      images: require(`../../../assets/images/banner/hunting/baner2.jpg`),
    },
    // {
    //   id: 3,
    //   title: 'Săn điểm TAS',
    //   images: 'https://cdn.tgdd.vn/2021/08/banner/800-300-800x300-3.png',
    // },
  ];

  const ItemSwiper = ({item}) => {
    return (
      <View style={tw`w-full h-[180px] z-2 items-center`}>
        <ImageBackground
          source={item.images}
          style={tw`flex justify-center items-center flex-2 w-full h-full`}
        />
        <View
          style={[
            tw`rounded-[24px] flex-row items-center p-[20px] h-[140px] mx-[20px] mt-[32%] bg-white`,
            StyleSheet.absoluteFillObject,
          ]}>
          <View style={tw`flex-1`}>
            <Text
              numberOfLines={3}
              style={[tw`font-bold`, {color: YELLOW_COLOR}]}>
              {item.title}
            </Text>
            <TouchableOpacity>
              <View
                style={[
                  tw`w-[90px] flex-row items-center px-[10px] mt-[10px] rounded-[12px] py-[6px] border`,
                  {borderColor: YELLOW_COLOR},
                ]}>
                <Text
                  style={[
                    tw`font-bold mr-[8px] text-[12px]`,
                    {color: YELLOW_COLOR},
                  ]}>
                  Xem thêm
                </Text>
                <IconFontAwesome
                  name="arrow-right"
                  size={12}
                  color={YELLOW_COLOR}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Image source={item.images} style={tw`w-50 h-[100px]`} />
        </View>
      </View>
    );
  };

  const SwiperRender = () => {
    return (
      <Swiper
        // chạy mỗi 1 giây
        // thời gian
        duration={2000}
        autoplay>
        {itemSwiper.map((item, index) => (
          <ItemSwiper key={index} item={item} />
        ))}
      </Swiper>
    );
  };

  const [progress, setProgress] = React.useState(0);

  const gameList = [
    {
      id: 1,
      title: 'Đoán Tên',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
      onPress: () => navigation.navigate('GuessName'),
    },
    {
      id: 2,
      title: 'T or F',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
      onPress: () => navigation.navigate('GuessTheName'),
    },
    {
      id: 3,
      title: 'T or F',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
      onPress: () => navigation.navigate('GuessTheName'),
    },
    {
      id: 4,
      title: 'T or F',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
      onPress: () => navigation.navigate('GuessTheName'),
    },
  ];

  useEffect(() => {
    let subs = true;
    if (progress < 1 && progress !== 0) {
      setTimeout(() => {
        if (subs) {
          setProgress(progress + 0.1);
        }
      }, 100);
    }
    return () => {
      subs = false;
    };
  }, [progress]);

  const imageRef = useRef(null);

  const startAnimation = () => {
    if (imageRef.current) {
      imageRef.current.animate('shake');
    }
  };

  const InfoUser = () => {
    return (
      <View style={tw`flex-col bg-red-200`}>
        <View
          style={tw`flex-row rounded-[24px] mx-5 my-4 p-4 bg-white justify-between items-center`}>
          <Avatar
            size={64}
            rounded
            source={user.images ? {uri: user.images} : {}}
          />
          <View style={tw`flex-col ml-2 justify-start items-start`}>
            <Text style={tw`font-bold mb-1 text-[#333] text-xl`}>
              {user.fullName}
            </Text>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`font-bold mr-2 text-[#888] text-base text-right`}>
                Thành tích:
              </Text>
              <Text style={tw`font-bold text-[${YELLOW_COLOR}] text-xl`}>
                100
              </Text>
              <Image
                source={require(`../../../assets/images/items/cups/tasCoin.jpg`)}
                style={tw`ml-1 w-7 h-7`}
              />
            </View>
            {/* <TouchableOpacity>
              <Text style={tw`text-[#666] text-sm`}>Xem thêm</Text>
            </TouchableOpacity> */}
          </View>
          <View style={tw`flex-col justify-between items-center`}>
            <Image
              source={require(`../../../assets/images/items/cups/dong.png`)}
              style={tw`w-12 h-12`}
            />
            <Text style={tw`text-[#666] text-[${YELLOW_COLOR}] text-xl`}>
              ĐỒNG II
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const itemDailyTask = [
    {
      id: 1,
      title: 'Xem chi tiết 1 sản phẩm trong 1 phút',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
    },
    {
      id: 2,
      title: 'Chơi thắng 1 ván game đoán hình ảnh',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
    },
    {
      id: 3,
      title: 'Chia sẽ 1 sản phẩm lên mạng xã hội',
      images: require(`../../../assets/images/items/cups/gift_01.jpg`),
    },
  ];

  const itemDailyTaskRender = (item, index) => {
    return (
      <View
        key={index}
        style={tw`flex-row my-1 justify-between items-center bg-white border-b border-[#f5f5f5]`}>
        <View style={tw`flex-row items-center py-2`}>
          <Image source={item.images} style={tw`w-8 h-8`} />
          <Text style={tw`flex-3 font-bold text-[#333] text-base ml-2`}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 10,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 10, // Giá trị được tăng lên để tạo đổ bóng đậm tối luôn
              shadowRadius: 6,
              elevation: 7, // This line is for Android
            }}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
              Thực hiện
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const DailyTask = () => {
    return (
      <View
        style={tw`flex-col flex-1 border border-[#f5f5f5] rounded-[24px] mx-5 my-4 bg-white p-4 shadow-lg
    `}>
        <View style={tw`flex-row justify-center items-center bg-white`}>
          <Text style={tw`font-bold text-[#333] text-xl`}>
            Nhiệm vụ hôm nay
          </Text>
        </View>
        <View style={tw`flex-row justify-between mb-1 items-end px-5`}>
          <Text style={tw`font-bold text-[#999] text-sm`}>Tiến độ: 1/3</Text>
          <TouchableOpacity onPress={startAnimation}>
            <Animatable.Image
              ref={imageRef}
              source={require(`../../../assets/images/items/cups/gift_01.jpg`)}
              style={tw`w-8 h-8`}
            />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row  justify-between items-center px-5`}>
          <LinearProgress
            style={{
              marginVertical: 0,
              width: '100%',
              borderRadius: 10,
              height: 10,
            }}
            value={0.2}
            variant="determinate"
          />
        </View>
        <View style={tw`flex-col mt-3`}>
          {itemDailyTask.map((item, index) => itemDailyTaskRender(item, index))}
        </View>
      </View>
    );
  };

  const BodyRender = () => {
    return (
      // khung thông tin cá nhân
      <View style={tw`flex-col flex-1`}>
        {/* thông tin cá nhân */}
        <InfoUser />
        {/* khung nhiệm vụ */}
        <DailyTask />

        <View style={tw`flex-col flex-1 bg-blue-100`}>
          <Text style={tw`font-bold text-[#333]  text-xl mx-5 my-4`}>
            GAME VUI SĂN ĐIỂM
          </Text>
        </View>
        <View
          style={tw`flex-col flex-1 border border-[#f5f5f5] rounded-[24px] mx-5 my-4 bg-white p-4 shadow-lg
    `}>
          <View style={tw`flex-row mt-3 flex justify-between items-center`}>
            {gameList.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={item.onPress}
                  key={index}
                  style={tw`flex-row my-1 justify-between items-center`}>
                  <View style={tw`flex-col justify-between items-center py-2`}>
                    <Image source={item.images} style={tw`w-12 h-12 rounded`} />
                    <Text style={tw`flex-3 font-bold text-[#333] text-base`}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-col flex-1`}>
      <Header title={'Săn điểm TAS'} navigation={navigation} />
      <ScrollView style={tw`flex-1  flex-col`}>
        <View style={tw`flex-col h-72 bg-blue-100`}>
          <SwiperRender />
        </View>
        <View style={tw`flex-col bg-white flex-8`}>
          <BodyRender />
        </View>
      </ScrollView>
    </View>
  );
};

export default TASHunting;
