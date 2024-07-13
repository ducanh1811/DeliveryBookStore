import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: {},
    listCheckout: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        addUserToCart: (state, action) => {
            const userId = action.payload
            state.data[userId] = []
        },

        remove: (state, action) => {
            const { userId, productId } = action.payload
            const cartData = state.data[userId]
            const newList = cartData.filter(cart => cart.product._id !== productId)
            state.data[userId] = [...newList]
        },

        add: (state, action) => {

            const { userId, data } = action.payload
            if (state.data.hasOwnProperty(userId)) {

                const cartData = state.data[userId]
                const findProductIndex = cartData?.findIndex(item =>
                    item.product._id === data.product._id)

                if (findProductIndex !== -1) {

                    cartData[findProductIndex].quantity += data.quantity
                } else {

                    cartData.push(data)
                }

                state.data[userId] = [...cartData]

            } else {
                state.data[userId] = [data]
            }

            //state.data = {}
        },

        minusQuantity: (state, action) => {

            const { userId, productId } = action.payload
            const cartData = state.data[userId]
            const productIndex = cartData.findIndex(cart => cart.product._id === productId)

            if (cartData[productIndex].quantity > 1) {

                cartData[productIndex].quantity -= 1
                state.data[userId] = [...cartData]
            }
        },

        plusQuantity: (state, action) => {
            const { userId, productId } = action.payload
            const cartData = state.data[userId]
            const productIndex = cartData.findIndex(cart => cart.product._id === productId)
            cartData[productIndex].quantity += 1

            state.data[userId] = [...cartData]
        },

        updateListCheckout: (state, action) => {

            const { userId, data } = action.payload
            state.listCheckout[userId] = [...data]
        }

    }
})

export const { addUserToCart, add, remove, minusQuantity, plusQuantity, updateListCheckout } = cartSlice.actions

export default cartSlice.reducer
