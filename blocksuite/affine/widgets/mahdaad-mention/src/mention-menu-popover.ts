import {
  cleanSpecifiedTail,
  getTextContentFromInlineRange,
} from '@blocksuite/affine-rich-text';
import { createKeydownObserver } from '@blocksuite/affine-shared/utils';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import { BlockStdScope } from '@blocksuite/std';
import { ShadowlessElement } from '@blocksuite/std';
import { html } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import { insertContent } from '@blocksuite/affine-rich-text';
import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts';
import { BlockModel } from '@blocksuite/store';
import { prefixCls } from '../../../../../../src/claytapEditor/const';

export class MentionMenuPopover extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  constructor(
    private editorHost: BlockStdScope,
    private inlineEditor: AffineInlineEditor,
    private abortController = new AbortController(),
    private model: BlockModel
  ) {
    super();
  }

  private readonly _abort = () => {
    // remove popover dom
    //this.context.close();
    this.abortController.abort();
    // clear input query
    cleanSpecifiedTail(
      this.editorHost,
      this.inlineEditor,
      this.triggerKey + (this._query || '')
    );
  };

  updatePosition = (position: { x: string; y: string; height: number }) => {
    this._position = position;
  };

  private readonly _startRange = this.inlineEditor.getInlineRange();

  private get _query() {
    return getTextContentFromInlineRange(this.inlineEditor, this._startRange);
  }

  private readonly clearTrigger = () => {
    cleanSpecifiedTail(
      this.editorHost,
      this.inlineEditor,
      this.triggerKey + (this._query || '')
    );
  };

  override connectedCallback() {
    super.connectedCallback();

    // init
    //this._updateLinkedDocGroup().catch(console.error);
    /*this._disposables.addFromEvent(this, 'pointerdown', e => {
      // Prevent input from losing focus
      e.preventDefault();
    });*/
    /*this._disposables.addFromEvent(this, 'mousedown', e => {
      // Prevent input from losing focus in electron
      e.preventDefault();
    });*/

    this._disposables.addFromEvent(this, 'mousedown', e => {
      e.stopPropagation();
      //if (e.target === this) return;
      // We don't clear the query when clicking outside the popover
    });

    //todo ali ghasami
    this._disposables.addFromEvent(window, 'mousedown', e => {
      //if (e.target === this) return;
      // We don't clear the query when clicking outside the popover
      //this.context.close();
      this.abortController.abort();
    });

    const keydownObserverAbortController = new AbortController();
    this._disposables.add(() => keydownObserverAbortController.abort());

    const { eventSource } = this.inlineEditor;
    if (!eventSource) return;

    createKeydownObserver({
      target: eventSource,
      signal: keydownObserverAbortController.signal,
      interceptor: (event, next) => {
        const { key } = event;
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter') {
          return;
        }

        /*if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          event.stopPropagation();
          return;
        }*/
        /*if (event.key === 'Escape') {
          //this.context.close();
          this.abortController.abort();
          event.preventDefault();
          event.stopPropagation();
          return;
        }*/
        next();
      },
      onInput: () => {
        setTimeout(() => {
          // console.log("22222",this._query);
          this._searchText = this._query;
        }, 50);
        /*if (isComposition) {
          //this._updateLinkedDocGroup().catch(console.error);
        } else {
          const subscription = this.inlineEditor.slots.renderComplete.subscribe(
            () => {
              subscription.unsubscribe();
              //this._updateLinkedDocGroup().catch(console.error);
            }
          );
        }*/
      },

      onDelete: () => {
        setTimeout(() => {
          //console.log("22222",this._query);
          this._searchText = this._query;
        }, 50);

        const curRange = this.inlineEditor.getInlineRange();
        if (!this._startRange || !curRange) {
          return;
        }
        if (curRange.index - 1 < this._startRange.index) {
          //this.context.close();
          this.abortController.abort();
        }
        /*const subscription = this.inlineEditor.slots.renderComplete.subscribe(
          () => {
            subscription.unsubscribe();
            //this._updateLinkedDocGroup().catch(console.error);
          }
        );*/
      },
      onConfirm: () => {
        this.abortController.abort();
        /*this._flattenActionList[this._activatedItemIndex]
          .action()
          ?.catch(console.error);*/
      },
      onAbort: () => {
        //this.context.close();
        this.abortController.abort();
      },
    });

    this._disposables.addFromEvent(this, 'mousedown', e => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    //this._menusItemsEffectCleanup();
    //this._updateLinkedDocGroupAbortController?.abort();
  }

  override render() {
    //const MAX_HEIGHT = 390;
    const style = this._position
      ? styleMap({
          transform: `translate(${this._position.x}, ${this._position.y})`,
          //maxHeight: `${Math.min(this._position.height, MAX_HEIGHT)}px`,
        })
      : styleMap({
          visibility: 'hidden',
        });
    return html`<div
      class="${prefixCls}-command-popover popover-element"
      style="${style}"
    >
      <div class="${prefixCls}-command-popover-container">
        <mahdaad-user-picker
          search-text="${this._searchText}"
          .inline-editor="${this.inlineEditor}"
          @select="${(event: CustomEvent) => {
            //return;
            //this.
            this.abortController.abort();
            this.clearTrigger();
            setTimeout(() => {
              insertContent(this.editorHost, this.model, REFERENCE_NODE, {
                mention: {
                  user_id: event.detail.user_id,
                  id: event.detail.id,
                },
              });
              /* const inlineEditor = this.context.inlineEditor
             const inlineRange = inlineEditor.getInlineRange();
             if (!inlineRange) return;

             inlineEditor.insertText(inlineRange, REFERENCE_NODE, {
               mention: {
                 user_id: event.detail.user_id,
                 id: event.detail.id,
               },
             });
             inlineEditor.setInlineRange({
               index: inlineRange.index+1,
               length: 0,
             });*/
            }, 1);

            /*return;
           const inlineEditor = this.context.inlineEditor
           if (!inlineEditor) return;
           this.context.inlineEditor
             .waitForUpdate()
             .then(() => {
               const inlineRange = inlineEditor.getInlineRange();
               if (!inlineRange) return;

               inlineEditor.insertText(inlineRange, REFERENCE_NODE, {
                 mention: {
                   user_id: event.detail.user_id,
                   id: event.detail.id,
                 },
               });
               inlineEditor.setInlineRange({
                 index: inlineRange.index+1,
                 length: 0,
               });
               //inlineEditor.deleteText({index:inlineRange.index-1,length:1})
             })*/
            //return
            /*insertContent(this.context.std, this.context.model, REFERENCE_NODE, {
             mention: {
               user_id: event.detail.user_id,
               id: event.detail.id,
             },
           });*/

            //this.context.close();
            //return
            /*this.context.inlineEditor
           .waitForUpdate()
           .then(() => {
             //console.log("11111",this.context)
             //item.action(this.context)?.catch(console.error);
             //this.abortController.abort();
             insertContent(this.context.std, this.context.model, REFERENCE_NODE, {
               mention: {
                 user_id: event.detail.user_id,
                 id: event.detail.id,
               },
             });
             this.context.close();
           })
           .catch(console.error);*/
          }}"
          @close="${() => {
            this._abort();
          }}"
        ></mahdaad-user-picker>
      </div>
    </div>`;
  }

  @state()
  private accessor _position: {
    height: number;
    x: string;
    y: string;
  } | null = null;

  @property({ attribute: false })
  accessor triggerKey!: string;

  @state()
  private accessor _searchText = '';

  @query(`.popover-element`)
  accessor PopOverElement: Element | null = null;
}
