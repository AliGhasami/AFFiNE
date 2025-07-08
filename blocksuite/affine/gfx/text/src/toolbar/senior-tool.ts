import { SeniorToolExtension } from '@blocksuite/affine-widget-edgeless-toolbar';
import { html } from 'lit';
export const textSeniorTool = SeniorToolExtension(
  'text',
  ({ block, toolbarContainer }) => {
    return {
      name: 'Text',
      content: html`<edgeless-text-tool-button
        .edgeless=${block}
        .toolbarContainer=${toolbarContainer}
      ></edgeless-text-tool-button>`,
    };
  }
);
