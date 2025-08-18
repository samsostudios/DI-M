import { gsap } from 'gsap';

class LPHero {
  private panel: HTMLElement;
  private open: HTMLButtonElement;
  private close: HTMLButtonElement;
  constructor() {
    this.panel = document.querySelector('.hero_panel') as HTMLElement;
    this.open = document.querySelector('#modalOpen') as HTMLButtonElement;
    this.close = document.querySelector('#modalClose') as HTMLButtonElement;

    this.setListeners();
  }

  private setListeners() {
    this.open.addEventListener('click', () => {
      console.log('Opening');
      this.openPanel();
    });
    this.close.addEventListener('click', () => {
      console.log('Closing');
      this.closePanel();
    });
  }

  private openPanel() {
    const tl = gsap.timeline();
    tl.set(this.panel, { display: 'block', x: '100%' });
    tl.to(this.panel, { x: '0%', ease: 'expo.out' });
  }

  private closePanel() {
    const tl = gsap.timeline();
    tl.to(this.panel, { x: '100%', ease: 'expo.out' });
    tl.set(this.panel, { display: 'none' });
  }
}
export const lpHero = () => {
  new LPHero();
};
export default lpHero;
