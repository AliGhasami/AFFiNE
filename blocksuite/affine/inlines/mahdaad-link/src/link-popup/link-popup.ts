import type { EditorIconButton } from '@blocksuite/affine-components/toolbar';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import {
  //isValidUrl,
  normalizeUrl,
  stopPropagation,
} from '@blocksuite/affine-shared/utils';
import { WithDisposable } from '@blocksuite/global/lit';
//import { DoneIcon } from '@blocksuite/icons/lit';
import {
  BLOCK_ID_ATTR,
  BlockComponent,
  type BlockStdScope,
  ShadowlessElement,
  TextSelection,
} from '@blocksuite/std';
import type { InlineRange } from '@blocksuite/std/inline';
import {
  autoUpdate,
  computePosition,
  inline,
  offset,
  shift,
  flip,
} from '@floating-ui/dom';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts';

//import { linkPopupStyle } from './styles';

export class LinkPopup extends WithDisposable(ShadowlessElement) {
  //static override styles = linkPopupStyle;

  private _bodyOverflowStyle = '';

  get block() {
    const block = this.inlineEditor.rootElement.closest<BlockComponent>(
      `[${BLOCK_ID_ATTR}]`
    );
    if (!block) return null;
    return block;
  }

  private readonly _createTemplate = () => {
    /* this.updateComplete
      .then(() => {
        //this.linkInput?.focus();
        //this._updateConfirmBtn();
      })
      .catch(console.error);*/
    //console.log('20000', this.block.doc.meta.);
    //this.block.doc?.collection.setDocMeta(,)
    //this.host?.selection.clear();
    //console.log('1111', this.currentText);
    //console.log('11111', this.block.doc.meta?.id);
    return html`<div class="popover-block-editor">
      <mahdaad-inline-weblink-add-editor-form
        object-id="${this.block.doc.meta?.id}"
        .title="${this.currentText}"
        @save="${this.handleSave}"
        @generateWeblink="${this.generateWeblink}"
        .create-link="${true}"
      ></mahdaad-inline-weblink-add-editor-form>
    </div> `;
    /*this.updateComplete
      .then(() => {
        this.linkInput?.focus();

        this._updateConfirmBtn();
      })
      .catch(console.error);

    return html`
      <div class="affine-link-popover create">
        <input
          id="link-input"
          class="affine-link-popover-input"
          type="text"
          spellcheck="false"
          placeholder="Paste or type a link"
          @paste=${this._updateConfirmBtn}
          @input=${this._updateConfirmBtn}
        />
        ${this._confirmBtnTemplate()}
      </div>
    `;*/
  };

  generateWeblink(event: CustomEvent) {
    const lnk = event.detail;
    if (!this.inlineEditor.isValidInlineRange(this.targetInlineRange)) return;
    this.inlineEditor.insertText(this.targetInlineRange, REFERENCE_NODE, {
      mahdaadObjectLink: {
        object_id: lnk.object_id,
        link_id: lnk.link_id,
        type: lnk.type,
      },
      reference: null,
    });
    this.abortController.abort();
  }

  /* private readonly _editTemplate = () => {
    this.updateComplete
      .then(() => {
        if (
          !this.textInput ||
          !this.linkInput ||
          !this.currentText ||
          !this.currentLink
        )
          return;

        this.textInput.value = this.currentText;
        this.linkInput.value = this.currentLink;

        this.textInput.select();

        this._updateConfirmBtn();
      })
      .catch(console.error);

    return html`
      <div class="affine-link-edit-popover">
        <div class="affine-edit-area text">
          <input
            class="affine-edit-input"
            id="text-input"
            type="text"
            placeholder="Enter text"
            @input=${this._updateConfirmBtn}
          />
          <label class="affine-edit-label" for="text-input">Text</label>
        </div>
        <div class="affine-edit-area link">
          <input
            id="link-input"
            class="affine-edit-input"
            type="text"
            spellcheck="false"
            placeholder="Paste or type a link"
            @input=${this._updateConfirmBtn}
          />
          <label class="affine-edit-label" for="link-input">Link</label>
        </div>
        ${this._confirmBtnTemplate()}
      </div>
    `;
  };*/

  /* get currentLink() {
    return this.inlineEditor.getFormat(this.targetInlineRange).link;
  }*/

  get currentText() {
    return this.inlineEditor.yTextString.slice(
      this.targetInlineRange.index,
      this.targetInlineRange.index + this.targetInlineRange.length
    );
  }

  /*private _confirmBtnTemplate() {
    return html`
      <editor-icon-button
        class="affine-confirm-button"
        .iconSize="${'24px'}"
        .disabled=${true}
        @click=${this._onConfirm}
      >
        ${DoneIcon()}
      </editor-icon-button>
    `;
  }*/

  private handleSave(event: CustomEvent) {
    const data = event.detail;
    this._onConfirm(data.title, data.url);
    //console.log('this is handle save', data);
  }

