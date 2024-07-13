import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../constants/index';
import { jwtDecode } from 'jwt-decode';
import { decode as atob, encode as btoa } from 'base-64';
import { useDispatch } from 'react-redux'
import { logout } from '../stores/userSlice';

global.atob = atob;
global.btoa = btoa;

export const getData = async key => {
    let data = await AsyncStorage.getItem(key);

    data = JSON.parse(data);

    return data;
};

export const setData = (key, value) => {
    AsyncStorage.setItem(key, JSON.stringify(value));
};

export const isTokenExpired = token => {
    const decodedToken = jwtDecode(token, { header: true })
    if (decodedToken && decodedToken.exp) {
        const expirationTime = decodedToken.exp * 1000
        const currentTime = Date.now()
        return currentTime > expirationTime
    }
    return true;
};

export const plusNumNotice = () => {

    const num = getData('numNewNotice')
    if (num) {
        setData('numNewNotice', num + 1)
    } else {
        setData('numNewNotice', 1)
    }
}

export const clearNumNotice = () => {

    setData('numNewNotice', 0)
}

export const getAuthInstance = token => {

    const instance = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    // instance.interceptors.response.use(
    //     response => response,
    //     error => {
    //         console.log(error)
    //         const { status } = error.response;

    //         if (status === 401) {

    //             console.log("token het han")
    //         }

    //         return Promise.reject(error);
    //     }
    // )

    return instance
};
