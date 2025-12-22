import { gsap } from 'gsap';

class Menu {
  private component: HTMLElement;
  private links: HTMLElement[];
  private open: HTMLElement;
  private close: HTMLElement;

  constructor() {
    this.component = document.querySelector('.component_menu') as HTMLElement;
    this.links = [...this.component.querySelectorAll('.menu_link')] as HTMLElement[];
    this.open = document.querySelector('#menuOpen') as HTMLElement;
    this.close = document.querySelector('#menuClose') as HTMLElement;

    this.setupUI();
    this.setListeners();
  }

  private setupUI() {
    // gsap.set(this.links, {opacity: 0,})
    console.log('MENU', this.open, this.close);
    gsap.set(this.component, { x: '-100%' });
  }

  private setListeners() {
    this.open.addEventListener('click', () => {
      this.openMenu();
    });
    this.close.addEventListener('click', () => {
      this.closeMenu();
    });
  }

  private openMenu() {
    console.log('OPEN');
    const tl = gsap.timeline();
    tl.set(this.component, { display: 'block' });
    tl.to(this.component, { x: '0%', duration: 1, ease: 'expo.inOut' });
    tl.fromTo(this.links, { opacity: 0 }, { opacity: 1 });
  }

  private closeMenu() {
    console.log('OPEN');
    const tl = gsap.timeline();
    tl.to(this.component, { x: '-100%', duration: 1, ease: 'expo.inOut' });
    tl.set(this.component, { display: 'none' });
  }
}

export const menu = () => {
  new Menu();
};
export default menu;
