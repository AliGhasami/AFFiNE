import type { ExtensionType } from '@blocksuite/store';

import { RootBlockHtmlAdapterExtension } from './html.js';
import { RootBlockMarkdownAdapterExtension } from './markdown.js';
import { RootBlockNotionHtmlAdapterExtension } from './notion-html.js';
import { RootBlockMahdaadHtmlAdapterExtension } from './mahdaad-html';

export const RootBlockAdapterExtensions: ExtensionType[] = [
  RootBlockHtmlAdapterExtension,
  RootBlockMarkdownAdapterExtension,
  RootBlockNotionHtmlAdapterExtension,
  RootBlockMahdaadHtmlAdapterExtension,
];
