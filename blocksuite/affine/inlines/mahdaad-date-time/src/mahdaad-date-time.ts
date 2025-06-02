import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import { BLOCK_ID_ATTR, type BlockComponent, type BlockStdScope } from '@blocksuite/std'
import { ShadowlessElement } from '@blocksuite/std';
import {
  INLINE_ROOT_ATTR,
  type InlineRootElement,
  ZERO_WIDTH_FOR_EMBED_NODE,
  ZERO_WIDTH_FOR_EMPTY_LINE,
} from '@blocksuite/std/inline'
import type { DeltaInsert } from '@blocksuite/store';
import {  html } from 'lit';
import { property } from 'lit/decorators.js';

import { prefixCls } from '../../../../../../src/claytapEditor/const'

export class MahdaadDateTime extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {

  addParagraph() {
    setTimeout(()=>{
      this.std.command.exec('addParagraph');
    },50)
  }

  get inlineEditor() {
    const inlineRoot = this.closest<InlineRootElement<AffineTextAttributes>>(
      `[${INLINE_ROOT_ATTR}]`
    );
    return inlineRoot?.inlineEditor;
  }

  get selfInlineRange() {
    const selfInlineRange = this.inlineEditor?.getInlineRangeFromElement(this);
    return selfInlineRange;
  }


  selfUpdate(event) {
    const data = event?.detail;
    if (data && data.key && data.hasOwnProperty('value')) {
      const format = this.inlineEditor.getFormat(this.selfInlineRange);
      if (format?.date?.id) {
        const date = JSON.parse(JSON.stringify(format.date));
        const {value, key} = data
        if (value === undefined && date[key] !== undefined)
          delete date[key];
        else date[key] = value
        this.inlineEditor.formatText(this.selfInlineRange, {
          date,
        });
      }
    }
  }

  get blockElement() {
    const blockElement = this.inlineEditor.rootElement.closest<BlockComponent>(
      `[${BLOCK_ID_ATTR}]`
    );
    //assertExists(blockElement);
    return blockElement;
  }

  override render() {


    return html`<span >
      <mahdaad-date-time
        class="${prefixCls}-date-time"
        data-event-id="${this.id}"
        @update=${this.selfUpdate}
        @addParagraph="${this.addParagraph}"
        read-only="${this.blockElement.doc.readonly}"
        date="${this.delta.attributes?.date?.date}"
        time="${this.delta.attributes?.date?.time}"
        id="${this.delta.attributes?.date?.id}"
        meta="${this.delta.attributes?.date?.meta}"
      >
      </mahdaad-date-time>
      <v-text .str=${ZERO_WIDTH_FOR_EMBED_NODE}></v-text>
    </span>`;
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
