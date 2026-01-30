import { lenisInstance } from '$utils/smoothScroll';
import { getScrollController } from './scrollController';

class FooterNav {
  private component: HTMLElement;
  private links: HTMLElement[];

  constructor() {
    this.component = document.querySelector('.compoent_footer') as HTMLElement;
    this.links = [...document.querySelectorAll('.footer_nav-link')] as HTMLElement[];

    this.setListeners();
  }

  private setListeners() {
    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = link.dataset.menuTarget;
        const scroller = getScrollController();

        console.log('FOOTER', target, scroller);

        if (!target || !scroller) return;

        if (scroller.isHorizontalEnabled()) {
          e.preventDefault();
          scroller.scrollToMenuSection(target, { duration: 3 });
          return;
        }

        e.preventDefault();

        const el = document.querySelector(`[data-menu-section="${target}"`) as HTMLElement;
        console.log('****', el);

        if (!el) return;

        const lenis = lenisInstance();
        if (lenis) {
          lenis.scrollTo(el, { duration: 3 });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

export const footerNav = () => {
  new FooterNav();
};
export default footerNav;
