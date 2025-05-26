import {
  cleanSpecifiedTail,
  getTextContentFromInlineRange,
} from '@blocksuite/affine-rich-text';
import {
  DocModeProvider,
  TelemetryProvider,
} from '@blocksuite/affine-shared/services';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import {
  createKeydownObserver,
  getCurrentNativeRange,
  getPopperPosition,
  isFuzzyMatch,
  substringMatchScore,
} from '@blocksuite/affine-shared/utils';
import { WithDisposable } from '@blocksuite/global/lit';
import { ShadowlessElement } from '@blocksuite/std'
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import throttle from 'lodash-es/throttle';

//todo fix import ali ghasami
import { prefixCls } from '../../../../../../src/claytapEditor/const'
import {
  AFFINE_SLASH_MENU_TRIGGER_KEY,
} from './consts.js';
//import { actionsMenu } from './mahdaad_menu'
import {  styles } from './styles.js';
import type {
  SlashMenuActionItem,
  SlashMenuContext,
  SlashMenuItem,
  SlashMenuSubMenu,
} from './types.js';
import {
  isSubMenuItem,
} from './utils.js';
type InnerSlashMenuContext = SlashMenuContext & {
  onClickItem: (item: SlashMenuActionItem) => void;
  searching: boolean;
};

export class SlashMenu extends WithDisposable(ShadowlessElement) {
  static override styles = styles;

  private get _telemetry() {
    return this.context.std.getOptional(TelemetryProvider);
  }

  private get _editorMode() {
    return this.context.std.get(DocModeProvider).getEditorMode();
  }

  private readonly _handleClickItem = (item: SlashMenuActionItem) => {
    // Need to remove the search string
    // We must to do clean the slash string before we do the action
    // Otherwise, the action may change the model and cause the slash string to be changed
    cleanSpecifiedTail(
      this.context.std,
      this.context.model,
      AFFINE_SLASH_MENU_TRIGGER_KEY + (this._query || '')
    );
    this.inlineEditor
      .waitForUpdate()
      .then(() => {
        item.action(this.context);
        this._telemetry?.track('SelectSlashMenuItem', {
          page: this._editorMode ?? undefined,
          segment:
            this.context.model.flavour === 'affine:edgeless-text'
              ? 'edgeless-text'
              : 'doc',
          module: 'slash menu',
          control: item.name,
        });
        this.abortController.abort();
      })
      .catch(console.error);
  };

  private readonly _initItemPathMap = () => {
    const traverse = (item: SlashMenuItem, path: number[]) => {
      this._itemPathMap.set(item, [...path]);
      if (isSubMenuItem(item)) {
        item.subMenu.forEach((subItem, index) =>
          traverse(subItem, [...path, index])
        );
      }
    };

    this.items.forEach((item, index) => traverse(item, [index]));
  };

  private _innerSlashMenuContext!: InnerSlashMenuContext;

  private readonly _itemPathMap = new Map<SlashMenuItem, number[]>();

  private _queryState: 'off' | 'on' | 'no_result' = 'off';

  private readonly _startRange = this.inlineEditor.getInlineRange();

  private readonly _updateFilteredItems = () => {
    const query = this._query;
    if (query === null) {
      this.abortController.abort();
      return;
    }
    this._filteredItems = [];
    const searchStr = query.toLowerCase();
    if (searchStr === '' || searchStr.endsWith(' ')) {
      this._queryState = searchStr === '' ? 'off' : 'no_result';
      this._innerSlashMenuContext.searching = false;
      return;
    }

    // Layer order traversal
    let depth = 0;
    let queue = this.items;
    while (queue.length !== 0) {
      // remove the sub menu item from the previous layer result
      this._filteredItems = this._filteredItems.filter(
        item => !isSubMenuItem(item)
      );

      this._filteredItems = this._filteredItems.concat(
        queue.filter(({ name, searchAlias = [] }) =>
          [name, ...searchAlias].some(str => isFuzzyMatch(str, searchStr))
        )
      );

      // We search first and second layer
      if (this._filteredItems.length !== 0 && depth >= 1) break;

      queue = queue
        .map<typeof queue>(item => {
          if (isSubMenuItem(item)) {
            return item.subMenu;
          } else {
            return [];
          }
        })
        .flat();

      depth++;
    }

    this._filteredItems.sort((a, b) => {
      return -(
        substringMatchScore(a.name, searchStr) -
        substringMatchScore(b.name, searchStr)
      );
    });

    this._queryState = this._filteredItems.length === 0 ? 'no_result' : 'on';
    this._innerSlashMenuContext.searching = true;
  };

