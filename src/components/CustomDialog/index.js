import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {PRIMARY_COLOR} from '../../styles/color.global';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Avatar, Icon, ListItem, Dialog, Skeleton, Rating} from '@rneui/themed';

const CustomDialog = ({
  title = 'Thông báo',
  text,
  actions,
  visible,
  toggleDialog,
}) => {
  return (
    <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
      <Dialog.Title title={title} />
      <Text style={tw`text-3.7`}>{text}</Text>
      <View style={tw`flex-row justify-end items-center`}>
        {actions.map((action, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={tw`pt-5 px-2`}
              onPress={action.onPress}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: PRIMARY_COLOR,
                  // backgroundColor: 'blue',
                }}>
                {action.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Dialog>
  );
};

export default CustomDialog;
