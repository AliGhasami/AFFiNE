import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';

export const MahdaadCalloutBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-callout'),
  BlockViewExtension('affine:mahdaad-callout', literal`affine-mahdaad-callout`),
].flat();
