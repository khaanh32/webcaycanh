// frontend/src/pages/ProductDetail.js


import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import {
    FaShoppingCart, FaPlus, FaMinus, FaStar, FaRegStar,
    FaSun, FaWater, FaLeaf, FaShareAlt, FaChevronLeft, FaChevronRight, FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api, { getProducts } from '../api';
import '../index.css';

// --- Component con cho Tab ---
const Tab = ({ label, isActive, onClick }) => (
    <button
        className={`product-detail-tab ${isActive ? 'active' : ''}`}
        onClick={onClick}
    >
        {label}
    </button>
);

// --- Component ProductCard cho Sản phẩm liên quan ---
const RelatedProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
        window.scrollTo(0, 0); // Scroll lên đầu trang khi chuyển sản phẩm
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ ...product, quantity: 1 });
        toast.success(`${product.ten_cay} đã được thêm vào giỏ hàng.`);
    };

    // Sử dụng lại class product-card-modern từ Home.js/Product.js nếu bạn muốn giao diện đồng nhất
    // Hoặc bạn có thể tạo class riêng và style trong CSS
    return (
        <div
            className="product-card-modern related-product-card"
            onClick={handleCardClick}
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
                    <button onClick={handleAddToCart} className="overlay-btn add-to-cart-btn" title="Thêm vào giỏ">
                        <FaShoppingCart />
                    </button>
                </div>
            </div>
            <div className="product-card-modern-content">
                <h3 className="product-card-modern-name">{product.ten_cay}</h3>
                <p className="product-card-modern-price">{Number(product.gia).toLocaleString()}đ</p>
            </div>
        </div>
    );
};


