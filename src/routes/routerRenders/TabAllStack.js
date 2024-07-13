import { NavigationContainer, useLinkTo } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabAllRoutes from '../routerConfigs/TabAll.config';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
// import Cart from '../../screens/user/Cart';

import { useEffect } from 'react';
// import { checkUser, fetchInitialData } from '../../stores/asyncActions';
// import { getAddressDelivery, getOrientation } from '../../stores/otherSlice';
import { ActivityIndicator, Dimensions } from 'react-native';
// import { addUserToCart } from '../../stores/cartSlice';
// import { logout } from '../../stores/userSlice';
// import linking from '../linkings';
// import notifee from '@notifee/react-native';
const Stack = createNativeStackNavigator()

const TabAllStack = () => {
  const { token } = useSelector(state => state.user);
// console.log('token', token, user);
  // const linkTo = useLinkTo();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const onChange = ({ window }) => {
  //     const { width, height } = window;
  //     // dispatch(getOrientation(width > height ? 'landscape' : 'portrait'));
  //   };

  //   Dimensions.addEventListener('change', onChange);

  //   return () => {
  //     Dimensions?.removeEventListener('change', onChange);
  //   };
  // }, []);

  // React.useEffect(() => {
  //   dispatch(checkUser(token))
  //   dispatch(fetchInitialData(token ? token + user?._id : null))

  //   notifee.onBackgroundEvent(event => {
  //     console.log('event: ' + event);
  //   });

  //   notifee.onForegroundEvent(event => {
  //     if (event.detail.pressAction) {
  //       if (event.detail.pressAction.id === 'default') {
  //         linkTo('/product-detail/65646a7d1d2b3aa954b7d9f3')
  //       }
  //     }
  //   });
  // }, []);

  return (
    <NavigationContainer 
    // linking={linking} 
    fallback={<ActivityIndicator color="red" size="large" />}>
      <Stack.Navigator
        initialRouteName={token != null ? "TabBottom" : "Login"}
        screenOptions={{
          headerShown: false
        }}
      >
        {
          TabAllRoutes.map(screen => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ))
        }
        {/* <Stack.Screen
          name='Cart'
          component={Cart}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default TabAllStack;
