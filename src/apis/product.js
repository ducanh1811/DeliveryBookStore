import axios from 'axios'
import { API_URL } from '../constants/index'

export const apiSearchProduct = async (keyword) => {

    const response = await axios.get(`${API_URL}/products?title=${keyword}&num=10`)

    return response
}

export const apiGetProduct = async (params) => {

    // console.log('params', params)

    const response = await axios.get(`${API_URL}/products`, {
        params
    })

    return response
}

export const apiGetProductById = async (id) => {

    const response = await axios.get(`${API_URL}/products/id/${id}`)

    return response
}

export const apiGetProductRate = async (id) => {

    const response = await axios.post(`${API_URL}/evaluates/count?_id=${id}`)

    return response
}

export const apiGetProductComment = async (id) => {

    const response = await axios.post(`${API_URL}/evaluates/product?sort=desc&typeSort=desc&_id=${id}`)

    return response
}

export const apiGetProductByCategory = async (id, limit = 10) => {

    const response = await axios.post(`${API_URL}/products/category?category=${id}&limit=${limit}`)

    return response
}
