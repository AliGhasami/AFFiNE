import { WithDisposable } from '@blocksuite/global/lit';
import { ToggleDownIcon, ToggleRightIcon } from '@blocksuite/icons/lit';
import { ShadowlessElement } from '@blocksuite/std';
import { css, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit-html';
import { styleMap } from 'lit/directives/style-map.js';
import { getDirection } from '../../../../../../src/claytapEditor/utils';

export const TOGGLE_BUTTON_PARENT_CLASS = 'blocksuite-toggle-button-parent';

export class ToggleButton extends WithDisposable(ShadowlessElement) {
  static override styles = css`
    .toggle-icon {
      display: flex;
      align-items: start;
      justify-content: start;
      position: absolute;
      width: 16px;
      height: 16px;
      top: calc((1em - 16px) / 2 + 5px);
      //left: 0;
      //transform: translateX(100%);
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    .toggle-icon:hover {
      background: var(--affine-hover-color);
    }

    .toggle-icon[data-collapsed='true'] {
      opacity: 1;
    }

    .${unsafeCSS(TOGGLE_BUTTON_PARENT_CLASS)}:hover .toggle-icon {
      opacity: 1;
    }

    .with-drag-handle .toggle-icon {
      opacity: 1;
    }
    .with-drag-handle .affine-block-children-container .toggle-icon {
      opacity: 0;
    }
  `;

  get _dir() {
    return this.direction ? this.direction : getDirection();
  }

  override render() {
    const style = {
      transform: `translateX(${this._dir == 'ltr' ? '-100%' : '100%'})`,
    };

    const toggleRightStyle = {
      transform: `translateX(${this._dir == 'ltr' ? '-100%' : '100%'}) rotate(${this._dir == 'ltr' ? '0deg' : '-180deg'} )`,
    };

    const toggleDownTemplate = html`
      <div
        style="${styleMap(style)}"
        contenteditable="false"
        class="toggle-icon"
        @click=${() => this.updateCollapsed(!this.collapsed)}
      >
        ${ToggleDownIcon({
          width: '16px',
          height: '16px',
          style: 'color: #77757D',
        })}
      </div>
    `;

    const toggleRightTemplate = html`
      <div
        style="${styleMap(toggleRightStyle)}"
        contenteditable="false"
        class="toggle-icon"
        data-collapsed=${this.collapsed}
        @click=${() => this.updateCollapsed(!this.collapsed)}
      >
        ${ToggleRightIcon({
          width: '16px',
          height: '16px',
          style: 'color: #77757D',
        })}
      </div>
    `;

    return this.collapsed ? toggleRightTemplate : toggleDownTemplate;
  }

  @property({ attribute: false })
  accessor collapsed!: boolean;

  @property({ attribute: false })
  accessor direction!: 'rtl' | 'ltr' | null;

  @property({ attribute: false })
  accessor updateCollapsed!: (collapsed: boolean) => void;
}

declare global {
  interface HTMLElementTagNameMap {
    'blocksuite-toggle-button': ToggleButton;
  }
}
