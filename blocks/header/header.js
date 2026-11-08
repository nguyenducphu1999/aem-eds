import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const desktop = window.matchMedia('(width >= 900px)');

function closeDrops(nav, except = null) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    if (li !== except) li.setAttribute('aria-expanded', 'false');
  });
}

function toggleMenu(nav, button, force) {
  const expanded = force !== undefined ? force : nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  button.setAttribute('aria-label', expanded ? 'Đóng menu' : 'Mở menu');
  document.body.style.overflowY = expanded && !desktop.matches ? 'hidden' : '';
  if (!expanded) closeDrops(nav);
}

/**
 * Cấu trúc document /nav (3 section, mỗi section cách nhau bằng ---):
 *  1. Brand  : logo (ảnh có link về trang chủ)
 *  2. Sections: danh sách 3 cấp
 *       - Cấp 1: link danh mục (TV, Tủ lạnh...)   -> hiển thị trên thanh menu
 *         - Cấp 2: tiêu đề cột (link)             -> tiêu đề cột trong mega menu
 *           - Cấp 3: link sản phẩm                -> link trong cột
 *  3. Tools  : danh sách link (Tìm kiếm, Giỏ hàng, Tài khoản...)
 * @param {Element} block
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  ['brand', 'sections', 'tools'].forEach((name, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${name}`);
  });

  // logo: bỏ style button mà decorateButtons có thể thêm vào
  const brandLink = nav.querySelector('.nav-brand .button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container')?.classList.remove('button-container');
  }

  // hamburger (mobile)
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Mở menu">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  const hamburgerButton = hamburger.querySelector('button');
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // mega menu
  const drops = nav.querySelectorAll('.nav-sections .default-content-wrapper > ul > li');
  drops.forEach((li) => {
    if (!li.querySelector('ul')) return;
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');

    const link = li.querySelector(':scope > a');

    li.addEventListener('mouseenter', () => {
      if (!desktop.matches) return;
      closeDrops(nav, li);
      li.setAttribute('aria-expanded', 'true');
    });
    li.addEventListener('mouseleave', () => {
      if (desktop.matches) li.setAttribute('aria-expanded', 'false');
    });
    li.addEventListener('focusin', () => {
      if (!desktop.matches) return;
      closeDrops(nav, li);
      li.setAttribute('aria-expanded', 'true');
    });

    // mobile: bấm để mở/đóng accordion thay vì chuyển trang
    link?.addEventListener('click', (e) => {
      if (desktop.matches) return;
      e.preventDefault();
      const open = li.getAttribute('aria-expanded') === 'true';
      closeDrops(nav);
      li.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  hamburgerButton.addEventListener('click', () => toggleMenu(nav, hamburgerButton));

  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    closeDrops(nav);
    if (nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, hamburgerButton, false);
  });

  // bấm ra ngoài thì đóng mega menu (desktop)
  document.addEventListener('click', (e) => {
    if (desktop.matches && !nav.contains(e.target)) closeDrops(nav);
  });

  desktop.addEventListener('change', () => toggleMenu(nav, hamburgerButton, false));

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
}
