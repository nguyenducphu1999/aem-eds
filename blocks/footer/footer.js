import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Nhận diện 2 phần của footer theo NỘI DUNG, không phụ thuộc vào đường kẻ ngang
 * (section break) trong document /footer:
 *   - footer-links: danh sách có lồng nhau (tiêu đề cột -> các link)
 *   - footer-legal: mọi thứ còn lại (mạng xã hội, bản quyền, điều khoản)
 * @param {Element} fragment
 * @returns {Element[]} các section đã dựng lại
 */
function buildSections(fragment) {
  const items = [...fragment.querySelectorAll('.default-content-wrapper')]
    .flatMap((wrapper) => [...wrapper.children]);
  const columns = items.find((el) => el.matches('ul, ol') && el.querySelector('ul, ol'));
  const rest = items.filter((el) => el !== columns);

  const make = (name, els) => {
    if (!els.length) return null;
    const section = document.createElement('div');
    section.className = `section ${name}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'default-content-wrapper';
    wrapper.append(...els);
    section.append(wrapper);
    return section;
  };

  return [
    make('footer-links', columns ? [columns] : []),
    make('footer-legal', rest),
  ].filter(Boolean);
}

/**
 * Cấu trúc document /footer (chỉ cần đúng thứ tự):
 *  1. Danh sách 2 cấp: cấp 1 = tiêu đề cột, cấp 2 = các link
 *  2. Mạng xã hội (danh sách link), bản quyền, điều khoản
 * @param {Element} block
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  footer.append(...buildSections(fragment));

  // tiêu đề cột -> button (accordion trên mobile, tiêu đề tĩnh trên desktop)
  footer.querySelectorAll('.footer-links .default-content-wrapper > ul > li').forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;

    const labelNodes = [...li.childNodes].filter((node) => node !== sub);
    const label = labelNodes.map((node) => node.textContent).join('').trim();
    labelNodes.forEach((node) => node.remove());

    const title = document.createElement('button');
    title.type = 'button';
    title.className = 'footer-col-title';
    title.textContent = label;
    title.setAttribute('aria-expanded', 'false');
    title.addEventListener('click', () => {
      const open = title.getAttribute('aria-expanded') === 'true';
      title.setAttribute('aria-expanded', String(!open));
      li.classList.toggle('open', !open);
    });
    li.prepend(title);
  });

  block.append(footer);
}
