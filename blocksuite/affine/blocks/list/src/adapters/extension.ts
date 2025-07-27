import type { ExtensionType } from '@blocksuite/store';

import { ListBlockHtmlAdapterExtension } from './html.js';
import { ListBlockMarkdownAdapterExtension } from './markdown.js';
import { ListBlockNotionHtmlAdapterExtension } from './notion-html.js';
import { ListBlockPlainTextAdapterExtension } from './plain-text.js';
import { ListBlockMahdaadHtmlAdapterExtension } from './mahdaad-html';

export const ListBlockAdapterExtensions: ExtensionType[] = [
  ListBlockHtmlAdapterExtension,
  ListBlockMarkdownAdapterExtension,
  ListBlockPlainTextAdapterExtension,
  ListBlockNotionHtmlAdapterExtension,
  ListBlockMahdaadHtmlAdapterExtension,
];
