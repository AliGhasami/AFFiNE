import { MAHDAAD_AI_PANEL_WIDGET } from './config.js';
import { MahdaadAIPanelWidget } from './index.js';

export function effects() {
  customElements.define(MAHDAAD_AI_PANEL_WIDGET, MahdaadAIPanelWidget);
}
