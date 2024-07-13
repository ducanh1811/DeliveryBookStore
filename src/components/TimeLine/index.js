import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

const TimelineItem = ({title, description, onPress, achieved, index}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`flex-row items-center w-full my-2`}>
      <View
        style={tw`w-7 h-7 rounded-full bg-${
          achieved ? 'green' : 'gray'
        }-400 shadow-lg mr-2`}
      />
      <View style={tw`flex-1 border-b border-gray-100 pb-2`}>
        <Text style={tw`font-bold mb-1`}>{title}</Text>
        <Text>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Timeline = ({point}) => {
  const timelineData = [
    {
      title: 'Mốc 10 điểm',
      description: 'Phiếu giảm giá 20% đơn hàng bất kỳ',
      achieved: point >= 10 ? true : false,
    },
    {
      title: 'Mốc 100 điểm',
      description: 'Phiếu giảm giá 50% đơn hàng bất kỳ',
      achieved: point >= 100 ? true : false,
    },
    {
      title: 'Mốc 1000 điểm',
      description: 'Phiếu giảm giá 80% đơn hàng bất kỳ',
      achieved: point >= 1000 ? true : false,
    },
  ];

  return (
    <View style={tw`flex-1`}>
      {timelineData.map((item, index) => (
        <TimelineItem
          key={index}
          title={item.title}
          description={item.description}
          achieved={item.achieved}
          onPress={() => console.log(`${item.title} pressed`)}
        />
      ))}
    </View>
  );
};

export default Timeline;
