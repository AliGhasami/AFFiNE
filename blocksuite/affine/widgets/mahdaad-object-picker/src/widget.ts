import type { RootBlockModel } from '@blocksuite/affine-model';
import {
  getRangeRects,
  type SelectionRect,
} from '@blocksuite/affine-shared/commands';
import { FeatureFlagService } from '@blocksuite/affine-shared/services';
import {
  getCurrentNativeRange,
  getPopperPosition,
  getViewportElement,
} from '@blocksuite/affine-shared/utils';
import { IS_MOBILE } from '@blocksuite/global/env';
import {
  type BlockComponent,
  BlockStdScope,
  EditorHost,
} from '@blocksuite/std';
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
import { BlockModel } from '@blocksuite/store';
import { signal } from '@preact/signals-core';
import {
  getDirection,
  objectTriggerWords,
} from '../../../../../../src/claytapEditor/utils.ts';
import {
  type IObjectType,
  MAHDAAD_OBJECT_PICKER_WIDGET,
  type ObjectPickerWidgetConfig,
} from './config.js';
import { literal, unsafeStatic } from 'lit/static-html.js';
import debounce from 'lodash-es/debounce';

import { DisposableGroup } from '@blocksuite/global/disposable';
import { getInlineEditorByModel } from '@blocksuite/affine-rich-text';
import throttle from 'lodash-es/throttle';
import { ObjectPickerPopover } from './object-picker-popover';
let globalAbortController = new AbortController();

function closePopover() {
  globalAbortController.abort();
}

const showMenu = debounce(
  ({
    context,
    //config,
    container = document.body,
    abortController = new AbortController(),
    obj_type,
    triggerKey,
    //configItemTransform,
  }: {
    context: any; //: { model }
    obj_type: string;
    triggerKey: string;
    //config: SlashMenuConfig;
    container?: HTMLElement;
    abortController?: AbortController;
    //configItemTransform: (item: SlashMenuItem) => SlashMenuItem;
  }) => {
    globalAbortController = abortController;
    const curRange = getCurrentNativeRange();
    if (!curRange) return;
    const disposables = new DisposableGroup();
    abortController.signal.addEventListener('abort', () =>
      disposables.dispose()
    );

    const inlineEditor = getInlineEditorByModel(context.std, context.model);
    if (!inlineEditor) return;
    const objectPicker = new ObjectPickerPopover(
      context.std,
      inlineEditor,
      abortController,
      obj_type,
      context.model
    );

    //private obj_type: IObjectType,
    //private model: BlockModel


    //objectPicker.options = options;
    objectPicker.triggerKey = triggerKey;
    //slashMenu.context = context;
    /*slashMenu.items = buildSlashMenuItems(
      typeof config.items === 'function' ? config.items(context) : config.items,
      context,
      configItemTransform
    );*/

    container.append(objectPicker);
    disposables.add(() => {
      objectPicker.clearTrigger()
      objectPicker.remove()
    });
    const updatePosition = throttle(() => {
      /*const slashMenuElement = slashMenu.slashMenuElement;
      assertExists(
        slashMenuElement,
        'You should render the slash menu node even if no position'
      );
      debugger;*/
      //console.log(slashMenuElement, curRange, getDirection());
      const position = getPopperPosition(
        objectPicker.PopOverElement,
        curRange,
        {},
        getDirection()
      );
      //console.log('out', position);
      objectPicker.updatePosition(position);
    }, 10);

    disposables.addFromEvent(window, 'resize', updatePosition);
    /*const scrollContainer = getViewportElement(context.std);
    if (scrollContainer) {
      // Note: in edgeless mode, the scroll container is not exist!
      disposables.addFromEvent(scrollContainer, 'scroll', updatePosition, {
        passive: true,
      });
    }*/
    //console.log("aaaaaa",slashMenu,slashMenu.items)
    // FIXME(Flrande): It is not a best practice,
    // but merely a temporary measure for reusing previous components.
    // Mount
    //console.log('1111', slashMenu);

    setTimeout(updatePosition);
    //console.log('2222', slashMenu);

    disposables.addFromEvent(
      objectPicker,
      'mousedown',
      e => {
        e.stopPropagation();
        //console.log('this is objectPicker');
        // console.log('555', e, e.target);
        //if (e.target === objectPicker) return;
        //abortController.abort();
        //abortController.abort();
      }
      //{ passive: true }
    );

    disposables.addFromEvent(
      window,
      'mousedown',
      e => {
        //console.log('this is windows event');
        //console.log('555', e, e.target);
        //if (e.target === objectPicker) return;
        abortController.abort();
        //abortController.abort();
      }
      //{ passive: true }
    );

    return objectPicker;
  },
  100,
  { leading: true }
);

