import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts'
import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import { BLOCK_ID_ATTR, BlockComponent, type BlockStdScope } from '@blocksuite/std'
import { ShadowlessElement } from '@blocksuite/std';
import {
  INLINE_ROOT_ATTR,
  type InlineRootElement,
  ZERO_WIDTH_FOR_EMPTY_LINE,
} from '@blocksuite/std/inline'
import type { DeltaInsert } from '@blocksuite/store';
import {  html } from 'lit';
import { property } from 'lit/decorators.js';

export class MahdaadLink extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {

  get link() {
    const link = this.delta.attributes?.link;
    if (!link) {
      return '';
    }
    return link;
  }

  get selfInlineRange() {
    const selfInlineRange = this.inlineEditor?.getInlineRangeFromElement(this);
    return selfInlineRange;
  }


  get inlineEditor() {
    const inlineRoot = this.closest<InlineRootElement<AffineTextAttributes>>(
      `[${INLINE_ROOT_ATTR}]`
    );
    return inlineRoot?.inlineEditor;
  }


  /*get currentText() {
    return  "111111"
    /!*return this.inlineEditor.yTextString.slice(
      this.selfInlineRange.index,
      this.selfInlineRange.index + this.selfInlineRange.length
    );*!/
  }*/

  /*get selfInlineRange() {
    const selfInlineRange = this.inlineEditor.getInlineRangeFromElement(this);
    //assertExists(selfInlineRange);
    return selfInlineRange;
  }*/

 /* get currentLink() {
    return  "222222"
    const link = this.inlineEditor?.getFormat(this.selfInlineRange).link;
    //assertExists(link);
    return link;
  }*/

  get url(){
    return this.delta.attributes.link
  }

  get title(){
    return this.delta.insert
  }


  get block() {
    const block = this.inlineEditor.rootElement.closest<BlockComponent>(
      `[${BLOCK_ID_ATTR}]`
    );
    if (!block) return null;
    return block;
  }

  private readonly _removeLink = () => {
    if (this.inlineEditor.isValidInlineRange(this.selfInlineRange)) {
      this.inlineEditor.formatText(this.selfInlineRange, {
        link: null,
      });
    }
    //this.abortController.abort();
  };

  generateWeblink(event: CustomEvent) {
    const lnk = event.detail;
    if (!this.inlineEditor.isValidInlineRange(this.selfInlineRange)) return;
    this.inlineEditor.insertText(this.selfInlineRange, REFERENCE_NODE, {
      mahdaadObjectLink: {
        object_id: lnk.object_id,
        link_id: lnk.link_id,
        type: lnk.type,
      },
      reference: null,
    });
  }

  private _convertToCardView(show_type: 'card' | 'embed') {
    if (!this.inlineEditor.isValidInlineRange(this.selfInlineRange)) {
      return;
    }

    const targetFlavour = 'affine:mahdaad-weblink-block';
    const block = this.block;
    if (!block) return;
    const url = this.url;
    const title =  this.title  ; //this.currentText
    const props = {
      url,
      title: title === url ? '' : title,
      show_type,
    };
    const doc = block.doc;
    const parent = doc.getParent(block.model);
    //assertExists(parent);
    const index = parent.children.indexOf(block.model);
    doc.addBlock(targetFlavour as never, props, parent, index + 1);
    const totalTextLength = this.inlineEditor.yTextLength;
    const inlineTextLength = this.selfInlineRange.length;
    if (totalTextLength === inlineTextLength) {
      doc.deleteBlock(block.model);
    } else {
      this.inlineEditor.formatText(this.selfInlineRange, { link: null });
    }
  }


  override render() {

    return html`
      <mahdaad-link-inline
        url="${this.url}"
        title="${this.title}"
        object-id="${this.block.doc.meta.object_id}"
        @removeLink="${this._removeLink}"
        @generateWeblink="${this.generateWeblink}"
        @changeViewMode="${(event: CustomEvent) => {
          const mode = event.detail;
          switch (mode) {
            case 'card':
              this._convertToCardView('card');
              break;
            case 'embed':
              this._convertToCardView('embed');
              break;
          }
        }}"
      >
      <v-text .str=${this.title}></v-text>
      </mahdaad-link-inline>
    `;

  }

  @property({ type: Object })
  accessor delta: DeltaInsert<AffineTextAttributes> = {
    insert: ZERO_WIDTH_FOR_EMPTY_LINE,
    attributes: {},
  };

  @property({ type: Boolean })
  accessor selected = false;

  @property({ attribute: false })
  accessor std!: BlockStdScope;
}
