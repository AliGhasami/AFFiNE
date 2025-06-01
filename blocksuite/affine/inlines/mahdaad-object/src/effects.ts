import { MahdaadObject } from './mahdaad-object';

export function effects() {
  customElements.define('mahdaad-mention', MahdaadObject);
}

declare global {
  interface HTMLElementTagNameMap {
    'mahdaad-mention': MahdaadObject;
  }
}
