import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';


export type MahdaadObjectProps = {
  object_id: undefined | string,
  link_id: undefined | string,
  type: undefined | string,
  show_type: 'inline' | 'embed',
  meta?:Record<string, string | null | any>
  file_id?:string,
  dir: 'rtl' | 'ltr' | null,
} & BlockMeta;

export const MahdaadObjectBlockSchema = defineBlockSchema({
  flavour: 'affine:mahdaad-object',
  props: (): MahdaadObjectProps => ({
    object_id: undefined,
    link_id: undefined,
    type: undefined,
    show_type: 'inline',
    meta:{},
    dir:null,
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
  toModel: () => new MahdaadObjectBlockModel(),
});

export const MahdaadObjectBlockSchemaExtension =
  BlockSchemaExtension(MahdaadObjectBlockSchema);

export class MahdaadObjectBlockModel extends BlockModel<MahdaadObjectProps> {
  /*override isEmpty(): boolean {
    return this.props.text$.value.length === 0 && this.children.length === 0;
  }*/
}
