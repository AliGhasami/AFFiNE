import { MahdaadCalloutBlockComponent } from './mahdaad-callout-block';

export function effects() {
  customElements.define('affine-mahdaad-callout', MahdaadCalloutBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-mahdaad-callout': MahdaadCalloutBlockComponent;
  }
}
