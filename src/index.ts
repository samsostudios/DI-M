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

  loadComponent('.component_preloader', () => import('$components/preloader'));
  loadComponent('.component_nav', () => import('$components/menu'));
  loadComponent('.section_hero', () => import('$components/heroSlider'));
  loadComponent('.section_contact', () => import('$components/stepForm'));
  // loadComponent('.section_hero', () => import('$components/landingPageHero'));

  // loadComponent('.section_fx', () => import('$components/fxScrollSection'));
});
