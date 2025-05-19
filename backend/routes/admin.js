// backend/routes/admin.js

const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint thêm sản phẩm mới vào cơ sở dữ liệu và lưu ảnh sản phẩm
router.post('/products', upload.array('images', 10), async (req, res) => {
  const { ten_cay, ten_khoa_hoc, dac_diem, y_nghia_phong_thuy, loi_ich, gia } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO data (ten_cay, ten_khoa_hoc, dac_diem, y_nghia_phong_thuy, loi_ich, gia) VALUES (?, ?, ?, ?, ?, ?)",
      [ten_cay, ten_khoa_hoc, dac_diem, y_nghia_phong_thuy, loi_ich, gia]
    );
    const productId = result.insertId;
    
    const targetDir = path.join(__dirname, '../../frontend/public/images_tree');
    console.log("Target directory:", targetDir);
    await fs.mkdir(targetDir, { recursive: true });
    
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const outputFilename = `${ten_cay}_${i + 1}.jpg`;
        const outputPath = path.join(targetDir, outputFilename);
        try {
          await sharp(file.buffer)
            .jpeg()
            .toFile(outputPath);
        } catch (fileErr) {
          console.error(`Error processing file ${outputFilename}:`, fileErr);
        }
      }
    } else {
      console.warn("No files received in req.files");
    }
    res.json({ message: "Thêm sản phẩm thành công", productId });
  } catch (error) {
    console.error("Error in product upload:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint kiểm soát đơn hàng
router.get("/orders", async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders");
    for (let order of orders) {
      const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
      order.items = items;
      const [statusRows] = await pool.query("SELECT status FROM order_status WHERE order_id = ?", [order.id]);
      order.status_detail = statusRows.length > 0 ? statusRows[0].status : order.status;
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint cập nhật trạng thái đơn hàng
router.put("/orders/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM order_status WHERE order_id = ?", [orderId]);
    if (rows.length > 0) {
      await pool.query("UPDATE order_status SET status = ? WHERE order_id = ?", [status, orderId]);
    } else {
      await pool.query("INSERT INTO order_status (order_id, status) VALUES (?, ?)", [orderId, status]);
    }
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", orderId, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint cập nhật thông tin sản phẩm từ bảng data theo id
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { ten_cay, ten_khoa_hoc, dac_diem, y_nghia_phong_thuy, loi_ich, gia } = req.body;
  try {
    await pool.query(
      "UPDATE data SET ten_cay = ?, ten_khoa_hoc = ?, dac_diem = ?, y_nghia_phong_thuy = ?, loi_ich = ?, gia = ? WHERE id = ?",
      [ten_cay, ten_khoa_hoc, dac_diem, y_nghia_phong_thuy, loi_ich, gia, id]
    );
    res.json({ message: "Cập nhật sản phẩm thành công", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint xóa sản phẩm
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM data WHERE id = ?", [id]);
    await pool.query("DELETE FROM product_images WHERE product_id = ?", [id]);
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;