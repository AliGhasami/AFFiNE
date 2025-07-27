import { SlashMenuConfigExtension } from '@blocksuite/affine-widget-slash-menu';
import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';

import { mahdaadObjectSlashMenuConfig } from './config/slash-menu';
import { ObjectBlockAdapterExtensions } from './adapters/extension';

export const MahdaadObjectBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-object'),
  BlockViewExtension('affine:mahdaad-object', literal`affine-mahdaad-object`),
  SlashMenuConfigExtension(
    'affine:mahdaad-object',
    mahdaadObjectSlashMenuConfig
  ),
  ObjectBlockAdapterExtensions,
].flat();
