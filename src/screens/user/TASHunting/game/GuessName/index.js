import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  PanResponder,
  Alert,
  StatusBar,
  Touchable,
  Pressable,
  Modal,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import React, {memo, useRef} from 'react';
import {useState, useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {
  Avatar,
  Icon,
  ListItem,
  Dialog,
  Skeleton,
  LinearProgress,
  Image,
  Rating,
} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-swiper';
import tw from 'twrnc';
import {useSelector} from 'react-redux';
import {BackgroundImage} from '@rneui/themed/dist/config';
import {
  PRIMARY_COLOR,
  YELLOW_COLOR,
  GREEN_COLOR,
} from '../../../../../styles/color.global';
const miniquestions = [
  {
    id: 1,
    question: 'Mặt trời mọc từ phía đông?',
    answer: true,
  },
  {
    id: 2,
    question: 'Mặt trời lặn từ phía đông?',
    answer: false,
  },
  {
    id: 3,
    question: 'Đắc Nhân Tâm của Dale Carnegie có 10 nguyên tắc?',
    answer: true,
  },
  {
    id: 4,
    question: 'Đắc Nhân Tâm của Dale Carnegie có 11 nguyên tắc?',
    answer: false,
  },
];

const imageMapping = [
  require('../../../../../assets/images/game/guessnam/images/cat.jpg'),
  require('../../../../../assets/images/game/guessnam/images/chick.jpg'),
  require('../../../../../assets/images/game/guessnam/images/snake.jpg'),
  require('../../../../../assets/images/game/guessnam/images/pig.jpg'),
  require('../../../../../assets/images/game/guessnam/images/dog.jpg'),
  require('../../../../../assets/images/game/guessnam/images/cow.jpg'),
  require('../../../../../assets/images/game/guessnam/images/chameleon.jpg'),
  require('../../../../../assets/images/game/guessnam/images/elephant.jpg'),
  require('../../../../../assets/images/game/guessnam/images/rabbit.jpg'),
  // Thêm các mục khác nếu cần thiết
];

const bigquestions = [
  {
    id: 0,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 0,
    answer: [
      {id: 1, answer: 'Mèo', isTrue: true},
      {id: 2, answer: 'Chó', isTrue: false},
      {id: 3, answer: 'Chuột', isTrue: false},
    ],
  },
  {
    id: 1,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 1,
    answer: [
      {id: 1, answer: 'Mèo', isTrue: false},
      {id: 2, answer: 'Gà', isTrue: true},
      {id: 3, answer: 'Chuột', isTrue: false},
    ],
  },
  {
    id: 2,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 2,
    answer: [
      {id: 1, answer: 'Rắn', isTrue: true},
      {id: 2, answer: 'Nhện', isTrue: false},
      {id: 3, answer: 'Chuột', isTrue: false},
    ],
  },
  {
    id: 3,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 3,
    answer: [
      {id: 1, answer: 'Mèo', isTrue: false},
      {id: 2, answer: 'Gà', isTrue: false},
      {id: 3, answer: 'Heo', isTrue: true},
    ],
  },
  {
    id: 4,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 4,
    answer: [
      {id: 1, answer: 'Mèo', isTrue: false},
      {id: 2, answer: 'Chó', isTrue: true},
      {id: 3, answer: 'Vịt', isTrue: false},
    ],
  },
  {
    id: 5,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 5,
    answer: [
      {id: 1, answer: 'Tắc kè', isTrue: false},
      {id: 2, answer: 'Heo', isTrue: false},
      {id: 3, answer: 'Bò', isTrue: true},
    ],
  },
  {
    id: 6,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 6,
    answer: [
      {id: 1, answer: 'Tắc kè', isTrue: true},
      {id: 2, answer: 'Khỉ', isTrue: false},
      {id: 3, answer: 'Chuột', isTrue: false},
    ],
  },
  {
    id: 7,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 7,
    answer: [
      {id: 1, answer: 'Mèo', isTrue: false},
      {id: 2, answer: 'Heo', isTrue: false},
      {id: 3, answer: 'Voi', isTrue: true},
    ],
  },
  {
    id: 8,
    question: 'Đây là 1 con vật, bạn hãy đoán tên của nó là gì?',
    image: 8,
    answer: [
      {id: 1, answer: 'Thỏ', isTrue: true},
      {id: 2, answer: 'Heo', isTrue: false},
      {id: 3, answer: 'Tắc kè', isTrue: false},
    ],
  },
];
const GuessName = ({navigation}) => {
  const {user} = useSelector(state => state.user);
  const [boxes, setBoxes] = useState(Array.from({length: 9}, (_, i) => i + 1));
  const [scrore, setScrore] = useState(0);
  const [indexFocus, setIndexFocus] = useState(null);
  const [miniQuestions, setMiniQuestions] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTrueBigQuestion, setIsTrueBigQuestion] = useState(null);
  const [appearedList, setAppearedList] = useState([]);
  const [chooseAnswer, setChooseAnswer] = useState(null);
  const [numQuestion, setNumQuestion] = useState(0);
  const randomBigQuestion = listQuestion => {
    const random = Math.floor(Math.random() * listQuestion.length);
    return listQuestion[random];
  };
  const [bigQuestion, setBigQuestion] = useState(
    randomBigQuestion(bigquestions),
  );
  // console.log('miniQuestions', miniQuestions);
  // bộ câu hỏi

  useEffect(() => {
    setAppearedList(appearedList.concat(bigQuestion));
  }, [bigQuestion]);

  // nhận random câu hỏi
  const randomQuestion = listQuestion => {
    const random = Math.floor(Math.random() * listQuestion.length);
    setMiniQuestions(listQuestion[random]);
  };

  console.log('appearedList', appearedList);

  const handlePress = index => {
    setIndexFocus(index);
    // Xóa ô được ấn
    randomQuestion(miniquestions);
    setModalVisible(true);
    // setBoxes(boxes.map(box => (box === index ? null : box)));
  };

  const handleBigAnswer = (index, answer) => {
    setChooseAnswer(index);
    if (answer) {
      setScrore(scrore + 50);
      setIsTrueBigQuestion(true);
    } else {
      setScrore(scrore - 50);
      setIsTrueBigQuestion(false);
    }
    setModalVisible(true);
  };

  // thông báo
  const handleAlert = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      position: 'top',
    });
  };

  const ModalCustom = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          navigation.goBack();
        }}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            opacity: 0.6,
          }}
        />
        {isTrueBigQuestion != null
          ? contentPassModel()
          : contentMiniQuestionModel()}
      </Modal>
    );
  };

  // console.log('miniQuestions', isTrueBigQuestion);

  const contentPassModel = () => {
    // console.log('contentPassModel');
    return (
      <View style={tw`flex-1 flex-col items-center justify-center`}>
        <View style={[tw`w-90 h-[40%] items-center bg-white rounded`]}>
          <LottieView
            source={
              isTrueBigQuestion
                ? require(`../../../../../assets/jsons/congratulation.json`)
                : require(`../../../../../assets/jsons/failed_01.json`)
            }
            autoPlay={true}
            loop={false}
            style={{flexGrow: 1, width: '60%', marginBottom: 100}}
          />
          <View
            style={[
              tw`text-2xl text-[#333]`,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={tw`text-2xl text-[#333] mt-${
                isTrueBigQuestion ? '30' : '50'
              } text-center px-5`}>
              {isTrueBigQuestion
                ? 'Chúc mừng, bạn được cộng 50 điểm'
                : 'Rất tiếc, bạn bị trừ 50 điểm'}
            </Text>

            <View
              style={tw`flex-1.5 flex-row items-center justify-center px-5`}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={tw`flex-1 flex-row items-center justify-center bg-red-500 mr-1 rounded-lg
          `}>
                <Text style={tw`text-2xl text-white p-2`}>Thoát</Text>
              </Pressable>
              <Pressable
                onPress={() => handleContinue()}
                style={tw`flex-1 flex-row items-center justify-center bg-green-500 ml-1 rounded-lg
          `}>
                <Text style={tw`text-2xl text-white p-2`}>Tiếp tục</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleContinue = () => {
    setModalVisible(!modalVisible);
    setBigQuestion(randomBigQuestion(bigquestions));
    setIsTrueBigQuestion(null);
    setChooseAnswer(null);
    setNumQuestion(numQuestion + 1);
    setBoxes(Array.from({length: 9}, (_, i) => i + 1));
  };

  const contentMiniQuestionModel = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 30,
          marginVertical: 180,
          borderRadius: 20,
          backgroundColor: 'white',
        }}>
        <View
          style={tw`flex-1 flex-col items-center justify-between px-5 py-5`}>
          <View
            style={tw`flex-1 flex-col items-center justify-center rounded-lg
        `}>
            <Text style={tw`text-2xl text-[#333]`}>
              Gói câu hỏi số {miniQuestions?.id}
            </Text>
          </View>
          <View
            style={tw`flex-5 flex-col items-center justify-center bg-yellow-400 rounded-lg w-73 shadow-lg px-5 py-10 mb-2
        `}>
            <Text
              style={tw`text-2xl text-black text-center font-bold
          `}>
              {miniQuestions?.question}
            </Text>
          </View>
          <View style={tw`flex-1.5 flex-row items-center justify-center`}>
            <Pressable
              onPress={() => handleAnswer(true)}
              style={tw`flex-1 flex-row items-center justify-center bg-green-500 mr-1 rounded-lg
          `}>
              <Text style={tw`text-3xl text-white p-3`}>ĐÚNG</Text>
            </Pressable>
            <Pressable
              onPress={() => handleAnswer(false)}
              style={tw`flex-1 flex-row items-center justify-center bg-red-500 ml-1 rounded-lg
          `}>
              <Text style={tw`text-3xl text-white p-3`}>SAI</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const itemAnswer = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleBigAnswer(index, item.isTrue)}
        key={index}
        style={tw`flex-1 flex-row items-center justify-start bg-[${
          chooseAnswer != index
            ? YELLOW_COLOR
            : item.isTrue
            ? GREEN_COLOR
            : PRIMARY_COLOR
        }] rounded-xl rounded-xl border border-yellow-800  my-2 shadow-lg`}>
        <Text style={tw`text-3xl text-black ml-5`}>
          {(index == 0 ? 'A. ' : index == 1 ? 'B. ' : 'C. ') + item.answer}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleAnswer = answer => {
    setModalVisible(!modalVisible);
    if (miniQuestions?.answer === answer) {
      setScrore(scrore + 10);
      setBoxes(boxes.map(box => (box === indexFocus ? null : box)));
      handleAlert('success', 'Chúc mừng', 'Bạn được cộng 10 điểm');
    } else {
      setScrore(scrore - 10);
      handleAlert('error', 'Rất tiếc', 'Bạn bị trừ 10 điểm');
    }
  };
  const ScreenGame = memo(({question}) => {
    // console.log('question', question);
    return (
      <View style={tw`flex-1 flex-col`}>
        <View
          style={tw`flex-1 flex-row items-center bg-white justify-center opacity-90 rounded-xl mb-2 shadow-lg overflow-hidden
          `}>
          <Text style={tw`text-xl text-black  font-bold`}>
            Câu hỏi {numQuestion + 1}: {question?.question}
          </Text>
        </View>
        <BackgroundImage
          source={imageMapping[question?.image]}
          style={tw`flex-4 flex-col
           rounded-xl border border-[10px] border-gray-200 shadow-lg overflow-hidden
          `}>
          <View style={tw`flex-1 flex-row flex-wrap`}>
            {boxes.map((box, index) =>
              box != null ? (
                <TouchableOpacity
                  // độ mờ
                  activeOpacity={0.95}
                  key={index}
                  onPress={() => handlePress(box)}
                  style={tw`w-1/3 h-1/3`}>
                  <Image
                    source={require(`../../../../../assets/images/game/guessnam/items/question.jpg`)}
                    style={tw`w-full h-full`}
                  />
                </TouchableOpacity>
              ) : (
                <View style={tw`w-1/3 h-1/3`} key={index}></View>
              ),
            )}
          </View>
        </BackgroundImage>
        <View
          style={tw`flex-3 flex-col my-2 opacity-90
        `}>
          {
            // Câu trả lời
            question.answer?.map((item, index) => itemAnswer({item, index}))
          }
        </View>
      </View>
    );
  });
  return (
    <BackgroundImage
      style={tw`flex-col flex-1 px-4 py-5
      `}
      source={require('../../../../../assets/images/backgrounds/guessname.jpg')}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle="dark-content"
        // hidden={true}
      />
      <ModalCustom />

      <View style={tw`flex-1 flex-col`}>
        <View style={tw`flex-1.5 flex-row items-center justify-between`}>
          <View style={tw`flex-1 flex-row items-center justify-between`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`flex-1 flex-row items-start justify-start 
              `}>
              <Image
                source={require(`../../../../../assets/images/game/guessnam/items/goBack.png`)}
                style={tw`w-24 h-24 `}
              />
            </TouchableOpacity>
          </View>
          <View
            style={tw`flex-1 flex-row items-center justify-center bg-blue-100 px-2 py-4 rounded 
             border border-[3px] border-white shadow-lg
            `}>
            <Avatar
              size={40}
              rounded
              source={user?.images ? {uri: user?.images} : {}}
            />
            <View style={tw`flex-2 flex-col items-start ml-2 justify-center`}>
              <Text style={tw`text-sm text-black`}>{user?.fullName}</Text>
              <Text style={tw`text-xs text-black`}>Điểm: {scrore}</Text>
            </View>
          </View>
        </View>
        <View style={tw`flex-8.5 flex-col items-center justify-center`}>
          <ScreenGame question={bigQuestion} />
        </View>
      </View>
    </BackgroundImage>
  );
};

export default GuessName;
