import { CaptionedBlockComponent } from '@blocksuite/affine-components/caption';
import type { MahdaadTableOfContentBlockModel } from '@blocksuite/affine-model';
import { html, type TemplateResult } from 'lit';
import {  state } from 'lit/decorators.js';

export class MahdaadTableOfContentBlockComponent extends CaptionedBlockComponent<MahdaadTableOfContentBlockModel> {
  override connectedCallback() {
    super.connectedCallback();
    this.list= this.doc?.meta?.headingList ?? []
    //todo ali ghasami important
    /*this._disposables.add(
      this.doc.collection.slots.docUpdated.on(() => {
        this.list= this.doc?.meta?.headingList ?? []
      })
    );*/
  }

  changeOptions(event:CustomEvent) {
    const key=event.detail[0]
    switch (key) {
      case 'delete':
        this.doc.deleteBlock(this.model)
        break
      case 'right_to_left':
        this.doc.updateBlock(this.model, { dir: 'rtl'})
        break
      case 'left_to_right':
        this.doc.updateBlock(this.model, { dir: 'ltr'})
        break
    }
  }


  override renderBlock(): TemplateResult<1> {
    return html`<div contenteditable="false">
      <mahdaad-table-of-content-component
        list=${JSON.stringify(this.list)}
        direction=${this.model.props.dir}
        readonly="${this.doc.readonly}"
        @changeOption="${this.changeOptions}"
        @scrollBlock="${this.scrollToBlock}"
      >
      </mahdaad-table-of-content-component>
    </div>`;
  }

  scrollToBlock(event: CustomEvent) {
    const blockId = event.detail[0];
    const block = this.host.view.getBlock(blockId);
    if (block) {
      block.scrollIntoView({ behavior: 'smooth', block: 'center' });
      block.classList.add('highlight-heading-animation');
      setTimeout(() => {
        block.classList.remove('highlight-heading-animation');
      }, 3000);
    }
  }


  /*setDirection(event: CustomEvent) {
    this.doc.updateBlock(this.model, {dir:event.detail});
  }*/

  @state()
  accessor list: any[] = [];


  //todo ali ghasami
  /*override previewName(): string {
    return  getBlockName(this)
    //return 'Table of content'
  }*/

}
