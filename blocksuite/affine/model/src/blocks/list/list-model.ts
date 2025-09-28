import type { Text } from '@blocksuite/store';
import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';

// `toggle` type has been deprecated, do not use it
export type ListType = 'bulleted' | 'numbered' | 'todo' | 'toggle';

export type ListProps = {
  type: ListType;
  text: Text;
  checked: boolean;
  collapsed: boolean;
  order: number | null;
  dir: null | 'rtl' | 'ltr';
  user_change_direction:boolean
} & BlockMeta;

export const ListBlockSchema = defineBlockSchema({
  flavour: 'affine:list',
  props: internal =>
    ({
      user_change_direction:false,
      type: 'bulleted',
      text: internal.Text(),
      checked: false,
      collapsed: false,
      dir: null,
      // number type only for numbered list
      order: null,
      'meta:createdAt': undefined,
      'meta:createdBy': undefined,
      'meta:updatedAt': undefined,
      'meta:updatedBy': undefined,
    }) as ListProps,
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'affine:note',
      'affine:database',
      'affine:list',
      'affine:paragraph',
      'affine:edgeless-text',
      'affine:callout',
      'affine:mahdaad-callout',
      'affine:mahdaad-multi-column',
    ],
  },
  toModel: () => new ListBlockModel(),
});

export const ListBlockSchemaExtension = BlockSchemaExtension(ListBlockSchema);

export class ListBlockModel extends BlockModel<ListProps> {}
