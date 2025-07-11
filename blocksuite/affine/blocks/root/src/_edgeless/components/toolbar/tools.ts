import { frameQuickTool } from '@blocksuite/affine-block-frame';
import { eraserSeniorTool, penSeniorTool } from '@blocksuite/affine-gfx-brush';
import { connectorQuickTool } from '@blocksuite/affine-gfx-connector';
import { mindMapSeniorTool } from '@blocksuite/affine-gfx-mindmap';
import { noteSeniorTool } from '@blocksuite/affine-gfx-note';
import { shapeSeniorTool } from '@blocksuite/affine-gfx-shape';
import { textSeniorTool } from '@blocksuite/affine-gfx-text';
//import { templateSeniorTool } from '@blocksuite/affine-gfx-template';
import { QuickToolExtension } from '@blocksuite/affine-widget-edgeless-toolbar';
import { html } from 'lit';
//import { buildLinkDenseMenu } from './link/link-dense-menu.js';

const defaultQuickTool = QuickToolExtension('default', ({ block }) => {
  return {
    type: 'default',
    content: html`<edgeless-default-tool-button
      .edgeless=${block}
    ></edgeless-default-tool-button>`,
  };
});

const panQuickTool = QuickToolExtension('pan', ({ block }) => {
  return {
    type: 'pan',
    content: html`<edgeless-pan-tool-button
      .edgeless=${block}
    ></edgeless-pan-tool-button>`,
  };
});

/*const TextTool = QuickToolExtension('text', ({ block }) => {
  return {
    type: 'pan',
    content: html`<edgeless-pan-tool-button
      .edgeless=${block}
    ></edgeless-pan-tool-button>`,
  };
});*/

/*const linkQuickTool = QuickToolExtension('link', ({ block, gfx }) => {
  return {
    content: html`<edgeless-link-tool-button
      .edgeless=${block}
    ></edgeless-link-tool-button>`,
    menu: buildLinkDenseMenu(block, gfx),
  };
});*/

export const quickTools = [
  defaultQuickTool,
  panQuickTool,
  frameQuickTool,
  connectorQuickTool,
  //linkQuickTool,
];

export const seniorTools = [
  noteSeniorTool,
  penSeniorTool,
  eraserSeniorTool,
  shapeSeniorTool,
  mindMapSeniorTool,
  textSeniorTool,
  //mindMapSeniorTool,
  //templateSeniorTool,
];
