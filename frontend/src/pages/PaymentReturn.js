
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import api from '../api';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const { clearCart } = useContext(CartContext);
  const [message, setMessage] = useState("Đang xử lý thanh toán...");

  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
  const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
  
  useEffect(() => {
    async function updateOrderStatus() {
      const res = await api.get(`/api/orders/latest?userId=${vnp_OrderInfo}`);
      console.log(res);
      const orderId = res.data.id;
      const orderCode = res.data.order_code;

      if (vnp_ResponseCode === '00') {
        try {
          await api.put(`/api/orders/update-status/${orderId}`, { status: 'paid' });
          setMessage("Thanh toán đơn hàng thành công!");
          if (orderCode && orderCode.endsWith('C')) {
            localStorage.removeItem('cart');
            clearCart();
          }
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      } else if (vnp_ResponseCode === '24') {
        try {
          await api.put(`/api/orders/update-status/${orderId}`, { status: 'cancelled' });
          setMessage("Thanh toán thất bại do người dùng hủy giao dịch!");
        } catch (error) {
          console.error("Error code 24:", error);
        }
      } else {
        try {
          await api.put(`/api/orders/update-status/${orderId}`, { status: 'cancelled' });
          setMessage("Thanh toán thất bại do các lý do khác!");
        } catch (error) {
          console.error("Error", error);
        }
      }

      setTimeout(() => {
        navigate('/user/orders');
      }, 3000);
    }

    updateOrderStatus();
  }, [vnp_ResponseCode, vnp_OrderInfo, navigate, clearCart]);

  return (
    <div className="payment-return-container">
      <div className="payment-return-card">
        <h2 className="payment-return-title">Kết quả thanh toán</h2>
        <p className="payment-return-message">{message}</p>
        <p className="payment-return-description">
          Vui lòng chờ trong giây lát, bạn sẽ được chuyển hướng đến trang đơn hàng.
        </p>
      </div>
    </div>
  );
};

export default PaymentReturn;