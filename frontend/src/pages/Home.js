// frontend/src/pages/Home.js
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { getProducts } from '../api';
import { toast } from 'react-toastify';
import '../index.css';

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaShoppingCart, FaArrowRight, FaLeaf, FaSeedling, FaStar, FaShieldAlt, FaShippingFast, FaHeadset } from 'react-icons/fa';
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchAndSetProducts = () => {
      setLoading(true);
      getProducts()
        .then(res => {
          const allProducts = res.data;
          if (!Array.isArray(allProducts)) {
            console.error("API did not return an array for products:", allProducts);
            toast.error("Lỗi định dạng dữ liệu sản phẩm!");
            setNewProducts([]);
            setFeaturedProducts([]);
            localStorage.removeItem("products");
            return;
          }
          localStorage.setItem("products", JSON.stringify(allProducts));
          
          const arrivals = allProducts.length > 8 ? allProducts.slice(-8).reverse() : [...allProducts].reverse();
          setNewProducts(arrivals);

          let potentialFeatured = allProducts.filter(p => !arrivals.find(np => np.id === p.id));
          if (potentialFeatured.length < 4 && allProducts.length > 0) { 
            potentialFeatured = [...allProducts];
          }
          const shuffled = [...potentialFeatured].sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
        })
        .catch(err => {
          toast.error("Lỗi tải sản phẩm!");
          setNewProducts([]);
          setFeaturedProducts([]);
        })
        .finally(() => setLoading(false));
    };

    const cachedProducts = localStorage.getItem("products");
    if (cachedProducts) {
      try {
        const allProducts = JSON.parse(cachedProducts);
        if (!Array.isArray(allProducts)) {
            throw new Error("Cached products is not an array");
        }
        const arrivals = allProducts.length > 8 ? allProducts.slice(-8).reverse() : [...allProducts].reverse();
        setNewProducts(arrivals);

        let potentialFeatured = allProducts.filter(p => !arrivals.find(np => np.id === p.id));
        if (potentialFeatured.length < 4 && allProducts.length > 0) { 
          potentialFeatured = [...allProducts];
        }
        const shuffled = [...potentialFeatured].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (e) {
        console.error("Error parsing cached products or processing them:", e);
        localStorage.removeItem("products");
        fetchAndSetProducts();
      }
    } else {
      fetchAndSetProducts();
    }
  }, []);

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.ten_cay} đã được thêm vào giỏ hàng`);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    navigate("/payment", { state: { product, quantity: 1 } });
  };

  const slideImages = [
    "/background/background_0.jpg",
    "/background/background_1.jpg",
    "/background/background_2.jpg",
  ];

  const categoryLinks = [
    { name: "Cây Trong Nhà", icon: <FaLeaf />, key: "trongnha", description: "Mang không gian xanh mát và không khí trong lành vào ngôi nhà của bạn." },
    { name: "Cây Để Bàn", icon: <FaSeedling />, key: "deban", description: "Những chậu cây nhỏ xinh, tạo điểm nhấn cho góc làm việc và học tập." },
    { name: "Cây Phong Thủy", icon: <FaStar />, key: "phongthuy", description: "Thu hút may mắn, tài lộc và vượng khí cho gia chủ." },
  ];

  return (
    <div className="home-page-container">
      <section className="hero-section-modern">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.hero-swiper-pagination' }}
          navigation={{
            nextEl: '.hero-swiper-button-next',
            prevEl: '.hero-swiper-button-prev',
          }}
          className="hero-swiper"
        >
          {slideImages.map((src, index) => (
            <SwiperSlide key={index} className="hero-slide" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${src})` }}>
              <div className="hero-slide-content">
                <h2 className="hero-title">Không Gian Xanh, Cuộc Sống An Lành</h2>
                <p className="hero-subtitle">Mang thiên nhiên vào tổ ấm với những loại cây cảnh độc đáo và dễ chăm sóc.</p>
                <Link to="/product" className="btn btn-primary-modern hero-cta-modern">
                  Khám Phá Ngay <FaArrowRight style={{ marginLeft: '10px' }} />
                </Link>
              </div>
            </SwiperSlide>
          ))}
          <div className="hero-swiper-controls">
            <div className="hero-swiper-button-prev"><FaArrowRight style={{transform: 'rotate(180deg)'}} /></div>
            <div className="hero-swiper-pagination"></div>
            <div className="hero-swiper-button-next"><FaArrowRight /></div>
          </div>
        </Swiper>
      </section>

      <section className="service-highlights-section">
        <div className="service-highlight-item">
          <FaShippingFast className="service-icon" />
          <div>
            <h4>Giao Hàng Nhanh</h4>
            <p>Vận chuyển an toàn, đảm bảo cây luôn tươi tốt khi đến tay bạn.</p>
          </div>
        </div>
        <div className="service-highlight-item">
          <FaShieldAlt className="service-icon" />
          <div>
            <h4>Chất Lượng Đảm Bảo</h4>
            <p>Cây được tuyển chọn kỹ lưỡng, khỏe mạnh và sẵn sàng làm đẹp không gian.</p>
          </div>
        </div>
        <div className="service-highlight-item">
          <FaHeadset className="service-icon" />
          <div>
            <h4>Hỗ Trợ Tận Tâm</h4>
            <p>Đội ngũ tư vấn viên sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
          </div>
        </div>
      </section>
      
      <section className="featured-categories-modern">
        <h2 className="section-title-modern">Danh Mục Nổi Bật</h2>
        <div className="categories-grid-modern">
          {categoryLinks.map(cat => (
            <Link to={`/product?category=${cat.key}`} key={cat.name} className="category-card-modern">
              <div className="category-card-modern-icon-wrapper">
                {cat.icon}
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <span className="category-card-modern-link">
                Xem Thêm <FaArrowRight style={{ marginLeft: '5px', fontSize: '0.8em' }}/>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section-modern">
        <h2 className="section-title-modern">Sản Phẩm Mới Về</h2>
        {loading ? <p className="loading-text-modern">Đang tải sản phẩm...</p> : (
          newProducts.length > 0 ? (
            <div className="product-grid-modern">
              {newProducts.map(product => (
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
                      <button onClick={(e) => handleAddToCart(product, e)} className="overlay-btn add-to-cart-btn" title="Thêm vào giỏ">
                        <FaShoppingCart />
                      </button>
                       <button onClick={(e) => handleBuyNow(product, e)} className="overlay-btn buy-now-btn-alt" title="Mua ngay">
                        Mua Ngay
                      </button>
                    </div>
                  </div>
                  <div className="product-card-modern-content">
                    <h3 className="product-card-modern-name">{product.ten_cay}</h3>
                    <p className="product-card-modern-price">{Number(product.gia).toLocaleString()}đ</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="no-products-text-modern">Chưa có sản phẩm mới.</p>
        )}
        <div className="view-all-modern">
          <Link to="/product" className="btn btn-secondary-modern">
            Xem Tất Cả Sản Phẩm <FaArrowRight style={{ marginLeft: '8px' }}/>
          </Link>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="products-section-modern featured-products-section-modern">
          <h2 className="section-title-modern">Có Thể Bạn Sẽ Thích</h2>
           {loading ? <p className="loading-text-modern">Đang tải...</p> : (
            <div className="product-grid-modern">
              {featuredProducts.map(product => (
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
                      onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/images_tree/default.jpg`; }}
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
           )}
        </section>
      )}
    </div>
  );
}

export default Home;