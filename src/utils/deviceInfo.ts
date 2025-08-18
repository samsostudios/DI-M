import { WEBFLOW_BREAKPOINTS } from '@finsweet/ts-utils';

export const breakpoints = () => {
  let device = '';
  const wBreakpoints = [...WEBFLOW_BREAKPOINTS];
  const breakpoints = {
    tiny: 0,
    small: 0,
    medium: 0,
    main: 0,
  };

  window.addEventListener('resize', () => {
    init();
  });

  init();

  function init() {
    for (const i in wBreakpoints) {
      const nametTemp = wBreakpoints[i][0];
      const pointTemp = parseInt(wBreakpoints[i][1].split(':')[1].split('p')[0]);

      breakpoints[nametTemp] = pointTemp;
    }

    const curWidth = window.innerWidth;

    if (curWidth > breakpoints.main) {
      device = 'desktop';
    } else if (curWidth < breakpoints.main && curWidth > breakpoints.small) {
      device = 'tablet';
    } else if (curWidth < breakpoints.medium && curWidth > breakpoints.tiny) {
      device = 'mobile-landscape';
    } else if (curWidth < breakpoints.small) {
      device = 'mobile-portrait';
    }
  }

  return [device, window.innerWidth, window.innerHeight];
};

export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
