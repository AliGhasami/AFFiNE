import { MAHDAAD_OBJECT_PICKER_WIDGET} from './config.js';
//import { ImportDoc } from './import-doc/import-doc.js';
//import { Loader } from './import-doc/loader.js';
import { MahdaadObjectPickerWidget } from './index.js';
import { ObjectPickerPopover } from './object-picker-popover';
//import { AffineMobileLinkedDocMenu } from './mobile-linked-doc-menu.js';

export function effects() {
  customElements.define(MAHDAAD_OBJECT_PICKER_WIDGET, MahdaadObjectPickerWidget);
  customElements.define('mahdaad-object-picker-popover', ObjectPickerPopover);
  //customElements.define('import-doc', ImportDoc);
  /*customElements.define(
    'affine-mobile-linked-doc-menu',
    AffineMobileLinkedDocMenu
  );*/
  //customElements.define('loader-element', Loader);
}
