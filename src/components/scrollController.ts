import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollController {
  private container: HTMLElement;
  private track: HTMLElement;
  private sections: HTMLElement[];

  constructor() {
    this.container = document.querySelector('.page_horizontal') as HTMLElement;
    this.track = document.querySelector('.page_scroll-track') as HTMLElement;
    this.sections = [...this.track.querySelectorAll('section')] as HTMLElement[];

    console.log('section', this.sections);

    if (!this.container || !this.track) {
      console.error('Container or track not found.');
      return;
    }

    if (window.Webflow) {
      window.Webflow.push(() => this.setup());
    } else {
      window.addEventListener('load', () => this.setup());
    }
    // this.setup();
    // this.initScroll();
  }

  private setup() {
    console.log('setup');
    // gsap.set(this.container, { height: '100svh' });
    gsap.set(this.track, {
      display: 'flex',
      width: '5000px',
      flexFlow: 'row nowrap',
      position: 'absolute',
    });
    gsap.set(this.sections, { flexShrink: 0 });

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
  }
}
export const scrollControler = () => {
  new ScrollController();
};
export default scrollControler;
