import type { NoteBlockModel } from '@blocksuite/affine-model';
import { BlockComponent } from '@blocksuite/std';
import { effect } from '@preact/signals-core';
import { css, html } from 'lit';

//todo ali ghasami for fix import
import { checkNotEmptyNote } from '../../../../../../src/claytapEditor/utils/index.ts';

export class NoteBlockComponent extends BlockComponent<NoteBlockModel> {
  static override styles = css`
    .affine-note-block-container {
      display: flow-root;
    }
    .affine-note-block-container.selected {
      background-color: var(--affine-hover-color);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.disposables.add(
      effect(() => {
        checkNotEmptyNote(this.model, this.doc);
      })
    );
  }

  override renderBlock() {
    return html`
      <div class="affine-note-block-container">
        <div class="affine-block-children-container">
          ${this.renderChildren(this.model)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-note': NoteBlockComponent;
  }
}
