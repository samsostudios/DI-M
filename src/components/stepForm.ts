import { gsap } from 'gsap';

class StepFrom {
  private component: HTMLElement;
  private form: HTMLFormElement;
  private formSteps: HTMLElement[];
  private formAdvance: HTMLButtonElement;
  private formPrevious: HTMLButtonElement;
  private formSubmit: HTMLButtonElement;
  private numTrack: HTMLElement;
  private currentStep: number = 0;

  constructor() {
    this.component = document.querySelector('.section_contact') as HTMLElement;
    this.form = document.querySelector('.contact_form') as HTMLFormElement;
    this.formSteps = [...document.querySelectorAll('.form_step')] as HTMLElement[];
    this.formAdvance = document.querySelector('#formAdvance') as HTMLButtonElement;
    this.formPrevious = document.querySelector('#formPrevious') as HTMLButtonElement;
    this.formSubmit = document.querySelector('#formSubmit') as HTMLButtonElement;
    this.numTrack = document.querySelector('.form_progress-track') as HTMLElement;

    if (!this.form) return;

    console.log('***', this.formSteps);

    this.setListeners();
  }

  private setListeners() {
    this.formAdvance.addEventListener('click', () => {
      const current = this.formSteps[this.currentStep];
      const next = this.formSteps[this.currentStep + 1];

      console.log('HERE', this.formSteps);

      if (this.currentStep < this.formSteps.length - 1) {
        const err = this.checkSteps(current);
        if (err.length === 0) {
          this.clearStepError();
          this.showNext(current, next);
          this.currentStep += 1;
        }
      }
    });
    this.formPrevious.addEventListener('click', () => {
      const current = this.formSteps[this.currentStep];
      const prev = this.formSteps[this.currentStep - 1];

      if (this.currentStep > 0) {
        this.showPrev(current, prev);
        this.currentStep -= 1;
      }
    });
  }
  private showNext(current: HTMLElement, next: HTMLElement) {
    console.log('next', this.currentStep);
    this.clearStepError();
    const tl = gsap.timeline();
    tl.to(current, { y: '-5rem', opacity: 0, duration: 1, ease: 'expo.out' });
    tl.to(this.numTrack, { y: '-=33%', duration: 1, ease: 'expo.out' }, '<');
    tl.set(next, { display: 'flex' }, '<0.5');
    tl.fromTo(
      next,
      { y: '5rem', opacity: 0 },
      { y: '0rem', opacity: 1, duration: 1, ease: 'expo.out' },
      '<',
    );
    tl.set(current, { display: 'none' });
  }
  private showPrev(current: HTMLElement, prev: HTMLElement) {
    console.log('prev', this.currentStep);
    const tl = gsap.timeline();
    tl.to(current, { y: '5rem', opacity: 0, duration: 1, ease: 'expo.out' });
    tl.to(this.numTrack, { y: '+=33%', duration: 1, ease: 'expo.out' }, '<');
    tl.set(prev, { display: 'flex' }, '<0.5');
    tl.fromTo(
      prev,
      { y: '-5rem', opacity: 0 },
      { y: '0rem', opacity: 1, duration: 1, ease: 'expo.out' },
      '<',
    );
  }

  private checkSteps(currentStep: HTMLElement) {
    console.log('$$$', currentStep.querySelectorAll('input'));
    const inputs = currentStep.querySelectorAll('input');
    const errors: HTMLElement[] = [];

    inputs.forEach((item: HTMLInputElement) => {
      const req = item.required;
      console.log('^^^', item.type);

      if (req) {
        const val = item.value;
        if (item.type === 'radio') {
        }
        if (val === '') {
          this.showStepError();
          errors.push(item);
        }
      }
      console.log('**', req, errors);
    });
    return errors;
  }

  private showStepError() {
    // this.clearStepError();
    const errorElement = document.querySelector('.form_error');
    const errorText = document.querySelector('.form_error-text') as HTMLElement;

    errorText.innerHTML = 'Please make sure required feilds are filled out.';
    const tl = gsap.timeline();
    tl.set(errorElement, { display: 'block' });
    tl.fromTo(errorElement, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power4.out' });
  }

  private clearStepError() {
    console.log('CLEAR');
    const errorElement = document.querySelector('.form_error');
    const tl = gsap.timeline();
    tl.to(errorElement, { opacity: 0, duration: 1, ease: 'power4.out' });
    tl.set(errorElement, { display: 'none' });
  }
}

export const stepFrom = () => {
  new StepFrom();
};
export default stepFrom;
