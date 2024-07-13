import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { memo } from 'react';
import { Tab, Text, TabView } from '@rneui/themed';
import { PRIMARY_COLOR } from '../../styles/color.global';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
const CustomTab = ({ data }) => {
  const [index, setIndex] = useState(0);
  const { orientation } = useSelector(state => state.other);

  // console.log('reder lại CustomTab');
  return (
    <>
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={{
          backgroundColor: PRIMARY_COLOR,
          height: 1.5,
          width:
            orientation != 'portrait'
              ? Dimensions.get('window').width / 3
              : Dimensions.get('window').width / 3,
        }}
        containerStyle={{
          backgroundColor: 'white',
          height: 70,
          width:
            orientation != 'portrait'
              ? Dimensions.get('window').width / 3
              : Dimensions.get('window').width / 3,
          justifyContent: 'space-around',
          borderBottomWidth: 1.5,
          borderBottomColor: 'gray',
        }}
        scrollable={true}
        // variant="primary"
        // disableIndicator={true}
        dense>
        {data.map((item, e) => {
          return (
            <Tab.Item
              key={e}
              title={item.title}
              titleStyle={{
                fontSize: 12,
                color: e === index ? PRIMARY_COLOR : 'gray',
              }}
              icon={{
                name: item.icon,
                type: 'ionicon',
                color: e === index ? PRIMARY_COLOR : 'gray',
              }}
            />
          );
        })}
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {data.map((item, e) => {
          return (
            <TabView.Item
              key={e}
              style={{ backgroundColor: 'white', width: '100%' }}>
              {item.content}
            </TabView.Item>
          );
        })}
      </TabView>
    </>
  );
};

export default CustomTab;
