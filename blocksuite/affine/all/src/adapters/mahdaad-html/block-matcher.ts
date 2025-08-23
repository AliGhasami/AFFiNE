import { ListBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-list';
import { ParagraphBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-paragraph';
import { RootBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-root';
import { NoteBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-note';
import { ObjectBlockMahdaadHtmlAdapterExtension } from '@blocksuite/mahdaad-object-block';
import { DividerBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-divider';
import { WeblinkBlockMahdaadHtmlAdapterExtension } from '@blocksuite/mahdaad-weblink-block';
import { MahdaadCalloutBlockMahdaadHtmlAdapterExtension } from '@blocksuite/mahdaad-callout-block';
import { TableOfContentBlockMahdaadHtmlAdapterExtension } from '@blocksuite/mahdaad-table-of-content-block';
import { MahdaadMultiColumnBlockHtmlAdapterExtension } from '@blocksuite/mahdaad-multi-column-block';
import { DatabaseBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-database';
import { TableBlockMahdaadHtmlAdapterExtension } from '@blocksuite/affine-block-table';

export const defaultBlockMahdaadHtmlAdapterMatchers = [
  RootBlockMahdaadHtmlAdapterExtension,
  ParagraphBlockMahdaadHtmlAdapterExtension,
  ListBlockMahdaadHtmlAdapterExtension,
  NoteBlockMahdaadHtmlAdapterExtension,
  ObjectBlockMahdaadHtmlAdapterExtension,
  DividerBlockMahdaadHtmlAdapterExtension,
  WeblinkBlockMahdaadHtmlAdapterExtension,
  MahdaadCalloutBlockMahdaadHtmlAdapterExtension,
  TableOfContentBlockMahdaadHtmlAdapterExtension,
  MahdaadMultiColumnBlockHtmlAdapterExtension,
  DatabaseBlockMahdaadHtmlAdapterExtension,
  TableBlockMahdaadHtmlAdapterExtension,
  /*
  MahdaadAttachmentBlockHtmlAdapterExtension,
  */
  /*,
  CodeBlockHtmlAdapterExtension,
  DividerBlockHtmlAdapterExtension,
  ImageBlockHtmlAdapterExtension,
  RootBlockHtmlAdapterExtension,
  EmbedYoutubeBlockHtmlAdapterExtension,
  EmbedFigmaBlockHtmlAdapterExtension,
  EmbedLoomBlockHtmlAdapterExtension,
  EmbedGithubBlockHtmlAdapterExtension,
  EmbedIframeBlockHtmlAdapterExtension,
  BookmarkBlockHtmlAdapterExtension,
  DatabaseBlockHtmlAdapterExtension,
  TableBlockHtmlAdapterExtension,
  EmbedLinkedDocHtmlAdapterExtension,
  EmbedSyncedDocBlockHtmlAdapterExtension,*/
];
