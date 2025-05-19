const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Lấy giỏ hàng của user theo userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.execute("SELECT * FROM cart WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm sản phẩm vào giỏ
router.post("/", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const [existing] = await pool.execute("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
    if (existing.length > 0) {
      const newQuantity = Number(existing[0].quantity) + Number(quantity);
      await pool.execute("UPDATE cart SET quantity = ? WHERE id = ?", [newQuantity, existing[0].id]);
      return res.json({ message: "Cập nhật số lượng sản phẩm trong giỏ hàng thành công" });
    }
    await pool.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [user_id, product_id, quantity]);
    res.json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    await pool.execute("UPDATE cart SET quantity = ? WHERE id = ?", [quantity, id]);
    res.json({ message: "Cập nhật giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`[CART DELETE] Received request to delete cart item with id: ${id}, type: ${typeof id}`); // Log id nhận được
  try {
    const [result] = await pool.execute("DELETE FROM cart WHERE id = ?", [id]);
    console.log(`[CART DELETE] Database result for id ${id}:`, JSON.stringify(result, null, 2)); // Log kết quả từ DB

    if (result.affectedRows === 0) {
      console.log(`[CART DELETE] No rows affected for id ${id}. Item not found.`);
      return res.status(404).json({ error: "Sản phẩm không tồn tại trong giỏ hàng hoặc đã được xóa" });
    }

    console.log(`[CART DELETE] Successfully deleted item with id ${id}.`);
    res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
  } catch (error) {
    console.error(`[CART DELETE] Error deleting item with id ${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;