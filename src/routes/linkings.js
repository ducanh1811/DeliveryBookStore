const config = {
    screens: {
        ProductDetail: {
            path: 'product-detail/:productId',
            parse: {
                productId: (productId) => `${productId}`
            }
        }
    }
}

const linking = {
    prefixes: ["bookstore://app"],
    config
}

export default linking
