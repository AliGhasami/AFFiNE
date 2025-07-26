import type { ExtensionType } from '@blocksuite/store';

import { ParagraphBlockHtmlAdapterExtension } from './html.js';
import { ParagraphBlockMarkdownAdapterExtension } from './markdown.js';
import { ParagraphBlockNotionHtmlAdapterExtension } from './notion-html.js';
import { ParagraphBlockPlainTextAdapterExtension } from './plain-text.js';
import { ParagraphBlockMahdaadHtmlAdapterExtension } from './mahdaad-html';

export const ParagraphBlockAdapterExtensions: ExtensionType[] = [
  ParagraphBlockHtmlAdapterExtension,
  ParagraphBlockMarkdownAdapterExtension,
  ParagraphBlockPlainTextAdapterExtension,
  ParagraphBlockNotionHtmlAdapterExtension,
  ParagraphBlockMahdaadHtmlAdapterExtension,
];
