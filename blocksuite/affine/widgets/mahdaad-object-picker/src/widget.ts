import type { RootBlockModel } from '@blocksuite/affine-model';
import {
  getRangeRects,
  type SelectionRect,
} from '@blocksuite/affine-shared/commands';
import { FeatureFlagService } from '@blocksuite/affine-shared/services';
import { getViewportElement } from '@blocksuite/affine-shared/utils';
import { IS_MOBILE } from '@blocksuite/global/env';
import type { BlockComponent } from '@blocksuite/std';
import {
  BLOCK_ID_ATTR,
  WidgetComponent,
  WidgetViewExtension,
} from '@blocksuite/std';
import { GfxControllerIdentifier } from '@blocksuite/std/gfx';
import {
  INLINE_ROOT_ATTR,
  type InlineEditor,
  type InlineRootElement,
} from '@blocksuite/std/inline';
import { BlockModel } from '@blocksuite/store'
import { signal } from '@preact/signals-core';
import { html, nothing } from 'lit';
import { choose } from 'lit/directives/choose.js';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { objectTriggerWords } from '../../../../../../src/claytapEditor/utils.ts'
import {
  type IObjectType,
  MAHDAAD_OBJECT_PICKER_WIDGET,
  type ObjectPickerContext,
  type ObjectPickerWidgetConfig,
} from './config.js'

export class MahdaadObjectPickerWidget extends WidgetComponent<RootBlockModel> {
  //static override styles = linkedDocWidgetStyles;

  private _context: ObjectPickerContext | null = null;

  private readonly _inputRects$ = signal<SelectionRect[]>([]);

  private readonly _mode$ = signal<'desktop' | 'mobile' | 'none'>('none');

  static DEFAULT_OPTIONS: ObjectPickerWidgetConfig = {
    /**
     * The first item of the trigger keys will be the primary key
     */
    triggerKeys: [
      //'@',
      //comment for support mention
      //'@',
    ],
    triggerWords: [
      {
        words: objectTriggerWords.file,
        type: 'file',
      },
      {
        words: objectTriggerWords.page,
        type: 'document',
      },
      {
        words: objectTriggerWords.image,
        type: 'image',
      },
      {
        words: objectTriggerWords.weblink,
        type: 'weblink',
      },
      {
        words: objectTriggerWords.tag,
        type: 'tag',
      },
      {
        words: objectTriggerWords.template,
        type: 'template',
      },
    ],
    ignoreBlockTypes: ['affine:code'],
  };



  private _updateInputRects() {
    if (!this._context) return;
    const { inlineEditor, startRange, triggerKey } = this._context;

    const currentInlineRange = inlineEditor.getInlineRange();
    if (!currentInlineRange) return;

    const startIndex = startRange.index - triggerKey.length;
    const range = inlineEditor.toDomRange({
      index: startIndex,
      length: currentInlineRange.index - startIndex,
    });
    if (!range) return;

    this._inputRects$.value = getRangeRects(
      range,
      getViewportElement(this.host)
    );
  }

  private readonly _renderLinkedDocPopover = () => {
    return html`<mahdaad-object-picker-popover
      .context=${this._context}
    ></mahdaad-object-picker-popover>`;
  };


  private _watchInput() {
    this.handleEvent('beforeInput', ctx => {
      if (this._mode$.peek() !== 'none') return;

      const event = ctx.get('defaultState').event;
      if (!(event instanceof InputEvent)) return;

      if (event.data === null) return;

      const host = this.std.host;

      const range = host.range.value;
      if (!range || !range.collapsed) return;

      const containerElement =
        range.commonAncestorContainer instanceof Element
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;
      if (!containerElement) return;

      //if (containerElement.closest(this.config.ignoreSelector)) return;

      const block = containerElement.closest<BlockComponent>(
        `[${BLOCK_ID_ATTR}]`
      );
      if (!block || this.config.ignoreBlockTypes.includes(block.flavour))
        return;
      const model = block.model;

      const inlineRoot = containerElement.closest<InlineRootElement>(
        `[${INLINE_ROOT_ATTR}]`
      );
      if (!inlineRoot) return;

      const inlineEditor = inlineRoot.inlineEditor;
      const inlineRange = inlineEditor.getInlineRange();
      if (!inlineRange) return;
      const text = inlineEditor.yTextString;
      if (text) {
        this.config.triggerWords.forEach(item => {
          const temp=item.words.map(_=>_.toLowerCase())
          if (temp.includes(text.toLowerCase())) {
            const triggerKey= temp.find(key=>key==text.toLowerCase())
              ?? ''
            inlineEditor
              .waitForUpdate()
              .then(() => {
                this.show({
                  inlineEditor,
                  primaryTriggerKey:triggerKey,
                  mode: IS_MOBILE ? 'mobile' : 'desktop',
                  obj_type:item.type,
                  model
                });
              })
              .catch(console.error);
          }
        });
      }
    });
  }

