# Hướng dẫn thêm vào repo eds-demo

## 1. Copy file vào repo

| File trong zip | Hành động |
|---|---|
| `styles/styles.css` | **Thay thế** file cũ |
| `blocks/header/header.js`, `header.css` | **Thay thế** file cũ |
| `blocks/footer/footer.js`, `footer.css` | **Thay thế** file cũ |
| `blocks/carousel/*` | **Tạo mới** |
| `blocks/category-tiles/*` | **Tạo mới** |
| `blocks/product-carousel/*` | **Tạo mới** |
| `blocks/promo-banner/*` | **Tạo mới** |
| `blocks/tabs/*` | **Tạo mới** |

Không cần sửa `scripts/aem.js`, `blocks/fragment/fragment.js`, `styles/fonts.css`, `head.html`.

## 2. scripts/scripts.js: chỉ sửa 1 dòng (tùy chọn)

Trong hàm `loadEager`, đổi ngôn ngữ trang:

```js
document.documentElement.lang = 'vi';   // boilerplate để 'en'
```

Boilerplate đã tự xử lý: nút (`**[link]**` = nút đỏ, `_[link]_` = nút viền), block, section metadata,
lazy-load. Chưa cần thêm logic nào khác vào scripts.js.

Nếu bạn đã sửa `scripts.js` trước đó và có đoạn `buildHeroBlock`, hãy xóa lời gọi nó trong
`buildAutoBlocks` để hero không bị tự chèn khi trang có carousel.

## 3. Dựng nội dung trong document

Mỗi block là một bảng, ô đầu tiên của bảng là tên block (không phân biệt hoa thường).

### /nav  (3 section, cách nhau bằng ---)

```
Section 1: ảnh logo (có link về /)
---
Section 2: danh sách 3 cấp
 - TV & Âm thanh            <- link, cấp 1 (BẮT BUỘC là link)
   - Tivi                   <- link, cấp 2 = tiêu đề cột
     - OLED
     - QNED
     - 4K UHD
   - Loa & Soundbar
     - Soundbar
 - Tủ lạnh                  <- link
   - ...
---
Section 3: danh sách link công cụ
 - Tìm kiếm
 - Giỏ hàng
 - Đăng nhập
```

### /footer  (2 section)

```
Section 1: danh sách 2 cấp
 - Sản phẩm                 <- chữ thường, làm tiêu đề cột
   - Tivi
   - Tủ lạnh
 - Hỗ trợ
   - Bảo hành
   - Liên hệ
---
Section 2: icon mạng xã hội (danh sách ảnh có link) + đoạn bản quyền
```

### Trang chủ

Block Carousel (mỗi dòng = 1 slide: ảnh | chữ):

| Carousel | |
|---|---|
| (ảnh 1) | ## Tiêu đề 1 <br> Mô tả ngắn <br> **[Mua ngay](/tivi)** |
| (ảnh 2) | ## Tiêu đề 2 <br> **[Khám phá](/tu-lanh)** |

Block Category Tiles (mỗi dòng = 1 ô: ảnh | tên có link):

| Category Tiles | |
|---|---|
| (icon tivi) | [Tivi](/tivi) |
| (icon tủ lạnh) | [Tủ lạnh](/tu-lanh) |

Block Product Carousel (mỗi dòng = 1 thẻ: ảnh | nội dung; đoạn đầu là tên sản phẩm):

| Product Carousel | |
|---|---|
| (ảnh sp) | Tivi OLED 55 inch <br> Giá từ 25.990.000đ <br> [Xem chi tiết](/tivi/oled55) |

Block Promo Banner (1 dòng = banner rộng, 2-3 dòng = lưới; thêm `Promo Banner (dark)` nếu ảnh nền tối):

| Promo Banner | |
|---|---|
| (ảnh nền) | ### Ưu đãi tháng 11 <br> _[Xem ưu đãi](/uu-dai)_ |

Block Tabs (mỗi dòng = 1 tab: tên tab | nội dung, có thể chứa block khác dạng text/link):

| Tabs | |
|---|---|
| Nổi bật | nội dung... |
| Mới ra mắt | nội dung... |

### Section Metadata (bảng cuối section)

| Section Metadata | |
|---|---|
| Style | light |

Giá trị Style: `light` (nền xám nhạt), `dark` (nền tối), `full-width` (bỏ giới hạn chiều rộng).

## 4. Kiểm tra

```bash
npm run lint
aem up
```

Hero carousel nên là block đầu tiên trong section đầu tiên của trang chủ để ảnh đầu được load eager (tốt cho LCP).
