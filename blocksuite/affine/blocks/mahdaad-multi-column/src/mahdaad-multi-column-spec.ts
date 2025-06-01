import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';
import { mahdaadMultiColumnSlashMenuConfig } from './config/slash-menu'
import { SlashMenuConfigExtension } from '@blocksuite/affine-widget-slash-menu'

export const MahdaadMultiColumnBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-multi-column'),
  BlockViewExtension('affine:mahdaad-multi-column', literal`affine-mahdaad-multi-column`),
  SlashMenuConfigExtension('affine:mahdaad-multi-column',   mahdaadMultiColumnSlashMenuConfig),

].flat();
