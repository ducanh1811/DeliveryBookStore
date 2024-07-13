import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../components/Header/index'
import { useSelector } from 'react-redux'
import tw from 'twrnc'
import { BORDER_COLOR, PRIMARY_COLOR } from '../../styles/color.global'
import FontIcon from 'react-native-vector-icons/FontAwesome5'

const tabList = [
    {
        icon: 'https://png.pngtree.com/png-clipart/20230122/original/pngtree-book-icon-vector-image-png-image_8926794.png',
        name: 'Sách trong nước'
    },
    {
        icon: 'https://cdn-icons-png.freepik.com/256/4715/4715333.png',
        name: 'Sách ngoài nước'
    }
]

const Categories = ({ navigation }) => {

    const { categories } = useSelector(state => state.data)
    const [currentTab, setCurrentTab] = React.useState(0)
    const [tabChild, setTabChild] = React.useState([])

    const handleTogge = (index) => {

        const newList = tabChild.map((tab, tabIndex) => {

            if (index === tabIndex) {
                return tab ? false : true
            } else return tab
        })

        setTabChild(newList)
    }

    React.useEffect(() => {

        const array = new Array(10).fill(false)

        setTabChild(array)
    }, [])

    const handleToProduct = (categoryId) => {
        navigation.navigate("Product", { keywords: null, categoryId: categoryId })
    }

    const handleToAllProduct = () => {
        navigation.navigate("Product", { keywords: null, categoryId: null })
    }

    return (
        <View>
            <Header title="Danh mục sản phẩm" navigation={navigation} />
            <View style={tw`flex-row`}>
                <View style={tw`flex-1`}>
                    {
                        tabList.map((tab, index) => (
                            <TouchableOpacity
                                style={tw`p-[10px] justify-center mb-[2px] w-full bg-[#e0e0e0] border-l-4 ${index === currentTab ? `border-[${PRIMARY_COLOR}]` : 'border-[#e0e0e0]'}`}
                                onPress={() => setCurrentTab(index)}
                                key={tab.name}
                            >
                                <View style={tw`w-full items-center`}>
                                    <Image
                                        source={{ uri: `${tab.icon}` }}
                                        style={[tw`w-[40px] h-[40px]`, { objectFit: 'cover' }]}
                                    />
                                </View>
                                <Text style={tw`w-full text-center font-bold text-[#333]`}>{tab.name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <ScrollView style={tw`flex-2.5`}>
                    <TouchableOpacity onPress={handleToAllProduct} style={tw`flex-row items-center justify-between px-[10px] py-[14px] bg-white ml-[4px] mb-[4px]`}>
                        <Text style={tw`text-[#333] font-bold`}>Tất cả sản phẩm</Text>
                        <FontIcon
                            name="chevron-right"
                            size={14}
                            color="#333"
                        />
                    </TouchableOpacity>
                    <View style={tw`pb-[200px]`}>
                        {
                            currentTab === 0 &&
                            <View style={tw`flex-1`}>
                                {
                                    categories?.map((category, index) => (
                                        <View
                                            key={category._id}
                                            style={tw`px-[10px] py-[14px] bg-white ml-[4px] mb-[4px]`}>
                                            <TouchableOpacity onPress={() => handleTogge(index)} style={tw`flex-row items-center justify-between`}>
                                                <Text style={tw`${tabChild[index] ? 'text-[#C92127]' : 'text-[#333]'} font-bold`}>
                                                    {category._id}
                                                </Text>
                                                <FontIcon
                                                    name={tabChild[index] ? "chevron-up" : "chevron-down"}
                                                    size={14}
                                                    color={tabChild[index] ? PRIMARY_COLOR : "#333"}
                                                />
                                            </TouchableOpacity>
                                            {
                                                tabChild[index] &&
                                                <>
                                                    {
                                                        category?.categories?.map((child, index) => (
                                                            child
                                                                ?
                                                                <TouchableOpacity
                                                                    onPress={() => handleToProduct(child._id)}
                                                                    key={child._id}
                                                                    style={tw`flex-row items-center justify-between border-b border-[${BORDER_COLOR}] py-[14px] bg-white ml-[4px] mb-[4px]`}
                                                                >
                                                                    <Text style={tw`text-[#333]`}>
                                                                        {child.name}
                                                                    </Text>
                                                                    <FontIcon
                                                                        name="chevron-right"
                                                                        size={14}
                                                                        color="#999"
                                                                    />
                                                                </TouchableOpacity>
                                                                :
                                                                <View key={index}></View>
                                                        ))
                                                    }
                                                </>
                                            }
                                        </View>
                                    ))
                                }
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Categories