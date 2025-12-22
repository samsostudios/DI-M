import { gsap } from 'gsap';

export const buildRevealTl = () => {};

export const mosaicReveal = () => {
  const glyphs = [...document.querySelectorAll('.typo-grid_glyph.main')];

  console.log('mosaic', glyphs);

  const tl = gsap.timeline();
};
