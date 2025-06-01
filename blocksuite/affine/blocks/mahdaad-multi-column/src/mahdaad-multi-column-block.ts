import { CaptionedBlockComponent } from '@blocksuite/affine-components/caption';
import type { MahdaadMultiColumnBlockModel } from '@blocksuite/affine-model';
import { BlockModel } from '@blocksuite/store';
import { html, nothing, type TemplateResult } from 'lit'
import { property } from 'lit/decorators.js';
import { pick } from 'lodash-es';
export class MahdaadMultiColumnBlockComponent extends CaptionedBlockComponent<MahdaadMultiColumnBlockModel> {

  override connectedCallback() {
    super.connectedCallback();
  }

  addColumn(currentIndex: number, position: 'left' | 'right') {
    const temp = this.model.children[currentIndex];
    const ids = this.doc.addSiblingBlocks(
      temp,
      [{ flavour: 'affine:note' }],
      position == 'left' ? 'before' : 'after'
    );
    this.doc.addBlock('affine:paragraph', {}, ids[0]);
  }

  override renderBlock(): TemplateResult<1> {
    const children = this.model.children.map(item => {
      const temp = new BlockModel();
      temp.children.push(item);
      return temp;
    });
    //console.log("this is children in block suite",children.length);
    return html` <div>
      <mahdaad-multi-column-component
        read-only="${this.doc.readonly}"
        column-count="${children.length}"
        sizes="${JSON.stringify(this.model.props.sizes)}"
        @add-column="${(event: CustomEvent) => {
      const detail = event.detail;
      this.addColumn(detail[0], detail[1]);
    }}"
        @update-props="${(event: CustomEvent) => {
      this.updateProps(event);
    }}"
        @move-column="${(event: CustomEvent) => {
      const detail = event.detail;
      this.moveColumn(detail[0], detail[1]);
    }}"
        @delete-column="${(event: CustomEvent) => {
      const detail = event.detail;
      this.deleteColumn(detail[0]);
    }}"
        @fullWidth="${(event: CustomEvent) => {
      const detail = event.detail;
      this.fullWidth(detail[0]);
    }}"
        @fullWidthAll="${this.fullWidthAll}"
        @deleteBlock="${this.deleteBlock}"
        @mount="${() => {
      this._isLoad = true;
    }}"
      >
        <div slot="slot_0">
           ${this._isLoad && children[0]
      ? this.renderChildren(children[0])
      : nothing}
        </div>
        <div slot="slot_1">
          ${this._isLoad && children[1]
      ? this.renderChildren(children[1])
      : nothing}
        </div>
        <div slot="slot_2">
          ${this._isLoad && children[2]
      ? this.renderChildren(children[2])
      : nothing}
        </div>
        <div slot="slot_3">
          ${this._isLoad && children[3]
      ? this.renderChildren(children[3])
      : nothing}
        </div>
      </mahdaad-multi-column-component>
    </div>`;
  }

  updateProps(event: CustomEvent) {
    const props = event.detail[0];
    const normal = pick(props, ['sizes']);
    this.doc.updateBlock(this.model, {
      ...normal,
    });
  }

  moveColumn(currentIndex: number, position: 'left' | 'right') {
    const moveIndex= position == 'left' ? currentIndex - 1 : currentIndex + 1
    const target = this.model.children[moveIndex]
    const sizes= this.model.props.sizes.slice(0)
    const temp= sizes[currentIndex]
    sizes[currentIndex]=sizes[moveIndex]
    sizes[moveIndex]= temp
    this.doc.moveBlocks(
      [this.model.children[currentIndex]],
      this.model,
      target,
      position == 'left'
    );
    this.doc.updateBlock(this.model, {
      sizes
    });
  }


  @property({ attribute: false })
  accessor _isLoad: boolean = false;

  //todo ali ghasami
  /*override previewName(): string {
    return  getBlockName(this)
    //return  `${this.model.children.length} columns`
  }*/


  fullWidthAll() {
    this.model.children.slice(1).forEach(child => {
      this.doc.addSiblingBlocks(
        this.model,
        [{ flavour: 'affine:mahdaad-multi-column', count: 1 }],
        'after'
      );

      const previousSibling = this.doc.getNext(this.model);
      if (previousSibling) {
        this.doc.moveBlocks([child], previousSibling);
      }
    });
  }

  deleteColumn(currentIndex: number) {
    if (this.model.children.length == 1) {
      this.doc.deleteBlock(this.model);
    } else {
      this.doc.deleteBlock(this.model.children[currentIndex]);
    }
  }

  fullWidth(currentIndex: number) {
    this.doc.addSiblingBlocks(
      this.model,
      [{ flavour: 'affine:mahdaad-multi-column', count: 1 }],
      'after'
    );

    const previousSibling = this.doc.getNext(this.model);
    if (previousSibling) {
      this.doc.moveBlocks([this.model.children[currentIndex]], previousSibling);
    }
  }

  deleteBlock() {
    this.doc.deleteBlock(this.model);
  }

}
