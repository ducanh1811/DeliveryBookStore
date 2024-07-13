import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    apiGetProductCategory,
    apiGetProductHots,
    apiGetSlideList,
    apiGetFavoritesForMe,
    apiGetVouchersForMe,
    apiGetStatusOrderForMe,
    apiGetAllOrderForMe,
    apiGetAllCategory,
} from '../apis/data';
import {
    listPathCategory,
    listPathHots,
    listPathLearn,
    // listPathStatusOrder,
} from '../constants/index';
import { useSelector } from 'react-redux'
import { apiGetProfile } from '../apis/user';

export const fetchInitialData = createAsyncThunk(
    'data/initialData',
    async token => {
        try {
            const productsHots = await apiGetProductHots(listPathHots[0].path);
            const categoryBooks = await apiGetProductCategory(listPathCategory[0].path);
            const learnBooks = await apiGetProductCategory(listPathLearn[0].path);
            const slideList = await apiGetSlideList();
            console.log('da vao day', token);

            // load khi đã đăng nhập nếu không thì trả []
            const favoriteList = token
                ? await apiGetFavoritesForMe(token)
                : { data: { data: [] } };
            // console.log('da vao day2', favoriteList);
            const voucherList = token
                ? await apiGetVouchersForMe(token)
                : { data: { data: [] } };
            const allMyOrder = token
                ? await apiGetAllOrderForMe('01' + token)
                : { data: { data: [] } };

            console.log('allMyOrder', allMyOrder);
            const confirmMyOrder = token
                ? await apiGetStatusOrderForMe('01' + '0' + token)
                : { data: { data: [] } };
            const deliveryMyOrder = token
                ? await apiGetStatusOrderForMe('01' + '1' + token)
                : { data: { data: [] } };
            const completeMyOrder = token
                ? await apiGetStatusOrderForMe('01' + '2' + token)
                : { data: { data: [] } };
            const cancelMyOrder = token
                ? await apiGetStatusOrderForMe('01' + '3' + token)
                : { data: { data: [] } };

            // console.log('123asd');
            //console.log('favoriteList212', favoriteList.data.data, productsHots.data.data.length);

            const categories = await apiGetAllCategory()

            return {
                productsHots: [
                    {
                        title: listPathHots[0].title,
                        products: productsHots.data.data,
                    },
                ],
                categoryBooks: [
                    {
                        title: listPathCategory[0].title,
                        products: categoryBooks.data.data,
                    },
                ],
                learnBooks: [
                    {
                        title: listPathLearn[0].title,
                        products: learnBooks.data.data,
                    },
                ],
                slideList: slideList.data.data,
                favoriteList: favoriteList.data.data,
                voucherList: voucherList.data.data,
                allMyOrder: allMyOrder.data.data,
                deliveryMyOrder: deliveryMyOrder.data.data,
                completeMyOrder: completeMyOrder.data.data,
                cancelMyOrder: cancelMyOrder.data.data,
                confirmMyOrder: confirmMyOrder.data.data,
                categories: categories.data.data
            };
        } catch (error) {
            console.log('error', error);
        }
    },
)

export const checkUser = createAsyncThunk(
    'user/checkUser',
    async (token) => {

        const resposne = await apiGetProfile(token)

        return resposne.data.data

    }
) 