  private _watchViewportChange() {
    const gfx = this.std.get(GfxControllerIdentifier);
    this.disposables.add(
      gfx.viewport.viewportUpdated.subscribe(() => {
        this._updateInputRects();
      })
    );
  }

  get config(): ObjectPickerWidgetConfig {
    return  MahdaadObjectPickerWidget.DEFAULT_OPTIONS
  }

  override connectedCallback() {
    super.connectedCallback();

    this._watchInput();
    this._watchViewportChange();
  }

  show(props?: {
    inlineEditor?: InlineEditor;
    primaryTriggerKey?: string;
    mode?: 'desktop' | 'mobile';
    obj_type: IObjectType;
    addTriggerKey?: boolean;
    model:BlockModel
  }) {
    const host = this.host;
    const {
      primaryTriggerKey = '',
      mode = 'desktop',
      obj_type='document'
      //addTriggerKey = false,
    } = props ?? {};
    let inlineEditor: InlineEditor;
    if (!props?.inlineEditor) {
      const range = host.range.value;
      if (!range || !range.collapsed) return;
      const containerElement =
        range.commonAncestorContainer instanceof Element
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;
      if (!containerElement) return;
      const inlineRoot = containerElement.closest<InlineRootElement>(
        `[${INLINE_ROOT_ATTR}]`
      );
      if (!inlineRoot) return;
      inlineEditor = inlineRoot.inlineEditor;
    } else {
      inlineEditor = props.inlineEditor;
    }

    /*if (addTriggerKey) {
      this._addTriggerKey(inlineEditor, primaryTriggerKey);
      // we need to wait the range sync to get the correct startNativeRange
      const subscription = inlineEditor.slots.inlineRangeSync.subscribe(() => {
        this.show({ ...props, addTriggerKey: false });
        subscription.unsubscribe();
      });
      return;
    }*/

    const startRange = inlineEditor.getInlineRange();
    if (!startRange) return;

    const startNativeRange = inlineEditor.getNativeRange();
    if (!startNativeRange) return;

    const disposable = inlineEditor.slots.renderComplete.subscribe(() => {
      this._updateInputRects();
    });
    this._context = {
      std: this.std,
      inlineEditor,
      startRange,
      startNativeRange,
      triggerKey: primaryTriggerKey,
      config: this.config,
      obj_type,
      model:props.model,
      close: () => {
        disposable.unsubscribe();
        this._inputRects$.value = [];
        this._mode$.value = 'none';
        this._context = null;
      },
    };

    this._updateInputRects();

    const enableMobile = this.doc
      .get(FeatureFlagService)
      .getFlag('enable_mobile_linked_doc_menu');
    this._mode$.value = enableMobile ? mode : 'desktop';
  }

  override render() {
    if (this._mode$.value === 'none') return nothing;
    //${this._renderInputMask()}
    return html`
      <blocksuite-portal
        .shadowDom=${false}
        .template=${choose(
          this._mode$.value,
          [
            ['desktop', this._renderLinkedDocPopover],
            //['mobile', this._renderLinkedDocMenu],
            ['mobile', this._renderLinkedDocPopover],
          ],
          () => html`${nothing}`
        )}
      ></blocksuite-portal>`;
  }
}

export const mahdaadObjectWidget = WidgetViewExtension(
  'affine:page',
  MAHDAAD_OBJECT_PICKER_WIDGET,
  literal`${unsafeStatic(MAHDAAD_OBJECT_PICKER_WIDGET)}`
);

declare global {
  interface HTMLElementTagNameMap {
    [MAHDAAD_OBJECT_PICKER_WIDGET]: MahdaadObjectPickerWidget;
  }
}
