import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import { BlockStdScope } from '@blocksuite/std'
import type { InlineRange } from '@blocksuite/std/inline';
import { BlockModel } from '@blocksuite/store'

export interface MahdaadMentionWidgetConfig {
  triggerKeys: string[];
  ignoreBlockTypes: string[];
}


export type MahdaadMentionContext = {
  std: BlockStdScope;
  inlineEditor: AffineInlineEditor;
  startRange: InlineRange;
  startNativeRange: Range;
  triggerKey: string;
  config: MahdaadMentionWidgetConfig;
  close: () => void;
  model:BlockModel;
};


export const MAHDAAD_MENTION_WIDGET = 'mahdaad-mention-menu-widget';
