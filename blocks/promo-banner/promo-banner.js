import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Banner khuyến mãi. Mỗi dòng = 1 banner: [ảnh nền | nội dung]
 * 1 dòng = banner rộng; 2-3 dòng = lưới banner. Thêm class `dark` (section/block variant)
 * nếu ảnh nền tối và chữ cần màu trắng.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.classList.add(`promo-banner-${rows.length}`);

  rows.forEach((row) => {
    const [imageCell, contentCell] = row.children;
    row.className = 'promo-item';

    if (imageCell) {
      imageCell.className = 'promo-image';
      const img = imageCell.querySelector('img');
      if (img) {
        img.closest('picture').replaceWith(
          createOptimizedPicture(img.src, img.alt, false, [
            { media: '(width >= 900px)', width: '1200' },
            { width: '800' },
          ]),
        );
      }
    }
    if (contentCell) contentCell.className = 'promo-content';
  });
}
