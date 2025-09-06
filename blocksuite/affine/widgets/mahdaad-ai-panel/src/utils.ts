import type { EditorHost } from '@blocksuite/affine/std';

/*import {
  AffineAIPanelWidget,
} from '../widgets/ai-panel/ai-panel';*/
import { MAHDAAD_AI_PANEL_WIDGET } from './config';
import { MahdaadAIPanelWidget } from './widget';

export const getMahdaadAIPanelWidget = (
  host: EditorHost
): MahdaadAIPanelWidget => {
  const rootBlockId = host.doc.root?.id;
  if (!rootBlockId) {
    throw new Error('rootBlockId is not found');
  }
  const aiPanel = host.view.getWidget(MAHDAAD_AI_PANEL_WIDGET, rootBlockId);
  if (!(aiPanel instanceof MahdaadAIPanelWidget)) {
    throw new Error('AI panel not found');
  }
  return aiPanel;
};
