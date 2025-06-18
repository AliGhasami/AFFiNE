//import { LoadingIcon } from '@blocksuite/affine-block-image';
//import type { IconButton } from '@blocksuite/affine-components/icon-button';
import {
  cleanSpecifiedTail,
  getTextContentFromInlineRange,
} from '@blocksuite/affine-rich-text';
//import { unsafeCSSVar } from '@blocksuite/affine-shared/theme';
import {
  createKeydownObserver,
  getPopperPosition,
  getViewportElement,
} from '@blocksuite/affine-shared/utils';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
//import { MoreHorizontalIcon } from '@blocksuite/icons/lit';
import { PropTypes, requiredProperties } from '@blocksuite/std';
import {  ShadowlessElement } from '@blocksuite/std';
import { GfxControllerIdentifier } from '@blocksuite/std/gfx';
//import { effect } from '@preact/signals-core';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import throttle from 'lodash-es/throttle';

import type { LinkedDocContext } from './config.js';
import { linkedDocPopoverStyles } from './styles.js';
//import { resolveSignal } from './utils.js';

@requiredProperties({
  context: PropTypes.object,
})
export class ObjectPickerPopover extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = linkedDocPopoverStyles;

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

  //todo ali ghasami for migrate to event bus
  addObjectLink(model: BlockModel, lnk: ObjectLink,deleteEmptyBlock: boolean= true) {
    //return;
    if (!model.doc.getSchemaByFlavour('affine:mahdaad-object')) {
      return;
    }

    /*insertContent(this.editorHost, this.model, REFERENCE_NODE, {
      mahdaadObjectLink: {
        object_id: lnk.object_id,
        link_id: lnk.link_id,
        type: lnk.type,
      },
    });*/

    const temp = model.doc.addSiblingBlocks(this.model, [
      {
        flavour: 'affine:mahdaad-object',
        ...lnk,
      },
    ]);

    //model.doc.addBlocks()
    //console.log('this', model.text?.length);
    /*
        if (model.text?.length == 0) {
          model.doc.deleteBlock(this.model);
        }*/
    //return;

    if(deleteEmptyBlock)
    {
      setTimeout(()=>{
        if (model.text?.length == 0) {
          model.doc.deleteBlock(this.model);
        }
      })
    }

    const next = model.doc.getNext(temp[0]);
    //console.log("cccc",next);
    if (next && this.editorHost) {
      //console.log("host",this.editorHost);
      const inline: InlineEditor | null = getInlineEditorByModel(
        this.editorHost,
        next
      );
      if (inline) {
        inline.focusEnd();
      }
    }
    if (this.abortController) {
      this.abortController.abort();
    }
  }


  //private readonly _expanded = new Map<string, boolean>();

  //private readonly _menusItemsEffectCleanup: () => void = () => {};

  /*private readonly _updateLinkedDocGroup = async () => {
    const query = this._query;
    if (this._updateLinkedDocGroupAbortController) {
      this._updateLinkedDocGroupAbortController.abort();
    }
    this._updateLinkedDocGroupAbortController = new AbortController();

    if (query === null || query.startsWith(' ')) {
      this.context.close();
      return;
    }
    /!*this._linkedDocGroup = await this.context.config.getMenus(
      query,
      this._abort,
      this.context.std.host,
      this.context.inlineEditor,
      this._updateLinkedDocGroupAbortController.signal
    );*!/

    this._menusItemsEffectCleanup();

    // need to rebind the effect because this._linkedDocGroup has changed.
    this._menusItemsEffectCleanup = effect(() => {
      this._updateAutoFocusedItem();

      // wait for the next tick to ensure the items are rendered to DOM
      setTimeout(() => {
        this.scrollToFocusedItem();
      });
    });
  };*/

