import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOPLAY_MS = 6000;

/**
 * Hero carousel. Mỗi dòng của bảng = 1 slide: [ảnh | nội dung]
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const total = rows.length;

  const track = document.createElement('ul');
  track.className = 'carousel-track';

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  rows.forEach((row, i) => {
    const slide = document.createElement('li');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} / ${total}`);

    const [imageCell, contentCell] = row.children;

    if (imageCell) {
      imageCell.className = 'carousel-image';
      const img = imageCell.querySelector('img');
      if (img) {
        // slide đầu tiên load eager để tốt cho LCP
        const picture = createOptimizedPicture(img.src, img.alt, i === 0, [
          { media: '(width >= 900px)', width: '2000' },
          { width: '900' },
        ]);
        img.closest('picture').replaceWith(picture);
      }
      slide.append(imageCell);
    }
    if (contentCell) {
      contentCell.className = 'carousel-content';
      slide.append(contentCell);
    }
    track.append(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Đến slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i)); // eslint-disable-line no-use-before-define
    dots.append(dot);
  });

  block.textContent = '';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Banner nổi bật');
  block.append(track);

  if (total < 2) return;

  let current = 0;
  let timer = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(index) {
    current = index;
    [...track.children].forEach((s, i) => s.setAttribute('aria-hidden', String(i !== index)));
    [...dots.children].forEach((d, i) => {
      if (i === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }

  function goTo(index) {
    const next = (index + total) % total;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    setActive(next);
  }

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-prev';
  prev.setAttribute('aria-label', 'Slide trước');
  prev.addEventListener('click', () => goTo(current - 1));
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Slide sau');
  next.addEventListener('click', () => goTo(current + 1));
  nav.append(prev, next);
  block.append(nav, dots);

  // cập nhật chấm khi người dùng vuốt/cuộn
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive([...track.children].indexOf(entry.target));
    });
  }, { root: track, threshold: 0.6 });
  [...track.children].forEach((s) => observer.observe(s));

  // autoplay (tạm dừng khi hover/focus, tắt nếu người dùng chọn giảm chuyển động)
  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  setActive(0);
  start();
}