function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [isLoading, setIsLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const totalImages = 5; // Giả sử có tối đa 5 ảnh
    const imageNumbers = Array.from({ length: totalImages }, (_, i) => i + 1);

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            setIsLoading(true);
            try {
                // Ưu tiên scroll lên đầu trang
                window.scrollTo(0, 0);

                const productRes = await api.get(`/api/products/${id}`);
                setProduct(productRes.data);

                const allProductsRes = await getProducts();
                if (Array.isArray(allProductsRes.data)) {
                    const currentProduct = productRes.data;
                    const otherProducts = allProductsRes.data.filter(p => p.id !== currentProduct.id);
                    
                    // Logic ưu tiên sản phẩm cùng loại (nếu có trường category)
                    let filteredRelated = otherProducts;
                    if (currentProduct.loai_cay) { // Giả sử có trường `loai_cay`
                        const sameCategoryProducts = otherProducts.filter(p => p.loai_cay === currentProduct.loai_cay);
                        if (sameCategoryProducts.length >= 4) {
                            filteredRelated = sameCategoryProducts;
                        } else {
                            // Nếu không đủ, lấy thêm từ các sản phẩm khác
                            const remainingNeeded = 4 - sameCategoryProducts.length;
                            const differentCategoryProducts = otherProducts.filter(p => p.loai_cay !== currentProduct.loai_cay);
                            const shuffledDifferent = [...differentCategoryProducts].sort(() => 0.5 - Math.random());
                            filteredRelated = [...sameCategoryProducts, ...shuffledDifferent.slice(0, remainingNeeded)];
                        }
                    }
                    
                    const shuffled = [...filteredRelated].sort(() => 0.5 - Math.random());
                    setRelatedProducts(shuffled.slice(0, 4));
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Lỗi tải sản phẩm hoặc sản phẩm liên quan:", err);
                toast.error("Không tìm thấy sản phẩm!");
                navigate("/", { replace: true });
                setIsLoading(false);
            }
        };

        fetchProductAndRelated();
    }, [id, navigate]);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleDirectQuantityInput = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };
    
    const handleQuantityBlur = () => {
        if (quantity === '' || Number(quantity) < 1) {
            setQuantity(1);
        } else {
            setQuantity(Number(quantity)); // Đảm bảo quantity là số
        }
    };

    const handleAddToCart = () => {
        if (!product || Number(quantity) < 1) return;
        addToCart({ ...product, quantity: Number(quantity) });
        toast.success(`${product.ten_cay} (x${Number(quantity)}) đã được thêm vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        if (!product || Number(quantity) < 1) return;
        navigate("/payment", { state: { product, quantity: Number(quantity) } });
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const navigateImage = (direction) => {
        setSelectedImageIndex(prevIndex => {
            let newIndex = prevIndex + direction;
            if (newIndex < 0) newIndex = totalImages - 1;
            if (newIndex >= totalImages) newIndex = 0;
            // Kiểm tra xem ảnh mới có tồn tại không trước khi chuyển
            const testImageUrl = `${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_${imageNumbers[newIndex]}.jpg`;
            const img = new Image();
            img.src = testImageUrl;
            // (Logic kiểm tra ảnh nâng cao có thể phức tạp hơn, đây là ví dụ đơn giản)
            // Nếu bạn có cách chắc chắn hơn để biết số lượng ảnh thực tế, hãy dùng cách đó.
            return newIndex; 
        });
    };

    if (isLoading) {
        return <div className="product-detail-loading">Đang tải thông tin sản phẩm...</div>;
    }

    if (!product) {
        return <div className="product-detail-not-found">Không tìm thấy sản phẩm.</div>;
    }

    const currentImageNumber = imageNumbers[selectedImageIndex];
    const mainImageUrl = `${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_${currentImageNumber}.jpg`;

    // Giả sử bạn có thể trích xuất thông tin chăm sóc từ các trường hiện có
    // Hoặc bạn đã thêm các trường mới vào CSDL và API (ví dụ: product.care_light)
    const parseCareInfo = (text) => {
        if (!text) return { light: "Thông tin chưa cập nhật", water: "Thông tin chưa cập nhật", soil: "Thông tin chưa cập nhật" };
        // Ví dụ đơn giản, bạn có thể cần logic phức tạp hơn
        const lightMatch = text.match(/Ánh sáng: ([^.]+\.)/i);
        const waterMatch = text.match(/Tưới nước: ([^.]+\.)/i);
        const soilMatch = text.match(/Đất trồng: ([^.]+\.)/i);
        return {
            light: lightMatch ? lightMatch[1].trim() : "Xem chi tiết ở mô tả.",
            water: waterMatch ? waterMatch[1].trim() : "Xem chi tiết ở mô tả.",
            soil: soilMatch ? soilMatch[1].trim() : "Xem chi tiết ở mô tả."
        };
    };
    const careInfo = parseCareInfo(product.dac_diem || product.loi_ich);


    return (
        <div className='product-detail-page-container'>
            <div className="product-detail-breadcrumb">
                <Link to="/">Trang chủ</Link> <FaChevronRight size={10} />
                <Link to="/product">Sản phẩm</Link> <FaChevronRight size={10} />
                <span>{product.ten_cay}</span>
            </div>
            <div className="product-detail-layout">
                <div className="product-image-column">
                    <div className="main-image-container">
                        <img
                            src={mainImageUrl}
                            alt={`${product.ten_cay} - ảnh chính`}
                            className="main-product-image"
                            onError={(e) => e.target.src = "/images_tree/default.jpg"}
                        />
                        <button onClick={() => navigateImage(-1)} className="image-nav-btn prev-btn" aria-label="Ảnh trước"><FaChevronLeft /></button>
                        <button onClick={() => navigateImage(1)} className="image-nav-btn next-btn" aria-label="Ảnh kế tiếp"><FaChevronRight /></button>
                    </div>
                    <div className="thumbnail-gallery">
                        {imageNumbers.map((num, index) => {
                            const thumbnailUrl = `${process.env.PUBLIC_URL}/images_tree/${product.ten_cay}_${num}.jpg`;
                            // Logic ẩn thumbnail nếu ảnh không tồn tại có thể cần cải thiện
                            // ở đây chỉ đơn giản là render và dựa vào onError của thẻ img
                            return (
                                <img
                                    key={num}
                                    src={thumbnailUrl}
                                    alt={`${product.ten_cay} - thumbnail ${num}`}
                                    className={`thumbnail-image ${index === selectedImageIndex ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(index)}
                                    onError={(e) => e.currentTarget.style.display = 'none'} 
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="product-info-column">
                    <h1 className="product-name">{product.ten_cay}</h1>
                    
                    <div className="product-price-container">
                        <span className="current-price">{Number(product.gia).toLocaleString()}đ</span>
                    </div>
                    <p className="product-short-description">
                        {product.dac_diem && product.dac_diem.length > 180
                            ? `${product.dac_diem.substring(0, 180)}...`
                            : product.dac_diem || "Mang vẻ đẹp tự nhiên và sức sống cho không gian của bạn."
                        }
                    </p>
                    <div className="product-quantity-selector">
                        <label htmlFor="quantity" className="quantity-label">Số lượng:</label>
                        <div className="quantity-controls">
                            <button onClick={() => handleQuantityChange(-1)} className="quantity-btn" aria-label="Giảm số lượng"><FaMinus /></button>
                            <input
                                id="quantity"
                                type="number" // Sử dụng type="text" và pattern="[0-9]*" để kiểm soát tốt hơn trên một số trình duyệt
                                inputMode="numeric" // Gợi ý bàn phím số trên mobile
                                value={quantity}
                                onChange={handleDirectQuantityInput}
                                onBlur={handleQuantityBlur}
                                className="quantity-input"
                                min="1"
                            />
                            <button onClick={() => handleQuantityChange(1)} className="quantity-btn" aria-label="Tăng số lượng"><FaPlus /></button>
                        </div>
                    </div>
                    <div className="product-actions">
                        <button onClick={handleAddToCart} className="btn-add-to-cart">
                            <FaShoppingCart /> Thêm vào giỏ
                        </button>
                        <button onClick={handleBuyNow} className="btn-buy-now">
                            Mua ngay
                        </button>
                    </div>
                   
                    <div className="product-details-tabs-container">
                        <div className="tabs-nav">
                            <Tab label="Mô tả chi tiết" isActive={activeTab === 'description'} onClick={() => setActiveTab('description')} />
                            <Tab label="Hướng dẫn chăm sóc" isActive={activeTab === 'care'} onClick={() => setActiveTab('care')} />
                            <Tab label="Ý nghĩa phong thủy" isActive={activeTab === 'fengshui'} onClick={() => setActiveTab('fengshui')} />
                        </div>
                        <div className="tab-content">
                            {activeTab === 'description' && (
                                <div className="tab-pane">
                                    <h2>Mô tả chi tiết</h2>
                                    <p><strong>Tên khoa học:</strong> {product.ten_khoa_hoc || "Chưa cập nhật"}</p>
                                    <p><strong>Đặc điểm nổi bật:</strong><br />{product.dac_diem || "Thông tin đang được cập nhật."}</p>
                                    <p><strong>Lợi ích:</strong><br />{product.loi_ich || "Thông tin đang được cập nhật."}</p>
                                </div>
                            )}
                            {activeTab === 'care' && (
                                <div className="tab-pane">
                                    <h2>Hướng dẫn chăm sóc</h2>
                                    <p><FaSun className="care-icon" /> <strong>Ánh sáng:</strong> {careInfo.light}</p>
                                    <p><FaWater className="care-icon" /> <strong>Tưới nước:</strong> {careInfo.water}</p>
                                    <p><FaLeaf className="care-icon" /> <strong>Đất trồng:</strong> {careInfo.soil}</p>
                                    <p><em>Lưu ý: Đây là hướng dẫn chung. Tùy thuộc vào điều kiện cụ thể, bạn có thể cần điều chỉnh cho phù hợp.</em></p>
                                </div>
                            )}
                            {activeTab === 'fengshui' && (
                                <div className="tab-pane">
                                    <h2>Ý nghĩa phong thủy</h2>
                                    <p>{product.y_nghia_phong_thuy || "Thông tin đang được cập nhật."}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Có thể bạn cũng thích</h2>
                    <div className="product-grid-modern">
                        {relatedProducts.map(relatedProd => (
                            <RelatedProductCard key={relatedProd.id} product={relatedProd} />
                        ))}
                    </div>
                    
                </div>
            )} 
        </div>
    );
}

export default ProductDetail;