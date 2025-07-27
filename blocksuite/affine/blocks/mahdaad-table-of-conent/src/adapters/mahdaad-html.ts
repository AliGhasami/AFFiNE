import { MahdaadTableOfContentBlockSchema } from '@blocksuite/affine-model';
import {
  BlockMahdaadHtmlAdapterExtension,
  type BlockMahdaadHtmlAdapterMatcher,
  HastUtils,
} from '@blocksuite/affine-shared/adapters';

export const TableOfContentBlockMahdaadHtmlAdapterMatcher: BlockMahdaadHtmlAdapterMatcher =
  {
    flavour: MahdaadTableOfContentBlockSchema.model.flavour,
    toMatch: o => HastUtils.isElement(o.node),
    fromMatch: o =>
      o.node.flavour === MahdaadTableOfContentBlockSchema.model.flavour,
    toBlockSnapshot: {
      enter: (o, context) => {
        if (!HastUtils.isElement(o.node)) {
          return;
        }
      },
    },
    fromBlockSnapshot: {
      enter: (o, context) => {
        const { walkerContext } = context;
        //@ts-ignore
        const lang = context.configs.get('mahdaad_config')?.lang ?? 'en';
        const headingList = context.configs.get('headingList') || [];
        walkerContext.openNode(
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: [
                `mahdaad-block-container mahdaad-table-of-content`,
                lang == 'fa' ? 'rtl' : 'ltr',
              ],
            },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: {
                  className: ['title'],
                  style:
                    'display: flex; align-items: center; padding:8px; font-size: 14px; line-height:24px; font-weight: 400;  height:32px;',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'iconify-icon',
                    properties: {
                      icon: 'tabler:align-justified',
                      style: 'padding-inline-end:2px;',
                    },
                    children: [],
                  },
                  {
                    type: 'text',
                    value: lang == 'fa' ? 'فهرست مطالب' : 'Table of Content',
                  },
                ],
              },
              {
                type: 'element',
                tagName: 'div',
                properties: {
                  className: ['list'],
                },
                children: headingList.map((heading, index) => ({
                  type: 'element',
                  tagName: 'div',
                  properties: {
                    className: [`item ${heading.type}`],
                    style: `height:32px;`,
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'a',
                      properties: {
                        href: `#${heading.id}`,
                        className: ['link'],
                        style: 'height:32px; color:inherit; font-size:14px;',
                      },
                      children: [
                        {
                          type: 'text',
                          value: heading.text,
                          properties: {
                            style: ``,
                          },
                        },
                      ],
                    },
                  ],
                })),
              },
            ],
          },
          'children'
        );
      },
      leave: (_, context) => {
        const { walkerContext } = context;
        walkerContext.closeNode();
      },
    },
  };

export const TableOfContentBlockMahdaadHtmlAdapterExtension =
  BlockMahdaadHtmlAdapterExtension(
    TableOfContentBlockMahdaadHtmlAdapterMatcher
  );
