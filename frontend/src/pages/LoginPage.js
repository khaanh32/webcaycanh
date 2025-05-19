// frontend/src/pages/LoginPage.js

import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import '../index.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location hiện tại
  const { user, login, loading: authLoading } = useContext(AuthContext); // Thêm authLoading từ context
  const [searchParams] = useSearchParams();

  // Effect này chỉ để xử lý token từ URL khi được redirect từ backend
  useEffect(() => {
    const token = searchParams.get('token');
    // Chỉ xử lý token nếu đang ở trang /login-success và có token
    // (Giả định App.js của bạn có <Route path="/login-success" element={<LoginPage />} />)
    if (token && location.pathname.includes('/login-success')) {
      login(token);
      // Sau khi gọi login(token), `user` trong AuthContext sẽ được cập nhật.
      // useEffect tiếp theo sẽ xử lý việc navigate đến /user.
      // Để tránh việc navigate('/user') hai lần, chúng ta không navigate ở đây nữa.
    }
  }, [searchParams, login, location.pathname]);

  // Effect này để chuyển hướng người dùng nếu họ đã đăng nhập
  useEffect(() => {
    // Nếu auth không còn loading VÀ đã có user
    if (!authLoading && user) {
      // Chuyển hướng đến trang user, thay thế lịch sử để người dùng không quay lại trang login/login-success
      navigate('/user', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = () => {
    const backendUrl = process.env.REACT_APP_API_BASE_URL;
    if (backendUrl) {
      window.location.href = `${backendUrl}/auth/google`;
    } else {
      console.error("REACT_APP_API_BASE_URL is not defined! Please set it in your .env file for the frontend.");
      alert("Lỗi cấu hình: Không thể xác định địa chỉ máy chủ. Vui lòng thử lại sau.");
      // Fallback cho môi trường development nếu muốn:
      // if (process.env.NODE_ENV === 'development') {
      //   window.location.href = 'http://localhost:5000/auth/google';
      // }
    }
  };

  // Nếu AuthContext đang loading hoặc user đã tồn tại (nghĩa là đã đăng nhập và sắp được chuyển hướng)
  // thì hiển thị một trạng thái chờ hoặc không hiển thị gì cả.
  if (authLoading) {
    return <div className="login-container" style={{textAlign: 'center', paddingTop: '50px'}}>Đang tải...</div>;
  }

  // Nếu đã có user (sau khi authLoading là false), useEffect ở trên sẽ xử lý navigate.
  // Trả về null ở đây để tránh render form đăng nhập một cách không cần thiết.
  if (user) {
    return null;
  }

  // Chỉ hiển thị form đăng nhập nếu chưa có user và AuthContext đã load xong
  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/background/logo.jpg" alt="logo" className="image" />
        <p>Đăng nhập để trải nghiệm các tính năng <br></br> tuyệt vời của chúng tôi.</p>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          <img src="/background/icon_gg.png" alt="Google" className="google-icon" />
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
