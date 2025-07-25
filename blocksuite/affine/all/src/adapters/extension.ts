import {
  HtmlInlineToDeltaAdapterExtensions,
  InlineDeltaToHtmlAdapterExtensions,
  InlineDeltaToMarkdownAdapterExtensions,
  InlineDeltaToPlainTextAdapterExtensions,
  MarkdownInlineToDeltaAdapterExtensions,
  NotionHtmlInlineToDeltaAdapterExtensions,
} from '@blocksuite/affine-inline-preset';
import {
  AttachmentAdapterFactoryExtension,
  HtmlAdapterFactoryExtension,
  ImageAdapterFactoryExtension,
  MarkdownAdapterFactoryExtension,
  MixTextAdapterFactoryExtension,
  NotionHtmlAdapterFactoryExtension,
  NotionTextAdapterFactoryExtension,
  PlainTextAdapterFactoryExtension,
  MahdaadHtmlAdapterFactoryExtension
} from '@blocksuite/affine-shared/adapters';
import type { ExtensionType } from '@blocksuite/store';

import { defaultBlockHtmlAdapterMatchers } from './html/block-matcher';
import {  defaultBlockMahdaadHtmlAdapterMatchers } from './mahdaad-html/block-matcher';
import { defaultBlockMarkdownAdapterMatchers } from './markdown/block-matcher';
import { defaultMarkdownPreprocessors } from './markdown/preprocessor';
import { defaultBlockNotionHtmlAdapterMatchers } from './notion-html/block-matcher';
import { defaultBlockPlainTextAdapterMatchers } from './plain-text/block-matcher';

export function getAdapterFactoryExtensions(): ExtensionType[] {
  return [
    AttachmentAdapterFactoryExtension,
    ImageAdapterFactoryExtension,
    MarkdownAdapterFactoryExtension,
    PlainTextAdapterFactoryExtension,
    HtmlAdapterFactoryExtension,
    NotionTextAdapterFactoryExtension,
    NotionHtmlAdapterFactoryExtension,
    MixTextAdapterFactoryExtension,
    MahdaadHtmlAdapterFactoryExtension
  ];
}

export function getHtmlAdapterExtensions(): ExtensionType[] {
  return [
    ...HtmlInlineToDeltaAdapterExtensions,
    ...defaultBlockHtmlAdapterMatchers,
    ...InlineDeltaToHtmlAdapterExtensions,
  ];
}

//todo ali ghasami
export function getMahdaadHtmlAdapterExtensions(): ExtensionType[] {
  return [
    ...HtmlInlineToDeltaAdapterExtensions,
    ...defaultBlockMahdaadHtmlAdapterMatchers,
    ...InlineDeltaToHtmlAdapterExtensions,
  ];
}

export function getMarkdownAdapterExtensions(): ExtensionType[] {
  return [
    ...MarkdownInlineToDeltaAdapterExtensions,
    ...defaultBlockMarkdownAdapterMatchers,
    ...InlineDeltaToMarkdownAdapterExtensions,
    ...defaultMarkdownPreprocessors,
  ];
}

export function getNotionHtmlAdapterExtensions(): ExtensionType[] {
  return [
    ...NotionHtmlInlineToDeltaAdapterExtensions,
    ...defaultBlockNotionHtmlAdapterMatchers,
  ];
}

export function getPlainTextAdapterExtensions(): ExtensionType[] {
  return [
    ...defaultBlockPlainTextAdapterMatchers,
    ...InlineDeltaToPlainTextAdapterExtensions,
  ];
}