  private get _query() {
    return getTextContentFromInlineRange(this.inlineEditor, this._startRange);
  }

  get host() {
    return this.context.std.host;
  }

  constructor(
    private readonly inlineEditor: AffineInlineEditor,
    private readonly abortController = new AbortController()
  ) {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();

    this._innerSlashMenuContext = {
      ...this.context,
      onClickItem: this._handleClickItem,
      searching: false,
    };

    this._initItemPathMap();

    this._disposables.addFromEvent(this, 'mousedown', e => {
      // Prevent input from losing focus
      e.preventDefault();
    });

    const inlineEditor = this.inlineEditor;
    if (!inlineEditor || !inlineEditor.eventSource) {
      console.error('inlineEditor or eventSource is not found');
      return;
    }

    /**
     * Handle arrow key
     *
     * The slash menu will be closed in the following keyboard cases:
     * - Press the space key
     * - Press the backspace key and the search string is empty
     * - Press the escape key
     * - When the search item is empty, the slash menu will be hidden temporarily,
     *   and if the following key is not the backspace key, the slash menu will be closed
     */
    createKeydownObserver({
      target: inlineEditor.eventSource,
      signal: this.abortController.signal,
      interceptor: (event, next) => {
        const { key, isComposing, code } = event;
        if (key === AFFINE_SLASH_MENU_TRIGGER_KEY) {
          // Can not stopPropagation here,
          // otherwise the rich text will not be able to trigger a new the slash menu
          return;
        }

        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter') {
          return;
        }

        if (key === 'Process' && !isComposing && code === 'Slash') {
          // The IME case of above
          return;
        }

        if (key !== 'Backspace' && this._queryState === 'no_result') {
          // if the following key is not the backspace key,
          // the slash menu will be closed
          this.abortController.abort();
          return;
        }

        if (key === 'Escape') {
          this.abortController.abort();
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (key === 'ArrowRight' || key === 'ArrowLeft') {
          return;
        }

        next();
      },
      onInput: isComposition => {
        if (isComposition) {
          this._updateFilteredItems();
        } else {
          const subscription = this.inlineEditor.slots.renderComplete.subscribe(
            () => {
              subscription.unsubscribe();
              this._updateFilteredItems();
            }
          );
        }
      },
      onPaste: () => {
        setTimeout(() => {
          this._updateFilteredItems();
        }, 50);
      },
      onDelete: () => {
        const curRange = this.inlineEditor.getInlineRange();
        if (!this._startRange || !curRange) {
          return;
        }
        if (curRange.index < this._startRange.index) {
          this.abortController.abort();
        }
        const subscription = this.inlineEditor.slots.renderComplete.subscribe(
          () => {
            subscription.unsubscribe();
            this._updateFilteredItems();
          }
        );
      },
      onAbort: () => this.abortController.abort(),
    });

    this._telemetry?.track('OpenSlashMenu', {
      page: this._editorMode ?? undefined,
      type: this.context.model.flavour.split(':').pop(),
      module: 'slash menu',
    });
  }

