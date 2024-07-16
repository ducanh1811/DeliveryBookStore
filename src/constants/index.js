const isDeploy = process.env.NODE_ENV === 'production';
//const isDeploy = true;

const wifiPort = {
  teleWifi: '192.168.181.147',
};

export const API_URL =
  isDeploy === true
    ? 'https://bookstore-ta-v3.onrender.com/bookstore/api/v1'
    : `http://${wifiPort.teleWifi}:3000/bookstore/api/v1`;
// export const API_URL = 'http://192.168.43.204:3000/bookstore/api/v1'
// export const API_URL = 'http://192.168.1.65:3000/bookstore/api/v1'

export const API_ADDRESS = 'https://vapi.vnappmob.com';
export const apiMaps = 'https://api.mapbox.com/';
export const API_KEY =
  'pk.eyJ1IjoiZHVjdGhvIiwiYSI6ImNsanlmem5kaDA0OTIzZnFnMGpmMzhlZ2sifQ.Tm8Tc--X7kKEwGD3p7N1gw';
export const locationShop = [106.762681, 10.854211];

export const inCome = 0.8;

export const listPathHots = [
  {
    title: 'Sách mới nhất',
    path: '/new/10',
  },
  {
    title: 'Sách rẻ nhất',
    path: '/sale/10',
  },
  {
    title: 'Bán chạy nhất',
    path: '/bestseller/10',
  },
];

export const listPathStatusOrder = [
  {
    title: 'Chờ xác nhận',
    path: '0',
  },
  {
    title: 'Đang giao',
    path: '1',
  },
  {
    title: 'Hoàn thành',
    path: '2',
  },
  {
    title: 'Đã hủy',
    path: '3',
  },
];

export const listPathCategory = [
  {
    title: 'Lịch sử thế giới',
    path: 'category=9725&limit=10',
  },

  {
    title: 'Nghệ thuật sống đẹp',
    path: 'category=872&limit=10',
  },

  {
    title: 'Tài chính - Tiền tệ',
    path: 'category=5246&limit=10',
  },
];

export const listPathLearn = [
  {
    title: 'Băng keo - Keo hồ - Cắt keo',
    path: 'category=3898&limit=10',
  },

  {
    title: 'Bút lông màu',
    path: 'category=8934&limit=10',
  },
];

export const categories = [
  {
    title: 'VPP DCHS',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/image_195509_1_8906.jpg',
    id: 3898,
  },
  {
    title: 'Đồ chơi',
    image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/5702017231044.jpg',
    id: 2539,
  },
  {
    title: 'Ngôn Tình Đam Mỹ',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/_am_m_.jpg',
    id: 1367,
  },
  {
    title: 'Sách Học Ngoại Ngữ',
    image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/8935246917176.jpg',
    id: 1856,
  },
  {
    title: 'Manga',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/2023-05_MANGA/lop-hoc-rung-ron_bia_2-card_tap-17.jpg',
    id: 1084,
  },
  {
    title: 'Tâm Linh Luân Hồi',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/T_m_linh.jpg',
    id: 861,
  },
  {
    title: 'Tư Duy - Kỹ Năng Sống',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Thao_t_ng.jpg',
    id: 871,
  },
  {
    title: 'Sách Chiêm Tinh - Horoscope',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Th_c_T_nh.jpg',
    id: 7671,
  },
  {
    title: 'Tiểu Thuyết',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Ti_u_Thuy_t.jpg',
    id: 844,
  },
  {
    title: 'Light Novel',
    image:
      'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/lightnovel.jpg',
    id: 7358,
  },
];

export const paymentMethodList = ['Thanh toán khi nhận hàng'];

export const shippingMethodList = ['Giao hàng tiêu chuẩn'];
