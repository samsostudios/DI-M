import navHUD from '$components/navHUD';
import scrollControler from '$components/scrollController';
import loadComponent from '$utils/loadComponent';
import { initSmoothScroll } from '$utils/smoothScroll';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  // DEBUG
  const imgs = [...document.querySelectorAll('img')];
  const sized: HTMLElement[] = [];
  imgs.forEach((i) => {
    if (i.sizes) {
      sized.push(i);
      console.log('SIZE:', i, i.sizes);
    }
  });
  console.log('All', imgs);
  console.log('Sized', sized);
  console.log('window', window.innerWidth);

  const img = document.querySelector('img.fx_img');
  const log = (label) => {
    const r = img.getBoundingClientRect().width;
    console.log(label, {
      rect: r,
      sizesAttr: img.getAttribute('sizes'),
      sizesProp: img.sizes,
      parent: img.parentElement?.className,
    });
  };

  log('now');

  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));
  window.addEventListener('load', () => log('load'));

  new MutationObserver(() => log('MUTATION')).observe(img, {
    attributes: true,
    attributeFilter: ['sizes', 'srcset'],
  });
  // END DEBUG

  initSmoothScroll();
  navHUD();
  scrollControler();

  loadComponent('.component_preloader', () => import('$components/preloader'));
  loadComponent('.component_nav', () => import('$components/menu'));
  loadComponent('.section_hero', () => import('$components/heroSlider'));
  loadComponent('.section_contact', () => import('$components/stepForm'));
  // loadComponent('.section_hero', () => import('$components/landingPageHero'));

  // loadComponent('.section_fx', () => import('$components/fxScrollSection'));
});
