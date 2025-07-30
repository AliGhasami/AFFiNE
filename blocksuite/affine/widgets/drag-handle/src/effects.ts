import {
  EDGELESS_DND_PREVIEW_ELEMENT,
  EdgelessDndPreviewElement,
} from './components/edgeless-preview/preview';
import { AFFINE_DRAG_HANDLE_WIDGET } from './consts';
import { AffineDragHandleWidget } from './drag-handle';
import {
  DOC_DND_PREVIEW_ELEMENT,
  DocDndPreviewElement,
} from './components/doc-preview/preview';

export function effects() {
  customElements.define(AFFINE_DRAG_HANDLE_WIDGET, AffineDragHandleWidget);
  customElements.define(
    EDGELESS_DND_PREVIEW_ELEMENT,
    EdgelessDndPreviewElement
  );
  customElements.define(DOC_DND_PREVIEW_ELEMENT, DocDndPreviewElement);
}
