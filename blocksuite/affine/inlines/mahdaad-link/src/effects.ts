import { MahdaadLink } from './mahdaad-link';
import { LinkPopup } from './link-popup/link-popup';
export function effects() {
  customElements.define('mahdaad-weblink-node', MahdaadLink);
  customElements.define('link-popup', LinkPopup);
}

declare global {
  interface HTMLElementTagNameMap {
    'mahdaad-weblink-node': MahdaadLink;
  }
}
