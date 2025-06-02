import { MahdaadLink } from './mahdaad-link';

export function effects() {
  customElements.define('mahdaad-weblink-node', MahdaadLink);
}

declare global {
  interface HTMLElementTagNameMap {
    'mahdaad-weblink-node': MahdaadLink;
  }
}
