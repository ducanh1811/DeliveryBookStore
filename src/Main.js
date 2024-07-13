import React, {useState} from 'react';
import TabAllStack from './routes/routerRenders/TabAllStack';
import {StatusBar, Text} from 'react-native';
import {PRIMARY_COLOR} from './styles/color.global';
import Introduction from './screens/system/Introduction';

import {useEffect} from 'react';
// import { Text } from 'react-native';
import {useSelector} from 'react-redux';

function Main() {
  const {user, token} = useSelector(state => state.user);
  const [isIntro, setIsIntro] = useState(token ? true : false);
  // const {user} = useSelector(state => state.user);
  // console.log(user, 'token121');
  return (
    <>
      {isIntro ? (
        <Introduction setIsIntro={setIsIntro} />
      ) : (
        <>
          <TabAllStack />
          <StatusBar translucent backgroundColor={PRIMARY_COLOR} />
        </>
      )}
    </>
  );
}

export default Main;
