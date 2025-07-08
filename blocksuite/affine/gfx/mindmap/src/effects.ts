//import { EdgelessMindmapToolButton } from './toolbar/mindmap-tool-button';
import { MahdaadEdgelessMindmapToolButton } from './toolbar/mahdaad-mindmap-tool-button';
import { MindMapPlaceholder } from './toolbar/mindmap-importing-placeholder';
import { EdgelessMindmapMenu } from './toolbar/mindmap-menu';

export function effects() {
  /*customElements.define(
    'edgeless-mindmap-tool-button',
    EdgelessMindmapToolButton
  );*/
  customElements.define(
    'edgeless-mindmap-tool-button',
    MahdaadEdgelessMindmapToolButton
  );
  customElements.define('edgeless-mindmap-menu', EdgelessMindmapMenu);
  customElements.define('mindmap-import-placeholder', MindMapPlaceholder);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-mindmap-tool-button': MahdaadEdgelessMindmapToolButton;
    'edgeless-mindmap-menu': EdgelessMindmapMenu;
    'mindmap-import-placeholder': MindMapPlaceholder;
  }
}
