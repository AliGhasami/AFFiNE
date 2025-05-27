import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';

export type MahdaadCalloutProps = {
  type?:string | null,
  background?:string | null,
  icon?:string | null,
  dir?: null | 'ltr' |  'rtl';
} & BlockMeta;

export const MahdaadCalloutBlockSchema = defineBlockSchema({
  flavour: 'affine:mahdaad-callout',
  props: (): MahdaadCalloutProps => ({
    type:'info',
    icon:null,
    background:null,
    dir: null,
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
      'affine:paragraph',
      'affine:list',
      /*'affine:note',
      'affine:database',
      'affine:paragraph',
      'affine:list',
      'affine:edgeless-text',
      'affine:callout',
      'affine:transcription',*/
    ],
  },
  toModel: () => new MahdaadCalloutBlockModel(),
});

export const MahdaadCalloutBlockSchemaExtension =
  BlockSchemaExtension(MahdaadCalloutBlockSchema);

export class MahdaadCalloutBlockModel extends BlockModel<MahdaadCalloutProps> {
  /*override isEmpty(): boolean {
    return this.props.text$.value.length === 0 && this.children.length === 0;
  }*/
}
