import { CaptionedBlockComponent } from '@blocksuite/affine-components/caption';
import type { MahdaadWeblinkBlockModel } from '@blocksuite/affine-model';
import { html, type TemplateResult } from 'lit';
import type { DeltaInsert } from '@blocksuite/store';
import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import type { ObjectLink } from '../../../../../../src/claytapEditor/types';
import { Text } from '@blocksuite/store';
import { getBlockName } from '../../../../../../src/claytapEditor/utils';

export class MahdaadWeblinkBlockComponent extends CaptionedBlockComponent<MahdaadWeblinkBlockModel> {
  override connectedCallback() {
    super.connectedCallback();
  }

  changeViewMode(event: CustomEvent) {
    const mode = event.detail[0];
    if (mode == 'inline') {
      const { doc } = this.model;
      const parent = doc.getParent(this.model);
      const index = parent.children.indexOf(this.model);

      const text = new Text([
        {
          insert: this.model.props.title ?? this.model.props.url ?? '',
          attributes: {
            link: this.model.props.url,
            reference: null,
          },
        },
      ] as DeltaInsert<AffineTextAttributes>[]);

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
    }
  }

  generateWeblink(event: CustomEvent) {
    const lnk: ObjectLink = event.detail;
    this.doc.addSiblingBlocks(this.model, [
      {
        flavour: 'affine:mahdaad-object',
        object_id: lnk.object_id,
        type: lnk.type,
        link_id: lnk.link_id,
        show_type: 'card',
        //...this.model,
        //name: file.name,
        //size: file.size,
        //type: types[index],
      },
    ]);
    this.doc.deleteBlock(this.model);
    /*if (!this.inlineEditor.isValidInlineRange(this.targetInlineRange)) return;
    this.inlineEditor.insertText(this.targetInlineRange, REFERENCE_NODE, {
      mahdaadObjectLink: {
        object_id: lnk.object_id,
        link_id: lnk.link_id,
        type: lnk.type,
      },
      reference: null,
    });
    this.abortController.abort();*/
  }

  override renderBlock(): TemplateResult<1> {
    return html`<div contenteditable="false">
      <mahdaad-weblink
        .model="${this.model}"
        object-id="${this.doc.meta.id}"
        read-only="${this.doc.readonly}"
        show-type="${this.model.props.show_type}"
        url="${this.model.props.url}"
        title="${this.model.props.title}"
        @remove="${() => {
          this.removeBlock();
        }}"
        @save="${this.save}"
        @changeViewMode="${this.changeViewMode}"
        @generateWeblink="${this.generateWeblink}"
      ></mahdaad-weblink>
    </div>`;
  }

  override previewName(): string {
    return getBlockName(this);
  }

  save(event: CustomEvent) {
    const data = event.detail[0];
    this.doc.updateBlock(this.model, {
      title: data.title,
      url: data.url,
    });
    //this.model.propsUpdated
    //this._onConfirm(data.title, data.url);
  }

  removeBlock() {
    this.doc.deleteBlock(this.model);
  }
}
