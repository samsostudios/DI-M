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
    this.handleSequence();
  }

  private setListeners() {
    this.formAdvance.addEventListener('click', () => {
      const currentStep = this.formSteps[this.currentStep];
      const nextStep = this.formSteps[this.currentStep + 1];

      console.log('next', currentStep, nextStep);

      const tl = gsap.timeline();
      tl.to(currentStep, { y: '-5rem', opacity: 0, duration: 1, ease: 'expo.out' });
      tl.to(
        this.numTrack,
        { y: `-${this.currentStep + 1 * 33}%`, duration: 1, ease: 'expo.out' },
        '<',
      );
      tl.set(nextStep, { display: 'flex' });
      tl.fromTo(
        nextStep,
        { y: '5rem', opacity: 0 },
        { y: '0rem', opacity: 1, duration: 1, ease: 'expo.out' },
      );
    });
    this.formPrevious.addEventListener('click', () => {
      const currentStep = this.formSteps[this.currentStep];
      const prevStep = this.formSteps[this.currentStep - 1];

      const tl = gsap.timeline();
    });
  }
  private handleSequence() {}
}

export const stepFrom = () => {
  new StepFrom();
};
export default stepFrom;
