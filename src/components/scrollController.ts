import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollController {
  private container: HTMLElement;
  private track: HTMLElement;

  constructor() {
    this.container = document.querySelector('.page_horizontal') as HTMLElement;
    this.track = document.querySelector('.page_scroll-track') as HTMLElement;

    if (!this.container || !this.track) {
      console.error('Container or track not found.');
      return;
    }

    this.setup();
    this.initScroll();
  }

  private setup() {
    console.log('setup');
    gsap.set(this.container, { height: '100svh' });
    gsap.set(this.track, { display: 'flex', width: 'max-content' });

    setTimeout(() => {
      this.initScroll();
    }, 500);
  }
  private initScroll() {
    const totalScrollLength = this.track.scrollWidth - window.innerWidth;

    console.log('scroll length', this.track, totalScrollLength);

    gsap.to(this.track, {
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
  }
}
export const scrollControler = () => {
  new ScrollController();
};
export default scrollControler();