  protected override willUpdate() {
    if (!this.hasUpdated) {
      const currRage = getCurrentNativeRange();
      if (!currRage) {
        this.abortController.abort();
        return;
      }

      // Handle position
      const updatePosition = throttle(() => {
        this._position = getPopperPosition(this, currRage);
      }, 10);

      this.disposables.addFromEvent(window, 'resize', updatePosition);
      updatePosition();
    }
  }

  checkKeys() {
    let allowKeys=['*']
    const denyKeys=[]
    //const temp = []
    //todo ali ghasami
    /*if(checkParentIs(this.context.model,MahdaadMultiColumnBlockSchema.model.flavour)) {
      denyKeys.push('two_columns','three_columns','four_columns')
    }
    if(checkParentIs(this.context.model,MahdaadCalloutBlockSchema.model.flavour)) {
      allowKeys=['text','h1','h2','h3','bullet_list','number_list','check_list','quote']
    }*/
    return  {allowKeys,denyKeys}
  }

  override render() {
    const {denyKeys,allowKeys} = this.checkKeys()
    const slashMenuStyles = this._position
      ? {
          transform: `translate(${this._position.x}, ${this._position.y})`,
          //maxHeight: `${Math.min(this._position.height, AFFINE_SLASH_MENU_MAX_HEIGHT)}px`,
        }
      : {
          visibility: 'hidden',
        };

    /*return html`${this._queryState !== 'no_result'
        ? html` <div
            class="overlay-mask"
            @click="${() => this.abortController.abort()}"
          ></div>`
        : nothing}
      <inner-slash-menu
        .context=${this._innerSlashMenuContext}
        .menu=${this._queryState === 'off' ? this.items : this._filteredItems}
        .mainMenuStyle=${slashMenuStyles}
        .abortController=${this.abortController}
      >
      </inner-slash-menu>`;*/
// .tools-list="${this._toolsList()}"
    //vue-block-board-editor-popover ${Prefix}-slash-menu
    return html`${html` <div
        class="overlay-mask"
        @click="${() => this.abortController.abort()}"
      ></div>`}

      <div
        class="${prefixCls}-slash-menu-popover"
        style="${styleMap(slashMenuStyles)}"
      >
        <mahdaad-slash-menu
          search-text="${this._query}"
          .inline-editor="${this.inlineEditor}"
          deny-keys="${JSON.stringify(denyKeys)}"
          allow-keys="${JSON.stringify(allowKeys)}"
          @select="${(event: CustomEvent) => {
      const key = event.detail;
            //console.log("1111",key)
      //todo ali ghasami
      const temp = this.actionMap[key] //actionsMenu.find(i => i.key == key);
      if (temp) {
        const item=this.items.find(i=>i.group==temp)
        if(item){
          this._handleClickItem(item);
        }
      }
      this.abortController.abort();
    }}"
          @close="${() => {
      this.abortController.abort();
    }}"
        ></mahdaad-slash-menu>
      </div>`;
  }



  private accessor actionMap={
    'text':'0_Basic@0',
    'h1':'0_Basic@1',
    'h2':'0_Basic@2',
    'h3':'0_Basic@3',
    'bullet_list':'1_List@0',
    'number_list':'1_List@1',
    'check_list':'1_List@2',
    'quote':'0_Basic@6',
    'callout':'',
    'two_columns':'',
    'three_columns':'',
    'four_columns':'',
    'table_of_content':'',
    'mention':'',
    'template':'',
    'date':'',
    'time':'',
    'table':'7_Database@0',
    'divider':'0_Basic@7',
    'page':'',
    'file':'',
    'image':'',
    'weblink':'',
    'tag':'',
  }



  @state()
  private accessor _filteredItems: (SlashMenuActionItem | SlashMenuSubMenu)[] =
    [];

  @state()
  private accessor _position: {
    x: string;
    y: string;
    height: number;
  } | null = null;

  @property({ attribute: false })
  accessor items!: SlashMenuItem[];

  @property({ attribute: false })
  accessor context!: SlashMenuContext;
}