/*  private readonly _updateAutoFocusedItem = () => {
    // Get the auto-focused item key from the config
    const autoFocusedItemKey = this.context.config.autoFocusedItemKey?.(
      this._linkedDocGroup,
      this._query || '',
      this._activatedItemKey,
      this.context.std.host,
      this.context.inlineEditor
    );

    if (autoFocusedItemKey) {
      this._activatedItemKey = autoFocusedItemKey;
      return;
    }

    // If no auto-focused item key is returned from the config and no item is currently focused,
    // focus the first item in the flattened action list
    if (!this._activatedItemKey && this._flattenActionList.length > 0) {
      this._activatedItemKey = this._flattenActionList[0].key;
    }
  };*/

  //private readonly _updateLinkedDocGroupAbortController: AbortController | null = null;

 /* private get _actionGroup() {
    return this._linkedDocGroup.map(group => {
      return {
        ...group,
        items: this._getActionItems(group),
      };
    });
  }*/

  /*private get _flattenActionList() {
    return this._actionGroup
      .map(group =>
        group.items.map(item => ({ ...item, groupName: group.name }))
      )
      .flat();
  }*/

  private get _query() {
    return getTextContentFromInlineRange(
      this.context.inlineEditor,
      this.context.startRange
    );
  }

  /*private _getActionItems(group: LinkedMenuGroup) {
    const isExpanded = !!this._expanded.get(group.name);
    let items = resolveSignal(group.items);

    const isOverflow = !!group.maxDisplay && items.length > group.maxDisplay;

    items = isExpanded ? items : items.slice(0, group.maxDisplay);

    if (isOverflow && !isExpanded && group.maxDisplay) {
      items = items.concat({
        key: `${group.name} More`,
        name: resolveSignal(group.overflowText) || 'more',
        icon: MoreHorizontalIcon({ width: '24px', height: '24px' }),
        action: () => {
          this._expanded.set(group.name, true);
          this.requestUpdate();
        },
      });
    }

    return items;
  }*/

  /*private _isTextOverflowing(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }*/

  override connectedCallback() {
    super.connectedCallback();

    // init
    //this._updateLinkedDocGroup().catch(console.error);
    this._disposables.addFromEvent(this, 'pointerdown', e => {
      // Prevent input from losing focus
      e.preventDefault();
    });
    this._disposables.addFromEvent(this, 'mousedown', e => {
      // Prevent input from losing focus in electron
      e.preventDefault();
    });
    this._disposables.addFromEvent(window, 'pointerdown', e => {
      if (e.target === this) return;
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
      onMove: step => {
        //const itemLen = this._flattenActionList.length;
        /*const nextIndex = (itemLen + this._activatedItemIndex + step) % itemLen;
        const item = this._flattenActionList[nextIndex];
        if (item) {
          this._activatedItemKey = item.key;
        }
        this.scrollToFocusedItem();*/
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

    /*const actionGroups = this._actionGroup.map(group => {
      // Check if the group is loading or hidden
      const isLoading = resolveSignal(group.loading);
      const isHidden = resolveSignal(group.hidden);
      return {
        ...group,
        isLoading,
        isHidden,
      };
    });*/

    return html`<div class="linked-doc-popover" style="${style}">
        <mahdaad-object-picker-component
            search-text="${this._query}"
            .inline-editor="${this.context.inlineEditor}"
            type="${this.obj_type}"
            .model="${this.model}"
            .create-function=${this.addObjectLink}
            .insert-template="${this.insertTemplate}"
            @clear-trigger="${() => {
                  this.clearTrigger();
            }}"
            @select="${(event: CustomEvent) => {
                this.clearTrigger();
                if (this.obj_type == 'template') {
                  this.insertTemplate(event.detail);
                } else {
                  this.addObjectLink(this.model, event.detail as ObjectLink);
                  this._abort()
                  //this.abortController.abort();
                }
            }}"
            @close="${() => {
              this._abort() // .abortController.abort();
            }}"
          >
          </mahdaad-object-picker-component>
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

  /*private scrollToFocusedItem() {
    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) {
      return;
    }

    // If there's no active item key, don't try to scroll
    if (!this._activatedItemKey) {
      return;
    }

    const ele = shadowRoot.querySelector(
      `icon-button[data-id="${this._activatedItemKey}"]`
    );

    // If the element doesn't exist, don't log a warning
    if (!ele) {
      return;
    }

    ele.scrollIntoView({
      block: 'nearest',
    });
  }*/

  /*get _activatedItemIndex() {
    const index = this._flattenActionList.findIndex(
      item => item.key === this._activatedItemKey
    );
    return index === -1 ? 0 : index;
  }*/

  /*@state()
  private accessor _activatedItemKey: string | null = null;*/

/*  @state()
  private accessor _linkedDocGroup: LinkedMenuGroup[] = [];*/

  @state()
  private accessor _position: {
    height: number;
    x: string;
    y: string;
  } | null = null;

  //@state()
  //private accessor _showTooltip = false;

  @property({ attribute: false })
  accessor context!: LinkedDocContext;

  /*@state()
  private accessor _searchText = '';*/

  /*@queryAll('icon-button')
  accessor iconButtons!: NodeListOf<IconButton>;*/

 /* @query('.linked-doc-popover')
  accessor linkedDocElement: Element | null = null;*/
}
