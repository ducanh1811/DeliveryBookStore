import { View, Text, Alert, BackHandler, TouchableOpacity } from 'react-native'
import React from 'react'

import tw from 'twrnc'
import Header from '../../components/Header/index'
import OTPTextInput from 'react-native-otp-textinput'
import Toast from 'react-native-toast-message'
import Loading from '../../components/loaders/Loading'
import { PRIMARY_COLOR } from '../../styles/color.global'
import Button from '../../components/Button/index'
import { apiUpdateEmail, apiVerifyOtp } from '../../apis/user'
import { useSelector, useDispatch } from 'react-redux'
import { update } from '../../stores/userSlice'

const AuthenChangeEmail = ({ route, navigation }) => {

    const { email, otpCode } = route?.params
    const { token } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [otp, setOTP] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [timer, setTimer] = React.useState(59)
    const [verify, setVerify] = React.useState(otpCode)

    React.useEffect(() => {

        setTimeout(() => {

            if (timer > 0) {

                setTimer(prev => prev - 1)
            }
        }, 1000)

        return () => clearTimeout()
    }, [timer])

    const handleChangeText = (text) => {

        setOTP(text)
    }

    const onAuthen = async () => {

        if (otp) {

            if (otp == verify) {

                try {
                    setLoading(true)
                    const response = await apiUpdateEmail(email, token)
                    setLoading(false)

                    if (response.status === 200) {

                        dispatch(update(response.data.data))
                        Toast.show({
                            type: 'success',
                            text1: 'Xác thực email thành công!'
                        })
                        setTimeout(() => {

                            navigation.goBack()
                        }, 200)
                    }
                } catch (error) {
                    setLoading(false)
                    Toast.show({
                        type: 'error',
                        text1: error?.response ? error?.response?.data?.message : "Lỗi xác thực email"
                    })
                }
            } else {

                Toast.show({
                    type: 'info',
                    text1: 'Mã OTP không đúng'
                })
            }
        } else {

            Toast.show({
                type: 'info',
                text1: 'Vui lòng nhập mã OTP'
            })
        }
    }

    const handleResendOTP = async () => {

        setLoading(true)
        const response = await apiVerifyOtp(email)
        setLoading(false)
        console.log(response)
        if (response.status === 200) {

            setVerify(response.data.data)
            Toast.show({
                type: 'success',
                text1: `Đã gửi mã OTP đến email ${email}`
            })
            setTimer(59)
        }
    }

    React.useEffect(() => {
        const backAction = () => {
            Alert.alert(
                'Xác nhận',
                'Bạn có chắc muốn trở lại?',
                [
                    {
                        text: 'Hủy',
                        onPress: () => null,
                        style: 'cancel',
                    },
                    {
                        text: 'Đồng ý',
                        onPress: () => navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <View style={tw`flex-1`}>
            {loading && <Loading />}
            <Header title="Xác thực email" />
            <Text style={tw`p-[20px] text-[#333]`}>Chúng tôi đã gửi mã xác thực OTP đến email {email}. Vui lòng nhập để xác thực</Text>
            <View style={tw`w-full h-[100px] my-[30px] items-center`}>
                <OTPTextInput
                    autoFocus={true}
                    tintColor={PRIMARY_COLOR}
                    handleTextChange={handleChangeText}
                />
            </View>
            <View style={tw`items-center flex-row justify-end`}>
                <Text style={tw`mr-[10px] text-[${PRIMARY_COLOR}]`}>
                    {Math.floor(timer / 60)}:{timer % 60 <= 9 ? `0${timer % 60}` : timer % 60}
                </Text>
                <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
                    <Text style={tw`text-[14px] text-right mr-[40px] font-bold ${timer > 0 ? "text-[#999]" : "text-[#333]"}`}>
                        Gửi lại
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={tw`my-[20px] mx-[40px]`}>
                <Button type='linear' title="Xác thực" onPress={onAuthen} />
            </View>
        </View>
    )
}

export default AuthenChangeEmail