import { AFFINE_SLASH_MENU_WIDGET } from './consts';
import { SlashMenu } from './slash-menu-popover';
import { AffineSlashMenuWidget } from './widget';

export function effects() {
  customElements.define(AFFINE_SLASH_MENU_WIDGET, AffineSlashMenuWidget);
  customElements.define('affine-slash-menu', SlashMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    [AFFINE_SLASH_MENU_WIDGET]: AffineSlashMenuWidget;
  }
}
