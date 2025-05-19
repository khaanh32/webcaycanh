// webcaycanh_BanChinh/frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css'; // Sử dụng file CSS này
import { FiBox, FiShoppingCart, FiPlusSquare, FiEdit, FiTrash2, FiChevronDown, FiChevronUp, FiPackage, FiDollarSign, FiCalendar, FiList, FiChevronsRight } from 'react-icons/fi';

const statusMapping = {
  paid: "Đã thanh toán",
  cancelled: "Đã bị hủy",
  pending: "Đang chờ thanh toán"
};

// ==== Components con ====

// Product Row Component (có ảnh)
const ProductRow = ({ product, onEdit, onDelete }) => (
  <tr className="admin-table-row">
    <td className="admin-table-cell">{product.id}</td>
    <td className="admin-table-cell">
      <img
        src={`${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_1.jpg`}
        alt={product.ten_cay}
        className="admin-product-thumbnail"
        onError={(e) => {
          e.target.onerror = null; // Ngăn lặp vô hạn nếu ảnh mặc định cũng lỗi
          e.target.src = "/images_tree/default.jpg";
        }}
      />
    </td>
    <td className="admin-table-cell product-name-cell">{product.ten_cay}</td>
    <td className="admin-table-cell hidden md:table-cell">{product.ten_khoa_hoc}</td>
    <td className="admin-table-cell">{Number(product.gia).toLocaleString()}đ</td>
    <td className="admin-table-cell">
      <div className="admin-actions">
        <Link
          to={`/admin/edit-product/${product.id}?tab=products`}
          className="admin-action-btn edit-btn"
          title="Chỉnh sửa"
        >
          <FiEdit size={16} /> <span className="ml-1 hidden sm:inline">Sửa</span>
        </Link>
        <button
          onClick={() => onDelete(product.id)}
          className="admin-action-btn delete-btn"
          title="Xóa"
        >
          <FiTrash2 size={16} /> <span className="ml-1 hidden sm:inline">Xóa</span>
        </button>
      </div>
    </td>
  </tr>
);

