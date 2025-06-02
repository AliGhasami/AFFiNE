import { MahdaadDateTime } from './mahdaad-date-time';

export function effects() {
  customElements.define('mahdaad-date-time-inline', MahdaadDateTime);
}

declare global {
  interface HTMLElementTagNameMap {
    'mahdaad-date-time-inline': MahdaadDateTime;
  }
}
