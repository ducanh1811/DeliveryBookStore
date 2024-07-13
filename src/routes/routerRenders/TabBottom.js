import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Text, Dimensions} from 'react-native';
import tw from 'twrnc';
import TabBottomRouters from '../routerConfigs/TabBottom.config';
import {PRIMARY_COLOR} from '../../styles/color.global';
import {useState, useEffect} from 'react';
// import {getAllMyOrder} from '../../stores/dataSlice';
import {useSelector, useDispatch} from 'react-redux';
import Cart from '../../screens/user/Cart';
import Notification from '../../screens/user/Notification';
// import messaging from '@react-native-firebase/messaging';
import {getData} from '../../utils/storage';

const Tab = createBottomTabNavigator();

// key: cart, notification
const TabBottom = ({navigation}) => {
  // const { orientation } = useSelector(state => state.other);

  const {user, isLoggedIn} = useSelector(state => state.user);
  const {data} = useSelector(state => state.cart);
  const [cartData, setCartData] = React.useState([]);
  const [numNewNotice, setNumNewNotice] = React.useState(0);
  const {isUseKeyBoard} = useSelector(state => state.other);

  React.useEffect(() => {
    if (isLoggedIn) {
      if (Object.keys(data).length > 0) {
        if (data.hasOwnProperty(user?._id)) {
          setCartData(data[user?._id]);
        }
      }
    }
  }, [data, user, isLoggedIn]);

  React.useEffect(() => {
    const num = getData('numNewNotice');
    console.log(num);
    if (num) {
      setNumNewNotice(num);
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouterName="info"
      // // ẩn footer
      // tabBarOptions={{
      //   showLabel: true,
      //   activeTintColor: `${PRIMARY_COLOR}`,
      //   inactiveTintColor: '#666',
      //   style: {
      //     height: 54,
      //     paddingBottom: 5,
      //   },
      //   labelStyle: {
      //     fontSize: 13,
      //     fontWeight: 'bold',
      //   },
      // }}
      screenOptions={{headerShown: false}}>
      {TabBottomRouters.map((tab, index) => {
        const {screen, label, tabIconLabel, iconName, badge} = {...tab};

        return (
          <Tab.Screen
            key={index}
            name={label}
            // style={{
            //   display: 'none',
            // }}
            component={screen}
            options={{
              navigationOptions: {
                headerShown: false,
                // ẩn footer
                // tabBarShowLabel: false,
              },
              tabBarLabelStyle: {
                fontSize: 13,
                fontWeight: 'bold',
                // display: 'none',
              },
              tabBarStyle: {
                height: 54,
                paddingBottom: 5,
                // hidden: true,
                display: isUseKeyBoard ? 'none' : 'flex',
              },

              tabBarIcon: ({focused, color, size}) => {
                return (
                  <IconFontAwesome
                    name={iconName}
                    size={16}
                    color={focused ? `${PRIMARY_COLOR}` : '#666'}
                    solid
                  />
                );
              },
              tabBarLabel: ({focused}) => {
                return (
                  <Text
                    style={tw`${
                      focused ? `text-[${PRIMARY_COLOR}]` : 'text-[#666]'
                    }`}>
                    {label}
                  </Text>
                );
              },
            }}
          />
        );
      })}
      {/* {numNewNotice > 0 && isLoggedIn ? (
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{
            navigationOptions: {
              headerShown: false,
            },
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: 'bold',
            },
            tabBarStyle: {
              height: 54,
              paddingBottom: 5,
            },
            tabBarBadge: `${numNewNotice > 9 ? '9+' : numNewNotice}`,

            tabBarIcon: ({focused, color, size}) => {
              return (
                <IconFontAwesome
                  name="bell"
                  size={16}
                  color={focused ? `${PRIMARY_COLOR}` : '#666'}
                  solid
                />
              );
            },
            tabBarLabel: ({focused}) => {
              return (
                <Text style={tw`${focused ? 'text-[#C92127]' : 'text-[#666]'}`}>
                  Thông báo
                </Text>
              );
            },
          }}
        />
      ) : (
        <Tab.Screen
          name="Thông báo"
          component={Notification}
          options={{
            navigationOptions: {
              headerShown: false,
            },
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: 'bold',
            },
            tabBarStyle: {
              height: 54,
              paddingBottom: 5,
            },

            tabBarIcon: ({focused, color, size}) => {
              return (
                <IconFontAwesome
                  name="bell"
                  size={16}
                  color={focused ? `${PRIMARY_COLOR}` : '#666'}
                  solid
                />
              );
            },
            tabBarLabel: ({focused}) => {
              return (
                <Text style={tw`${focused ? 'text-[#C92127]' : 'text-[#666]'}`}>
                  Thông báo
                </Text>
              );
            },
          }}
        />
      )}
      {cartData?.length > 0 && isLoggedIn ? (
        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            navigationOptions: {
              headerShown: false,
            },
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: 'bold',
            },
            tabBarStyle: {
              height: 54,
              paddingBottom: 5,
            },
            tabBarBadge: `${cartData?.length}`,

            tabBarIcon: ({focused, color, size}) => {
              return (
                <IconFontAwesome
                  name="cart-plus"
                  size={16}
                  color={focused ? `${PRIMARY_COLOR}` : '#666'}
                  solid
                />
              );
            },
            tabBarLabel: ({focused}) => {
              return (
                <Text style={tw`${focused ? 'text-[#C92127]' : 'text-[#666]'}`}>
                  Giỏ hàng
                </Text>
              );
            },
          }}
        />
      ) : (
        <Tab.Screen
          name="Giỏ hàng"
          component={Cart}
          options={{
            navigationOptions: {
              headerShown: false,
            },
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: 'bold',
            },
            tabBarStyle: {
              height: 54,
              paddingBottom: 5,
            },

            tabBarIcon: ({focused, color, size}) => {
              return (
                <IconFontAwesome
                  name="cart-plus"
                  size={16}
                  color={focused ? `${PRIMARY_COLOR}` : '#666'}
                  solid
                />
              );
            },
            tabBarLabel: ({focused}) => {
              return (
                <Text style={tw`${focused ? 'text-[#C92127]' : 'text-[#666]'}`}>
                  Giỏ hàng
                </Text>
              );
            },
          }}
        />
      )} */}
    </Tab.Navigator>
  );
};

export default TabBottom;
