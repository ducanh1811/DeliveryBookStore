import {createSlice} from '@reduxjs/toolkit';
// import {fetchInitialData} from './asyncActions';
import {Dimensions} from 'react-native';
import {useSelector} from 'react-redux';

// const {token, user} = useSelector(state => state.user);

const initialState = {
  orientation:
    Dimensions.get('window').width > Dimensions.get('window').height
      ? 'landscape'
      : 'portrait',

  addressDelivery: [],

  isUseKeyBoard: false,
};

const otherSlice = createSlice({
  name: 'other',
  initialState,
  reducers: {
    getOrientation: (state, action) => {
      state.orientation = action.payload;
    },

    getAddressDelivery: (state, action) => {
      state.addressDelivery = action.payload;
    },

    getIsUseKeyBoard: (state, action) => {
      state.isUseKeyBoard = action.payload;
    },
  },
});

export const {getOrientation, getAddressDelivery, getIsUseKeyBoard} = otherSlice.actions;

export default otherSlice.reducer;
