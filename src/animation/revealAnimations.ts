import { gsap } from 'gsap';

export const buildRevealTl = (type: string, section: HTMLElement) => {
  switch (type) {
    case 'mosaic':
      return mosaicReveal(section);
    default:
      return null;
  }
};

export const mosaicReveal = (section: HTMLElement) => {
  const glyphs = [...section.querySelectorAll('.typo-grid_glyph.main')];
  // console.log('mosaic', glyphs);

  const tl = gsap.timeline();
  tl.fromTo(glyphs, { opacity: 0 }, { opacity: 1 });

  return tl;
};
