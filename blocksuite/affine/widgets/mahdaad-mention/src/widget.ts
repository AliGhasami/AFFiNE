import type { RootBlockModel } from '@blocksuite/affine-model';
import {
  getCurrentNativeRange,
  getPopperPosition,
} from '@blocksuite/affine-shared/utils';
import { type BlockComponent, BlockStdScope } from '@blocksuite/std';
import {
  BLOCK_ID_ATTR,
  WidgetComponent,
  WidgetViewExtension,
} from '@blocksuite/std';
import {
  INLINE_ROOT_ATTR,
  type InlineRootElement,
} from '@blocksuite/std/inline';
import { BlockModel } from '@blocksuite/store';
import { signal } from '@preact/signals-core';
import { getDirection } from '../../../../../../src/claytapEditor/utils/index.ts';

import { literal, unsafeStatic } from 'lit/static-html.js';
import debounce from 'lodash-es/debounce';
import {
  MAHDAAD_MENTION_WIDGET,
  //type MahdaadMentionContext,
  type MahdaadMentionWidgetConfig,
} from './config.js';
import { DisposableGroup } from '@blocksuite/global/disposable';
import { getInlineEditorByModel } from '@blocksuite/affine-rich-text';
import throttle from 'lodash-es/throttle';
import { MentionMenuPopover } from './mention-menu-popover';

let globalAbortController = new AbortController();

export function closeMentionMenu() {
  globalAbortController.abort();
}

const showMenu = debounce(
  ({
    context,
    container = document.body,
    abortController = new AbortController(),
    triggerKey,
  }: {
    context: any; //: { model }
    //obj_type: string;
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
    const mentionPopover = new MentionMenuPopover(
      context.std,
      inlineEditor,
      abortController,
      context.model
    );
    disposables.add(() => {
      mentionPopover.remove();
    });
    mentionPopover.triggerKey = triggerKey;

    const updatePosition = throttle(() => {
      const menuElement = mentionPopover.PopOverElement;
      if (!menuElement) return;
      const position = getPopperPosition(
        menuElement,
        curRange,
        {},
        getDirection()
      );
      mentionPopover.updatePosition(position);
    }, 10);

    disposables.addFromEvent(window, 'resize', updatePosition);

    container.append(mentionPopover);

    setTimeout(updatePosition);
    /*disposables.addFromEvent(
      mentionPopover,
      'mousedown',
      e => {
        e.stopPropagation();
      }
      //{ passive: true }
    );*/

    disposables.addFromEvent(
      window,
      'mousedown',
      () => {
        abortController.abort();
      }
      //{ passive: true }
    );

    return mentionPopover;
  },
  100
  //{ leading: true }
);

export class MahdaadMentionMenuWidget extends WidgetComponent<RootBlockModel> {
  private readonly _mode$ = signal<'desktop' | 'mobile' | 'none'>('none');

  static DEFAULT_OPTIONS: MahdaadMentionWidgetConfig = {
    /**
     * The first item of the trigger keys will be the primary key
     */
    triggerKeys: ['@'],
    ignoreBlockTypes: ['affine:code'],
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

      const matchedKey = this.config.triggerKeys.find(triggerKey =>
        text.endsWith(triggerKey)
      );
      if (!matchedKey) return;

      closeMentionMenu();

      inlineEditor
        .waitForUpdate()
        .then(() => {
          showMenu({
            context: {
              model,
              std: this.std,
            },
            triggerKey: matchedKey,
          });
        })
        .catch(console.error);
    });
  }

  get config(): MahdaadMentionWidgetConfig {
    return MahdaadMentionMenuWidget.DEFAULT_OPTIONS;
  }

  override connectedCallback() {
    super.connectedCallback();

    this._watchInput();
  }

  showPicker = (std: BlockStdScope, triggerKey: string, model: BlockModel) => {
    showMenu({
      context: { model, std },
      triggerKey,
    });
  };
}

export const mahdaadMentionWidget = WidgetViewExtension(
  'affine:page',
  MAHDAAD_MENTION_WIDGET,
  literal`${unsafeStatic(MAHDAAD_MENTION_WIDGET)}`
);

declare global {
  interface HTMLElementTagNameMap {
    [MAHDAAD_MENTION_WIDGET]: MahdaadMentionMenuWidget;
  }
}
