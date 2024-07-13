import moment from 'moment-timezone';

function formatToVND(number) {
  if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K';
  } else {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(number);
  }
}

function formatDetailToVND(number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number);
}

function getTimeInVietnam(date) {
  return moment.tz(date, 'Asia/Ho_Chi_Minh').format('yyyy-MM-DD');
}

function getDetailTimeInVietnam(date) {
  return moment.tz(date, 'Asia/Ho_Chi_Minh').format('yyyy-MM-DD HH:mm:ss');
}

export {
  formatToVND,
  getTimeInVietnam,
  getDetailTimeInVietnam,
  formatDetailToVND,
};
