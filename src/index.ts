import navHUD from '$components/navHUD';
import scrollControler from '$components/scrollController';
import loadComponent from '$utils/loadComponent';
import { initSmoothScroll } from '$utils/smoothScroll';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  initSmoothScroll();
  navHUD();
  scrollControler();

  loadComponent('.section_hero', () => import('$components/heroSlider'));
  loadComponent('.section_hero', () => import('$components/landingPageHero'));
});
