// frontend/src/pages/LoginPage.js
import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import '../index.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location hiện tại
  const { user, login, loading: authLoading } = useContext(AuthContext); // Thêm authLoading
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    // Chỉ xử lý token nếu đang ở trang /login-success và có token
    if (token && location.pathname.includes('/login-success')) {
      login(token);
      // Không cần navigate('/user') ở đây nữa, AuthProvider hoặc useEffect khác sẽ xử lý
    }
  }, [searchParams, login, location.pathname]);

  useEffect(() => {
    // Nếu đã có user (đã đăng nhập), và không phải đang trong quá trình loading auth
    // thì chuyển hướng đến /user.
    // Điều này cũng xử lý trường hợp người dùng đã login và vào lại /login hoặc /login-success
    if (!authLoading && user) {
      navigate('/user', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = () => {
    const backendUrl = process.env.REACT_APP_API_BASE_URL;
    if (backendUrl) {
      window.location.href = `${backendUrl}/auth/google`;
    } else {
      console.error("REACT_APP_API_BASE_URL is not defined!");
      alert("Lỗi cấu hình: Không thể xác định địa chỉ máy chủ. Vui lòng thử lại sau.");
    }
  };

  // Nếu đang loading auth hoặc đã có user (sắp được redirect), không hiển thị gì hoặc hiển thị loading
  if (authLoading || user) {
    return <div>Đang xử lý...</div>; // Hoặc một spinner
  }

  // Chỉ hiển thị form đăng nhập nếu chưa có user và không loading
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
