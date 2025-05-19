const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("./config/passport");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(passport.initialize());

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const orderPaymentRoutes = require('./routes/orderPayment');
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const vnpayRoutes = require("./routes/vnpay"); // Thêm route VNPay

app.use('/api/orders', orderPaymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vnpay", vnpayRoutes); // Sử dụng route VNPay

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});