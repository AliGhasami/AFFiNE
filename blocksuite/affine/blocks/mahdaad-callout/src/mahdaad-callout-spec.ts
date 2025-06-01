import { SlashMenuConfigExtension } from '@blocksuite/affine-widget-slash-menu'
import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { literal } from 'lit/static-html.js';

import {mahdaadCalloutSlashMenuConfig } from  './config/slash-menu'

export const MahdaadCalloutBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:mahdaad-callout'),
  BlockViewExtension('affine:mahdaad-callout', literal`affine-mahdaad-callout`),
  SlashMenuConfigExtension('affine:mahdaad-callout', mahdaadCalloutSlashMenuConfig),
].flat();
