// frontend/src/components/Footer.js
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
// import './Footer.css'; // Nếu bạn tạo tệp CSS riêng

function NewFooter() {
  return (
    <footer className="new-footer">
      <div className="new-footer-container">
        <div className="new-footer-section new-footer-about">
          <h4>Về Chúng Tôi</h4>
          <p>
            Chuyên cung cấp các loại cây cảnh chất lượng, mang không gian xanh đến mọi nhà.
            Chúng tôi tin rằng mỗi không gian sống đều xứng đáng có thêm màu xanh của thiên nhiên.
          </p>
          <div className="new-footer-socials">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="new-footer-section new-footer-links">
          <h4>Liên Kết Nhanh</h4>
          <ul>
            <li><Link to="/product">Sản phẩm</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/user/orders">Đơn hàng của tôi</Link></li>
            <li><Link to="/#">Chính sách đổi trả</Link></li>
            <li><Link to="/#">Điều khoản dịch vụ</Link></li>
          </ul>
        </div>

        <div className="new-footer-section new-footer-contact">
          <h4>Thông Tin Liên Hệ</h4>
          <p><FaMapMarkerAlt /> 180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</p>
          <p><FaPhone /> 0283 850 5520</p>
          <p><FaEnvelope /> support@webcaycanh.vn</p>
        </div>

        <div className="new-footer-section new-footer-newsletter">
          <h4>Đăng Ký Nhận Tin</h4>
          <p>Nhận thông tin về sản phẩm mới và các ưu đãi đặc biệt.</p>
          <form className="new-newsletter-form">
            <input type="email" placeholder="Email của bạn" />
            <button type="submit">Đăng Ký</button>
          </form>
        </div>
      </div>

      <div className="new-footer-bottom">
        <p>&copy; {new Date().getFullYear()} Web Cây Cảnh. Bảo lưu mọi quyền.</p>
        {/* Bạn có thể thêm các icon thanh toán ở đây nếu muốn */}
        {/* <div className="new-payment-icons">
          <img src="/path/to/visa.png" alt="Visa" />
          <img src="/path/to/mastercard.png" alt="Mastercard" />
        </div> */}
      </div>
    </footer>
  );
}

export default NewFooter;