import { unsafeCSSVarV2 } from '@blocksuite/affine-shared/theme';
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

const styles = css`
  :host {
    display: flex;
  }

  .switch {
    height: 0;
    width: 0;
    visibility: hidden;
    margin: 0;
  }

  label {
    cursor: pointer;
    text-indent: -9999px;
    width: 38px;
    height: 20px;
    background: ${unsafeCSSVarV2('toggle/backgroundOff')};
    display: block;
    border-radius: 20px;
    position: relative;
  }

  label:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: ${unsafeCSSVarV2('toggle/foreground')};
    border-radius: 16px;
    transition: 0.1s;
  }

  label.on {
    background: ${unsafeCSSVarV2('toggle/background')};
  }

  label.on:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }

  label:active:after {
    width: 24px;
  }
`;

export class ToggleSwitch extends LitElement {
  static override styles = styles;

  private _toggleSwitch() {
    this.on = !this.on;
    if (this.onChange) {
      this.onChange(this.on);
    }
  }

  override render() {
    return html`
      <label class=${this.on ? 'on' : ''}>
        <input
          type="checkbox"
          class="switch"
          ?checked=${this.on}
          @change=${this._toggleSwitch}
        />
      </label>
    `;
  }

  @property({ attribute: false })
  accessor on = false;

  @property({ attribute: false })
  accessor onChange: ((on: boolean) => void) | undefined = undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'toggle-switch': ToggleSwitch;
  }
}
