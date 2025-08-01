import { unsafeCSSVarV2 } from '@blocksuite/affine-shared/theme';
import { property } from 'lit/decorators.js';
import { css, html, LitElement, nothing } from 'lit';
import {  ShadowlessElement } from '@blocksuite/affine/std'

/*
const BLOCK_PREVIEW_ICON_MAP: Record<
  string,
  {
    icon: typeof ShapeIcon;
    name: string;
  }
> = {
  shape: {
    icon: ShapeIcon,
    name: 'Edgeless shape',
  },
  'affine:image': {
    icon: ImageIcon,
    name: 'Image block',
  },
  'affine:note': {
    icon: PageIcon,
    name: 'Note block',
  },
  'affine:frame': {
    icon: FrameIcon,
    name: 'Frame block',
  },
  'affine:embed-': {
    icon: EmbedIcon,
    name: 'Embed block',
  },
};
*/

declare global {
  interface HTMLElementTagNameMap {
    'doc-dnd-preview-element': DocDndPreviewElement;
  }
}

export const DOC_DND_PREVIEW_ELEMENT = 'doc-dnd-preview-element';

export class DocDndPreviewElement extends ShadowlessElement {
  static override styles = css`
    .edgeless-dnd-preview-container {
      position: relative;
      padding: 12px;
      width: 264px;
      height: 80px;
    }

    .edgeless-dnd-preview-block {
      display: flex;
      position: absolute;

      width: 234px;

      align-items: flex-start;
      box-sizing: border-box;

      border-radius: 8px;
      background-color: ${unsafeCSSVarV2(
        'layer/background/overlayPanel',
        '#FBFBFC'
      )};

      padding: 8px 20px;
      gap: 8px;

      transform-origin: center;

      font-family: var(--affine-font-family);
      box-shadow: 0px 0px 0px 0.5px #e3e3e4 inset;
    }

    .edgeless-dnd-preview-block > svg {
      color: ${unsafeCSSVarV2('icon/primary', '#77757D')};
    }

    .edgeless-dnd-preview-block > .text {
      color: ${unsafeCSSVarV2('text/primary', '#121212')};
      font-size: 14px;
      line-height: 24px;
    }
  `;

  /*@property({ type: Array })
  accessor elementTypes: {
    type: string;
  }[] = [];*/

  /*private _getPreviewIcon(type: string) {
    if (BLOCK_PREVIEW_ICON_MAP[type]) {
      return BLOCK_PREVIEW_ICON_MAP[type];
    }

    if (type.startsWith('affine:embed-')) {
      return BLOCK_PREVIEW_ICON_MAP['affine:embed-'];
    }

    return {
      icon: ShapeIcon,
      name: 'Edgeless content',
    };
  }*/

  @property({ attribute: false })
  accessor text: string = '-';

  @property({ attribute: false })
  accessor tooltipMessage: string = '';

  override render() {
    return html`<style>
        doc-dnd-preview-element {
          //width: 300px;
          display: block;
          //height: 400px;
            //position: absolute;
            //background-color: red;
            box-sizing: border-box;
            position: absolute;
            //display: block;

            top: 0;
            left: 0;
            transform-origin: 0 0;
           // opacity: 0.5;
            user-select: none;
            pointer-events: none;
            caret-color: transparent;
            z-index: 3;
          }

          .affine-drag-preview-grabbing * {
            cursor: grabbing !important;
          }
      </style>
      <div style="display: block;">
        <span class="hint"> ${this.text ?? '-'} </span>
        ${this.tooltipMessage
          ? html`<div class="tooltip-message">${this.tooltipMessage}</div>`
          : nothing}
      </div> `;

    /* const blocks = repeat(this.elementTypes.slice(0, 3), ({ type }, index) => {
      const { icon, name } = this._getPreviewIcon(type);

      return html`<div
        class="edgeless-dnd-preview-block"
        style=${styleMap({
          transform: `rotate(${index * -2}deg)`,
          zIndex: 3 - index,
        })}
      >
        ${icon({ width: '24px', height: '24px' })}
        <span class="text">${name}</span>
      </div>`;
    });*/
    /*return html`<div
      class="edgeless-dnd-preview-container"
      style="height: 150px;width: 150px;background-color: red"
    ></div>`;*/
  }
}
