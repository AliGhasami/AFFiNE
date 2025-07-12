import { AffineSchemas } from '@blocksuite/affine/schemas';
import { Schema, Transformer } from '@blocksuite/affine/store';
import { TestWorkspace } from '@blocksuite/affine/store/test';
import {
  cleanSpecifiedTail,
  getInlineEditorByModel,
  getTextContentFromInlineRange,
} from '@blocksuite/affine-rich-text';
import { replaceIdMiddleware } from '@blocksuite/affine-shared/adapters';
import {
  createKeydownObserver,
  getPopperPosition,
  getViewportElement,
} from '@blocksuite/affine-shared/utils';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import { EditorHost } from '@blocksuite/std';
import { ShadowlessElement } from '@blocksuite/std';
import { GfxControllerIdentifier } from '@blocksuite/std/gfx';
import type { InlineEditor } from '@blocksuite/std/inline';
import type { BlockModel } from '@blocksuite/store';
import { html } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { get } from 'lodash-es';
import throttle from 'lodash-es/throttle';
import type { ObjectLink } from '../../../../../../src/claytapEditor/types';
import type { IObjectType, ObjectPickerContext } from './config.js';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
/*@requiredProperties({
  context: PropTypes.object,
})*/
export class ObjectPickerPopover extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  //static override styles = objectPickerPopoverStyles;

  constructor(
    private editorHost: EditorHost,
    private inlineEditor: AffineInlineEditor,
    private abortController = new AbortController(),
    private obj_type: IObjectType,
    private model: BlockModel
  ) {
    super();
  }

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

  updatePosition = (position: { x: string; y: string; height: number }) => {
    this._position = position;
  };

  private readonly _startRange = this.inlineEditor.getInlineRange();

  private get _query() {
    return getTextContentFromInlineRange(this.inlineEditor, this._startRange);
  }

  private readonly clearTrigger = () => {
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
  };

  //todo ali ghasami for migrate to event bus
  addObjectLink(
    model: BlockModel,
    lnk: ObjectLink,
    deleteEmptyBlock: boolean = true
  ) {
    //debugger
    //return;
    /* if (!model.doc.getSchemaByFlavour('affine:mahdaad-object')) {
      return;
    }*/

    /*insertContent(this.editorHost, this.model, REFERENCE_NODE, {
      mahdaadObjectLink: {
        object_id: lnk.object_id,
        link_id: lnk.link_id,
        type: lnk.type,
      },
    });*/

    const temp = model.doc.addSiblingBlocks(this.context.model, [
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

    if (deleteEmptyBlock) {
      setTimeout(() => {
        if (model.text?.length == 0) {
          model.doc.deleteBlock(this.context.model);
        }
      });
    }

    const next = model.doc.getNext(temp[0]);
    //console.log("cccc",next);

    if (next && this.context.std) {
      //console.log("host",this.editorHost);
      const inline: InlineEditor | null = getInlineEditorByModel(
        this.context.std,
        next
      );
      if (inline) {
        inline.focusEnd();
      }
    }
    this.context.close();
    /*if (this.abortController) {
      this.abortController.abort();
    }*/
  }

  /* private get _query() {
    return getTextContentFromInlineRange(this.inlineEditor, this._startRange);
  }*/

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
      this.context.close();
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
        if (!this._startRange || !curRange) {
          return;
        }
        if (curRange.index < this._startRange.index) {
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

  async insertTemplate(data: any, model) {
    if (!data.context) return;
    const content = JSON.parse(data.context);
    const blocks = get(content, 'blocks.children', []);
    const note = blocks.find(item => item.flavour == 'affine:note');
    const noteChildren = get(note, 'children', []);
    const doc = model.doc; //this?.model?.doc; //this.model.doc;
    if (noteChildren.length > 0) {
      //const schema = new Schema().register(AffineSchemas);
      const collection = new TestWorkspace({});
      const job = new Transformer({
        schema: new Schema().register(AffineSchemas),
        blobCRUD: collection.blobSync,
        docCRUD: {
          create: (id: string) => collection.createDoc(id).getStore({ id }),
          get: (id: string) => collection.getDoc(id)?.getStore({ id }) ?? null,
          delete: (id: string) => collection.removeDoc(id),
        },
        middlewares: [replaceIdMiddleware(collection.idGenerator)],
      });
      //const collection = new DocCollection({ schema });
      /*const job = new Job({
        collection: collection,
        middlewares: [replaceIdMiddleware],
      });*/
      const notes = doc.getBlocksByFlavour('affine:note');
      if (notes.length > 0) {
        const parent = doc.getParent(model);
        if (parent) {
          const targetIndex =
            parent.children.findIndex(({ id }) => id === model.id) ?? 0;
          let insertIndex = targetIndex + 1; //place === 'before' ? targetIndex :
          for (const item of noteChildren) {
            await job.snapshotToBlock(item, doc, parent.id, insertIndex++);
          }
        }
      }
    }
    //this.context.close();
    /*if (this.abortController) {
      this.abortController.abort();
    }*/
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
      class="object-picker-popover object-popover-element"
      style="${style}"
    >
      <mahdaad-object-picker-component
        search-text="${this._query}"
        .inline-editor="${this.inlineEditor}"
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
            this.insertTemplate(event.detail, this.model);
          } else {
            this.addObjectLink(this.model, event.detail as ObjectLink);
            this._abort();
            //this.abortController.abort();
          }
        }}"
        @close="${() => {
          this._abort(); // .abortController.abort();
        }}"
      >
      </mahdaad-object-picker-component>
    </div>`;
  }

  /*override willUpdate() {
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
  }*/

  @state()
  private accessor _position: {
    height: number;
    x: string;
    y: string;
  } | null = null;

  @property({ attribute: false })
  accessor context!: ObjectPickerContext;

  @property({ attribute: false })
  accessor triggerKey!: string;

  @query(`.object-popover-element`)
  accessor PopOverElement: Element | null = null;
}
