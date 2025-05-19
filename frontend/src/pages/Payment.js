// frontend/src/pages/Payment.js

import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);

  const [amount, setAmount] = useState(0);
  const [orderPayload, setOrderPayload] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.error("Bạn chưa đăng nhập!");
      navigate('/login');
      return;
    }
    const computedAmount = location.state && location.state.product
      ? Number(location.state.product.gia)
      : cart.reduce((sum, item) => sum + (Number(item.gia) * Number(item.quantity)), 0);
    setAmount(computedAmount);

    if (location.state && location.state.product) {
      const { product, quantity = 1 } = location.state;
      setOrderPayload({
        orderItems: [{
          product_id: product.id,
          quantity: quantity,
          price: product.gia
        }],
        orderType: "B",
        total_amount: computedAmount,
        idGoogle: user.idGoogle
      });
    } else {
      setOrderPayload({
        orderItems: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.gia
        })),
        orderType: "C",
        total_amount: computedAmount,
        idGoogle: user.idGoogle
      });
    }
  }, [location.state, cart, user, loading, navigate]);

  const handleVNPay = async () => {
    if (amount <= 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    try {
      // Tạo đơn hàng trước
      await api.post('/api/orders/create', orderPayload);
      
      // Sử dụng API VNPay mới từ backend
      let url = '/api/vnpay/create_payment_url?';
      if (location.state && location.state.product) {
        url += `amount=${amount}&idGoogle=${user.idGoogle}&product_id=${location.state.product.id}&quantity=${location.state.quantity || 1}&price=${location.state.product.gia}`;
      } else {
        url += `amount=${amount}&idGoogle=${user.idGoogle}`;
      }
      
      // Lấy URL thanh toán từ backend và chuyển hướng
      const response = await api.get(url);
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
      toast.error("Lỗi tạo đơn hàng");
    }
  };

  if (loading) return <div className="payment-loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1 className="payment-title">Thanh toán đơn hàng</h1>
        <div className="payment-summary">
          <p className="payment-amount-label">Số tiền thanh toán:</p>
          <p className="payment-amount-value">{amount.toLocaleString()}đ</p>
        </div>
        <p className="payment-description">
          Vui lòng xác nhận đơn hàng và tiến hành thanh toán <br></br> qua cổng VNPay an toàn và nhanh chóng.
        </p>
        <button onClick={handleVNPay} className="btn btn-vnpay payment-btn">
          <img src="/background/icon_vnpay.webp" alt="vnpay" className="vnpay-icon" />
          Thanh toán qua VNPay
        </button>
      </div>
    </div>
  );
};

export default Payment;