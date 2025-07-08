import { EdgelessTextEditor } from './edgeless-text-editor';
import { MahdaadEdgelessTextToolButton } from './toolbar/mahdaad-text-tool-button';
import { EdgelessTextMenu } from './toolbar/text-menu';

export function effects() {
  customElements.define('edgeless-text-editor', EdgelessTextEditor);
  customElements.define('edgeless-text-menu', EdgelessTextMenu);
  customElements.define(
    'edgeless-text-tool-button',
    MahdaadEdgelessTextToolButton
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-text-editor': EdgelessTextEditor;
    'edgeless-text-menu': EdgelessTextMenu;
    'edgeless-text-tool-button': MahdaadEdgelessTextToolButton;
  }
}
