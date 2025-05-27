import { CaptionedBlockComponent } from '@blocksuite/affine-components/caption';
import type { MahdaadObjectBlockModel } from '@blocksuite/affine-model';
import {
  EDGELESS_TOP_CONTENTEDITABLE_SELECTOR,
} from '@blocksuite/affine-shared/consts';
import { DocModeProvider } from '@blocksuite/affine-shared/services';
import type { BlockComponent } from '@blocksuite/std';
import { html, type TemplateResult } from 'lit';
import {merge} from 'lodash-es'

export class MahdaadObjectBlockComponent extends CaptionedBlockComponent<MahdaadObjectBlockModel> {

  override get topContenteditableElement() {
    if (this.std.get(DocModeProvider).getEditorMode() === 'edgeless') {
      return this.closest<BlockComponent>(
        EDGELESS_TOP_CONTENTEDITABLE_SELECTOR
      );
    }
    return this.rootComponent;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  removeBlock() {
    this.doc.deleteBlock(this.model);
  }

  //todo ali ghasami
  parentId() {
    //todo ali ghasami for meta object id in doc meta
    return (this.doc.meta && this.doc.meta?.object_id) ?? null;
  }

  duplicate() {
    this.doc.addSiblingBlocks(this.model, [
      {
        flavour: 'affine:mahdaad-object',
        object_id: this.model.props.object_id,
        type: this.model.props.type,
        show_type: this.model.props.show_type,
        //...this.model,
        //name: file.name,
        //size: file.size,
        //type: types[index],
      },
    ]);
    //tryRemoveEmptyLine(this.model);
  }

  setDirection(event: CustomEvent) {
    this.doc.updateBlock(this.model, { dir: event.detail[0] });
  }


  //todo ali ghasami
  _convertLink(event: CustomEvent) {
    /*const data = event.detail[0];
    const { doc } = this.model;
    const parent = doc.getParent(this.model);
    //assertExists(parent);
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


  override renderBlock(): TemplateResult<1> {
    return html`<div contenteditable="false">
      <mahdaad-object-link-component
        direction=${this.model.props.dir}
        .model="${this.model}"
        read-only="${this.doc.readonly}"
        object-id="${this.model.props.object_id}"
        file-id="${this.model.props.file_id ?? null}"
        parent-id="${this.parentId()}"
        link-id="${this.model.props.link_id}"
        type="${this.model.props.type}"
        show-type="${this.model.props.show_type}"
        meta="${JSON.stringify(this.model.props.meta ?? {})}"
        @remove="${() => {
           this.removeBlock();
        }}"
        @setDirection="${this.setDirection}"
        @duplicate="${() => {
            this.duplicate();
        }}"
        @changeViewMode="${this.changeViewMode}"
        @convertToLink="${this._convertLink}"
        @updateProps="${this.updateProps}"
      ></mahdaad-object-link-component>
    </div>`;
  }

  updateProps(event: CustomEvent) {
    const props = event.detail[0];
    //console.log("this is props",props);
    //...this.model,
    //meta:{...props}
    //const meta=
    props.meta = merge(this.model.props.meta, props.meta ?? {});
    this.doc.updateBlock(this.model, props);
  }

  //todo ali ghasami
  changeViewMode(event: CustomEvent) {
    /*const mode = event.detail[0];
    //console.log("111111",this.model.type);
    if (
      ['document', 'image', 'weblink'].includes(this.model.type) &&
      mode == 'inline'
    ) {
      const { doc } = this.model;
      const parent = doc.getParent(this.model);
      assertExists(parent);
      const index = parent.children.indexOf(this.model);
      const yText = new DocCollection.Y.Text();
      yText.insert(0, REFERENCE_NODE);
      yText.format(0, REFERENCE_NODE.length, {
        mahdaadObjectLink: {
          object_id: this.model.object_id,
          link_id: this.model.link_id,
          type: this.model.type,
        },
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
      doc.deleteBlock(this.model);
    } else {
      this.doc.updateBlock(this.model, {
        show_type: mode,
      });
    }*/
  }
}
