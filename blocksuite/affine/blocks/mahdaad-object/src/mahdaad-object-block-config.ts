import type { MahdaadObjectBlockModel  } from '@blocksuite/affine-model';
import { ConfigExtensionFactory } from '@blocksuite/std';
import { type TemplateResult } from 'lit';
export interface MahdaadObjectBlockConfig {
  getPlaceholder: (model: MahdaadObjectBlockModel) => TemplateResult<1> | string;
}

export const MahdaadObjectBlockConfigExtension =
  ConfigExtensionFactory<MahdaadObjectBlockConfig>('affine:paragraph');
