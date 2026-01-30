import { gsap } from 'gsap';

class StepFrom {
  private component: HTMLElement;
  private form: HTMLFormElement;
  private formSteps: HTMLElement[];
  private formAdvance: HTMLButtonElement;
  private formPrevious: HTMLButtonElement;
  private triggerSubmit: HTMLButtonElement;
  private webflowSubmit: HTMLButtonElement;
  private numTrack: HTMLElement;
  private currentStep: number = 0;

  constructor() {
    this.component = document.querySelector('.section_contact') as HTMLElement;
    this.form = document.querySelector('.contact_form') as HTMLFormElement;
    this.formSteps = [...this.form.querySelectorAll('.form_step')] as HTMLElement[];
    this.formAdvance = this.component.querySelector('#formAdvance') as HTMLButtonElement;
    this.formPrevious = this.component.querySelector('#formPrevious') as HTMLButtonElement;
    this.triggerSubmit = this.component.querySelector('#triggerSubmit') as HTMLButtonElement;
    this.webflowSubmit = this.component.querySelector('#webflowSubmit') as HTMLButtonElement;
    this.numTrack = this.component.querySelector('.form_progress-track') as HTMLElement;

    if (!this.form) return;

    this.setListeners();
    this.syncControls();
  }

  private isLastStep(): boolean {
    return this.currentStep >= this.formSteps.length - 1;
  }

  private syncControls() {
    const last = this.isLastStep();
    // const atStart = this.currentStep === 0;

    if (last) {
      const tl = gsap.timeline();
      tl.to(this.formAdvance, { opacity: 0 });
      tl.set(this.formAdvance, { display: 'none' });
      tl.set(this.triggerSubmit, { display: 'flex' });
      tl.from(this.triggerSubmit, { opacity: 0 });
    }
  }

  private setListeners() {
    this.formAdvance.addEventListener('click', () => {
      const current = this.formSteps[this.currentStep];
      const next = this.formSteps[this.currentStep + 1];

      if (this.currentStep < this.formSteps.length - 1) {
        const err = this.checkSteps(current);
        if (err.length === 0) {
          this.clearStepError();
          this.showNext(current, next);
          this.currentStep += 1;
          this.syncControls();
        }
      }
    });
    this.formPrevious.addEventListener('click', () => {
      const current = this.formSteps[this.currentStep];
      const prev = this.formSteps[this.currentStep - 1];

      if (this.currentStep > 0) {
        this.showPrev(current, prev);
        this.currentStep -= 1;
        this.syncControls();
      }
    });

    this.triggerSubmit.addEventListener('click', () => {
      if (!this.webflowSubmit || !this.form) return;

      this.webflowSubmit.click();
    });
  }

  private showNext(current: HTMLElement, next: HTMLElement) {
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
    const fields = [
      ...currentStep.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'),
    ];

    const errors: HTMLElement[] = [];
    const validatedRadioGroups = new Set<string>();

    // console.log('HER$E', fields);

    fields.forEach((item) => {
      // RADIOS
      if (item instanceof HTMLInputElement && item.type === 'radio') {
        const groupName = item.name;
        if (!groupName) return;

        if (validatedRadioGroups.has(groupName)) return;
        validatedRadioGroups.add(groupName);

        const checked = currentStep.querySelector<HTMLInputElement>(
          `input[type="radio"][name="${CSS.escape(groupName)}"]:checked`,
        );

        if (!checked) {
          this.showStepError();
          errors.push(item);
        }

        return;
      }

      // CHECKBOX
      if (item instanceof HTMLInputElement && item.type === 'checkbox') {
        if (!item.checked) {
          this.showStepError();
          errors.push(item);
        }
        return;
      }

      // INPUT / TEXTAREA
      const val = item.value?.trim() ?? '';
      if (val === '') {
        this.showStepError();
        errors.push(item);
      }
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
