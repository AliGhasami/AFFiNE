import type { ParagraphBlockModel } from '@blocksuite/affine-model';
import { ConfigExtensionFactory } from '@blocksuite/std';
import { type TemplateResult } from 'lit';
export interface ParagraphBlockConfig {
  getPlaceholder: (model: ParagraphBlockModel) => TemplateResult<1> | string;
}

export const ParagraphBlockConfigExtension =
  ConfigExtensionFactory<ParagraphBlockConfig>('affine:paragraph');
