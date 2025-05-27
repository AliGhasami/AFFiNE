import { MahdaadObjectBlockComponent } from './mahdaad-object-block';

export function effects() {
  customElements.define('affine-mahdaad-object', MahdaadObjectBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-mahdaad-object': MahdaadObjectBlockComponent;
  }
}