export class MahdaadObjectPickerWidget extends WidgetComponent<RootBlockModel> {
  //private _context: ObjectPickerContext | null = null;

  //private readonly _inputRects$ = signal<SelectionRect[]>([]);

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

  /* private _updateInputRects() {
    //if (!this._context) return;
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
  }*/

  /*private readonly _renderLinkedDocPopover = () => {
    return html`<mahdaad-object-picker-popover
      .context=${this._context}
    ></mahdaad-object-picker-popover>`;
  };*/

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
          const temp = item.words.map(_ => _.toLowerCase());
          if (temp.includes(text.toLowerCase())) {
            const triggerKey =
              temp.find(key => key == text.toLowerCase()) ?? '';
            inlineEditor
              .waitForUpdate()
              .then(() => {
                //debugger;
                //todo ali ghasami

                /* std: this.std,
                  inlineEditor,
                  startRange,
                  startNativeRange,
                  triggerKey: primaryTriggerKey,
                  config: this.config,
                  obj_type,
                  model: props.model,
                  close: () => {
                  disposable.unsubscribe();
                  this._inputRects$.value = [];
                  this._mode$.value = 'none';
                  this._context = null;

                showMenu(this.std,sta);*/

                //showMenu({});

                showMenu({
                  context: {
                    model,
                    std: this.std,
                  },
                  obj_type: item.type,
                  triggerKey,
                  //config: this.config,
                  //configItemTransform: this.configItemTransform,
                });

                /*this.show({
                  inlineEditor,
                  primaryTriggerKey: triggerKey,
                  mode: IS_MOBILE ? 'mobile' : 'desktop',
                  obj_type: item.type,
                  model,
                });*/
              })
              .catch(console.error);
          }
        });
      }
    });
  }

  /* private _watchViewportChange() {
    const gfx = this.std.get(GfxControllerIdentifier);
    this.disposables.add(
      gfx.viewport.viewportUpdated.subscribe(() => {
        this._updateInputRects();
      })
    );
  }*/

  get config(): ObjectPickerWidgetConfig {
    return MahdaadObjectPickerWidget.DEFAULT_OPTIONS;
  }

  override connectedCallback() {
    super.connectedCallback();

    this._watchInput();
    //this._watchViewportChange();
  }

  showObjectPicker = (
    std: BlockStdScope,
    //inlineEditor: AffineInlineEditor,
    triggerKey: string,
    obj_type: IObjectType,
    model: BlockModel
  ) => {
    //debugger;
    /*const curRange = getCurrentNativeRange();
    if (!curRange) return;
    showMenu({
      editorHost: this.host,
      inlineEditor,
      range: curRange,
      options: this.options,
      triggerKey,
      obj_type,
      model,
    });*/

    showMenu({
      context: { model, std },
      //config,
      //container = document.body,
      //abortController = new AbortController(),
      obj_type,
      triggerKey,
    });
  };

  /* show(props?: {
    inlineEditor?: InlineEditor;
    primaryTriggerKey?: string;
    mode?: 'desktop' | 'mobile';
    obj_type: IObjectType;
    addTriggerKey?: boolean;
    model: BlockModel;
  }) {
    const host = this.host;
    const {
      primaryTriggerKey = '',
      mode = 'desktop',
      obj_type = 'document',
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

    /!*if (addTriggerKey) {
      this._addTriggerKey(inlineEditor, primaryTriggerKey);
      // we need to wait the range sync to get the correct startNativeRange
      const subscription = inlineEditor.slots.inlineRangeSync.subscribe(() => {
        this.show({ ...props, addTriggerKey: false });
        subscription.unsubscribe();
      });
      return;
    }*!/

    const startRange = inlineEditor.getInlineRange();
    if (!startRange) return;

    const startNativeRange = inlineEditor.getNativeRange();
    if (!startNativeRange) return;

    /!*const disposable = inlineEditor.slots.renderComplete.subscribe(() => {
      this._updateInputRects();
    });*!/
    /!*this._context = {
      std: this.std,
      inlineEditor,
      startRange,
      startNativeRange,
      triggerKey: primaryTriggerKey,
      config: this.config,
      obj_type,
      model: props.model,
      close: () => {
        disposable.unsubscribe();
        this._inputRects$.value = [];
        this._mode$.value = 'none';
        this._context = null;
      },
    };*!/

    //this._updateInputRects();

    const enableMobile = this.doc
      .get(FeatureFlagService)
      .getFlag('enable_mobile_linked_doc_menu');
    this._mode$.value = enableMobile ? mode : 'desktop';
  }*/

  /*override render() {
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
  }*/
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
