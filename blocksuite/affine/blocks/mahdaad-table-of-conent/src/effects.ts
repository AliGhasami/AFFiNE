import { MahdaadTableOfContentBlockComponent } from './mahdaad-table-of-content-block';

export function effects() {
  customElements.define('affine-mahdaad-table-of-content', MahdaadTableOfContentBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-mahdaad-table-of-content': MahdaadTableOfContentBlockComponent;
  }
}
