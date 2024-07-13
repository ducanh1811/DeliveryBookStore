import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    keywords: null,
    suggestionProducts: []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {

        search: (state, action) => {

            state.keywords = action.payload.keywords
            state.suggestionProducts = action.payload.suggestionProducts
        }
    }
})

export const { search } = productSlice.actions

export default productSlice.reducer
