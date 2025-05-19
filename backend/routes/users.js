// backend/routes/users.js



const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Lấy thông tin người dùng theo idGoogle
router.get("/:idGoogle", async (req, res) => {
  const { idGoogle } = req.params;
  try {
    const [rows] = await pool.query("SELECT id, displayName, email, phone, address FROM users WHERE idGoogle = ?", [idGoogle]);
    if (rows.length === 0) return res.status(404).json({ error: "Người dùng không tồn tại" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật thông tin người dùng theo idGoogle
router.put("/:idGoogle", async (req, res) => {
  const { idGoogle } = req.params;
  const { phone, address, email } = req.body;
  try {
    await pool.query("UPDATE users SET phone = ?, address = ?, email = ? WHERE idGoogle = ?", [phone, address, email, idGoogle]);
    res.json({ message: "Cập nhật thông tin người dùng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;