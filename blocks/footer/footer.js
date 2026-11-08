import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Cấu trúc document /footer (2 section):
 *  1. Cột link: danh sách 2 cấp
 *       - Cấp 1: tiêu đề cột (chữ thường, không cần link)
 *         - Cấp 2: các link
 *  2. Phần dưới: icon mạng xã hội, thông tin công ty, bản quyền
 * @param {Element} block
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const [links, legal] = footer.children;
  links?.classList.add('footer-links');
  legal?.classList.add('footer-legal');

  // tiêu đề cột -> button (accordion trên mobile, tiêu đề tĩnh trên desktop)
  links?.querySelectorAll('.default-content-wrapper > ul > li').forEach((li) => {
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
