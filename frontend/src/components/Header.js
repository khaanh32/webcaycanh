// frontend/src/components/Header.js
import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaTachometerAlt, // Icon cho trang Admin
  FaUserShield // Giữ lại icon này hoặc thay thế
} from 'react-icons/fa';
// import './Header.css'; // Nếu bạn tạo tệp CSS riêng

function NewHeader() {
  const navigate = useNavigate();
  const location = useLocation(); // Sử dụng hook useLocation
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownVisible(false);
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const closeDropdown = () => setDropdownVisible(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const isAdmin = user && user.role === 'admin';
  // Kiểm tra xem có đang ở trang admin không (dựa trên path)
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="new-header">
      <div className="new-header-container">
        <div className="new-header-left-section"> {/* Bọc logo và nav */}
          <div className="new-header-logo">
            <Link to={isAdmin ? "/admin" : "/"}>
              <img src="/background/logo.jpg" alt="Web Cây Cảnh" />
            </Link>
          </div>

          {/* Chỉ hiển thị nav này nếu không phải admin HOẶC không ở trang admin */}
          {(!isAdmin || !isAdminPage) && (
            <nav className={`new-header-nav ${mobileMenuOpen ? 'open' : ''}`}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
              <Link to="/product" onClick={() => setMobileMenuOpen(false)}>Sản phẩm</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Liên hệ</Link>
            </nav>
          )}
        </div>

        <div className="new-header-actions">
          {/* Chỉ hiển thị giỏ hàng nếu không phải admin HOẶC không ở trang admin */}
          {(!isAdmin || !isAdminPage) && (
            <Link to="/cart" className="new-header-cart-link">
              <FaShoppingCart />
              {cartItemCount > 0 && <span className="new-cart-count">{cartItemCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="new-user-menu">
              <button onClick={toggleDropdown} className="new-user-button">
                <FaUserCircle />
                <span>{user.displayName}</span>
              </button>
              {dropdownVisible && (
                <div className="new-dropdown-menu">
                  <Link to="/user" onClick={closeDropdown}><FaUser /> Tài khoản</Link>
                  {/* Chỉ hiển thị "Đơn hàng" nếu không phải admin HOẶC không ở trang admin */}
                  {(!isAdmin || !isAdminPage) && (
                    <Link to="/user/orders" onClick={closeDropdown}><FaShoppingBag /> Đơn hàng</Link>
                  )}
                 
                  <button onClick={handleLogout}><FaSignOutAlt /> Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="new-login-link">
              <FaUser />
              <span>Đăng nhập</span>
            </Link>
          )}
          {/* Chỉ hiển thị toggle mobile menu nếu không phải admin HOẶC không ở trang admin */}
          {(!isAdmin || !isAdminPage) && (
            <button className="new-mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default NewHeader;