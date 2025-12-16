import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { lenisInstance } from '$utils/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

class ScrollController {
  private container: HTMLElement;
  private track: HTMLElement;
  private sections: HTMLElement[];
  private sectionContainers: HTMLElement[];
  private sectionLayouts: HTMLElement[];
  private horizontalTween: gsap.core.Animation | null = null;

  constructor() {
    this.container = document.querySelector('.page_horizontal') as HTMLElement;
    this.track = document.querySelector('.page_scroll-track') as HTMLElement;
    this.sections = [...this.track.querySelectorAll('section')] as HTMLElement[];
    this.sectionLayouts = [
      ...this.track.querySelectorAll('[data-section-wide] .section_layout'),
    ] as HTMLElement[];
    this.sectionContainers = [
      ...this.track.querySelectorAll('.section_container'),
    ] as HTMLElement[];

    console.log('!!', this.sectionContainers);

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

    console.log('OFFSET', navOffset);

    gsap.set(this.sectionContainers, {
      width: 'auto',
      height: '100vh',
      paddingRight: `calc(${navOffset})`,
    });
    this.sectionContainers.forEach((e) => {});
    this.sectionLayouts.forEach((e) => {
      gsap.set(e, {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'var(--custom--site-frame)',
        height: '100%',
      });
    });

    gsap.set(this.track, {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 'max-content',
    });

    this.initScroll();

    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 250);
  }

  private initScroll() {
    const totalScrollLength = this.track.scrollWidth - window.innerWidth;

    console.log('scroll length', this.track.scrollWidth, window.innerWidth, totalScrollLength);

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

  private initParallax() {
    if (!this.horizontalTween) return;

    const fxSections = [...this.track.querySelectorAll('.section_fx')] as HTMLElement[];

    fxSections.forEach((section) => {
      const image = section.querySelector('img') as HTMLElement | null;
      if (!image) return;

      const maxScale = 1.6;
      const minScale = 1.0;
      const offset = -(minScale - 1) * 100;

      gsap.set(image, { scale: maxScale, transformOrigin: 'left center' });

      console.log('$$', section.clientWidth);

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
            start: 'left 95%',
            end: 'right 5%',
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
