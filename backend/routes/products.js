const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Lấy danh sách tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM data");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết sản phẩm theo id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM data WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;