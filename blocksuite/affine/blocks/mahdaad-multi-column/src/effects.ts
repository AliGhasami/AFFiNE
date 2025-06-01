import { MahdaadMultiColumnBlockComponent } from './mahdaad-multi-column-block';

export function effects() {
  customElements.define('affine-mahdaad-multi-column', MahdaadMultiColumnBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-mahdaad-multi-column': MahdaadMultiColumnBlockComponent;
  }
}
