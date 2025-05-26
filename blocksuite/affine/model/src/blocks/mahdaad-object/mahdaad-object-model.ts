import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';

/*export type ParagraphType =
  | 'text'
  | 'quote'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';*/

export type MahdaadObjectProps = {
  //type: ParagraphType;
  //text: Text;
  //collapsed: boolean;
  object_id: undefined | string,
  link_id: undefined | string,
  type: undefined | string,
  show_type: 'inline' | 'embed',
  meta?:Record<string, string | null | any>
  file_id?:string,
  dir: 'rtl' | 'ltr' | null,
} & BlockMeta;

export const MahdaadObjectBlockSchema = defineBlockSchema({
  flavour: 'affine:paragraph',
  props: (): MahdaadObjectProps => ({
    object_id: undefined,
    link_id: undefined,
    type: undefined,
    //id:undefined,
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
    parent: [
      'affine:note',
      'affine:database',
      'affine:paragraph',
      'affine:list',
      'affine:edgeless-text',
      'affine:callout',
      'affine:transcription',
    ],
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
