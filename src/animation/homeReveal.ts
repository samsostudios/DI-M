import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export const homeReveal = () => {
  const heroText = document.querySelector('.section_hero h1');
  const split = SplitText.create(heroText, {
    mask: 'words',
    type: 'words',
  });

  console.log('SPLIT', heroText, split);
  const tl = gsap.timeline();

  tl.fromTo(split.words, { y: '2rem', opacity: 0 }, { y: '0rem', opacity: 1 });
};
