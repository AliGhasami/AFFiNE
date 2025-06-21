import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import { BlockStdScope } from '@blocksuite/std'
import type { InlineRange } from '@blocksuite/std/inline';
import { BlockModel } from '@blocksuite/store'

//todo migrate to claytap folder
export type IObjectType =
  | 'document'
  | 'file'
  | 'board'
  | 'image'
  | 'weblink'
  | 'tag'
  | 'template';


export interface ObjectPickerWidgetConfig {
  triggerKeys: string[];
  triggerWords: { words: string[]; type: IObjectType }[];
  ignoreBlockTypes: string[];
}


export type ObjectPickerContext = {
  std: BlockStdScope;
  inlineEditor: AffineInlineEditor;
  startRange: InlineRange;
  startNativeRange: Range;
  triggerKey: string;
  config: ObjectPickerWidgetConfig;
  close: () => void;
  obj_type: IObjectType;
  model:BlockModel;
};


export const MAHDAAD_OBJECT_PICKER_WIDGET = 'mahdaad-object-picker-widget';
