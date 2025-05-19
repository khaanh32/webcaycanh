--
-- Database: `webcaycanh`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `id` int(11) NOT NULL,
  `ten_cay` varchar(255) NOT NULL,
  `ten_khoa_hoc` varchar(255) DEFAULT NULL,
  `dac_diem` text DEFAULT NULL,
  `y_nghia_phong_thuy` text DEFAULT NULL,
  `loi_ich` text DEFAULT NULL,
  `gia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`id`, `ten_cay`, `ten_khoa_hoc`, `dac_diem`, `y_nghia_phong_thuy`, `loi_ich`, `gia`) VALUES
(1, 'Cây Bạch Mã Hoàng Tử', 'Aglaonema hybrid', 'Lá xanh viền trắng, thân dày, mọng nước.', 'Tượng trưng cho sự mạnh mẽ, thăng tiến.', 'Lọc không khí, làm đẹp không gian.', 150000),
(2, 'Cây Bàng Singapore', 'Ficus lyrata', 'Cây thân gỗ, lá lớn, xanh đậm, mọc thẳng', 'Tượng trưng cho sự chính trực, may mắn', 'Trang trí nội thất, lọc không khí', 150000),
(3, 'Cây Bướm Đêm', 'Oxalis triangularis', 'Lá hình cánh bướm, màu tím đẹp mắt.', 'Mang lại sự huyền bí, may mắn.', 'Trang trí nội thất, tạo điểm nhấn.', 100000),
(4, 'Cây Cau Tiểu Trâm', 'Chamaedorea elegans', 'Thân nhỏ, lá xanh dạng cọ.', 'Hóa giải phong thủy xấu, mang bình an.', 'Lọc không khí, giảm ô nhiễm.', 100000),
(5, 'Cây Cẩm Tú Mai', 'Cuphea hyssopifolia', 'Cây bụi nhỏ, hoa tím hoặc hồng.', 'Tượng trưng cho sự dịu dàng, may mắn.', 'Trang trí sân vườn, lối đi.', 50000),
(6, 'Cây Cọ Nhật', 'Livistona chinensis', 'Lá xanh, xòe rộng như quạt.', 'Tạo thế vững chắc, mang lại sự giàu sang.', 'Hút bụi, làm sạch không khí.', 500000),
(7, 'Cây Dây Nhện', 'Chlorophytum comosum', 'Lá dài, cong, màu xanh viền trắng.', 'Hút tài lộc, xua đuổi tà khí.', 'Hấp thụ chất độc hại, tạo không gian xanh.', 50000),
(8, 'Cây Dương Xỉ', 'Nephrolepis exaltata', 'Cây thân thảo, lá kép, xanh tươi, mọc bụi', 'Mang năng lượng tích cực, xua đuổi tà khí', 'Cải thiện không khí, tăng độ ẩm', 50000),
(9, 'Cây Đa Búp', 'Ficus elastica', 'Lá xanh bóng, búp đỏ, thân gỗ.', 'Biểu tượng cho sự vững chắc, trường thọ.', 'Lọc không khí, hút bụi.', 200000),
(10, 'Cây Đa Lộc', 'Ficus microcarpa', 'Thân gỗ, lá nhỏ xanh bóng.', 'Mang lại sự vững bền, thịnh vượng.', 'Làm cây bonsai, trang trí nội thất.', 300000),
(11, 'Cây Đại Đế Đỏ', 'Philodendron Imperial Red', 'Cây thân thảo, lá lớn màu đỏ tía, bóng mượt, chiều cao trung bình từ 30-50 cm.', 'Tượng trưng cho quyền lực, mang lại may mắn và tài lộc cho gia chủ.', 'Trang trí nội thất, cải thiện chất lượng không khí.', 150000),
(12, 'Cây Đại Đế Xanh', 'Philodendron Imperial Green', 'Lá màu xanh đậm, hình bầu dục, thân mập mạp, chiều cao trung bình từ 40-60 cm.', 'Biểu tượng của sự thịnh vượng và phát triển bền vững.', 'Trang trí không gian sống, lọc không khí.', 200000),
(13, 'Cây Đế Vương Kim Cương', 'Philodendron Birkin', 'Lá màu xanh đậm với các đường vân trắng nổi bật, hình dáng độc đáo, chiều cao khoảng 25-40 cm.', 'Mang lại sự sang trọng, thu hút tài lộc và may mắn.', 'Trang trí bàn làm việc, không gian nội thất.', 250000),
(14, 'Cây Đuôi Công Tím', 'Calathea roseopicta', 'Lá xanh đậm viền tím, mặt dưới màu tím', 'Biểu tượng giàu có, huyền bí, may mắn', 'Trang trí, thanh lọc không khí', 120000),
(15, 'Cây Đuôi Công Xương Cá', 'Chưa xác định', 'Lá bầu dục, gân nổi giống xương cá, xanh/tím', 'Thu hút tài lộc, may mắn', 'Trang trí, lọc không khí', 100000),
(16, 'Cây Hạc Cam', 'Strelitzia reginae', 'Hoa giống chim hạc, màu cam, xanh lam', 'Tự do, cao quý, thịnh vượng, phú quý', 'Trang trí sân vườn, cắm hoa nghệ thuật', 200000),
(17, 'Cây Hạnh Phúc', 'Radermachera sinica', 'Thân gỗ, tán lá xum xuê.', 'Đem đến niềm vui, hạnh phúc.', 'Làm cây cảnh nội thất, lọc không khí.', 500000),
(18, 'Cây Hồng Môn', 'Anthurium andraeanum', 'Lá xanh, hoa đỏ hình trái tim.', 'Mang lại tình yêu, hạnh phúc.', 'Trang trí nội thất, thanh lọc không khí.', 150000),
(19, 'Cây Hương Thảo', 'Rosmarinus officinalis', 'Lá nhỏ dài, có mùi thơm đặc trưng.', 'Tượng trưng cho sự trung thành, nhớ nhung.', 'Làm gia vị, tinh dầu giúp thư giãn.', 100000),
(20, 'Cây Kim Ngân', 'Pachira aquatica', 'Thân dẻo dai, lá xanh mướt, thích hợp làm cây nội thất.', 'Tượng trưng cho tài lộc, may mắn.', 'Thanh lọc không khí, trang trí nhà cửa.', 200000),
(21, 'Cây Kim Tiền', 'Zamioculcas zamiifolia', 'Lá xanh bóng, thân mọng nước, dễ sống.', 'Tượng trưng cho tài lộc, phú quý.', 'Thanh lọc không khí, hút bụi.', 300000),
(22, 'Cây Lan Quân Tử', 'Clivia miniata', 'Lá bản to, hoa cam đỏ rực rỡ.', 'Thể hiện sự quý phái, vương giả.', 'Trang trí nhà cửa, may mắn trong công việc.', 500000),
(23, 'Cây Lan Ý', 'Spathiphyllum wallisii', 'Lá xanh, hoa trắng tinh khôi.', 'Mang lại bình an, xua đuổi xui xẻo.', 'Hấp thụ khí độc, trang trí.', 100000),
(24, 'Cây Lưỡi Hổ', 'Sansevieria trifasciata', 'Lá dài, cứng, xanh viền vàng.', 'Xua đuổi tà khí, mang lại may mắn.', 'Lọc không khí, hấp thụ CO2 ban đêm.', 100000),
(25, 'Cây May Mắn', 'Fittonia albivenis', 'Lá nhỏ, nhiều màu sắc độc đáo.', 'Tượng trưng cho sự tinh tế, nhẹ nhàng.', 'Trang trí bàn làm việc, dễ chăm sóc.', 50000),
(26, 'Cây Ngọc Ngân', 'Dieffenbachia picta', 'Lá xanh đốm trắng, thân mềm, dễ trồng.', 'Mang lại sự bình an, tài lộc.', 'Thanh lọc không khí, trang trí.', 100000),
(27, 'Cây Ngũ Gia Bì', 'Schefflera heptaphylla', 'Lá mọc thành chùm, xanh bóng.', 'Hóa giải phong thủy xấu, thu hút tài lộc.', 'Đuổi muỗi, thanh lọc không khí.', 200000),
(28, 'Cây Nguyệt Quế', 'Murraya paniculata', 'Thân gỗ nhỏ, lá xanh bóng.', 'Tượng trưng cho chiến thắng, vinh quang.', 'Làm cảnh, tạo hương thơm.', 200000),
(29, 'Cây Nhất Mạt Hương', 'Plectranthus hadiensis', 'Lá nhỏ, có mùi thơm nhẹ.', 'Mang lại may mắn, tài lộc.', 'Trang trí nội thất, thư giãn tinh thần.', 50000),
(30, 'Cây Oải Hương', 'Lavandula angustifolia', 'Lá xanh xám, hoa tím có hương thơm.', 'Tượng trưng cho sự bình yên, may mắn.', 'Tinh dầu thư giãn, hoa khô tạo mùi thơm.', 150000),
(31, 'Cây Ổ Rồng', 'Asplenium nidus', 'Lá đơn to, xanh bóng, mọc thành hình hoa thị', 'Bảo vệ, bình an, may mắn cho gia đình', 'Trang trí nội thất, tạo không gian xanh', 100000),
(32, 'Cây Phát Lộc', 'Dracaena sanderiana', 'Thân xanh, có thể uốn theo dáng.', 'Mang lại tài lộc, thịnh vượng.', 'Trang trí bàn làm việc, thanh lọc không khí.', 100000),
(33, 'Cây Phát Tài', 'Dracaena fragrans', 'Thân gỗ, lá xanh bóng, mọc theo chùm.', 'Tượng trưng cho tài lộc, may mắn.', 'Trang trí nội thất, lọc không khí.', 200000),
(34, 'Cây Phú Quý', 'Aglaonema Red', 'Lá xanh pha đỏ hồng, dễ chăm sóc.', 'Mang lại phú quý, tài lộc.', 'Làm sạch không khí, tạo không gian xanh.', 150000),
(35, 'Cây Sen Đá Kim Cương', 'Haworthia cooperi', 'Lá mọng nước, trong suốt như kim cương, xếp thành hình hoa thị, kích thước nhỏ gọn.', 'Thu hút tài lộc, may mắn, thành công và sự bình an cho gia chủ.', 'Trang trí bàn làm việc, kệ sách, không gian nhỏ.', 50000),
(36, 'Cây Sen Đá Mix', 'Echeveria spp.', 'Gồm nhiều loại sen đá khác nhau, đa dạng về màu sắc và hình dáng, lá mọng nước, xếp thành hình hoa thị.', 'Biểu tượng của sự kiên trì, tình yêu vĩnh cửu và sự trường tồn.', 'Trang trí không gian sống, quà tặng ý nghĩa.', 30000),
(37, 'Cây Sống Đời', 'Kalanchoe pinnata', 'Lá dày, hoa nhỏ nhiều màu.', 'Tượng trưng cho sự trường thọ, sức khỏe.', 'Trang trí ban công, dễ chăm sóc.', 50000),
(38, 'Cây Tùng La Hán', 'Podocarpus macrophyllus', 'Thân gỗ, lá kim xanh đậm.', 'Mang lại sự bình an, may mắn.', 'Trang trí sân vườn, bonsai phong thủy.', 1000000),
(39, 'Cây Tuyết Tùng', 'Cupressus macrocarpa', 'Cây thân gỗ nhỏ, cao 40-60 cm, lá kim màu xanh nõn chuối, tán hình tháp, tỏa hương thơm dễ chịu.', 'Tượng trưng cho sự trường thọ, bền bỉ; mang lại may mắn, tài lộc; giúp trừ tà, xua điềm xấu.', 'Trang trí nội thất, sân vườn; hương thơm giúp xua đuổi côn trùng; tạo không gian xanh mát.', 100000),
(40, 'Cây Thiết Mộc Lan', 'Dracaena fragrans', 'Thân gỗ, lá dài xanh viền vàng.', 'Mang lại tài lộc, sức khỏe.', 'Thanh lọc không khí, trang trí nội thất.', 300000),
(41, 'Cây Thường Xuân', 'Hedera helix', 'Cây leo, lá hình tim hoặc sao.', 'Tượng trưng cho sự phát triển, tình bạn.', 'Thanh lọc không khí, trang trí nội thất.', 100000),
(42, 'Cây Trầu Bà Thanh Xuân', 'Epipremnum aureum', 'Màu xanh tươi sáng, thân leo, dễ trồng và chăm sóc.', 'Mang lại sự tươi mới, năng lượng tích cực và may mắn.', 'Trang trí nhà cửa, văn phòng, lọc không khí.', 100000),
(43, 'Cây Trúc Mây', 'Rhapis excelsa', 'Lá dạng quạt, thân cứng cáp.', 'Hút tài lộc, mang lại may mắn.', 'Lọc không khí, làm cảnh sân vườn.', 300000),
(44, 'Cây Vạn Lộc', 'Aglaonema sp.', 'Lá màu đỏ hồng, xanh pha đốm.', 'Tượng trưng cho may mắn, phúc lộc.', 'Làm sạch không khí, trang trí.', 150000),
(45, 'Cây Vạn Niên Thanh', 'Aglaonema', 'Lá xanh bóng, viền trắng đẹp mắt.', 'Mang lại tài lộc, may mắn.', 'Thanh lọc không khí, hút chất độc.', 150000),
(46, 'Cây Xương Rồng Tròn', 'Echinocactus grusonii', 'Thân hình cầu, màu xanh lục, có gai vàng bao phủ, hoa màu vàng nhạt, kích thước đa dạng.', 'Mang lại sự bảo vệ, may mắn và tài lộc cho gia chủ.', 'Trang trí nội thất, sân vườn, quà tặng.', 60000),
(47, 'Cây Xương Rồng Trứng', 'Mammillaria elongata', 'Thân hình trụ nhỏ, mọc thành cụm, có gai mềm bao phủ, hoa nhỏ màu trắng hoặc vàng nhạt.', 'Tượng trưng cho sự kiên cường, bảo vệ và may mắn trong tình yêu.', 'Trang trí bàn làm việc, không gian sống, quà tặng.', 40000),
(48, 'Trầu Bà Cẩm Thạch', 'Epipremnum aureum Marble Queen', 'Lá màu xanh pha trắng hoặc vàng nhạt, hình trái tim, thân leo, dễ chăm sóc.', 'Tượng trưng cho sự tinh khiết, may mắn và tài lộc.', 'Trang trí không gian sống, lọc không khí.', 150000),
(49, 'Trầu Bà Lá Lỗ', 'Monstera adansonii', 'Lá hình bầu dục với các lỗ nhỏ tự nhiên, thân leo, chiều cao trung bình 30-60 cm.', 'Biểu tượng của sự độc đáo, sáng tạo và thịnh vượng.', 'Trang trí nội thất, tạo điểm nhấn cho không gian sống.', 200000),
(50, 'Trầu Bà Lá Xẻ', 'Monstera deliciosa', 'Lá lớn, xanh đậm, có các đường xẻ sâu đặc trưng, thân leo, có thể đạt chiều cao 1-2 m.', 'Tượng trưng cho sự sinh sôi, phát triển và thịnh vượng.', 'Trang trí nội thất, cải thiện không gian sống, lọc không khí.', 300000);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `idGoogle` varchar(255) DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `idGoogle`, `displayName`, `email`, `phone`, `address`, `role`) VALUES
(1, '106382714558837047371', 'Nhân Võ', 'votrinhan.project@gmail.com', '0987123456', 'Hồ Chí Minh', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `idGoogle` (`idGoogle`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `data` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`idGoogle`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `data` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_status`
--
ALTER TABLE `order_status`
  ADD CONSTRAINT `order_status_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `data` (`id`) ON DELETE CASCADE;
COMMIT;