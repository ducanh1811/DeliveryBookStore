import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'twrnc';
import {
  BLUE_COLOR,
  BORDER_COLOR,
  LIGHT_COLOR,
  PRIMARY_COLOR,
  SMALL_COLOR,
} from '../../styles/color.global';
import {Avatar, Icon, ListItem} from '@rneui/themed';

// type: linear, primary, line
// size: large, small
const ActionButton = ({
  disabled,
  title,
  onPress,
  icon,
  textColor = LIGHT_COLOR,
  bgColor = BLUE_COLOR,
  size = 4,
}) => {
  return (
    <TouchableOpacity disabled={disabled || false} onPress={onPress}>
      <View
        style={tw`flex-row ${!title ? 'rounded-full' : 'rounded-0'}
        justify-center items-center ${!title ? `w-12 h-12` : ``} border-t
        border-b pt-2 pb-2 border-r border-[${BORDER_COLOR}] bg-[${
          !disabled ? bgColor : SMALL_COLOR
        }]  pl-3 pr-3`}>
        {icon && (
          <Icon
            name={icon}
            type="material"
            size={size * 5}
            color={textColor}
            style={{
              marginRight: title ? 5 : 0,
            }}
          />
        )}
        {title && (
          <Text style={tw`text-center text-white text-${size}`}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
