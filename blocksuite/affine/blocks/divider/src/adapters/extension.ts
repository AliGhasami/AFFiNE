import type { ExtensionType } from '@blocksuite/store';

import { DividerBlockHtmlAdapterExtension } from './html.js';
import { DividerBlockMarkdownAdapterExtension } from './markdown.js';
import { DividerBlockNotionHtmlAdapterExtension } from './notion-html.js';
import { DividerBlockPlainTextAdapterExtension } from './plain-text.js';
import { DividerBlockMahdaadHtmlAdapterExtension } from './mahdaad-html';

export const DividerBlockAdapterExtensions: ExtensionType[] = [
  DividerBlockHtmlAdapterExtension,
  DividerBlockMarkdownAdapterExtension,
  DividerBlockNotionHtmlAdapterExtension,
  DividerBlockPlainTextAdapterExtension,
  DividerBlockMahdaadHtmlAdapterExtension,
];
