import { MahdaadMention } from './mahdaad-mention';

export function effects() {
  customElements.define('mahdaad-mention', MahdaadMention);
}

declare global {
  interface HTMLElementTagNameMap {
    'mahdaad-mention': MahdaadMention;
  }
}
