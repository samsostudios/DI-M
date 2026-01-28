class NavHUD {
  private day: HTMLElement;
  private date: HTMLElement;
  private time: HTMLElement;
  private ampm: HTMLElement;
  private intervalId: number | null = null;
  private readonly locale = 'en-US';
  private readonly timeZone = 'America/Los_Angeles';
  constructor() {
    this.day = document.querySelector('#navDay') as HTMLElement;
    this.date = document.querySelector('#navDate') as HTMLElement;
    this.time = document.querySelector('#navTime') as HTMLElement;
    this.ampm = document.querySelector('#navAMPM') as HTMLElement;

    if (!this.date || !this.time) return;

    this.updateHUD();
    this.intervalId = window.setInterval(() => this.updateHUD(), 1000);
  }

  private updateHUD() {
    const now = new Date();

    const weekday = now.toLocaleDateString(this.locale, {
      timeZone: this.timeZone,
      weekday: 'long',
    });

    const monthDay = now.toLocaleDateString(this.locale, {
      timeZone: this.timeZone,
      month: 'short',
      day: 'numeric',
    });

    const [timeStr, ampmStr] = now
      .toLocaleTimeString(this.locale, {
        timeZone: this.timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .split(' ');

    if (this.day) this.day.textContent = weekday;
    if (this.date) this.date.textContent = monthDay;
    if (this.time) this.time.textContent = timeStr;
    if (this.ampm) this.ampm.textContent = ampmStr;

    // console.log('!!!', this.day, '////', this.date);
    // console.log('!!!', this.time, '////', this.ampm);
  }
}
export const navHUD = () => {
  new NavHUD();
};
export default navHUD;
