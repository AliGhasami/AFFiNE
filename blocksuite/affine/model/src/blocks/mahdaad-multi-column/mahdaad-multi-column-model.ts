import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';

export type MahdaadMultiColumnProps = {
  sizes:string | number[]
} & BlockMeta;

export const MahdaadMultiColumnBlockSchema = defineBlockSchema({
  flavour: 'affine:mahdaad-multi-column',
  props: (): MahdaadMultiColumnProps => ({
    sizes:[],
    'meta:createdAt': undefined,
    'meta:createdBy': undefined,
    'meta:updatedAt': undefined,
    'meta:updatedBy': undefined,
  }),
  metadata: {
    version: 1,
    role: 'hub',
    parent: ['affine:note'],
    children: [
      'affine:note'
    ],
  },
  toModel: () => new MahdaadMultiColumnBlockModel(),
});

export const MahdaadMultiColumnBlockSchemaExtension =
  BlockSchemaExtension(MahdaadMultiColumnBlockSchema);

export class MahdaadMultiColumnBlockModel extends BlockModel<MahdaadMultiColumnProps> {

}
