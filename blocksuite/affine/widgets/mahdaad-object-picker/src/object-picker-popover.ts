import { AffineSchemas } from '@blocksuite/affine/schemas';
import { Schema, Transformer } from '@blocksuite/affine/store';
import { TestWorkspace } from '@blocksuite/affine/store/test';
import {
  cleanSpecifiedTail,
  getInlineEditorByModel,
  getTextContentFromInlineRange,
} from '@blocksuite/affine-rich-text';
import { replaceIdMiddleware } from '@blocksuite/affine-shared/adapters';
import { createKeydownObserver } from '@blocksuite/affine-shared/utils';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/lit';
import { BlockStdScope } from '@blocksuite/std';
import { ShadowlessElement } from '@blocksuite/std';
import type { InlineEditor } from '@blocksuite/std/inline';
import type { BlockModel } from '@blocksuite/store';
import { html } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { get } from 'lodash-es';
import type { ObjectLink } from '../../../../../../src/claytapEditor/types';
import type { IObjectType } from './config.js';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import { prefixCls } from '../../../../../../src/claytapEditor/const';

export class ObjectPickerPopover extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  constructor(
    private editorHost: BlockStdScope,
    private inlineEditor: AffineInlineEditor,
    private abortController = new AbortController(),
    private obj_type: IObjectType,
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

  readonly clearTrigger = () => {
    /*cleanSpecifiedTail(
      this.editorHost,
      this.inlineEditor,
      this.triggerKey + (this._query || '')
    );*/
    try {
      const text = this._searchText
        ? this.triggerKey + this._searchText
        : this.triggerKey;
      cleanSpecifiedTail(this.editorHost, this.inlineEditor, text);
    } catch (e) {
      console.log(e);
    }
  };

  addObjectLink(
    model: BlockModel,
    lnk: ObjectLink,
    deleteEmptyBlock: boolean = true
  ) {
    const temp = model.doc.addSiblingBlocks(this.model, [
      {
        flavour: 'affine:mahdaad-object',
        ...lnk,
      },
    ]);

    if (deleteEmptyBlock) {
      setTimeout(() => {
        if (model.text?.length == 0) {
          model.doc.deleteBlock(this.model);
        }
      });
    }

    const next = model.doc.getNext(temp[0]);

    if (next && this.editorHost) {
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

  override connectedCallback() {
    super.connectedCallback();

    this._disposables.addFromEvent(this, 'mousedown', e => {
      e.stopPropagation();
      //if (e.target === this) return;
      // We don't clear the query when clicking outside the popover
    });

    this._disposables.addFromEvent(window, 'mousedown', () => {
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

        next();
      },
      onInput: () => {
        setTimeout(() => {
          this._searchText = this._query;
        }, 50);
      },
      onDelete: () => {
        setTimeout(() => {
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
      },
      onMove: step => {
        this.abortController.abort();
      },
      onConfirm: () => {
        this.abortController.abort();
      },
      onAbort: () => {
        //this.context.close();
        this.abortController.abort();
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
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }

  override render() {
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
        <mahdaad-object-picker-component
          search-text="${this._searchText}"
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
      </div>
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
  accessor triggerKey!: string;

  @state()
  private accessor _searchText = '';

  @query(`.popover-element`)
  accessor popOverElement: Element | null = null;
}
