//import { EdgelessEraserToolButton } from './toolbar/components/eraser/eraser-tool-button';
import { MahdaadEdgelessEraserToolButton } from './toolbar/components/eraser/mahdaad-eraser-tool-button';
//import { EdgelessPenToolButton } from './toolbar/components/pen/pen-tool-button';
import { MahdaadEdgelessPenToolButton } from './toolbar/components/pen/mahdaad-pen-tool-button';
import { EdgelessPenMenu } from './toolbar/components/pen/pen-menu';

export function effects() {
  /*customElements.define(
    'edgeless-eraser-tool-button',
    EdgelessEraserToolButton
  );*/
  customElements.define(
    'edgeless-eraser-tool-button',
    MahdaadEdgelessEraserToolButton
  );
  //customElements.define('edgeless-pen-tool-button', EdgelessPenToolButton);
  customElements.define(
    'edgeless-pen-tool-button',
    MahdaadEdgelessPenToolButton
  );
  customElements.define('edgeless-pen-menu', EdgelessPenMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-pen-menu': EdgelessPenMenu;
    //'edgeless-pen-tool-button': EdgelessPenToolButton;
    'edgeless-pen-tool-button': MahdaadEdgelessPenToolButton;
    'edgeless-eraser-tool-button': MahdaadEdgelessEraserToolButton;
  }
}
