import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'twrnc';
import {PRIMARY_COLOR} from '../../styles/color.global';
import IconFont from 'react-native-vector-icons/FontAwesome5';

// type: linear, primary, line
// size: large, small
const Button = ({
  disabled = false,
  type = 'primary',
  title,
  onPress,
  flex = 'row',
  fontSize = 16,
  size = 'large',
  icon,
  color,
}) => {
  const Button = type == 'linear' ? LinearGradient : View;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Button
        colors={color ? color : ['#FA7B05', '#FA7B05', '#FA7B05', '#FA4005']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        locations={[0, 0.5, 0.7523, 1]}
        style={[
          tw`w-full ${
            type === 'linear' ? '' : 'border'
          } relative items-center rounded-[100px] ${
            size == 'small' ? 'px-[10px] py-[6px]' : 'px-[40px] py-[12px]'
          }`,
          {
            backgroundColor: `${type == 'primary' ? PRIMARY_COLOR : '#fff'}`,
            borderColor: PRIMARY_COLOR,
          },
        ]}>
        <Text
          style={[
            tw`font-bold`,
            {color: `${type == 'line' ? PRIMARY_COLOR : '#fff'}`},
          ]}>
          {title}
        </Text>
        {disabled && (
          <View
            style={tw`absolute items-center justify-center left-0 right-0 top-0 bottom-0 bg-[#ccc] rounded-[100px]`}>
            <Text style={tw`font-bold`}>{title}</Text>
          </View>
        )}
      </Button>
    </TouchableOpacity>
  );
};

export default Button;
