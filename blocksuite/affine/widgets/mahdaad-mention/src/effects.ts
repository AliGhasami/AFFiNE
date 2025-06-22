import { MAHDAAD_MENTION_WIDGET} from './config.js';
import { MahdaadMentionMenuWidget } from './index.js'
import { MentionMenuPopover } from './mention-menu-popover';

export function effects() {
  customElements.define(MAHDAAD_MENTION_WIDGET, MahdaadMentionMenuWidget);
  customElements.define('mahdaad-mention-popover', MentionMenuPopover);
}
