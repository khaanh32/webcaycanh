// frontend/src/pages/Cart.js

import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../index.css'; // Đảm bảo bạn đã cập nhật CSS trong file này

function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]); // Lưu ID của các sản phẩm được chọn

    // Chọn tất cả sản phẩm khi vào trang hoặc khi giỏ hàng thay đổi
    useEffect(() => {
        setSelectedItems(cart.map(item => item.id));
    }, [cart]);

    const handleSelectItem = (itemId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cart.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const quantityNum = parseInt(newQuantity, 10);
        if (quantityNum >= 1) {
            updateQuantity(itemId, quantityNum);
        } else if (newQuantity === '') { // Cho phép input rỗng tạm thời
             updateQuantity(itemId, '');
        }
    };
     const handleQuantityBlur = (itemId, currentQuantityStr) => {
        const currentQuantity = parseInt(currentQuantityStr, 10);
        if (isNaN(currentQuantity) || currentQuantity < 1) {
            updateQuantity(itemId, 1); // Nếu rỗng hoặc không hợp lệ, đặt lại là 1
        }
    };


    const itemsToCheckout = cart.filter(item => selectedItems.includes(item.id));
    const totalSumSelected = itemsToCheckout.reduce((sum, item) => sum + (item.gia * item.quantity), 0);

    const handleCheckout = () => {
        if (itemsToCheckout.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
            return;
        }
        // Truyền những sản phẩm được chọn tới trang thanh toán
        navigate("/payment", { state: { cartItems: itemsToCheckout } });
    };

    const handleProductLink = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty-container">
                <FaShoppingCart className="cart-empty-icon" />
                <h1>Giỏ hàng của bạn còn trống</h1>
                <p>Hãy khám phá thêm các sản phẩm cây cảnh tuyệt vời của chúng tôi!</p>
                <Link to="/product" className="btn-primary-modern">
                    Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <h1 className="cart-page-title">Giỏ Hàng Của Bạn</h1>
            <div className="cart-content-layout">
                <div className="cart-items-panel">
                    <div className="cart-header">
                        <div className="cart-header-select-all">
                            <input
                                type="checkbox"
                                id="selectAll"
                                checked={selectedItems.length === cart.length && cart.length > 0}
                                onChange={handleSelectAll}
                                disabled={cart.length === 0}
                            />
                            <label htmlFor="selectAll">Chọn tất cả ({cart.length} sản phẩm)</label>
                        </div>
                        {/* Các tiêu đề khác có thể ẩn đi và hiển thị trong từng item cho responsive */}
                    </div>

                    {cart.map(item => (
                        <div key={item.id} className={`cart-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
                            <div className="cart-item-select">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                />
                            </div>
                            <img
                                src={`${process.env.PUBLIC_URL}/images_tree/${item.ten_cay}_1.jpg`}
                                alt={item.ten_cay}
                                className="cart-item-image"
                                onClick={() => handleProductLink(item.id)}
                                onError={(e) => e.target.src = "/images_tree/default.jpg"}
                            />
                            <div className="cart-item-details">
                                <h3 className="cart-item-name" onClick={() => handleProductLink(item.id)}>
                                    {item.ten_cay}
                                </h3>
                                {/* <p className="cart-item-variant">Loại: Văn phòng</p> */}
                                <p className="cart-item-price-unit">Đơn giá: {Number(item.gia).toLocaleString()}đ</p>
                            </div>
                            <div className="cart-item-quantity">
                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="quantity-btn-cart">
                                    <FaMinus />
                                </button>
                                <input
                                    type="number"
                                    className="quantity-input-cart"
                                    value={item.quantity === '' ? '' : item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    onBlur={(e) => handleQuantityBlur(item.id, e.target.value)}
                                    min="1"
                                />
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn-cart">
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="cart-item-total-price">
                                {((item.gia || 0) * (item.quantity || 0)).toLocaleString()}đ
                            </div>
                            <div className="cart-item-actions">
                                <button onClick={() => removeFromCart(item.id)} className="cart-item-delete-btn" title="Xóa sản phẩm">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary-panel">
                    {/* <div className="cart-voucher">
                        <input type="text" placeholder="Mã giảm giá" />
                        <button className="btn-apply-voucher">Áp dụng</button>
                    </div> */}
                    <div className="cart-total-summary">
                        <div className="summary-row">
                            <span>Tạm tính ({itemsToCheckout.length} sản phẩm):</span>
                            <span>{totalSumSelected.toLocaleString()}đ</span>
                        </div>
                        {/* <div className="summary-row">
                            <span>Phí vận chuyển:</span>
                            <span>{(0).toLocaleString()}đ</span> 
                        </div> */}
                        <hr className="summary-divider" />
                        <div className="summary-row total-final">
                            <span>Tổng cộng:</span>
                            <span className="final-amount">{totalSumSelected.toLocaleString()}đ</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="btn-checkout-cart"
                        disabled={itemsToCheckout.length === 0}
                    >
                        Mua Hàng ({itemsToCheckout.length})
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;