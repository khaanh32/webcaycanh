// frontend/src/pages/Product.js
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts } from '../api';
import { toast } from 'react-toastify';
import '../index.css';

import { FaShoppingCart, FaSearch, FaTimes } from 'react-icons/fa';

// Định nghĩa các danh mục và từ khóa liên quan
const CATEGORY_DEFINITIONS = {
  all: { name: 'Tất Cả', keywords: [] },
  trongnha: { 
    name: 'Cây Trong Nhà', 
    keywords: ["lọc không khí", "nội thất", "trong nhà", "văn phòng", "ít nắng", "bóng râm", "thanh lọc", "hút bụi", "hấp thụ chất độc", "cải thiện không khí", "trong nha", "trong phong", "trong phong khach"] 
  },
  deban: { 
    name: 'Cây Để Bàn', 
    keywords: ["để bàn", "de ban", "nhỏ gọn", "mini", "kệ sách", "bàn làm việc", "trang trí bàn", "van phong", "văn phòng"] 
  },
  phongthuy: { 
    name: 'Cây Phong Thủy', 
    keywords: ["phong thủy", "phong thuy", "may mắn", "may man", "tài lộc", "tai loc", "thịnh vượng", "thinh vuong", "bình an", "binh an", "trường thọ", "truong tho", "xua đuổi tà khí", "hóa giải", "vượng khí", "phú quý", "chien thang", "vinh quang", "quyen luc"] 
  },
  // Bạn có thể thêm các category khác ở đây với từ khóa tương ứng
  // sanvuon: { name: 'Cây Sân Vườn', keywords: ["sân vườn", "ngoài trời", "ban công"] }
};

function Product() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [activeCategoryKey, setActiveCategoryKey] = useState('all'); // Sử dụng key của category

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);

  // Lấy danh sách các category để hiển thị nút
  const displayCategories = Object.keys(CATEGORY_DEFINITIONS).map(key => ({
    key: key,
    name: CATEGORY_DEFINITIONS[key].name
  }));

  useEffect(() => {
    const fetchAndSetProducts = () => {
      setLoading(true);
      getProducts()
        .then(res => {
          if (!Array.isArray(res.data)) {
            console.error("API did not return an array for products:", res.data);
            toast.error("Lỗi định dạng dữ liệu sản phẩm!");
            setAllProducts([]);
            localStorage.removeItem("products");
            return;
          }
          setAllProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
        })
        .catch(err => {
          toast.error("Lỗi tải sản phẩm!");
          setAllProducts([]);
        })
        .finally(() => setLoading(false));
    };

    const cachedProducts = localStorage.getItem("products");
    if (cachedProducts) {
      try {
        const parsedProducts = JSON.parse(cachedProducts);
         if (!Array.isArray(parsedProducts)) {
            throw new Error("Cached products is not an array");
        }
        setAllProducts(parsedProducts);
        setLoading(false);
      } catch (e) {
        console.error("Error parsing cached products:", e);
        localStorage.removeItem("products");
        fetchAndSetProducts();
      }
    } else {
      fetchAndSetProducts();
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromQuery = queryParams.get('category'); // Đây là key, ví dụ: "trongnha"
    if (categoryFromQuery && CATEGORY_DEFINITIONS[categoryFromQuery]) {
      setActiveCategoryKey(categoryFromQuery);
    } else {
      setActiveCategoryKey('all');
    }
  }, [location.search]);

  useEffect(() => {
    let currentProducts = [...allProducts];
    const categoryKeywords = CATEGORY_DEFINITIONS[activeCategoryKey]?.keywords || [];

    if (activeCategoryKey && activeCategoryKey !== 'all' && categoryKeywords.length > 0) {
      currentProducts = currentProducts.filter(product => {
        const productText = `${product.ten_cay} ${product.dac_diem || ''} ${product.y_nghia_phong_thuy || ''} ${product.loi_ich || ''}`.toLowerCase();
        return categoryKeywords.some(keyword => productText.includes(keyword.toLowerCase()));
      });
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(product =>
        product.ten_cay.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (sortCriteria === 'price-asc') {
      currentProducts.sort((a, b) => a.gia - b.gia);
    } else if (sortCriteria === 'price-desc') {
      currentProducts.sort((a, b) => b.gia - a.gia);
    } else if (sortCriteria === 'name-asc') {
      currentProducts.sort((a, b) => a.ten_cay.localeCompare(b.ten_cay));
    } else if (sortCriteria === 'name-desc') {
      currentProducts.sort((a, b) => b.ten_cay.localeCompare(a.ten_cay));
    }

    setFilteredProducts(currentProducts);
  }, [allProducts, searchTerm, sortCriteria, activeCategoryKey]);

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.ten_cay} đã được thêm vào giỏ hàng.`);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    navigate("/payment", { state: { product, quantity: 1 } });
  };
  
  const handleCategoryChange = (categoryKey) => {
    setActiveCategoryKey(categoryKey); // Cập nhật state
    if (categoryKey === 'all') {
      navigate("/product");
    } else {
      navigate(`/product?category=${categoryKey}`);
    }
  };

  return (
    <div className="product-listing-page-container">
     

      <div className="controls-bar-modern">
        <div className="search-container-modern">
          <FaSearch className="search-icon-modern" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên cây..."
            className="search-input-modern"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="clear-search-btn-modern">
              <FaTimes />
            </button>
          )}
        </div>
        <div className="filter-sort-container-modern">
          <div className="category-filter-modern">
            <span>Danh mục:</span>
            <div className="category-buttons-modern">
              {displayCategories.map(cat => (
                <button
                  key={cat.key}
                  className={`category-btn-modern ${activeCategoryKey === cat.key ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.key)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="sort-select-modern"
          >
            <option value="">Sắp xếp theo</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading-text-modern">Đang tải danh sách sản phẩm...</p>
      ) : (
        filteredProducts.length > 0 ? (
          <div className="product-grid-modern">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="product-card-modern"
                onClick={() => handleCardClick(product)}
              >
                <div className="product-card-modern-image-container">
                  <img
                    src={`${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_1.jpg`}
                    alt={product.ten_cay}
                    className="product-card-modern-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.PUBLIC_URL}/images_tree/default.jpg`;
                    }}
                  />
                  <div className="product-card-modern-overlay">
    {/* Bọc hai nút bằng div mới */}
    <div className="overlay-buttons-group"> 
        <button onClick={(e) => handleAddToCart(product, e)} className="overlay-btn add-to-cart-btn" title="Thêm vào giỏ">
            <FaShoppingCart />
        </button>
        <button onClick={(e) => handleBuyNow(product, e)} className="overlay-btn buy-now-btn-alt" title="Mua ngay">
            Mua Ngay
        </button>
    </div>
</div>
                </div>
                <div className="product-card-modern-content">
                  <h3 className="product-card-modern-name">{product.ten_cay}</h3>
                  <p className="product-card-modern-price">{Number(product.gia).toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-products-text-modern">
            Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.
          </p>
        )
      )}
    </div>
  );
}

export default Product;