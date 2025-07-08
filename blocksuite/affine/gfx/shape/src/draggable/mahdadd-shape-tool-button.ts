import { ShapeTablerIcon } from '@blocksuite/affine-components/icons';
import { type ShapeName, ShapeType } from '@blocksuite/affine-model';
import { EdgelessToolbarToolMixin } from '@blocksuite/affine-widget-edgeless-toolbar';
import { SignalWatcher } from '@blocksuite/global/lit';
import { css, html, LitElement } from 'lit';

import { ShapeTool } from '../shape-tool.js';
import type { DraggableShape } from './utils.js';

export class MahdaadEdgelessShapeToolButton extends EdgelessToolbarToolMixin(
  SignalWatcher(LitElement)
) {
  static override styles = css`
    :host {
      display: block;
      //width: 100%;
      //height: 100%;
    }
  `;

  private readonly _handleShapeClick = (shape: DraggableShape) => {
    this.setEdgelessTool(this.type, {
      shapeName: shape.name,
    });
    if (!this.popper) this._toggleMenu();
  };

  private readonly _handleWrapperClick = () => {
    if (this.tryDisposePopper()) return;

    this.setEdgelessTool(this.type, {
      shapeName: ShapeType.Rect,
    });
    if (!this.popper) this._toggleMenu();
  };

  override type = 'shape' as const;

  private _toggleMenu() {
    this.createPopper('edgeless-shape-menu', this, {
      setProps: ele => {
        ele.edgeless = this.edgeless;
        ele.onChange = (shapeName: ShapeName) => {
          this.setEdgelessTool(this.type, {
            shapeName,
          });
          this._updateOverlay();
        };
      },
    });
  }

  private _updateOverlay() {
    const controller = this.gfx.tool.currentTool$.peek();
    if (controller instanceof ShapeTool) {
      controller.createOverlay();
    }
  }

  override render() {
    const { active } = this;

    return html`
      <edgeless-tool-icon-button
        class="edgeless-shape-button"
        .tooltip=${this.popper
          ? ''
          : html`<affine-tooltip-content-with-shortcut
              data-tip="${'Shape'}"
              data-shortcut="${'S'}"
            ></affine-tooltip-content-with-shortcut>`}
        .tooltipOffset=${17}
        .iconContainerPadding=${6}
        .iconSize=${'24px'}
        .active=${active}
        @click=${this._handleWrapperClick}
      >
        <!-- <edgeless-toolbar-shape-draggable
          .edgeless=${this.edgeless}
          .toolbarContainer=${this.toolbarContainer}
          class="shapes"
          @click=${this._handleWrapperClick}
          .onShapeClick=${this._handleShapeClick}
        >
        </edgeless-toolbar-shape-draggable> -->
        ${ShapeTablerIcon}
        <toolbar-arrow-up-icon></toolbar-arrow-up-icon>
      </edgeless-tool-icon-button>
    `;
  }
}
