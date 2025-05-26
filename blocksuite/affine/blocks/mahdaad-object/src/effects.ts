//import { effects as ParagraphHeadingIconEffects } from './heading-icon.js';
import { MahdaadObjectBlockComponent } from './mahdaad-object-block';

export function effects() {
  //ParagraphHeadingIconEffects();
  customElements.define('affine-mahdaad-object', MahdaadObjectBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-mahdaad-object': MahdaadObjectBlockComponent;
  }
}
