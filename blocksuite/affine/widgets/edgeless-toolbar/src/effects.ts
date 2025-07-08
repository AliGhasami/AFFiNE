import { EdgelessToolIconButton } from './button/tool-icon-button';
import { EdgelessToolbarButton } from './button/toolbar-button';
/*import {
  EDGELESS_TOOLBAR_WIDGET,
  EdgelessToolbarWidget,
} from './edgeless-toolbar';*/
import {
  Mahdaad_EDGELESS_TOOLBAR_WIDGET,
  MahdaadEdgelessToolbarWidget,
} from './mahdaad-edgeless-toolbar';
import { EdgelessFontFamilyPanel } from './panel/font-family-panel';
import { EdgelessFontWeightAndStylePanel } from './panel/font-weight-and-style-panel';

export function effects() {
  //customElements.define(EDGELESS_TOOLBAR_WIDGET, EdgelessToolbarWidget);
  customElements.define(
    Mahdaad_EDGELESS_TOOLBAR_WIDGET,
    MahdaadEdgelessToolbarWidget
  );
  customElements.define('edgeless-toolbar-button', EdgelessToolbarButton);
  customElements.define('edgeless-tool-icon-button', EdgelessToolIconButton);
  customElements.define(
    'edgeless-font-weight-and-style-panel',
    EdgelessFontWeightAndStylePanel
  );
  customElements.define('edgeless-font-family-panel', EdgelessFontFamilyPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-tool-icon-button': EdgelessToolIconButton;
    'edgeless-toolbar-button': EdgelessToolbarButton;
    //'edgeless-toolbar-widget': EdgelessToolbarWidget;
    'mahdaad-edgeless-toolbar-widget': MahdaadEdgelessToolbarWidget;
    'edgeless-font-weight-and-style-panel': EdgelessFontWeightAndStylePanel;
    'edgeless-font-family-panel': EdgelessFontFamilyPanel;
  }
}
