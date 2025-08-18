export {};

declare global {
  interface Window {
    Webflow: Array<() => void> & {
      env?: (mode?: string) => boolean;
    };
    WebflowEditor?: unknown;
  }
}
