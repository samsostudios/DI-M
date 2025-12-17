import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// import { lenisInstance } from '$utils/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

class FxScroll {
  private components: HTMLElement[];
  private pageScroller: HTMLElement;

  constructor() {
    this.components = [...document.querySelectorAll('.section_fx')] as HTMLElement[];
    this.pageScroller = document.querySelector('.page_horizontal') as HTMLElement;

    this.setScrollers();
  }

  private setScrollers() {
    this.components.forEach((section) => {
      console.log('TO!', section);
      const image = section.querySelector('img');

      gsap.to(image, {
        // x: '-20%',
        opacity: 0.2,
        scrollTrigger: {
          trigger: section,
          scroller: this.pageScroller,
          horizontal: true,
          scrub: true,
          start: 'left center',
          end: 'right center',
          markers: true,
        },
      });
    });
  }
}

export const fxScroll = () => {
  new FxScroll();
};
export default fxScroll;
