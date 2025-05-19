// frontend/src/pages/UserOrders.js

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css'; // Đảm bảo bạn đã cập nhật CSS
import { FaReceipt, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Định nghĩa các tab và key tương ứng với 'status_detail' hoặc 'status' từ API
const ORDER_STATUS_TABS = {
    ALL: { label: "Tất cả", icon: <FaReceipt />, filterFn: () => true },
    PENDING_CONFIRMATION: { label: "Chờ xác nhận", icon: <FaReceipt />, filterFn: (order) => order.status_detail === "Chưa được xác nhận" || order.status_detail === "Xác nhận"},
    PROCESSING: { label: "Đang xử lý", icon: <FaBoxOpen />, filterFn: (order) => order.status_detail === "Đã bàn giao cho vận chuyển"},
    DELIVERED: { label: "Đã giao", icon: <FaCheckCircle />, filterFn: (order) => order.status_detail === "Đã giao" && order.status === "paid" },
    CANCELLED: { label: "Đã hủy", icon: <FaTimesCircle />, filterFn: (order) => order.status === "cancelled" || order.status_detail === "Đã hủy"},
    // Thêm các tab khác nếu cần
};

const paymentStatusMapping = {
  paid: "Đã thanh toán",
  cancelled: "Đã hủy thanh toán",
  pending: "Chờ thanh toán"
};


function UserOrders() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});
    const [activeTabKey, setActiveTabKey] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            toast.error("Bạn cần đăng nhập để xem đơn hàng!");
            navigate('/login');
            return;
        }

        setIsLoading(true);
        api.get(`/api/orders/user/${user.idGoogle}`)
            .then(res => {
                const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setAllOrders(sortedOrders);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải đơn hàng:", err);
                toast.error("Không thể tải danh sách đơn hàng.");
                setIsLoading(false);
            });
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const filterFn = ORDER_STATUS_TABS[activeTabKey]?.filterFn || (() => true);
        setFilteredOrders(allOrders.filter(filterFn));
    }, [activeTabKey, allOrders]);

    const toggleOrderDetail = (orderId) => {
        setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
        if (!orderDetails[orderId] && !expandedOrders[orderId]) { // Chỉ fetch khi mở và chưa có data
            api.get(`/api/orders/details/${orderId}`)
                .then(res => {
                    const items = res.data;
                    Promise.all(
                        items.map(item =>
                            api.get(`/api/products/${item.product_id}`)
                                .then(productRes => ({ ...item, ten_cay: productRes.data.ten_cay, hinh_anh: `${process.env.PUBLIC_URL}/images_tree/${productRes.data.ten_cay}_1.jpg` }))
                                .catch(() => ({ ...item, ten_cay: "Sản phẩm không tồn tại", hinh_anh: "/images_tree/default.jpg" }))
                        )
                    ).then(updatedItems => {
                        setOrderDetails(prev => ({ ...prev, [orderId]: updatedItems }));
                    });
                })
                .catch(err => {
                    console.error("Lỗi tải chi tiết đơn hàng:", err);
                    toast.error("Không thể tải chi tiết đơn hàng.");
                });
        }
    };

    const handleProductLink = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (authLoading || isLoading) {
        return <div className="user-orders-loading">Đang tải đơn hàng...</div>;
    }
    
    return (
        <div className="user-orders-page-container">
            <h1 className="user-orders-page-title">Đơn Hàng Của Tôi</h1>

            <div className="user-orders-tabs-nav">
                {Object.entries(ORDER_STATUS_TABS).map(([key, tab]) => (
                    <button
                        key={key}
                        className={`order-tab-btn ${activeTabKey === key ? 'active' : ''}`}
                        onClick={() => setActiveTabKey(key)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="user-orders-list">
                {filteredOrders.length === 0 ? (
                    <div className="user-orders-empty">
                        <FaReceipt size={50} />
                        <p>Không có đơn hàng nào trong mục này.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="user-order-card">
                            <div className="order-card-header" onClick={() => toggleOrderDetail(order.id)}>
                                <div className="order-info">
                                    <span>Mã đơn: <strong>{order.order_code}</strong></span>
                                    <span>Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="order-status-tags">
                                    <span className={`payment-status-badge status-${order.status}`}>
                                        {paymentStatusMapping[order.status] || order.status}
                                    </span>
                                    <span className={`shipping-status-badge status-detail-${order.status_detail?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                                        {order.status_detail || "Chưa cập nhật"}
                                    </span>
                                </div>
                                <button className="expand-details-btn">
                                    {expandedOrders[order.id] ? <FaAngleUp /> : <FaAngleDown />}
                                </button>
                            </div>

                            {expandedOrders[order.id] && (
                                <div className="order-card-body">
                                    {orderDetails[order.id] ? (
                                        orderDetails[order.id].map((item, index) => (
                                            <div key={index} className="order-item-detail">
                                                <img 
                                                    src={item.hinh_anh} 
                                                    alt={item.ten_cay} 
                                                    className="order-item-image"
                                                    onClick={() => handleProductLink(item.product_id)}
                                                    onError={(e) => e.target.src = "/images_tree/default.jpg"}
                                                />
                                                <div className="order-item-info">
                                                    <p className="order-item-name" onClick={() => handleProductLink(item.product_id)}>{item.ten_cay}</p>
                                                    <p className="order-item-qty">Số lượng: {item.quantity}</p>
                                                </div>
                                                <p className="order-item-price">{Number(item.price).toLocaleString()}đ</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Đang tải chi tiết sản phẩm...</p>
                                    )}
                                    <div className="order-card-footer">
                                        <span>Tổng tiền:</span>
                                        <span className="order-total-amount">{Number(order.total_amount).toLocaleString()}đ</span>
                                    </div>
                                     {/* <div className="order-actions">
                                        <button className="btn-secondary-modern">Xem chi tiết</button>
                                        {(order.status === 'paid' && order.status_detail === 'Đã giao') && (
                                            <button className="btn-primary-modern">Đánh giá</button>
                                        )}
                                    </div> */}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UserOrders;