  private _onConfirm(title: string, url: string) {
    if (!this.inlineEditor.isValidInlineRange(this.targetInlineRange)) return;
    //if (!this.linkInput) return;

    //const linkInputValue = this.linkInput.value;
    //if (!linkInputValue || !isValidUrl(linkInputValue)) return;

    const link = normalizeUrl(url);

    if (this.type === 'create') {
      /*this.inlineEditor.formatText(this.targetInlineRange, title, {
        link: link,
        reference: null,
      });*/
      this.inlineEditor.insertText(this.targetInlineRange, title, {
        link: link,
        reference: null,
      });
      this.inlineEditor.setInlineRange(this.targetInlineRange);
    } /*else if (this.type === 'edit') {
      const text = this.textInput?.value ?? link;
      this.inlineEditor.insertText(this.targetInlineRange, text, {
        link: link,
        reference: null,
      });
      this.inlineEditor.setInlineRange({
        index: this.targetInlineRange.index,
        length: text.length,
      });*/
    //}

    const textSelection = this.std.host.selection.find(TextSelection);
    if (textSelection) {
      this.std.range.syncTextSelectionToRange(textSelection);
    }

    this.abortController.abort();
  }

  /* private _onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
    if (!e.isComposing) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.abortController.abort();
        this.std.host.selection.clear();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        this._onConfirm();
      }
    }
  }*/

  /*  private _updateConfirmBtn() {
    if (!this.confirmButton) {
      return;
    }
    const link = this.linkInput?.value.trim();
    const disabled = !(link && isValidUrl(link));
    this.confirmButton.disabled = disabled;
    this.confirmButton.active = !disabled;
    this.confirmButton.requestUpdate();
  }*/

  private updateMockSelection(rects: DOMRect[]) {
    if (!this.mockSelectionContainer) {
      return;
    }

    this.mockSelectionContainer
      .querySelectorAll('div')
      .forEach(e => e.remove());

    const fragment = document.createDocumentFragment();

    rects.forEach(domRect => {
      const mockSelection = document.createElement('div');
      mockSelection.classList.add('mock-selection');

      // Get the container's bounding rect to account for its position
      const containerRect = this.mockSelectionContainer.getBoundingClientRect();

      // Adjust the position by subtracting the container's offset
      mockSelection.style.left = `${domRect.left - containerRect.left}px`;
      mockSelection.style.top = `${domRect.top - containerRect.top}px`;
      mockSelection.style.width = `${domRect.width}px`;
      mockSelection.style.height = `${domRect.height}px`;

      fragment.append(mockSelection);
    });

    this.mockSelectionContainer.append(fragment);
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.targetInlineRange.length === 0) {
      return;
    }

    // disable body scroll
    this._bodyOverflowStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.disposables.add({
      dispose: () => {
        document.body.style.overflow = this._bodyOverflowStyle;
      },
    });
  }

  override firstUpdated() {
    //this.disposables.addFromEvent(this, 'keydown', this._onKeydown);

    this.disposables.addFromEvent(this, 'copy', stopPropagation);
    this.disposables.addFromEvent(this, 'cut', stopPropagation);
    this.disposables.addFromEvent(this, 'paste', stopPropagation);

    this.disposables.addFromEvent(this.overlayMask, 'click', e => {
      e.stopPropagation();
      this.std.host.selection.setGroup('note', []);
      this.abortController.abort();
    });

    const range = this.inlineEditor.toDomRange(this.targetInlineRange);
    if (!range) {
      return;
    }

    const visualElement = {
      getBoundingClientRect: () => range.getBoundingClientRect(),
      getClientRects: () => range.getClientRects(),
    };
    const popover = this.popoverContainer;

    this.disposables.add(
      autoUpdate(visualElement, popover, () => {
        computePosition(visualElement, popover, {
          strategy: 'fixed',
          middleware: [
            flip(),
            offset(10),
            inline(),
            shift({
              padding: 6,
            }),
          ],
        })
          .then(({ x, y }) => {
            const domRects = range.getBoundingClientRect();
            popover.style.left = `${domRects.x}px`;
            popover.style.top = `${domRects.y + domRects.height + 10}px`;
            popover.style.zIndex = `99999`;
            popover.style.position = 'fixed';
            //popover.style.left = `${x}px`;
            //popover.style.top = `${y}px`;

            this.updateMockSelection(
              Array.from(visualElement.getClientRects())
            );
          })
          .catch(console.error);
      })
    );
  }

  override render() {
    return html`
      <div class="overlay-root">
        <div class="overlay-mask"></div>
        <div
          class="popover-container-1"
          style="position: absolute;
        display: flex;
        gap: 8px;
        box-sizing: content-box;
        justify-content: space-between;
        align-items: center;
        animation: affine-popover-fade-in 0.2s ease;
        z-index: var(--affine-z-index-popover);"
        >
          ${choose(this.type, [
            ['create', this._createTemplate],
            //['edit', this._editTemplate],
          ])}
        </div>
        <div class="mock-selection-container"></div>
      </div>
    `;
  }

  @property({ attribute: false })
  accessor abortController!: AbortController;

  @query('.affine-confirm-button')
  accessor confirmButton: EditorIconButton | null = null;

  @property({ attribute: false })
  accessor inlineEditor!: AffineInlineEditor;

  @query('#link-input')
  accessor linkInput: HTMLInputElement | null = null;

  @query('.mock-selection-container')
  accessor mockSelectionContainer!: HTMLDivElement;

  @query('.overlay-mask')
  accessor overlayMask!: HTMLDivElement;

  @query('.popover-container-1')
  accessor popoverContainer!: HTMLDivElement;

  @property({ attribute: false })
  accessor targetInlineRange!: InlineRange;

  @query('#text-input')
  accessor textInput: HTMLInputElement | null = null;

  @property()
  accessor type: 'create' | 'edit' = 'create';

  @property({ attribute: false })
  accessor std!: BlockStdScope;
}
