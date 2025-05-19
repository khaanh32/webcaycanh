
const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require("crypto");
const querystring = require('qs');
const vnpayConfig = require('../config/vnpayConfig');

// API trả về URL thanh toán VNPay
router.get('/create_payment_url', function (req, res) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  
  const ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

  const tmnCode = vnpayConfig.vnp_TmnCode;
  const secretKey = vnpayConfig.vnp_HashSecret;
  const vnpUrl = vnpayConfig.vnp_Url;
  const returnUrl = vnpayConfig.vnp_ReturnUrl;
  const orderId = moment(date).format('DDHHmmss');
  const amount = req.query.amount;
  const idGoogle = req.query.idGoogle;
  const locale = req.query.language || 'vn';
  const currCode = 'VND';
  
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: idGoogle,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  // Thêm thông tin sản phẩm nếu có
  if (req.query.product_id) {
    vnp_Params.vnp_Inv_Customer = `product_id=${req.query.product_id}&quantity=${req.query.quantity}&price=${req.query.price}`;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
  
  res.status(200).json({ paymentUrl });
});

// API kiểm tra trạng thái giao dịch (tham khảo)
router.get('/querydr', async function (req, res) {
  const vnp_TxnRef = req.query.orderId;
  const vnp_TransactionDate = req.query.transDate;
  const vnp_RequestId = moment().format('HHmmss');
  const vnp_Version = '2.1.0';
  const vnp_Command = 'querydr';
  const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
  
  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  let vnp_Params = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    vnp_IpAddr: vnp_IpAddr
  };
  
  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  
  res.status(200).json(vnp_Params);
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj){
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;