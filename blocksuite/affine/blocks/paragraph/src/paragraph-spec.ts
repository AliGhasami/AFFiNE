import { BlockViewExtension, FlavourExtension } from '@blocksuite/std';
import type { ExtensionType } from '@blocksuite/store';
import { html, type TemplateResult } from 'lit';
import { literal } from 'lit/static-html.js';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { translate as t } from 'lit-i18n';

import { ParagraphBlockAdapterExtensions } from './adapters/extension.js';
import { ParagraphBlockConfigExtension } from './paragraph-block-config.js';
import {
  ParagraphKeymapExtension,
  ParagraphTextKeymapExtension,
} from './paragraph-keymap.js';

const placeholders = {
  h1: t('heading_1'),
  h2: t('heading_2'),
  h3: t('heading_3'),
  h4: t('heading_4'),
  h5: t('heading_5'),
  h6: t('heading_6'),
  /*text: "Type '/' for commands",
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  quote: '',*/
};



export const ParagraphBlockSpec: ExtensionType[] = [
  FlavourExtension('affine:paragraph'),
  BlockViewExtension('affine:paragraph', literal`affine-paragraph`),
  ParagraphTextKeymapExtension,
  ParagraphKeymapExtension,
  ParagraphBlockAdapterExtensions,
  ParagraphBlockConfigExtension({
    getPlaceholder: (model) : TemplateResult<1> | string => {
      if (model.props.type === 'text') {
        //const blockComponent=this.std.view.getBlock(model.id)
        /*if((model.parent && model.parent.flavour==MahdaadCalloutBlockSchema.model.flavour) ||  (blockComponent && blockComponent.closest('.nest-editor')) ) {
          return html`<div class="affine-paragraph-placeholder-content" style="overflow: hidden">
        <div>
          <span class="place-holder">
            ${t('start_typing')}
          </span>
        </div>
        <div>
          <div>&nbsp;</div>
      </div>`;
    }*/

        /*style="width:100%; white-space: nowrap; /!* جلوگیری از رفتن به خط بعد *!/
        overflow: hidden; /!* مخفی کردن بخش اضافه *!/
        text-overflow: ellipsis; /!* نمایش ... به جای متن اضافی *!/"*/

        return html`<div class="affine-paragraph-placeholder-content" style="overflow: hidden">
        <div>
          <span class="place-holder">
           <span style="min-width: max-content;"> ${t('typing_placeholder')}</span>
            <span class="short-code" style="min-width: 10px">/</span>
            <span style="min-width: max-content;">${t('for_block_types')}</span>
          </span>
        </div>
        <div>&nbsp;</div>
      </div>`;
        // return "Type '/' for commands";
      }

      if(model.props.type=='quote') {
        return t('quote_placeholder') as string
      }
      return placeholders[model.props.type] as string;
    },
  }),
].flat();