// Order Row Component
const OrderRow = ({ order, orderDetails, expandedOrders, toggleOrderDetail, handleUpdateStatus }) => (
  <>
    <tr className="admin-table-row cursor-pointer" onClick={() => toggleOrderDetail(order.id)}>
      <td className="admin-table-cell">{order.order_code}</td>
      <td className="admin-table-cell hidden md:table-cell">{new Date(order.created_at).toLocaleDateString()}</td>
      <td className="admin-table-cell">{Number(order.total_amount).toLocaleString()}đ</td>
      <td className="admin-table-cell">
        <span className={`status-badge status-${order.status}`}>
          {statusMapping[order.status] || order.status}
        </span>
      </td>
      <td className="admin-table-cell hidden md:table-cell">{order.status_detail || "Chưa cập nhật"}</td>
      <td className="admin-table-cell">
        <select
          value={order.status_detail || order.status} // Nên có một trường `order_processing_status` riêng
          onClick={(e) => e.stopPropagation()}
          onChange={e => handleUpdateStatus(order.id, e.target.value)}
          className="admin-form-select"
        >
          <option value="Chưa được xác nhận">Chưa được xác nhận</option>
          <option value="Xác nhận">Xác nhận</option>
          <option value="Đã bàn giao cho vận chuyển">Đã bàn giao cho vận chuyển</option>
          <option value="Đã giao">Đã giao</option>
          <option value="Đã hủy">Đã hủy (Admin)</option>
        </select>
      </td>
      <td className="admin-table-cell text-center">
        {expandedOrders[order.id] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </td>
    </tr>
    {expandedOrders[order.id] && (
      <tr className="admin-order-details-row">
        <td colSpan="7" className="p-4 bg-slate-50">
          <h4 className="text-md font-semibold mb-2 text-slate-700">Chi tiết đơn hàng:</h4>
          {!orderDetails[order.id] && <p className="text-slate-500">Đang tải chi tiết...</p>}
          {orderDetails[order.id] && orderDetails[order.id].length === 0 && <p className="text-slate-500">Không có sản phẩm nào trong đơn hàng này.</p>}
          {orderDetails[order.id] && orderDetails[order.id].length > 0 && (
            <table className="admin-inner-table">
              <thead>
                <tr>
                  <th>Tên cây</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails[order.id].map((item, index) => (
                  <tr key={index}>
                    <td>{item.ten_cay}</td>
                    <td>{Number(item.price).toLocaleString()}đ</td>
                    <td>{item.quantity}</td>
                    <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </td>
      </tr>
    )}
  </>
);


// ==== AdminDashboard Component ====
function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useContext(AuthContext);

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'dashboard'; // Tab mặc định là dashboard overview

  const [activeTab, setActiveTab] = useState(initialTab);

  // States cho từng tab
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    ten_cay: "", ten_khoa_hoc: "", dac_diem: "", y_nghia_phong_thuy: "", loi_ich: "", gia: ""
  });
  const [imageFiles, setImageFiles] = useState(null);
  const fileInputRef = useRef(null);

  // Stats cho dashboard overview
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0 });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.error("Bạn chưa đăng nhập!");
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'admin') {
      toast.error("Bạn không có quyền truy cập trang admin!");
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin?tab=${tab}`, { replace: true });
  };

  // Fetch data cho từng tab
  const fetchOrders = () => {
    api.get('/api/admin/orders')
      .then(res => setOrders(res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))))
      .catch(err => toast.error("Lỗi tải đơn hàng!"));
  };

  const fetchProducts = () => {
    api.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => toast.error("Lỗi tải sản phẩm!"));
  };

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/api/admin/orders'),
        api.get('/api/products')
      ]);
      const totalOrders = ordersRes.data.length;
      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + (order.status === 'paid' ? Number(order.total_amount) : 0), 0);
      const totalProducts = productsRes.data.length;
      setStats({ totalOrders, totalRevenue, totalProducts });
    } catch (error) {
      toast.error("Lỗi tải dữ liệu dashboard!");
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'dashboard') fetchDashboardStats();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'products' || activeTab === 'addproducts') fetchProducts();
    }
  }, [activeTab, user]);


  const toggleOrderDetail = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    if (!orderDetails[orderId] && (!expandedOrders[orderId] === false)) {
      api.get(`/api/orders/details/${orderId}`)
        .then(res => {
          const items = res.data;
          Promise.all(
            items.map(item =>
              api.get(`/api/products/${item.product_id}`)
                .then(productRes => ({ ...item, ten_cay: productRes.data.ten_cay }))
            )
          ).then(updatedItems => setOrderDetails(prev => ({ ...prev, [orderId]: updatedItems })))
          .catch(() => toast.error("Lỗi tải chi tiết sản phẩm trong đơn hàng"));
        })
        .catch(() => toast.error("Lỗi tải chi tiết đơn hàng"));
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái đơn hàng!");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này không thể hoàn tác.")) return;
    try {
      await api.delete(`/api/admin/products/${productId}`);
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts(); // Tải lại danh sách sản phẩm
      // Cập nhật cache nếu cần, tương tự như khi thêm sản phẩm
      api.get('/api/products').then(res => localStorage.setItem("products", JSON.stringify(res.data)));
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm!");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));
    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }
    }
    try {
      await api.post('/api/admin/products', formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Thêm sản phẩm thành công!");
      setProductForm({ ten_cay: "", ten_khoa_hoc: "", dac_diem: "", y_nghia_phong_thuy: "", loi_ich: "", gia: "" });
      setImageFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchProducts(); // Tải lại danh sách sản phẩm
      api.get('/api/products').then(res => localStorage.setItem("products", JSON.stringify(res.data)));
    } catch (error) {
      toast.error("Lỗi thêm sản phẩm!");
    }
  };

  if (authLoading) return <div className="admin-loading-screen">Đang tải...</div>;

  const adminNavItems = [
    { key: 'dashboard', label: 'Tổng Quan', icon: <FiChevronsRight /> },
    { key: 'orders', label: 'Đơn Hàng', icon: <FiShoppingCart /> },
    { key: 'products', label: 'Sản Phẩm', icon: <FiBox /> },
    { key: 'addproducts', label: 'Thêm Sản Phẩm', icon: <FiPlusSquare /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Quản Trị Viên</h3>
        </div>
        <nav className="admin-sidebar-nav">
          {adminNavItems.map(item => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => handleTabChange(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-content-area">
        {activeTab === 'dashboard' && (
          <div className="admin-section-card">
            <h2 className="admin-section-title">Tổng Quan</h2>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <FiShoppingCart size={24} className="text-blue-500" />
                <h4>Tổng đơn hàng</h4>
                <p>{stats.totalOrders}</p>
              </div>
              <div className="admin-stat-card">
                <FiDollarSign size={24} className="text-green-500" />
                <h4>Tổng doanh thu (đã thanh toán)</h4>
                <p>{Number(stats.totalRevenue).toLocaleString()}đ</p>
              </div>
              <div className="admin-stat-card">
                <FiPackage size={24} className="text-purple-500" />
                <h4>Tổng sản phẩm</h4>
                <p>{stats.totalProducts}</p>
              </div>
            </div>
            {/* Thêm các biểu đồ hoặc thông tin khác ở đây */}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section-card">
            <h2 className="admin-section-title">Quản Lý Đơn Hàng</h2>
            {orders.length === 0 ? (
              <p>Không có đơn hàng nào.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã ĐH</th>
                      <th className="hidden md:table-cell">Ngày Đặt</th>
                      <th>Tổng Tiền</th>
                      <th>TT Thanh Toán</th>
                      <th className="hidden md:table-cell">TT Đơn Hàng</th>
                      <th>Cập Nhật TT</th>
                      <th>Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        orderDetails={orderDetails}
                        expandedOrders={expandedOrders}
                        toggleOrderDetail={toggleOrderDetail}
                        handleUpdateStatus={handleUpdateStatus}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-section-card">
            <h2 className="admin-section-title">Danh Sách Sản Phẩm</h2>
            {products.length === 0 ? (
              <p>Không có sản phẩm nào.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ảnh</th>
                      <th>Tên cây</th>
                      <th className="hidden md:table-cell">Tên khoa học</th>
                      <th>Giá</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onEdit={() => navigate(`/admin/edit-product/${product.id}`)}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addproducts' && (
          <div className="admin-section-card">
            <h2 className="admin-section-title">Thêm Sản Phẩm Mới</h2>
            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="ten_cay">Tên cây:</label>
                <input id="ten_cay" type="text" name="ten_cay" value={productForm.ten_cay} onChange={(e) => setProductForm({...productForm, ten_cay: e.target.value})} required className="admin-form-input" />
              </div>
              <div className="admin-form-group">
                <label htmlFor="ten_khoa_hoc">Tên khoa học:</label>
                <input id="ten_khoa_hoc" type="text" name="ten_khoa_hoc" value={productForm.ten_khoa_hoc} onChange={(e) => setProductForm({...productForm, ten_khoa_hoc: e.target.value})} className="admin-form-input" />
              </div>
              <div className="admin-form-group">
                <label htmlFor="dac_diem">Đặc điểm:</label>
                <textarea id="dac_diem" name="dac_diem" value={productForm.dac_diem} onChange={(e) => setProductForm({...productForm, dac_diem: e.target.value})} className="admin-form-textarea" rows="3"></textarea>
              </div>
              <div className="admin-form-group">
                <label htmlFor="y_nghia_phong_thuy">Ý nghĩa phong thủy:</label>
                <textarea id="y_nghia_phong_thuy" name="y_nghia_phong_thuy" value={productForm.y_nghia_phong_thuy} onChange={(e) => setProductForm({...productForm, y_nghia_phong_thuy: e.target.value})} className="admin-form-textarea" rows="3"></textarea>
              </div>
              <div className="admin-form-group">
                <label htmlFor="loi_ich">Lợi ích:</label>
                <textarea id="loi_ich" name="loi_ich" value={productForm.loi_ich} onChange={(e) => setProductForm({...productForm, loi_ich: e.target.value})} className="admin-form-textarea" rows="3"></textarea>
              </div>
              <div className="admin-form-group">
                <label htmlFor="gia">Giá (VNĐ):</label>
                <input id="gia" type="number" name="gia" value={productForm.gia} onChange={(e) => setProductForm({...productForm, gia: e.target.value})} required className="admin-form-input" />
              </div>
              <div className="admin-form-group">
                <label htmlFor="images">Ảnh sản phẩm (tối đa 5 ảnh, ảnh đầu tiên làm đại diện):</label>
                <input id="images" type="file" name="images" accept="image/*" multiple ref={fileInputRef} onChange={e => setImageFiles(e.target.files)} required className="admin-form-file-input" />
              </div>
              <button type="submit" className="admin-submit-button">
                Thêm Sản Phẩm
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;