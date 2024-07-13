import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../components/Header/index'
import { useSelector, useDispatch } from 'react-redux'
import tw from 'twrnc'
import Button from '../../components/Button/index'
import { apiGetNotification } from '../../apis/data'
import { getNotification } from '../../stores/dataSlice'
import { useIsFocused } from '@react-navigation/native'
import { clearNumNotice } from '../../stores/userSlice'

const Notification = ({ navigation }) => {

    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const { isLoggedIn, token, user } = useSelector(state => state.user)
    const { notifications } = useSelector(state => state.data)

    const handleToLogin = () => {

        navigation.navigate('Login')
    }

    const fetchNotification = async () => {

        const response = await apiGetNotification(token, user._id)

        if (response.status === 200) {
            dispatch(getNotification(response.data.data))
        }
    }

    React.useEffect(() => {

        if (isLoggedIn) {
            fetchNotification()
        }
    }, [isLoggedIn, token])

    React.useEffect(() => {

        if (isFocused && isLoggedIn) {
            dispatch(clearNumNotice())
            console.log(isFocused)
        }
    }, [isFocused])

    return (
        <View style={tw`flex-1`}>
            <Header title='Thông báo' />
            {
                isLoggedIn
                    ?
                    <ScrollView>
                        {
                            notifications.map(item => (
                                <TouchableOpacity key={item._id} style={tw`p-[10px] ${item.isAccess ? "bg-white" : "bg-[#eee]"} mb-[10px] flex-row items-center`}>
                                    <Image
                                        style={tw`w-[50px] h-[50px]`}
                                        source={{ uri: item.notification.image }}
                                    />
                                    <View style={tw`flex-1 ml-[10px]`}>
                                        <Text>{item.createdAt}</Text>
                                        <Text style={tw`text-[#333] font-bold`}>{item.notification.title}</Text>
                                        <Text style={tw`text-[#333]`} numberOfLines={2}>{item.notification.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                    :
                    <View style={tw`flex-1 items-center justify-center bg-white`}>
                        <Image
                            style={[tw`w-[200px] h-[200px] mb-[20px]`, { objectFit: 'contain' }]}
                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvx9WvKspimgqicn-dHNV_jDmGD5owcIInZA&usqp=CAU' }}
                        />
                        <Text style={tw`text-[#333]`}>Vui lòng đăng nhập để xem thông báo của bạn</Text>
                        <View style={tw`mt-[10px]`}>
                            <Button title="Đăng nhập" type="line" onPress={handleToLogin} />
                        </View>
                    </View>
            }
        </View>
    )
}

export default Notification