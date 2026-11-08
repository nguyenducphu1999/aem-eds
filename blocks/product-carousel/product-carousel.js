import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Carousel sản phẩm. Mỗi dòng = 1 thẻ: [ảnh | nội dung]
 * Nội dung gợi ý: tên sản phẩm (đoạn in đậm), mô tả/giá, link xem chi tiết.
 * @param {Element} block
 */
export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = 'product-carousel-track';

  [...block.children].forEach((row) => {
    const [imageCell, bodyCell] = row.children;
    const li = document.createElement('li');
    li.className = 'product-card';

    const img = imageCell?.querySelector('img');
    if (img) {
      const media = document.createElement('div');
      media.className = 'product-card-media';
      media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
      li.append(media);
    }
    if (bodyCell) {
      bodyCell.className = 'product-card-body';
      li.append(bodyCell);

      // cả thẻ bấm được: dùng link đầu tiên làm đích
      const link = bodyCell.querySelector('a');
      if (link) {
        li.addEventListener('click', (e) => {
          if (!e.target.closest('a')) link.click();
        });
        li.classList.add('is-clickable');
      }
    }
    track.append(li);
  });

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'product-carousel-prev';
  prev.setAttribute('aria-label', 'Sản phẩm trước');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'product-carousel-next';
  next.setAttribute('aria-label', 'Sản phẩm sau');

  const step = () => track.clientWidth * 0.8;
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  const updateButtons = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);

  block.replaceChildren(track, prev, next);
  updateButtons();
}
