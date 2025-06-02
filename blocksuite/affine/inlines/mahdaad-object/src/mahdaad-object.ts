import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts'
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
import {cloneDeep,merge} from 'lodash-es'

export class MahdaadObject extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {

  get block() {
    if (!this.inlineEditor?.rootElement) return null;
    const block = this.inlineEditor.rootElement.closest<BlockComponent>(
      `[${BLOCK_ID_ATTR}]`
    );
    return block;
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

  _convertLink(event: CustomEvent) {
    const data = event.detail[0];
    this.inlineEditor.insertText(this.selfInlineRange, data.title, {
      link: data.url,
      reference: null,
    });
    /*const { doc } = this.model;
    const parent = doc.getParent(this.model);
    assertExists(parent);
    const index = parent.children.indexOf(this.model);
    const yText = new DocCollection.Y.Text();
    yText.insert(0, data.title);
    yText.format(0, data.title.length, {
      link: data.url,
      reference: null,
    });
    const text = new doc.Text(yText);
    doc.addBlock(
      'affine:paragraph',
      {
        text,
      },
      parent,
      index
    );
    doc.deleteBlock(this.model);*/
  }


  changeViewMode(event: CustomEvent) {
    const mode = event.detail[0];

    if (mode == 'inline') return;

    const block = this.block;
    const doc = block.host.doc;
    const parent = doc.getParent(block.model);
    assertExists(parent);

    const index = parent.children.indexOf(block.model);
    //const docId = this.referenceDocId;

    //return
    const meta = this.getMeta();
    doc.addBlock(
      'affine:mahdaad-object',
      {
        link_id: meta?.link_id,
        object_id: meta?.object_id,
        type: meta?.type,
        show_type: mode,
      },
      parent,
      index + 1
    );
    const totalTextLength = this.inlineEditor.yTextLength;
    const inlineTextLength = this.selfInlineRange.length;
    if (totalTextLength === inlineTextLength) {
      doc.deleteBlock(block.model);
    } else {
      this.inlineEditor.insertText(this.selfInlineRange, REFERENCE_NODE); // this.docTitle
    }
  }

  parentId() {
    const block = this.block;
    const doc = block.host.doc;
    return (doc.meta && doc.meta?.object_id) ?? null
  }


  remove() {
    this.inlineEditor.insertText(this.selfInlineRange, REFERENCE_NODE);
  }

  getMeta() {
    return this.delta.attributes?.mahdaadObjectLink;
  }


  updateProps(event) {
    const data = event?.detail;
    const format = this.inlineEditor.getFormat(this.selfInlineRange);
    if(format.mahdaadObjectLink) {
      merge(format.mahdaadObjectLink,{meta:data.meta})
    }
    //console.log("this is format",format,cloneDeep(format));
    //
    this.inlineEditor.formatText(this.selfInlineRange, {
      ...cloneDeep(format)  /*{
        object_id: '11111',
        link_id: '225',
        type: 'image',
        //meta?:Record<string, string | null | number> | undefined
      } //cloneDeep(format.mahdaadObjectLink)*/
    });
    /*if (data && data.key && data.hasOwnProperty('value')) {

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
    }*/
  }

  get blockElement() {
    const blockElement = this.inlineEditor.rootElement.closest<BlockComponent>(
      `[${BLOCK_ID_ATTR}]`
    );
    //assertExists(blockElement);
    return blockElement;
  }


  override render() {

    const meta = this.getMeta();

    return html`<span
      data-selected=${this.selected}
      class="mahdaad-object-link-inline"
      ><mahdaad-object-link-component
        style="display: inline"
        read-only="${this.blockElement.doc.readonly}"
        object-id="${meta?.object_id}"
        link-id="${meta?.link_id}"
        parent-id="${this.parentId()}"
        type="${meta?.type}"
        show-type="inline"
        @changeViewMode="${this.changeViewMode}"
        @convertToLink="${this._convertLink}"
        @updateProps="${this.updateProps}"
        meta="${JSON.stringify(meta?.meta ?? {})}"
        @remove="${this.remove}"
      ></mahdaad-object-link-component
      ><v-text .str=${ZERO_WIDTH_FOR_EMBED_NODE}></v-text>
    </span>`;

   /* return html`this is object link <span
          data-selected=${this.selected}
          data-type="default"
          class="affine-mention"
          >@aaaaaaa<v-text
            .str=${ZERO_WIDTH_FOR_EMBED_NODE}
          ></v-text
        ></span>`;*/
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
