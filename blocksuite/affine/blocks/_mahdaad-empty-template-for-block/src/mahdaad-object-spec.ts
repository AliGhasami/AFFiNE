import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';

export const MahdaadObjectBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-object'),
  BlockViewExtension('affine:mahdaad-object', literal`affine-mahdaad-object`),
].flat();
