import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import {
  BLOCK_ID_ATTR,
  type BlockComponent,
  type BlockStdScope,
} from '@blocksuite/std';
import { ShadowlessElement } from '@blocksuite/std';
import {
  INLINE_ROOT_ATTR,
  type InlineRootElement,
  ZERO_WIDTH_FOR_EMBED_NODE,
  ZERO_WIDTH_FOR_EMPTY_LINE,
} from '@blocksuite/std/inline';
import type { DeltaInsert } from '@blocksuite/store';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

//todo ali ghasami for remove or change prefix class
import { prefixCls } from '../../../../../../src/claytapEditor/const';

export class MahdaadMention extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  get inlineEditor() {
    const inlineRoot = this.closest<InlineRootElement<AffineTextAttributes>>(
      `[${INLINE_ROOT_ATTR}]`
    );
    return inlineRoot?.inlineEditor;
  }

  get blockElement() {
    const blockElement = this.inlineEditor.rootElement.closest<BlockComponent>(
      `[${BLOCK_ID_ATTR}]`
    );
    //assertExists(blockElement);
    return blockElement;
  }

  get userId() {
    return this.delta.attributes?.mention?.user_id ?? null;
  }

  override render() {
    /*return html`this is mahdddad mention<span
          data-selected=${this.selected}
          data-type="default"
          class="affine-mention"
          >@aaaaaaa<v-text
            .str=${ZERO_WIDTH_FOR_EMBED_NODE}
          ></v-text
        ></span>`;*/

    return html`<span
      data-selected=${this.selected}
      data-type="default"
      class="${prefixCls}-mahdaad-mention"
      style="display: inline-block"
    >
      <mahdaad-mention-item
        is-read-only="${this.blockElement.doc.readonly ?? false}"
        user-id="${this.userId}"
      ></mahdaad-mention-item>
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
