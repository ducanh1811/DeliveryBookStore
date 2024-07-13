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
import {useForm, Controller} from 'react-hook-form';
import {
  BLUE_COLOR,
  PRIMARY_COLOR,
  YELLOW_COLOR,
} from '../../styles/color.global';
import {useDispatch} from 'react-redux';
import Button from '../../components/Button/index';
import Loading from '../../components/loaders/Loading';
import Toast from 'react-native-toast-message';
import {API_URL} from '../../constants/index';
import axios from 'axios';
import {login} from '../../stores/userSlice';
import Dialog from 'react-native-dialog';
import {apiVerifyOtp} from '../../apis/user';
import {ACCOUNT_REGISTER} from '../../constants/toast';

// import {StarOutlined} from '@ant-design/icons';

const Login = ({navigation}) => {
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [email, setEmail] = React.useState();
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const dispatch = useDispatch();

  const lottieSrc = require('../../assets/jsons/login.json');

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const handleToRegister = () => {
    // navigation.navigate('Register');
    Toast.show({
      type: 'info',
      //   text1: 'account_register',
      text1: ACCOUNT_REGISTER,
    });
  };

  const handleTogglePassword = () => {
    setIsShowPassword(prev => !prev);
  };

  const handleToForgotPassword = async () => {
    const check = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (check.test(email)) {
      setLoading(true);
      const otpResponse = await apiVerifyOtp(email);
      setLoading(false);

      if (otpResponse.status == 200) {
        navigation.navigate('AuthenticateOTP', {
          email: email,
          otpCode: otpResponse.data.data,
          forgotPassword: true,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập đúng định dạng email',
      });
    }
  };

  const onSubmit = async data => {
    setLoading(true);
    console.log(API_URL);
    axios
      .post(`${API_URL}/shippers/login`, {...data})
      .then(async response => {
        setLoading(false);
        if (response.status == 200) {
          if (
            response.data.hasOwnProperty('isLock') &&
            response.data.data.isLock
          ) {
            Toast.show({
              type: 'info',
              text1: 'Tài khoản của bạn hiện tạm thời bị khóa',
            });
          } else if (
            response.data.hasOwnProperty('isLock') &&
            response.data.data.isActive === false
          ) {
            setShowDialog(true);
          } else {
            // đang nhập thành công
            dispatch(login(response.data));

            Toast.show({
              type: 'success',
              text1: 'Đăng nhập tài khoản thành công!',
            });
            setTimeout(() => {
              navigation.navigate('TabBottom');
            }, 500);
          }
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: `Error: ${error?.response?.data?.message}`,
        });
      });
  };

  const handleActive = async () => {
    setLoading(true);
    const otpResponse = await apiVerifyOtp(watch('email'));
    setLoading(false);

    if (otpResponse.status == 200) {
      navigation.navigate('AuthenticateOTP', {
        email: watch('email'),
        otpCode: otpResponse.data.data,
        forgotPassword: false,
      });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <View style={tw`flex-1 items-center`}>
        <StatusBar translucent backgroundColor="transparent" />
        {showDialog && (
          <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <View style={tw`bg-white p-[10px] rounded-[4px]`}>
              <Dialog.Title>Thông báo tài khoản</Dialog.Title>
              <Dialog.Description>
                Tài khoản của bạn hiện chưa được kích hoạt
              </Dialog.Description>
              <View style={tw`flex-row justify-end`}>
                <Dialog.Button
                  label="Hủy"
                  color="#666"
                  bold={true}
                  onPress={() => setShowDialog(false)}
                />
                <Dialog.Button
                  label="Kích hoạt"
                  color={PRIMARY_COLOR}
                  bold={true}
                  onPress={handleActive}
                />
              </View>
            </View>
          </View>
        )}
        {showForgotPassword && (
            <View style={[StyleSheet.absoluteFillObject, styles.container]}>
                <View style={tw`bg-white p-[20px] rounded-[4px]`}>
                <Dialog.Title>Quên mật khẩu</Dialog.Title>
                <Dialog.Description>
                    Vui lòng nhập địa chỉ email để lấy lại mật khẩu tài khoản của
                    bạn
                </Dialog.Description>
                <View style={tw`pt-[10px]`}>
                    <Dialog.Input
                    placeholder="Nhập địa chỉ email"
                    value={email}
                    onChangeText={value => setEmail(value)}
                    />
                </View>
                <View style={tw`flex-row justify-end`}>
                    <Dialog.Button
                    label="Hủy"
                    color="#666"
                    bold={true}
                    onPress={() => setShowForgotPassword(false)}
                    />
                    <Dialog.Button
                    label="Tiếp tục"
                    color={PRIMARY_COLOR}
                    bold={true}
                    onPress={handleToForgotPassword}
                    />
                </View>
                </View>
            </View>
        )}
        <View
          style={[
            tw`w-full h-[40%] items-center`,
            {backgroundColor: 'rgb(45, 50, 80)'},
          ]}>
          <LottieView
            source={lottieSrc}
            autoPlay={true}
            loop
            style={{flexGrow: 1, width: '60%'}}
          />
        </View>
        <ScrollView
          style={[
            StyleSheet.absoluteFill,
            tw`w-full flex-1 bg-white top-[38%] rounded-t-[24px]`,
          ]}>
          <View style={tw`w-full my-[25px] flex items-center`}>
            <Text
              style={[tw`text-[2rem]`, styles.title]}
              onPress={() => {
                onSubmit({
                  email: 'aducanha@gmail.com',
                  password: '=Anh181102',
                });
              }}>
              Đăng nhập
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
                render={({field: {onChange, onBlur, value}}) => (
                  <View
                    style={tw`flex-row items-center border ${
                      errors.password ? 'border-red-500' : 'border-[#999]'
                    } rounded-[6px] text-[#333] w-full px-[10px]`}>
                    {/* <IconFontAwesome
                      name="envelope"
                      size={16}
                      color={`${PRIMARY_COLOR}`}
                    /> */}
                    {/* <StarOutlined
                      style={{fontSize: 22, color: PRIMARY_COLOR}}
                    /> */}
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

            <View style={tw`w-full my-[10px]`}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <View
                    style={tw`flex-row items-center border ${
                      errors.password ? 'border-red-500' : 'border-[#999]'
                    } rounded-[6px] text-[#333] w-full px-[10px]`}>
                    {/* <IconFontAwesome
                                            name="lock"
                                            size={22}
                                            color={`${PRIMARY_COLOR}`}
                                        /> */}
                    {/* <StarOutlined
                      style={{fontSize: 22, color: PRIMARY_COLOR}}
                    /> */}
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
              <View style={tw`mt-[16px] items-end`}>
                <Text
                  onPress={() => setShowForgotPassword(true)}
                  style={[tw`font-bold`, {color: YELLOW_COLOR}]}>
                  Quên mật khẩu
                </Text>
              </View>
              <View style={tw`mt-[20px] mx-[30px]`}>
                <Button
                  type="primary"
                  title="Đăng nhập"
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
              <View style={tw`mt-[10px] items-center`}>
                <Text style={tw`font-bold`}>Hoặc</Text>
              </View>
              {/* <View style={tw`mt-[10px] mx-[30px]`}>
                                <IconFontAwesome.Button
                                    name="facebook"
                                    backgroundColor={BLUE_COLOR}
                                    style={tw`rounded-[100px] py-[12px] px-[20px]`}>
                                    Đăng nhập bằng facebook
                                </IconFontAwesome.Button>
                            </View> */}
              <View
                style={tw`mt-[10px] pb-[10px] flex-row justify-center items-center`}>
                <Text style={tw`text-[#333]`}>Chưa có tài khoản? </Text>
                <Text
                  onPress={handleToRegister}
                  style={[tw`font-bold`, {color: `${YELLOW_COLOR}`}]}>
                  Đăng ký
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
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 2,
    padding: 20,
  },
});

export default Login;
