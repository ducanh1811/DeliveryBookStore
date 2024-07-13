import {View, Text, useWindowDimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import RenderHtml from 'react-native-render-html';
import {BLUE_COLOR} from '../../styles/color.global';
import IconFont from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

const ProductInfo = ({product}) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  // const html = product?.desciption.substring(0, 600)

  // const handleToProductInfo = () => {

  //     navigation.navigate("ProductInfo", {
  //         product: product
  //     })
  // }

  return <View style={tw`p-[10px]`}>z</View>;
};

export default ProductInfo;
