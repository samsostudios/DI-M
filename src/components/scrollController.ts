import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { lenisInstance } from '$utils/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

class ScrollController {
  private container: HTMLElement;
  private track: HTMLElement;
  // private sections: HTMLElement[];
  private wideSections: HTMLElement[];
  private wideLayouts: HTMLElement[];
  private fxSections: HTMLElement[];
  private heroSection: HTMLElement;
  private horizontalTween: gsap.core.Animation | null = null;

  constructor() {
    this.container = document.querySelector('.page_horizontal') as HTMLElement;
    this.track = document.querySelector('.page_scroll-track') as HTMLElement;
    // this.sections = [...this.track.querySelectorAll('section')] as HTMLElement[];
    this.wideSections = [...this.track.querySelectorAll('[data-section-wide]')] as HTMLElement[];
    this.wideLayouts = [
      ...this.track.querySelectorAll('[data-section-wide] .section_layout'),
    ] as HTMLElement[];

    this.fxSections = [...this.track.querySelectorAll('.section_fx')] as HTMLElement[];
    this.heroSection = document.querySelector('.section_hero') as HTMLElement;

    // console.log('!!', this.wideSections, this.wideLayouts);

    if (!this.container || !this.track) {
      console.error('Container or track not found.');
      return;
    }

    this.setup();
  }

  private setup() {
    // const frameWidth = this.getFrameSize();
    // console.log(`Frame Size: ${frameWidth}`);
    const root = document.documentElement;
    const navOffset = getComputedStyle(root)
      .getPropertyValue('--custom--nav-width-plus-gutter')
      .trim();

    const hPadding = getComputedStyle(root).getPropertyValue('--custom--h-site-height').trim();
    const vPadding = getComputedStyle(root).getPropertyValue('--custom--v-site-height').trim();

    // console.log('v', vPadding, 'h', hPadding);

    gsap.set(this.track, {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 'max-content',
    });
    gsap.set(this.fxSections, { flex: '0 0 100vw', height: '100vh' });
    gsap.set(this.heroSection, { flex: '0 0 100vw', height: '100vh' });
    gsap.set(this.wideSections, {
      width: 'auto',
      minWidth: '100vw',
      height: '100vh',
      paddingRight: `calc(${navOffset})`,
    });
    this.wideLayouts.forEach((e) => {
      gsap.set(e, {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'var(--custom--site-frame)',
        height: '100%',
      });
    });

    // gsap.set([this.fxSections, this.heroSection], {
    //   // flex: '0 0 auto',
    //   flexShrink: 0,
    // });

    this.initScroll();
    this.initSectionReveals();

    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 250);
  }

  private initScroll() {
    const totalScrollLength = this.track.scrollWidth - window.innerWidth;

    this.horizontalTween = gsap.to(this.track, {
      x: () => `-${totalScrollLength}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: () => `+=${totalScrollLength}`,
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

  private initSectionReveals() {
    if (!this.horizontalTween) return;

    const sections = [...this.track.querySelectorAll('[data-reveal]')] as HTMLElement[];
    console.log('reveals', sections);

    sections.forEach((section) => {
      const type = section.dataset.reveal as string;
      console.log('TT', type);
    });
  }

  private initParallax() {
    if (!this.horizontalTween) return;

    const fxSections = [...this.track.querySelectorAll('.section_fx')] as HTMLElement[];
    console.log('paralax', fxSections);

    fxSections.forEach((section) => {
      const image = section.querySelector('.fx_img') as HTMLElement | null;
      if (!image) return;

      const maxScale = 1.6;
      const minScale = 1.0;
      const offset = -(minScale - 1) * 100;

      gsap.set(image, { scale: maxScale, transformOrigin: 'left center' });

      console.log('$$', section);

      gsap.fromTo(
        image,
        { xPercent: 0 },
        {
          xPercent: offset,
          scale: minScale,
          // opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            containerAnimation: this.horizontalTween || undefined,
            trigger: section,
            start: 'left 90%',
            end: 'right 10%',
            scrub: true,
            markers: true,
          },
        },
      );
    });
  }

  private getFrameSize() {
    const rootElement = document.querySelector('.section_container') as HTMLElement;
    const frameWidth = getComputedStyle(rootElement).width;

    return parseFloat(frameWidth);
  }
}
export const scrollControler = () => {
  new ScrollController();
};
export default scrollControler;
