import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { breakpoints, isTouchDevice } from '$utils/deviceInfo';
import { lenisInstance } from '$utils/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

class ScrollController {
  private container: HTMLElement;
  private track: HTMLElement;
  private wideSections: HTMLElement[];
  private wideLayouts: HTMLElement[];
  private fxSections: HTMLElement[];
  private heroSection: HTMLElement;
  private contactSection: HTMLElement;
  private footerSection: HTMLElement;
  private horizontalTween: gsap.core.Animation | null = null;

  constructor() {
    this.container = document.querySelector('.page_horizontal') as HTMLElement;
    this.track = document.querySelector('.page_scroll-track') as HTMLElement;
    this.wideSections = [...this.track.querySelectorAll('[data-section-wide]')] as HTMLElement[];
    this.wideLayouts = [
      ...this.track.querySelectorAll('[data-section-wide] .section_layout'),
    ] as HTMLElement[];

    this.fxSections = [...this.track.querySelectorAll('.section_fx')] as HTMLElement[];
    this.heroSection = document.querySelector('.section_hero') as HTMLElement;
    this.contactSection = document.querySelector('.section_contact') as HTMLElement;
    this.footerSection = document.querySelector('.footer_component') as HTMLElement;

    const bp = breakpoints();
    const isTouch = isTouchDevice();
    console.log('BP', bp, 'touch', isTouch);

    if (!this.container || !this.track) {
      console.error('Container or track not found.');
      return;
    }

    if (isTouch) {
      console.log('[Scroller] Touch Device - Bypassing scroller setup');
      return;
    }

    if (bp[0] !== 'Desktop') {
      console.log('[Scroller] Non Desktop Device - Bypassing scroller setup');
    }

    this.setup();
    this.bindResize();
  }

  private setup() {
    const root = document.documentElement;
    const navMargin = getComputedStyle(root)
      .getPropertyValue('--custom--nav-width-plus-gutter')
      .trim();
    const siteMargin = getComputedStyle(root).getPropertyValue('--site--margin').trim();

    gsap.set(this.track, {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 'max-content',
    });
    gsap.set(this.fxSections, { flex: '0 0 100vw', height: '100vh' });
    gsap.set(this.heroSection, { flex: '0 0 100vw', height: '100vh' });
    gsap.set(this.contactSection, { flex: '0 0 133vw', height: '100vh' });
    gsap.set(this.contactSection.children[0], {
      width: 'auto',
      paddingRight: `calc(${navMargin})`,
    });
    gsap.set(this.footerSection, { paddingRight: `calc(${siteMargin})` });
    gsap.set(this.wideSections, {
      width: 'auto',
      minWidth: '100vw',
      height: '100vh',
      paddingRight: `calc(${navMargin})`,
    });
    this.wideLayouts.forEach((e) => {
      gsap.set(e, {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'var(--custom--site-frame)',
        height: '100%',
      });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initScroll();
        ScrollTrigger.refresh();
      });
    });
    // this.initScroll();
    // setTimeout(() => {
    //   ScrollTrigger.refresh(true);
    // }, 250);
  }

  private bindResize() {
    window.addEventListener(
      'resize',
      () => {
        // Let ScrollTrigger recalc distances
        ScrollTrigger.refresh();
      },
      { passive: true },
    );
  }

  private initScroll() {
    // const totalScrollLength = this.track.scrollWidth - window.innerWidth;
    const getScrollLength = () => {
      const last = this.track.lastElementChild as HTMLElement | null;
      if (!last) return 0;

      const len = last.offsetLeft + last.offsetWidth - this.container.clientWidth;
      return Math.max(0, Math.round(len));
    };
    // DEBUG
    // const getLastMetrics = () => {
    //   const last = this.track.lastElementChild as HTMLElement | null;
    //   if (!last) return null;

    //   return {
    //     trackScrollWidth: this.track.scrollWidth,
    //     lastEnd: last.offsetLeft + last.offsetWidth,
    //     containerW: this.container.clientWidth,
    //     len: last.offsetLeft + last.offsetWidth - this.container.clientWidth,
    //   };
    // };

    // let prev = getLastMetrics();
    // console.log('[metrics init]', prev);

    // let frames = 0;
    // const watch = () => {
    //   const next = getLastMetrics();
    //   if (prev && next && next.len !== prev.len) {
    //     console.log('[metrics changed]', { frames, prev, next });
    //   }
    //   prev = next ?? prev;
    //   frames++;
    //   if (frames < 240) requestAnimationFrame(watch); // ~4s
    // };
    // requestAnimationFrame(watch);

    // const footer = this.track.querySelector('.footer_component') as HTMLElement | null;
    // console.log('[len]', {
    //   len: getScrollLength(),
    //   footerEnd: footer ? footer.offsetLeft + footer.offsetWidth : null,
    //   lastEnd: (this.track.lastElementChild as HTMLElement | null)
    //     ? (this.track.lastElementChild as HTMLElement).offsetLeft +
    //       (this.track.lastElementChild as HTMLElement).offsetWidth
    //     : null,
    //   containerW: this.container.clientWidth,
    // });
    // END DEBUG

    // console.log('scroll length', totalScrollLength, getScrollLength());ca

    this.horizontalTween = gsap.to(this.track, {
      x: () => -getScrollLength(),
      ease: 'none',
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: () => `+=${getScrollLength()}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: true,
      },
    });

    this.initParallax();

    const lenis = lenisInstance();
    if (lenis) {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
      });
    }
  }

  private initParallax() {
    if (!this.horizontalTween) return;

    const fxSections = [...this.track.querySelectorAll('.section_fx')] as HTMLElement[];
    // console.log('paralax', fxSections);

    fxSections.forEach((section) => {
      const image = section.querySelector('.fx_img') as HTMLElement | null;
      if (!image) return;

      const maxScale = 1.6;
      const minScale = 1.4;
      const offset = -(minScale - 1) * 100;
      const beforeWidth = image.getBoundingClientRect().width;

      gsap.set(image, { scale: maxScale });

      const afterWidth = image.getBoundingClientRect().width;
      const offsetWidth = (afterWidth - beforeWidth) / 2;

      console.log('before', beforeWidth, 'after', afterWidth, 'offset', offsetWidth);

      gsap.set(image, { x: offsetWidth });

      gsap.fromTo(
        image,
        { xPercent: 0 },
        {
          scale: minScale,
          // opacity: 0.2,
          x: offset,
          ease: 'none',
          scrollTrigger: {
            containerAnimation: this.horizontalTween || undefined,
            trigger: section,
            start: 'left 90%',
            end: 'right 10%',
            scrub: true,
            // markers: true,
          },
        },
      );
    });
  }
}
export const scrollControler = () => {
  new ScrollController();
};
export default scrollControler;
