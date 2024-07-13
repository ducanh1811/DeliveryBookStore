import Home from '../../screens/public/Home';
import Suggest from '../../screens/public/Suggest';
import DeliveryAddress from '../../screens/user/DeliveryAddress';
import Account from '../../screens/user/Account';
import Turnover from '../../screens/user/Turnover';
import MyOrder from "../../screens/user/MyOrder";
// import Notification from "../../screens/user/Notification"

const TabBottomRouters = [
  {
    screen: Turnover,
    label: 'Trang chủ',
    tabIconLabel: 'home',
    iconName: 'home',
  },
  {
    screen: DeliveryAddress,
    label: 'Kho hàng',
    tabIconLabel: 'motorcycle',
    iconName: 'motorcycle',
  },
  {
      screen: MyOrder,
      label: 'Đơn hàng',
      tabIconLabel: 'lightbulb',
      iconName: 'lightbulb',
  },
  // {
  //     screen: Turnover,
  //     label: 'Trang chủ',
  //     tabIconLabel: 'user',
  //     iconName: 'lightbulb',
  // },
  // {
  //     screen: Suggest,
  //     label: 'Gợi ý',
  //     tabIconLabel: 'lightbulb',
  //     iconName: 'lightbulb',
  // }
];

export default TabBottomRouters;
