import { MahdaadObject } from './mahdaad-object';

export function effects() {
  customElements.define('mahdaad-object-link-inline', MahdaadObject);
}

declare global {
  interface HTMLElementTagNameMap {
    'mahdaad-object-link-inline': MahdaadObject;
  }
}
