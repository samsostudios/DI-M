import navHUD from '$components/navHUD';
import scrollControler from '$components/scrollController';
import loadComponent from '$utils/loadComponent';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  navHUD();
  // scrollControler();

  loadComponent('.section_hero', () => import('$components/heroSlider'));
  loadComponent('.section_hero', () => import('$components/landingPageHero'));
});
