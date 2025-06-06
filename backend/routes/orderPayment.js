
const express = require('express');
const moment = require('moment');
const pool = require('../models/db');
const router = express.Router();

// API tạo đơn hàng mới.
router.post('/create', async (req, res) => {
  try {
    const { idGoogle, orderItems, total_amount, orderType } = req.body;
    if (!idGoogle || !orderItems || !total_amount) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }
    const status = 'pending';
    const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    const baseOrderCode = 'GD' + moment().format('YYYYMMDDHHmmss');
    const order_code = baseOrderCode + (orderType ? orderType : '');

    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, order_code, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?)",
      [idGoogle, order_code, total_amount, status, created_at]
    );
    const orderId = orderResult.insertId;
    
    for (let item of orderItems) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.json({ message: "Đơn hàng đã được tạo", orderId });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: error.message });
  }
});

module.exports = router;