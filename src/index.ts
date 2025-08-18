import navHUD from '$comonents/navHUD';
import { scrollControler } from '$comonents/scrollController';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  navHUD();
  scrollControler();
});
