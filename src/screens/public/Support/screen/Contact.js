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
import Header from '../../../../components/Header/index';

import {PRIMARY_COLOR} from '../../../../styles/color.global';
import Button from '../../../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';
import {color} from '@rneui/themed/dist/config';
import {
  apiDeleteFavorites,
  apiGetVouchersForMe,
} from '../../../../apis/data';
import {getFavorites, getVouchers} from '../../../../stores/dataSlice';
// import Introduction from '../../../../components/loaders/Introduction';

const Contact = ({navigation}) => {
  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header title="Liên hệ" navigation={navigation} />
      </View>
      <ScrollView>
        <Text style={tw`text-lg font-bold mt-4 ml-4`}>Thông tin liên hệ</Text>
      </ScrollView>
    </View>
  );
};

export default Contact;
