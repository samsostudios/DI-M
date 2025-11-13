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

  constructor() {
    this.container = document.querySelector('.page_horizontal') as HTMLElement;
    this.track = document.querySelector('.page_scroll-track') as HTMLElement;
    this.sections = [...this.track.querySelectorAll('section')] as HTMLElement[];
    this.sectionContainers = [
      ...this.track.querySelectorAll('.section_container'),
    ] as HTMLElement[];
    this.sectionLayouts = [...this.track.querySelectorAll('.section_layout')] as HTMLElement[];

    // console.log('section', this.sections);

    if (!this.container || !this.track) {
      console.error('Container or track not found.');
      return;
    }

    this.setup();
    // this.initScroll();
  }

  private setup() {
    console.log('setup', this.sectionLayouts);

    const frameWidth = this.getFrameSize();
    console.log(`Frame Size: ${frameWidth}`);

    // gsap.set(this.container, { height: '100svh' });
    gsap.set(this.track, {
      display: 'flex',
      flexFlow: 'nowrap',
      // width: '5000px',
      // position: 'absolute',
    });
    // gsap.set(this.sectionContainers, { width: 'auto' });
    // gsap.set(this.sections, { flexShrink: 0 });
    gsap.set(this.sectionLayouts, {
      display: 'flex',
      flexDirection: 'horizontal',
      // flexShrink: 0,
      // minWidth: '100vw',
    });

    this.sectionContainers.forEach((item) => {
      const element = item as HTMLElement;
      const data = element.dataset.sectionWide;

      console.log('!', item, data);

      if (data !== undefined) {
        console.log('set 200vw', item);
        gsap.set(item, { width: frameWidth * 2 });
      }
    });

    this.initScroll();

    // Do a final refresh shortly after layout settles (fixes sticky pin spacing)
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 250);

    // setTimeout(() => {
    //   this.initScroll();
    // }, 5000);
  }
  private initScroll() {
    const totalScrollLength = this.track.scrollWidth - window.innerWidth;

    console.log('scroll length', this.track.scrollWidth, window.innerWidth, totalScrollLength);

    gsap.to(this.track, {
      x: () => `-${totalScrollLength}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: () => `+=${totalScrollLength}`,
        scrub: true,
        pin: true,
        // pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: true,
      },
    });

    const lenis = lenisInstance();
    if (lenis) {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
      });
    }
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
