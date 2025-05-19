// frontend/src/pages/LoginPage.js

import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../index.css';

function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/user', { replace: true });
    }
  }, [searchParams, login, navigate]);

  if (user) {
    // Nếu đã có user, không cần navigate ở đây nữa vì logic useEffect ở trên
    // đã xử lý việc navigate sau khi login.
    // Cân nhắc chuyển hướng nếu user đã login mà vào thẳng trang /login
    // Ví dụ:
    // useEffect(() => {
    //   if (user) {
    //     navigate('/user', { replace: true });
    //   }
    // }, [user, navigate]);
    // Tuy nhiên, logic hiện tại của bạn là nếu có user thì navigate('/user') ở dòng 68
    // Điều này có thể gây vòng lặp render nếu không cẩn thận.
    // Cách an toàn hơn là để useEffect xử lý.
  }

  const handleGoogleLogin = () => {
    // Sử dụng biến môi trường REACT_APP_API_BASE_URL
    const backendUrl = process.env.REACT_APP_API_BASE_URL;
    if (backendUrl) {
      window.location.href = `${backendUrl}/auth/google`;
    } else {
      // Fallback hoặc hiển thị lỗi nếu biến môi trường chưa được thiết lập
      console.error("REACT_APP_API_BASE_URL is not defined!");
      // Có thể hiển thị thông báo cho người dùng
      alert("Lỗi cấu hình: Không thể xác định địa chỉ máy chủ. Vui lòng thử lại sau.");
      // Hoặc dùng URL mặc định cho local development nếu muốn
      // window.location.href = 'http://localhost:5000/auth/google';
    }
  };

  // Nếu user đã tồn tại và đang ở trang login, chuyển hướng họ đi
  useEffect(() => {
    if (user && window.location.pathname === '/login') {
      navigate('/user', { replace: true });
    }
  }, [user, navigate]);


  // Chỉ hiển thị nút login nếu chưa có user
  if (user) {
    return null; // Hoặc một component loading/redirecting
  }

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
