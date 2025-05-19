import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css';
import { FiSave, FiXCircle, FiArrowLeft } from 'react-icons/fi';

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [formState, setFormState] = useState({
    ten_khoa_hoc: '', dac_diem: '', y_nghia_phong_thuy: '', loi_ich: '', gia: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      toast.error("Không có quyền truy cập.");
      navigate('/login', {replace: true});
      return;
    }

    api.get(`/api/products/${id}`)
      .then(res => {
        const productData = res.data;
        setProduct(productData);
        setFormState({
          ten_khoa_hoc: productData.ten_khoa_hoc || '',
          dac_diem: productData.dac_diem || '',
          y_nghia_phong_thuy: productData.y_nghia_phong_thuy || '',
          loi_ich: productData.loi_ich || '',
          gia: productData.gia || '',
        });
        setIsLoading(false);
      })
      .catch(err => {
        toast.error("Lỗi tải sản phẩm!");
        setIsLoading(false);
        navigate('/admin?tab=products', {replace: true});
      });
  }, [id, user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const dataToUpdate = { ...product, ...formState };

    api.put(`/api/admin/products/${id}`, dataToUpdate)
      .then(() => {
        toast.success("Cập nhật sản phẩm thành công!");
        api.get('/api/products')
          .then(res => localStorage.setItem("products", JSON.stringify(res.data)))
          .catch(err => console.error("Lỗi cập nhật cache sản phẩm:", err));
        navigate('/admin?tab=products', {replace: true});
      })
      .catch(err => {
        toast.error("Lỗi cập nhật sản phẩm!");
      })
      .finally(() => setIsUpdating(false));
  };

  if (authLoading || isLoading) return <div className="admin-loading-screen">Đang tải...</div>;
  if (!product) return <div className="admin-loading-screen">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="admin-edit-product-wrapper">
      <div className="admin-edit-product-page">
        <div className="admin-edit-product-header">
          <Link to="/admin?tab=products" className="admin-back-button">
            <FiArrowLeft className="mr-2" /> Quay lại danh sách
          </Link>
          <h1 className="admin-page-title">Chỉnh Sửa Sản Phẩm</h1>
        </div>

        <div className="admin-form-card">
          <div className="admin-product-info-display">
            <img
              src={`${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_1.jpg`}
              alt={product.ten_cay}
              className="admin-edit-product-image"
              onError={(e) => {e.target.onerror = null; e.target.src="/images_tree/default.jpg"}}
            />
            <h2 className="admin-edit-product-name">{product.ten_cay}</h2>
            <p className="admin-edit-product-id">ID: {product.id}</p>
          </div>

          <form onSubmit={handleUpdate} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="ten_khoa_hoc">Tên khoa học:</label>
                <input id="ten_khoa_hoc" type="text" name="ten_khoa_hoc" value={formState.ten_khoa_hoc} onChange={handleChange} className="admin-form-input" />
              </div>
              <div className="admin-form-group">
                <label htmlFor="gia">Giá (VNĐ):</label>
                <input id="gia" type="number" name="gia" value={formState.gia} onChange={handleChange} required className="admin-form-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="dac_diem">Đặc điểm:</label>
              <textarea id="dac_diem" name="dac_diem" value={formState.dac_diem} onChange={handleChange} className="admin-form-textarea" rows="4"></textarea>
            </div>
            <div className="admin-form-group">
              <label htmlFor="y_nghia_phong_thuy">Ý nghĩa phong thủy:</label>
              <textarea id="y_nghia_phong_thuy" name="y_nghia_phong_thuy" value={formState.y_nghia_phong_thuy} onChange={handleChange} className="admin-form-textarea" rows="4"></textarea>
            </div>
            <div className="admin-form-group">
              <label htmlFor="loi_ich">Lợi ích:</label>
              <textarea id="loi_ich" name="loi_ich" value={formState.loi_ich} onChange={handleChange} className="admin-form-textarea" rows="4"></textarea>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin?tab=products')}
                className="admin-action-btn cancel-btn"
              >
                <FiXCircle className="mr-2" /> Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="admin-submit-button"
              >
                <FiSave className="mr-2" /> {isUpdating ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminEditProduct;