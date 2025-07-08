import { MahdaadWeblinkBlockComponent } from './mahdaad-weblink-block';

export function effects() {
  customElements.define(
    'affine-mahdaad-weblink-block',
    MahdaadWeblinkBlockComponent
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-mahdaad-weblink-block': MahdaadWeblinkBlockComponent;
  }
}
