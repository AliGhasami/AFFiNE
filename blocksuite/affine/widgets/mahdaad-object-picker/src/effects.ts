import { MAHDAAD_OBJECT_PICKER_WIDGET} from './config.js';
import { MahdaadObjectPickerWidget } from './index.js';
import { ObjectPickerPopover } from './object-picker-popover';

export function effects() {
  customElements.define(MAHDAAD_OBJECT_PICKER_WIDGET, MahdaadObjectPickerWidget);
  customElements.define('mahdaad-object-picker-popover', ObjectPickerPopover);
}
