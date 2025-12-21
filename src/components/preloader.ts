import { gsap } from 'gsap';

class Preloader {
  private component: HTMLElement;
  private loaderTracks: HTMLElement[];
  private logo: HTMLElement;
  private tag: HTMLElement[];
  private bgImg: HTMLElement;

  constructor() {
    this.component = document.querySelector('.component_preloader') as HTMLElement;
    this.loaderTracks = [...document.querySelectorAll('.preloader_track')] as HTMLElement[];
    this.logo = document.querySelector('.preloader_logo') as HTMLElement;
    this.tag = [...document.querySelectorAll('.preloader_tag')] as HTMLElement[];
    this.bgImg = document.querySelector('.preloader_bg-img') as HTMLElement;

    this.animate();
  }

  private animate() {
    const tl = gsap.timeline();
  }
}

export const prelooader = () => {
  new Preloader();
};
export default prelooader;
