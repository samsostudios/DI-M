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

  private heroText: HTMLElement;
  private split: SplitText;
  private heroInfo: HTMLElement;
  private heroTag: HTMLElement;
  private nav: HTMLElement;
  private scrollGlyph: HTMLElement;
  private bypass: boolean = false;

  constructor() {
    this.component = document.querySelector('.component_preloader') as HTMLElement;
    this.loaderTracks = [...document.querySelectorAll('.preloader_track')] as HTMLElement[];
    this.logo = document.querySelector('.preloader_logo') as HTMLElement;
    this.tags = [...document.querySelectorAll('.preloader_tag')] as HTMLElement[];
    this.bgImg = document.querySelector('.preloader_img') as HTMLElement;
    this.overlayPanel = document.querySelector('.preloader_reveal') as HTMLElement;

    console.log('!!', this.loaderTracks);

    this.heroText = document.querySelector('.section_hero h1') as HTMLElement;
    document.fonts.ready.then(() => {});
    this.split = SplitText.create(this.heroText, {
      mask: 'lines',
      type: 'lines',
    });
    this.heroInfo = document.querySelector('.hero_overview') as HTMLElement;
    this.heroTag = document.querySelector('.hero_tag') as HTMLElement;
    this.nav = document.querySelector('.component_nav-ui') as HTMLElement;
    this.scrollGlyph = document.querySelector('.hero_scroll-glyph.alt') as HTMLElement;

    if (this.bypass === false) {
      this.setup();
      this.animate();
    } else {
      gsap.to(this.component, { opacity: 0, display: 'none' });
    }
  }

  private setup() {
    gsap.set([this.logo, this.tags], { opacity: 0, y: '4rem' });
    gsap.set(this.split.lines, { y: '100%', opacity: 0 });
    gsap.set(this.heroInfo.children, { opacity: 0 });
    gsap.set(this.heroTag, { opacity: 0 });
    gsap.set(this.nav, { x: '-100%' });
    gsap.set(this.scrollGlyph, { x: '5rem' });

    this.loaderTracks.forEach((item) => {
      // console.log(item.classList);
      if (item.classList.contains('is-vert')) {
        this.vTracks.push(item);
      } else if (item.classList.contains('is-hor')) {
        this.hTracks.push(item);
      }
    });

    // console.log('setup', this.hTracks, this.vTracks);
  }

  private animate() {
    const tl = gsap.timeline({
      // delay: 1,
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

    tl.to(this.hTracks, { y: '-100%', ease: 'power2.inOut' });
    tl.to(this.vTracks, { x: '-100%', ease: 'power2.inOut' }, '<');

    tl.to(this.overlayPanel, { width: '100%', duration: 1.5, ease: 'expo.in' });
    tl.to([this.tags, this.logo, this.bgImg], { opacity: 0, duration: 1, ease: 'power2.inOut' });
    tl.to(this.component, { duration: 1.5, x: '100%', ease: 'power3.out' });
    // tl.to(this.overlayPanel, { x: '100%', duration: 1.5, ease: 'expo.out' });

    // tl.to(this.component, {
    //   opacity: 0,
    //   duration: 1,
    //   ease: 'power2.in',
    // });

    // tl.set(this.component, { display: 'none' });
  }

  private reveal() {
    const tl = gsap.timeline();

    tl.to(this.nav, { x: '0%', duration: 2, ease: 'power4.out' });
    tl.to(this.scrollGlyph, { x: 0, duration: 2, ease: 'power4.out' }, '<');
    tl.to(
      this.split.lines,
      {
        y: '0rem',
        opacity: 1,
        stagger: 0.1,
        // rotateY: '0deg',
        duration: 1.5,
        ease: 'power4.out',
      },
      '<',
    );
    tl.to(
      this.heroInfo.children,
      {
        opacity: 1,
        // stagger: 0.2,
        duration: 2,
        ease: 'power4.inOut',
      },
      '0',
    );
    tl.to(
      this.heroTag,
      {
        opacity: 1,
        duration: 2,
        ease: 'power4.inOut',
      },
      '<',
    );
    console.log('%%', tl.duration());
  }
}

export const prelooader = () => {
  new Preloader();
};
export default prelooader;
