// frontend/src/pages/UserProfile.js

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css'; // Đảm bảo bạn đã cập nhật CSS
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaSignOutAlt, FaShoppingBag, FaUserShield } from 'react-icons/fa';

function UserProfile() {
    const navigate = useNavigate();
    const { user, loading: authLoading, logout } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        displayName: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        // Thêm trường ảnh đại diện nếu có từ API hoặc Google
        // avatarUrl: user?.photoURL || '/path/to/default-avatar.png'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [initialProfile, setInitialProfile] = useState(null); // Lưu trữ profile ban đầu để so sánh

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const res = await api.get(`/api/users/${user.idGoogle}`);
                const userData = {
                    displayName: user.displayName || '',
                    email: user.email || '',
                    phone: res.data.phone || '',
                    address: res.data.address || '',
                    role: user.role || '',
                    // avatarUrl: user.photoURL || '/path/to/default-avatar.png' // Nếu bạn lưu trữ hoặc lấy từ Google
                };
                setProfile(userData);
                setInitialProfile(userData); // Lưu trạng thái ban đầu
            } catch (err) {
                console.error("Lỗi tải thông tin người dùng:", err);
                // Vẫn set profile với thông tin từ AuthContext nếu API lỗi
                const fallbackUserData = {
                    displayName: user.displayName || '',
                    email: user.email || '',
                    phone: '',
                    address: '',
                    role: user.role || '',
                };
                setProfile(fallbackUserData);
                setInitialProfile(fallbackUserData);
                toast.error("Lỗi tải thông tin chi tiết người dùng!");
            }
        };

        fetchUserProfile();
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!/^\d{10,11}$/.test(profile.phone) && profile.phone !== '') { // Cho phép để trống nhưng nếu có thì phải đúng
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
        setIsUpdating(true);
        try {
            await api.put(`/api/users/${user.idGoogle}`, {
                phone: profile.phone,
                address: profile.address,
                email: profile.email // Giữ lại email, dù thường không cho sửa nếu là email Google
            });
            toast.success("Cập nhật thông tin thành công!");
            setInitialProfile(profile); // Cập nhật trạng thái ban đầu sau khi lưu
            setIsEditing(false);
        } catch (err) {
            console.error("Lỗi cập nhật thông tin:", err);
            toast.error("Lỗi cập nhật thông tin!");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setProfile(initialProfile); // Khôi phục về trạng thái ban đầu
        setIsEditing(false);
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
      };

    if (authLoading || !initialProfile) { // Chờ initialProfile được set
        return <div className="user-profile-loading">Đang tải hồ sơ...</div>;
    }
    
    return (
        <div className="user-profile-page-container">
            <div className="user-profile-sidebar">
                <div className="user-avatar-section">
                    {/* <img src={profile.avatarUrl} alt="Ảnh đại diện" className="user-avatar" /> */}
                    <FaUserCircle className="user-avatar-placeholder" />
                    <h3>{profile.displayName}</h3>
                    <p>{profile.email}</p>
                </div>
                <nav className="user-profile-nav">
                    <Link to="/user" className="nav-item active">
                        <FaUserCircle /> Hồ sơ của tôi
                    </Link>
                    {profile.role === 'user' && (
                    <Link to="/user/orders" className="nav-item">
                        <FaShoppingBag /> Đơn mua
                    </Link>)}
                    {profile.role === 'admin' && (
                        <Link to="/admin" className="nav-item admin-link">
                            <FaUserShield /> Trang quản trị
                        </Link>
                    )}
                     <button onClick={handleLogout} className="nav-item logout-btn">
                        <FaSignOutAlt /> Đăng xuất
                    </button>
                </nav>
            </div>

            <div className="user-profile-content">
                <div className="profile-content-header">
                    <h2>Hồ Sơ Của Tôi</h2>
                    <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>

                <form onSubmit={handleUpdate} className="profile-form">
                    <div className="form-field">
                        <label htmlFor="displayName">Tên hiển thị:</label>
                        <input type="text" id="displayName" name="displayName" value={profile.displayName} disabled />
                    </div>
                    <div className="form-field">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={profile.email} disabled />
                    </div>
                    <div className="form-field">
                        <label htmlFor="phone">Số điện thoại:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="address">Địa chỉ:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                    
                    <div className="form-actions">
                        {isEditing ? (
                            <>
                                <button type="submit" className="btn-save-profile" disabled={isUpdating}>
                                    <FaSave /> {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                                <button type="button" onClick={handleCancelEdit} className="btn-cancel-edit" disabled={isUpdating}>
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setIsEditing(true)} className="btn-edit-profile">
                                Chỉnh sửa hồ sơ
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;