import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';


interface Item {
  title?: string;
  icon?: string;
  children?: Item[];
}

export type MahdaadTableOfContentProps = {
  dir?:  null |'rtl' | 'ltr',
  data: Item[];
} & BlockMeta;

export const MahdaadTableOfContentBlockSchema = defineBlockSchema({
  flavour: 'affine:mahdaad-table-of-content',
  props: (): MahdaadTableOfContentProps => ({
    dir:null,
    data: [],
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
  toModel: () => new MahdaadTableOfContentBlockModel(),
});

export const MahdaadTableOfContentBlockSchemaExtension =
  BlockSchemaExtension(MahdaadTableOfContentBlockSchema);

export class MahdaadTableOfContentBlockModel extends BlockModel<MahdaadTableOfContentProps> {
  /*override isEmpty(): boolean {
    return this.props.text$.value.length === 0 && this.children.length === 0;
  }*/
}
