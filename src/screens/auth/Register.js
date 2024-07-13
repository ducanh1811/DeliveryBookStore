import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { useForm, Controller } from 'react-hook-form';

import {
    BLUE_COLOR,
    PRIMARY_COLOR,
    YELLOW_COLOR,
} from '../../styles/color.global';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button/index';
import Loading from '../../components/loaders/Loading';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../constants/index';
import axios from 'axios';
import { login } from '../../stores/userSlice';
import { apiVerifyOtp } from '../../apis/user';

const Register = ({ navigation }) => {
    const [isShowPassword, setIsShowPassword] = React.useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();

    const handleToLogin = () => {
        navigation.goBack()
    };

    const handleTogglePassword = () => {
        setIsShowPassword(prev => !prev);
    };

    const onSubmit = async (data) => {

        setLoading(true)
        axios.post(`${API_URL}/users/register`, {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            isLock: true
        })
            .then(async response => {
                if (response.status == 200) {

                    const otpResponse = await apiVerifyOtp(data.email)

                    setLoading(false)

                    if (otpResponse.status == 200) {

                        navigation.navigate('AuthenticateOTP', {
                            email: data.email,
                            otpCode: otpResponse.data.data,
                            forgotPassword: false
                        })
                    }
                }
            })
            .catch(error => {

                setLoading(false)
                Toast.show({
                    type: 'error',
                    text1: `Error: ${error?.response?.data?.message}`
                })
            })
    }

    React.useEffect(() => {

        if (watch('password') !== watch('confirmPassword')) {

            setError('confirmPassword', { type: 'custom', message: 'Mật khẩu không khớp' })
        } else {

            clearErrors('confirmPassword')
        }

    }, [watch('password'), watch('confirmPassword')])

    return (
        <>
            {loading && <Loading />}
            <View style={tw`flex-1 items-center`}>
                <StatusBar translucent backgroundColor="transparent" />
                <View
                    style={[
                        tw`w-full h-[40%] items-center`,
                        { backgroundColor: 'rgb(45, 50, 80)' },
                    ]}>
                    <LottieView
                        source={require('../../assets/jsons/loginRegister.json')}
                        autoPlay={true}
                        loop
                        style={{ flexGrow: 1, width: '60%' }}
                    />
                </View>
                <ScrollView
                    style={[
                        StyleSheet.absoluteFill,
                        tw`w-full flex-1 bg-white top-[38%] rounded-t-[24px]`,
                    ]}>
                    <View style={tw`w-full my-[10px] flex items-center`}>
                        <Text style={[tw`text-[2rem]`, styles.title]}>
                            Đăng ký
                        </Text>
                    </View>
                    <View style={tw`px-[20px]`}>
                        <View style={tw`w-full mb-[10px]`}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View
                                        style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-[#999]'
                                            } rounded-[6px] text-[#333] w-full px-[10px]`}>
                                        <View style={tw`w-[20px]`}>
                                            <IconFontAwesome
                                                name="envelope"
                                                size={16}
                                                color={`${PRIMARY_COLOR}`}
                                            />
                                        </View>
                                        <TextInput
                                            spellCheck={false}
                                            placeholder="Nhập địa chỉ email"
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            style={tw`ml-[10px] flex-1`}
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                )}
                            />
                            {errors.email && (
                                <Text style={tw`mt-[10px] text-red-500`}>
                                    Vui lòng nhập đúng định dạng email
                                </Text>
                            )}
                        </View>

                        <View style={tw`w-full mb-[10px]`}>
                            <Controller
                                name="fullName"
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View
                                        style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-[#999]'
                                            } rounded-[6px] text-[#333] w-full px-[10px]`}>
                                        <View style={tw`w-[20px]`}>
                                            <IconFontAwesome
                                                name="user"
                                                size={16}
                                                color={`${PRIMARY_COLOR}`}
                                            />
                                        </View>
                                        <TextInput
                                            spellCheck={false}
                                            placeholder="Nhập họ và tên"
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            style={tw`ml-[10px] flex-1`}
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                )}
                            />
                            {errors.fullName && (
                                <Text style={tw`mt-[10px] text-red-500`}>
                                    Vui lòng nhập họ và tên
                                </Text>
                            )}
                        </View>

                        <View style={tw`w-full my-[10px]`}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View
                                        style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-[#999]'
                                            } rounded-[6px] text-[#333] w-full px-[10px]`}>
                                        <View style={tw`w-[20px]`}>
                                            <IconFontAwesome
                                                name="lock"
                                                size={22}
                                                color={`${PRIMARY_COLOR}`}
                                            />
                                        </View>
                                        <TextInput
                                            spellCheck={false}
                                            onBlur={onBlur}
                                            placeholder="Nhập mật khẩu"
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            style={tw`ml-[10px] flex-1`}
                                            placeholderTextColor="#999"
                                            secureTextEntry={!isShowPassword}
                                        />
                                        {watch('password') ? (
                                            <View>
                                                {isShowPassword ? (
                                                    <TouchableOpacity onPress={handleTogglePassword}>
                                                        <IconFontAwesome
                                                            name="eye"
                                                            size={18}
                                                            color={`${PRIMARY_COLOR}`}
                                                        />
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity onPress={handleTogglePassword}>
                                                        <View style={tw`flex-1 w-[20px]`}>

                                                        </View>
                                                        <IconFontAwesome
                                                            name="eye-slash"
                                                            size={18}
                                                            color={`${PRIMARY_COLOR}`}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ) : (
                                            <View></View>
                                        )}
                                    </View>
                                )}
                            />

                            {errors.password && (
                                <Text style={tw`mt-[10px] text-red-500`}>
                                    Vui lòng nhập mật khẩu
                                </Text>
                            )}

                        </View>

                        <View style={tw`w-full my-[10px]`}>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View
                                        style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-[#999]'
                                            } rounded-[6px] text-[#333] w-full px-[10px]`}>
                                        <View style={tw`w-[20px]`}>
                                            <IconFontAwesome
                                                name="lock"
                                                size={22}
                                                color={`${PRIMARY_COLOR}`}
                                            />
                                        </View>
                                        <TextInput
                                            spellCheck={false}
                                            onBlur={onBlur}
                                            placeholder="Nhập mật khẩu"
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            style={tw`ml-[10px] flex-1`}
                                            placeholderTextColor="#999"
                                            secureTextEntry={!isShowConfirmPassword}
                                        />
                                        {watch('confirmPassword') ? (
                                            <View>
                                                {isShowConfirmPassword ? (
                                                    <TouchableOpacity onPress={() => setIsShowConfirmPassword(prev => !prev)}>
                                                        <IconFontAwesome
                                                            name="eye"
                                                            size={18}
                                                            color={`${PRIMARY_COLOR}`}
                                                        />
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity onPress={() => setIsShowConfirmPassword(prev => !prev)}>
                                                        <View style={tw`flex-1 w-[20px]`}>

                                                        </View>
                                                        <IconFontAwesome
                                                            name="eye-slash"
                                                            size={18}
                                                            color={`${PRIMARY_COLOR}`}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ) : (
                                            <View></View>
                                        )}
                                    </View>
                                )}
                            />

                            {errors.confirmPassword && (
                                <Text style={tw`mt-[10px] text-red-500`}>
                                    {errors.confirmPassword?.message}
                                </Text>
                            )}
                            <View style={tw`mt-[20px] mx-[30px]`}>
                                <Button
                                    type="primary"
                                    title="Đăng ký"
                                    onPress={handleSubmit(onSubmit)}
                                />
                            </View>
                            <View style={tw`mt-[10px] items-center`}>
                                <Text style={tw`font-bold`}>Hoặc</Text>
                            </View>
                            <View style={tw`mt-[10px] mx-[30px]`}>
                                <View style={tw`flex-1 w-[20px]`}>

                                </View>
                                <IconFontAwesome.Button
                                    name="facebook"
                                    backgroundColor={BLUE_COLOR}
                                    style={tw`rounded-[100px] py-[12px] px-[20px]`}>
                                    Đăng nhập bằng facebook
                                </IconFontAwesome.Button>
                            </View>
                            <View
                                style={tw`mt-[10px] pb-[10px] flex-row justify-center items-center`}>
                                <Text style={tw`text-[#333]`}>Đã có tài khoản? </Text>
                                <Text
                                    onPress={handleToLogin}
                                    style={[tw`font-bold`, { color: `${YELLOW_COLOR}` }]}>
                                    Đăng nhập
                                </Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: 'InknutAntiqua-Bold',
        color: PRIMARY_COLOR,
    },
});

export default Register;
