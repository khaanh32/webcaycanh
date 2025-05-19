
const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Tạo đơn hàng mới từ giỏ hàng hoặc mua ngay
router.post("/", async (req, res) => {
  const { user_id, items } = req.body;
  try {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, ?, NOW())",
      [user_id, total, "pending"]
    );
    const orderId = orderResult.insertId;
    for (let item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }
    res.json({ message: "Đơn hàng đã được tạo", orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật trạng thái đơn hàng (ví dụ: 'paid', 'cancelled')
router.put('/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  try {
    const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully', orderId, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy đơn hàng mới nhất của người dùng theo userId
router.get('/latest', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy tất cả đơn hàng của người dùng theo userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await pool.query("SELECT * FROM orders WHERE user_id = ?", [userId]);

    for (let order of orders) {
      const [statusRows] = await pool.query("SELECT status FROM order_status WHERE order_id = ?", [order.id]);
      order.status_detail = statusRows.length > 0 ? statusRows[0].status : "Chưa được xác nhận";
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết đơn hàng theo orderId
router.get("/details/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const [orderItems] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [orderId]);
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;