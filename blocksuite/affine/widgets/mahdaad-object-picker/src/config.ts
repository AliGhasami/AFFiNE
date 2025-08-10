//todo migrate to claytap folder
export type IObjectType =
  | 'document'
  | 'daily_note'
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

export const MAHDAAD_OBJECT_PICKER_WIDGET = 'mahdaad-object-picker-widget';
