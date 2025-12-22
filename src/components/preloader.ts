import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

class Preloader {
  private component: HTMLElement;
  private loaderTracks: HTMLElement[];
  private logo: HTMLElement;
  private tags: HTMLElement[];
  private bgImg: HTMLElement;
  private hTracks: HTMLElement[] = [];
  private vTracks: HTMLElement[] = [];
  private overlayPanel: HTMLElement;

  constructor() {
    this.component = document.querySelector('.component_preloader') as HTMLElement;
    this.loaderTracks = [...document.querySelectorAll('.preloader_track')] as HTMLElement[];
    this.logo = document.querySelector('.preloader_logo') as HTMLElement;
    this.tags = [...document.querySelectorAll('.preloader_tag')] as HTMLElement[];
    this.bgImg = document.querySelector('.preloader_img') as HTMLElement;
    this.overlayPanel = document.querySelector('.preloader_reveal') as HTMLElement;

    this.setup();
    this.animate();
  }

  private setup() {
    gsap.set([this.logo, this.tags], { opacity: 0, y: '4rem' });

    this.loaderTracks.forEach((item) => {
      console.log(item.classList);
      if (item.classList.contains('is-vert')) {
        this.vTracks.push(item);
      } else if (item.classList.contains('is-hor')) {
        this.hTracks.push(item);
      }
    });

    console.log('setup', this.hTracks, this.vTracks);
  }

  private animate() {
    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        this.reveal();
      },
    });

    tl.to(this.logo, { opacity: 1, y: 0, duration: 1, ease: 'expo.inOut' });
    tl.to(this.tags, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'expo.out' }, '<0.5');

    if (this.hTracks.length === 0 || this.vTracks.length === 0) return;

    tl.to(this.hTracks[0], { x: '0%', duration: 0.5, ease: 'power2.inOut' }, '0');
    tl.to(this.vTracks[1], { y: '0%', duration: 0.5, ease: 'power2.inOut' }, '0.5');
    tl.to(this.hTracks[1], { x: '0%', duration: 0.5, ease: 'power2.inOut' }, '1');
    tl.to(this.vTracks[0], { y: '0%', duration: 0.5, ease: 'power2.inOut' }, '1.5');

    // tl.to(this.hTracks, { y: '-100%', ease: 'power2.out' });
    // tl.to(this.vTracks, { x: '-100%', ease: 'power2.out' });
    tl.to(this.overlayPanel, { width: '100%', duration: 1, ease: 'expo.inOut' });

    tl.to(this.component, {
      opacity: 0,
      duration: 1,
      ease: 'power2.in',
    });
    tl.set(this.component, { display: 'none' });
  }

  private reveal() {
    const heroText = document.querySelector('.section_hero h1');
    const split = SplitText.create(heroText, {
      mask: 'words',
      type: 'words',
    });

    console.log('SPLIT', heroText, split);
    const tl = gsap.timeline();

    tl.fromTo(split.words, { y: '2rem', opacity: 0 }, { y: '0rem', opacity: 1 });
  }
}

export const prelooader = () => {
  new Preloader();
};
export default prelooader;
