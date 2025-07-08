import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';

export type MahdaadWeblinkProps = {
  title?: string;
  url: string | undefined;
  show_type: 'card' | 'embed';
} & BlockMeta;

export const MahdaadWeblinkBlockSchema = defineBlockSchema({
  flavour: 'affine:mahdaad-weblink-block',
  props: (): MahdaadWeblinkProps => ({
    title: undefined,
    url: undefined,
    show_type: 'card',
    'meta:createdAt': undefined,
    'meta:createdBy': undefined,
    'meta:updatedAt': undefined,
    'meta:updatedBy': undefined,
  }),
  metadata: {
    version: 1,
    role: 'content',
    //parent: [],
  },
  toModel: () => new MahdaadWeblinkBlockModel(),
});

export const MahdaadWeblinkBlockSchemaExtension = BlockSchemaExtension(
  MahdaadWeblinkBlockSchema
);

export class MahdaadWeblinkBlockModel extends BlockModel<MahdaadWeblinkProps> {
  /*override isEmpty(): boolean {
    return this.props.text$.value.length === 0 && this.children.length === 0;
  }*/
}
