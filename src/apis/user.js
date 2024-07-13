import axios from 'axios'
import { API_ADDRESS, API_URL } from '../constants/index'
import { getAuthInstance } from '../utils/storage'

export const apiGetProfile = async (token) => {

    const response = await getAuthInstance(token).get('/shippers/get/profile')

    return response

}

export const apiVerifyOtp = async (email) => {

    const response = await axios.post(`${API_URL}/shippers/verify`, {
        email
    })

    return response
}

export const apiActiveUser = async (email) => {

    const response = await axios.post(`${API_URL}/shippers/active`, {
        email
    })

    return response
}

export const apiUpdateUser = async (formData, id, token) => {

    try {
        const response = await getAuthInstance(token).put(`/shippers/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        return response
    } catch (error) {
        console.log("error update", error)
    }

}

export const apiUpdateEmail = async (email, token) => {

    const response = await getAuthInstance(token).put('/shippers/email', {
        email
    })

    return response
}

export const apiGetProvince = async () => {

    try {
        const response = await axios.get(`${API_ADDRESS}/api/province`)

        return response
    } catch (error) {

        throw new Error('Get Province Error')
    }
}

export const apiDistrictById = async (id) => {

    try {
        const response = await axios.get(`${API_ADDRESS}/api/province/district/${id}`)

        return response
    } catch (error) {

        throw new Error('Get District Error')
    }
}

export const apiWardById = async (id) => {

    try {
        const response = await axios.get(`${API_ADDRESS}/api/province/ward/${id}`)

        return response
    } catch (error) {

        throw new Error('Get Ward Error')
    }
}

export const apiCheckout = async (data, token) => {
    try {
        const response = await getAuthInstance(token).post('/orders/insert', data)

        return response
    } catch (error) {
        console.log(error)
        throw new Error('checkout Error')
    }
}

export const apiCreateOrderItem = async (token, data) => {
    try {
        const response = await getAuthInstance(token).post('/orderitems/insert', data)

        return response
    } catch (error) {
        console.log(error)
        throw new Error('insert order item Error')
    }
}

export const apiUpdateVoucher = async (id, data) => {
    try {
        const response = await axios.post(`${API_URL}/vouchers/update/${id}`, data)

        return response
    } catch (error) {

        console.log(error)
        throw new Error('update voucher Error')
    }
}