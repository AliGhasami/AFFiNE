import { SlashMenuConfigExtension } from '@blocksuite/affine-widget-slash-menu'
import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';

import {mahdaadTableOfContentSlashMenuConfig} from './config/slash-menu'
export const MahdaadTableOfContentBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-table-of-content'),
  BlockViewExtension('affine:mahdaad-table-of-content', literal`affine-mahdaad-table-of-content`),
  SlashMenuConfigExtension('affine:mahdaad-table-of-content', mahdaadTableOfContentSlashMenuConfig),
].flat();
