import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

class Menu {
  private component: HTMLElement;
  private links: HTMLElement[];
  private linkSpans: HTMLElement[];
  private spanHighlights: HTMLElement[];
  private open: HTMLElement;
  private close: HTMLElement;
  private iconLeft: HTMLElement;
  private iconRight: HTMLElement;
  private isOpen: boolean = false;

  constructor() {
    this.component = document.querySelector('.component_nav') as HTMLElement;
    this.links = [...this.component.querySelectorAll('.nav_link')] as HTMLElement[];
    this.spanHighlights = [...document.querySelectorAll('.nav_span-highlight')] as HTMLElement[];
    this.linkSpans = [...document.querySelectorAll('.nav_span')] as HTMLElement[];
    this.open = document.querySelector('#menuOpen') as HTMLElement;
    this.close = document.querySelector('#menuClose') as HTMLElement;
    this.iconLeft = document.querySelector('.nav-ui_svg-left') as HTMLElement;
    this.iconRight = document.querySelector('.nav-ui_svg-right') as HTMLElement;

    this.setupUI();
    this.setListeners();
  }

  private setupUI() {
    // gsap.set(this.links, {opacity: 0,})
    // console.log('MENU', this.open, this.close);
    gsap.set(this.component, { x: '-100%' });
    gsap.set([this.linkSpans, this.spanHighlights], { width: 0 });
  }

  private setListeners() {
    this.open.addEventListener('click', () => {
      if (this.isOpen === false) {
        this.openMenu();
        this.isOpen = true;
      } else {
        this.closeMenu();
        this.isOpen = false;
      }
    });
    this.close.addEventListener('click', () => {
      this.closeMenu();
      this.isOpen = false;
    });

    this.links.forEach((element) => {
      const highlight = element.querySelector('.nav_span-highlight');
      const imgWrap = element.querySelector('.nav_link-img-wrap');
      element.addEventListener('mouseover', () => {
        console.log('over');
        gsap.to(highlight, { width: '50%', ease: 'circ.out' });
        gsap.to(imgWrap, { height: '100%', ease: 'circ.out' });
      });
      element.addEventListener('mouseout', () => {
        gsap.to(highlight, { width: '0%', ease: 'circ.out' });
        gsap.to(imgWrap, { height: '0%', ease: 'circ.out' });
      });
    });
  }

  private openMenu() {
    // console.log('OPEN');
    const tl = gsap.timeline();
    tl.set(this.component, { display: 'block' });
    tl.to(this.iconLeft, { x: '-6', ease: 'expo.out' });
    tl.to(this.iconRight, { x: '6', ease: 'expo.out' }, '<');
    tl.to(this.component, { x: '0%', duration: 1.5, ease: 'expo.inOut' }, '<');
    tl.fromTo(
      this.links,
      { opacity: 0, y: '4rem' },
      { opacity: 1, y: '0rem', duartion: 1, stagger: 0.2, ease: 'power1.out' },
    );
    tl.to(this.linkSpans, { width: '100%', duration: 1, stagger: 0.2, ease: 'expo.out' }, '<0.1');
  }

  private closeMenu() {
    // console.log('OPEN');
    const tl = gsap.timeline();
    tl.to(this.component, { x: '-100%', duration: 1, ease: 'expo.inOut' });
    tl.to(this.iconLeft, { x: '0', ease: 'expo.out' }, '<');
    tl.to(this.iconRight, { x: '0', ease: 'expo.out' }, '<');
    tl.set(this.component, { display: 'none' });
  }
}

export const menu = () => {
  new Menu();
};
export default menu;
