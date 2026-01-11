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

  private menuSections: HTMLElement[] = [];
  private menuSectionIndex: Map<string, number> = new Map();
  private getScrollLengthFn: (() => number) | null = null;

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
      return;
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

    // Store scroll length for menu movement
    this.getScrollLengthFn = getScrollLength;
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
        onRefresh: () => this.rebuildMenuIndex(),
      },
    });

    this.rebuildMenuIndex();
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

  private clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  private buildMenuIndex(): Map<string, number> {
    const index = new Map<string, number>();

    // choose the selector you want; you mentioned data-menu-section
    this.menuSections = [...this.track.querySelectorAll<HTMLElement>('[data-menu-section]')];

    const max = this.getScrollLengthFn ? this.getScrollLengthFn() : 0;

    for (const el of this.menuSections) {
      const id = el.getAttribute('data-menu-section')?.trim();
      if (!id) continue;

      // The vertical scroll amount that moves the track to this element’s left edge
      const target = this.clamp(Math.round(el.offsetLeft), 0, max);
      index.set(id, target);
    }

    return index;
  }

  public scrollToMenuSection(
    id: string,
    opts?: { duration?: number; easing?: (t: number) => number; onComplete?: () => void },
  ) {
    const x = this.getMenuSectionX(id);
    if (x == null) return;

    const lenis = lenisInstance();
    if (lenis) {
      // Lenis accepts duration + easing in common setups
      lenis.scrollTo(x, {
        duration: opts?.duration ?? 1.1,
        easing: opts?.easing,
        onComplete: opts?.onComplete,
      });
    } else {
      // fallback
      window.scrollTo({ top: x, behavior: 'smooth' });
      opts?.onComplete?.();
    }
  }

  public isHorizontalEnabled(): boolean {
    const bp = breakpoints();
    const isTouch = isTouchDevice();
    return !isTouch && bp[0] === 'Desktop';
  }

  public rebuildMenuIndex(): void {
    this.menuSectionIndex = this.buildMenuIndex();
  }

  public getMenuSectionX(id: string): number | null {
    return this.menuSectionIndex.get(id) ?? null;
  }

  public getMenuSectionMap(): Record<string, number> {
    return Object.fromEntries(this.menuSectionIndex.entries());
  }
}

let scrollControllerInstance: ScrollController | null = null;

export const scrollControler = () => {
  scrollControllerInstance = new ScrollController();
  return scrollControllerInstance;
};

export const getScrollController = () => scrollControllerInstance;
export default scrollControler;
