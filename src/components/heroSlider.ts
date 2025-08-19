import { gsap } from 'gsap';

class HeroSlider {
  private container: HTMLElement;
  private images: HTMLImageElement[];
  private placeholder: HTMLElement;
  private currentIndex = 0;
  private duration: number;

  constructor() {
    this.container = document.querySelector('.hero_bg-slider') as HTMLElement;
    this.images = [...document.querySelectorAll('.hero_bg-slider img')] as HTMLImageElement[];
    this.placeholder = document.querySelector('.hero_bg-place') as HTMLElement;

    this.duration = parseInt(this.container.dataset.sliderDuration as string);

    this.setup();
  }

  private setup() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.startSlider();
      },
    });
    tl.set(this.container, { display: 'block' });
    tl.set(this.images, { position: 'absolute', opacity: 0 });
    tl.set(this.images[0], { opacity: 1 });
    tl.to(this.placeholder, { duration: 2, opacity: 0, ease: 'Power4.easeInOut' });
  }

  private startSlider() {
    if (this.images.length <= 1) return;

    this.images.forEach((img, index) => {
      gsap.set(img, { autoAlpha: index === this.currentIndex ? 1 : 0 });
    });

    setInterval(() => this.advanceSlider(), this.duration * 1000);
  }

  private advanceSlider() {
    const previous = this.currentIndex;
    const next = (this.currentIndex + 1) % this.images.length;
    this.currentIndex = next;

    gsap.to(this.images[previous], { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' });
    gsap.to(this.images[next], { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' });
  }
}
export const heroSlider = () => {
  new HeroSlider();
};
export default heroSlider;
