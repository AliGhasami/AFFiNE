import {
  cleanSpecifiedTail,
  getTextContentFromInlineRange,
} from '@blocksuite/affine-rich-text';
import { insertContent } from '@blocksuite/affine-rich-text';
import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts'
import {
  createKeydownObserver,
  getPopperPosition,
  getViewportElement,
} from '@blocksuite/affine-shared/utils';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import { PropTypes, requiredProperties } from '@blocksuite/std';
import {  ShadowlessElement } from '@blocksuite/std';
import { GfxControllerIdentifier } from '@blocksuite/std/gfx';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import throttle from 'lodash-es/throttle';

import type { MahdaadMentionContext } from './config.js';

@requiredProperties({
  context: PropTypes.object,
})
export class MentionMenuPopover extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  //static override styles = objectPickerPopoverStyles;

  private readonly _abort = () => {
    // remove popover dom
    this.context.close();
    // clear input query
    cleanSpecifiedTail(
      this.context.std,
      this.context.inlineEditor,
      this.context.triggerKey + (this._query || '')
    );
  };

  private  readonly  clearTrigger=()=>{
    cleanSpecifiedTail(
      this.context.std,
      this.context.inlineEditor,
      this.context.triggerKey + (this._query || '')
    );
    /*try {
      /!*const text = this._searchText ? this.triggerKey + this._searchText : this.triggerKey;
      cleanSpecifiedTail(this.editorHost, this.inlineEditor, text);*!/


    } catch (e) {
      console.log(e);
    }*/
  }


  private get _query() {
    return getTextContentFromInlineRange(
      this.context.inlineEditor,
      this.context.startRange
    );
  }


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

    this._disposables.addFromEvent(this,'mousedown', e => {
      e.stopPropagation();
      //if (e.target === this) return;
      // We don't clear the query when clicking outside the popover
    });

    //todo ali ghasami
    this._disposables.addFromEvent(window, 'mousedown', e => {
      //if (e.target === this) return;
      // We don't clear the query when clicking outside the popover
      this.context.close();
    });



    const keydownObserverAbortController = new AbortController();
    this._disposables.add(() => keydownObserverAbortController.abort());

    const { eventSource } = this.context.inlineEditor;
    if (!eventSource) return;

    createKeydownObserver({
      target: eventSource,
      signal: keydownObserverAbortController.signal,
      interceptor: (event, next) => {
        const { key } = event;
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter') {
          return;
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (event.key === 'Escape') {
          this.context.close();
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        next();
      },
      onInput: isComposition => {
        if (isComposition) {
          //this._updateLinkedDocGroup().catch(console.error);
        } else {
          const subscription =
            this.context.inlineEditor.slots.renderComplete.subscribe(() => {
              subscription.unsubscribe();
              //this._updateLinkedDocGroup().catch(console.error);
            });
        }
      },
      onPaste: () => {
        /*setTimeout(() => {
          this._updateLinkedDocGroup().catch(console.error);
        }, 50);*/
      },
      onDelete: () => {
        const curRange = this.context.inlineEditor.getInlineRange();
        if (!this.context.startRange || !curRange) {
          return;
        }
        if (curRange.index < this.context.startRange.index) {
          this.context.close();
        }
        const subscription =
          this.context.inlineEditor.slots.renderComplete.subscribe(() => {
            subscription.unsubscribe();
            //this._updateLinkedDocGroup().catch(console.error);
          });
      },
      onConfirm: () => {
        /*this._flattenActionList[this._activatedItemIndex]
          .action()
          ?.catch(console.error);*/
      },
      onAbort: () => {
        this.context.close();
      },
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

    return html`<div class="object-picker-popover" style="${style}">
       <mahdaad-user-picker
            search-text="${this._query}"
            .inline-editor="${this.context.inlineEditor}"
            @select="${(event: CustomEvent) => {
              this.clearTrigger()
              this.context.inlineEditor
              .waitForUpdate()
              .then(() => {
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
              .catch(console.error);

            }}"
            @close="${() => {
              this.context.close();
            }}"
          ></mahdaad-user-picker>
    </div>`;
  }

  override willUpdate() {
    if (!this.hasUpdated) {
      const updatePosition = throttle(() => {
        this._position = getPopperPosition(this, this.context.startNativeRange);
      }, 10);

      this.disposables.addFromEvent(window, 'resize', updatePosition);
      const scrollContainer = getViewportElement(this.context.std.host);
      if (scrollContainer) {
        // Note: in edgeless mode, the scroll container is not exist!
        this.disposables.addFromEvent(
          scrollContainer,
          'scroll',
          updatePosition,
          {
            passive: true,
          }
        );
      }

      const gfx = this.context.std.get(GfxControllerIdentifier);
      this.disposables.add(
        gfx.viewport.viewportUpdated.subscribe(updatePosition)
      );

      updatePosition();
    }
  }

  @state()
  private accessor _position: {
    height: number;
    x: string;
    y: string;
  } | null = null;



  @property({ attribute: false })
  accessor context!: MahdaadMentionContext;

}
