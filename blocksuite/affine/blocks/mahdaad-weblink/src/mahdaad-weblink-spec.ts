//import { SlashMenuConfigExtension } from '@blocksuite/affine-widget-slash-menu'
import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';

//import {mahdaadTableOfContentSlashMenuConfig} from './config/slash-menu'
export const MahdaadWeblinkBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-weblink-block'),
  BlockViewExtension(
    'affine:mahdaad-weblink-block',
    literal`affine-mahdaad-weblink-block`
  ),
  //SlashMenuConfigExtension('affine:mahdaad-table-of-content', mahdaadTableOfContentSlashMenuConfig),
].flat();
