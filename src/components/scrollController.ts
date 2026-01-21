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
  private navComponent: HTMLElement;
  private footerSection: HTMLElement;
  private absImages: HTMLImageElement[];

  // GSAP State
  private horizontalTween: gsap.core.Animation | null = null;
  private menuThemeTriggers: ScrollTrigger[] = [];

  // Responsive Context
  private mm: gsap.MatchMedia | null = null;
  private horizontalCtx: gsap.Context | null = null;
  private verticalCtx: gsap.Context | null = null;
  private onResizeDesktop: (() => void) | null = null;

  // Menu Helpers
  private menuSections: HTMLElement[] = [];
  private menuSectionIndex: Map<string, number> = new Map();
  private getScrollLengthFn: (() => number) | null = null;

  // Debug
  private debugScrollMetrics = false;

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
    this.navComponent = document.querySelector('.component_nav-ui') as HTMLElement;
    this.footerSection = document.querySelector('.footer_component') as HTMLElement;
    this.absImages = [...document.querySelectorAll('.u-img-fill.set-abs')] as HTMLImageElement[];

    this.initResposive();
  }

  // RESPONSIVE LIFECYLCE
  private initResposive() {
    this.mm?.kill();
    this.mm = gsap.matchMedia();

    const DESKTOP_QUERY = '(min-width: 992px) and (pointer: fine)';

    this.mm.add(DESKTOP_QUERY, () => {
      this.horizontalCtx = gsap.context(() => {
        this.enableHorizontal();
      }, this.container);

      return () => {
        this.disableHorizontal();
      };
    });

    this.mm.add(`not all and ${DESKTOP_QUERY}`, () => {
      this.verticalCtx = gsap.context(() => {
        this.enableVertical();
      }, this.container);

      return () => {
        this.disableVertical();
      };
    });
  }

  // HORIZONTAL MODE
  private enableHorizontal() {
    this.horizontalTween = null;
    this.getScrollLengthFn = null;

    this.setupHorizontalLayout();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initScroll();
        ScrollTrigger.refresh();
      });
    });

    this.bindResizeDesktopOnly();
  }

  private disableHorizontal() {
    this.killMenuTriggers();
    this.killHorizontalTween();
    this.unbindResizeDesktopOnly();
    this.resetLayoutStyles();

    this.horizontalCtx?.revert();
    this.horizontalCtx = null;

    ScrollTrigger.refresh();
  }

  private setupHorizontalLayout() {
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
    gsap.set(this.fxSections, { flex: '0 0 100vw' });
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
    if (this.absImages.length > 0) gsap.set(this.absImages, { position: 'absolute' });
  }

  private initScroll() {
    const getScrollLength = () => {
      const last = this.track.lastElementChild as HTMLElement | null;
      if (!last) return 0;

      const len = last.offsetLeft + last.offsetWidth - this.container.clientWidth;
      return Math.max(0, Math.round(len));
    };

    // Store scroll length for menu movement
    this.getScrollLengthFn = getScrollLength;

    // DEBUG
    if (this.debugScrollMetrics) {
      this.debugScrollLength(getScrollLength);
    }

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
        // markers: true,
        onRefresh: () => {
          this.rebuildMenuIndex();
          this.initMenuSync();
        },
      },
    });

    this.rebuildMenuIndex();
    this.initMenuSync();
    // this.initParallax();
  }

  // VERTICAL MODE
  private enableVertical() {
    this.horizontalTween = null;

    this.rebuildMenuIndex();
    this.initMenuSync();
    ScrollTrigger.refresh();
  }

  private disableVertical() {
    this.killMenuTriggers();

    this.verticalCtx?.revert();
    this.verticalCtx = null;
  }

  // FEATURE - PARALAX
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

      // console.log('before', beforeWidth, 'after', afterWidth, 'offset', offsetWidth);

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

  // FEATURE - MENU SCROLL TO
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

  public rebuildMenuIndex(): void {
    this.menuSectionIndex = this.buildMenuIndex();
  }

  public getMenuSectionX(id: string): number | null {
    return this.menuSectionIndex.get(id) ?? null;
  }

  public getMenuSectionMap(): Record<string, number> {
    return Object.fromEntries(this.menuSectionIndex.entries());
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

  // FEATURE - MENU THEME SYNC
  private initMenuSync() {
    if (!this.navComponent) {
      console.warn('[Scroller - menuThemeSync] No nav component found');
    }

    // console.log('^^', this.navComponent.getBoundingClientRect().right);

    this.killMenuTriggers();

    this.menuSections = [...this.track.querySelectorAll('[data-menu-section]')] as HTMLElement[];

    const THEME_PREFIX = 'u-theme-';

    const getThemeClass = (el: HTMLElement) =>
      [...el.classList].find((c) => c.startsWith(THEME_PREFIX)) ?? null;

    const clearNavThemes = () => {
      if (!this.navComponent) return;
      [...this.navComponent.classList].forEach((c) => {
        if (c.startsWith(THEME_PREFIX)) this.navComponent!.classList.remove(c);
      });
    };

    const applyThemeFromSection = (section: HTMLElement) => {
      if (!this.navComponent) return;

      const theme = getThemeClass(section);
      if (!theme) return;

      // avoid churn
      if (this.navComponent.classList.contains(theme)) return;

      clearNavThemes();
      this.navComponent.classList.add(theme);
    };

    const navX = this.navComponent.getBoundingClientRect().right;
    const navY = this.navComponent.getBoundingClientRect().bottom;

    const yLine = `top+=${Math.round(navY)}`;

    const horizontalMode = !!this.horizontalTween;

    this.menuSections.forEach((section) => {
      const trig = ScrollTrigger.create({
        trigger: section,
        ...(horizontalMode
          ? {
              containerAnimation: this.horizontalTween!, // key for horizontal pinned scroller
              start: `left ${navX}px`,
              end: `right ${navX}px`,
            }
          : { start: `top ${yLine}`, end: `bottom ${yLine}` }),

        // When entering / re-entering, apply that theme
        onEnter: () => applyThemeFromSection(section),
        onEnterBack: () => applyThemeFromSection(section),
        onLeave: () => clearNavThemes(),
        onLeaveBack: () => clearNavThemes(),

        // Optional: if you want to debug
        // markers: true,
      });

      this.menuThemeTriggers.push(trig);
    });
  }

  // SCROLL HELPERS
  private killMenuTriggers() {
    this.menuThemeTriggers.forEach((t) => t.kill());
    this.menuThemeTriggers = [];
  }

  private killHorizontalTween() {
    if (!this.horizontalTween) return;
    this.horizontalTween.scrollTrigger?.kill(true);
    this.horizontalTween.kill();
    this.horizontalTween = null;
  }

  private resetLayoutStyles() {
    gsap.set(this.track, { x: 0, clearProps: 'transform' });

    const toClear: any[] = [
      this.track,
      ...this.fxSections,
      this.heroSection,
      this.contactSection,
      this.contactSection?.children?.[0] as any,
      this.footerSection,
      ...this.wideSections,
      ...this.wideLayouts,
      ...this.absImages,
    ].filter(Boolean);

    gsap.set(toClear, { clearProps: 'all' });
  }

  private bindResizeDesktopOnly() {
    this.unbindResizeDesktopOnly();

    this.onResizeDesktop = () => {
      // Only recalc distances; mode switching is handled by matchMedia.
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', this.onResizeDesktop, { passive: true });
  }

  private unbindResizeDesktopOnly() {
    if (!this.onResizeDesktop) return;
    window.removeEventListener('resize', this.onResizeDesktop);
    this.onResizeDesktop = null;
  }

  // PUBLIC HELPERS
  public isHorizontalEnabled(): boolean {
    const bp = breakpoints();
    const isTouch = isTouchDevice();
    return !isTouch && bp[0] === 'desktop';
  }

  private debugScrollLength(getScrollLength: () => number, maxFrames = 240) {
    const getLastMetrics = () => {
      const last = this.track.lastElementChild as HTMLElement | null;
      if (!last) return null;

      return {
        trackScrollWidth: this.track.scrollWidth,
        lastEnd: last.offsetLeft + last.offsetWidth,
        containerW: this.container.clientWidth,
        len: last.offsetLeft + last.offsetWidth - this.container.clientWidth,
      };
    };

    let prev = getLastMetrics();
    console.log('[Scroller][metrics:init]', prev);

    let frames = 0;

    const watch = () => {
      const next = getLastMetrics();

      if (prev && next && next.len !== prev.len) {
        console.log('[Scroller][metrics:changed]', {
          frame: frames,
          prev,
          next,
        });
      }

      prev = next ?? prev;
      frames++;

      if (frames < maxFrames) {
        requestAnimationFrame(watch);
      } else {
        console.log('[Scroller][metrics:end]');
      }
    };

    requestAnimationFrame(watch);

    // One-time snapshot for sanity checking
    const footer = this.track.querySelector('.footer_component') as HTMLElement | null;

    console.log('[Scroller][metrics:snapshot]', {
      len: getScrollLength(),
      footerEnd: footer ? footer.offsetLeft + footer.offsetWidth : null,
      lastEnd: prev ? prev.lastEnd : null,
      containerW: this.container.clientWidth,
    });
  }
}

let scrollControllerInstance: ScrollController | null = null;

export const scrollControler = () => {
  scrollControllerInstance = new ScrollController();
  return scrollControllerInstance;
};

export const getScrollController = () => scrollControllerInstance;
export default scrollControler;
