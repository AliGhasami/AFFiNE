import { RootBlockSchema } from '@blocksuite/affine-model';
import {
  type BlockMahdaadHtmlAdapterMatcher,
  BlockMahdaadHtmlAdapterExtension,
  HastUtils,
} from '@blocksuite/affine-shared/adapters';
import fa from './fa.css?raw';
import mahdaadStyle from './mahdaad-style.css?raw';
import { getDirection } from '../../../../../../../src/claytapEditor/utils';
import { generateCSSVars } from '@mahdaad/tokens';

export const rootBlockMahdaadHtmlAdapterMatcher: BlockMahdaadHtmlAdapterMatcher =
  {
    flavour: RootBlockSchema.model.flavour,
    toMatch: o => HastUtils.isElement(o.node) && o.node.tagName === 'header',
    fromMatch: o => o.node.flavour === RootBlockSchema.model.flavour,
    toBlockSnapshot: {
      enter: (o, context) => {
        if (!HastUtils.isElement(o.node)) {
          return;
        }
        const { walkerContext } = context;
        if (o.node.tagName === 'header') {
          walkerContext.skipAllChildren();
        }
      },
    },
    fromBlockSnapshot: {
      enter: (_, context) => {
        const { walkerContext } = context;
        const htmlRootDocContext =
          walkerContext.getGlobalContext('hast:html-root-doc');
        const isRootDoc = htmlRootDocContext ?? true;
        if (!isRootDoc) {
          return;
        }

        const include_style: boolean =
          context.configs.get('mahdaad_config')?.include_style ?? false;
        const lang: string | null =
          context.configs.get('mahdaad_config')?.lang ?? null;
        const title: string | null =
          context.configs.get('mahdaad_config')?.title ?? null;

        walkerContext
          .openNode(
            {
              type: 'element',
              tagName: 'html',
              properties: {},
              children: [],
            },
            'children'
          )
          .openNode(
            {
              type: 'element',
              tagName: 'head',
              properties: {},
              children: [],
            },
            'children'
          )
          .openNode(
            {
              type: 'element',
              tagName: 'script',
              properties: {
                src: 'https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js',
              },
              children: [],
            },
            'children'
          )
          .closeNode()
          .openNode(
            {
              type: 'element',
              tagName: 'style',
              properties: {},
              children: [],
            },
            'children'
          )
          .openNode(
            {
              type: 'raw',
              value: include_style ? mahdaadStyle.replace(/\s\s+/g, '') : '',
              //value: '',
            },
            'children'
          )
          .closeNode()
          .openNode(
            {
              type: 'raw',
              value: lang == 'fa' ? fa.replace(/\s\s+/g, '') : '',
              //value: '',
            },
            'children'
          )
          .closeNode()
          .openNode(
            {
              type: 'raw',
              value: generateCSSVars(),
              //value: '',
            },
            'children'
          )
          .closeNode()
          .closeNode()
          .closeNode()
          .openNode(
            {
              type: 'element',
              tagName: 'body',
              properties: {},
              children: [],
            },
            'children'
          )
          .openNode(
            {
              type: 'element',
              tagName: 'div',
              properties: {
                class: 'page-title',
                dir: getDirection(),
                //style: 'width: 70vw; margin: 60px auto;',
              },
              children: [
                {
                  type: 'text',
                  value: title,
                  //value: '',
                },
              ],
            },
            'children'
          )
          .closeNode();
        /*.openNode(
          {
            type: 'element',
            tagName: 'div',
            properties: {
              //style: 'width: 70vw; margin: 60px auto;',
            },
            children: [],
          },
          'children'
        )
        .openNode({
          type: 'comment',
          value: 'BlockSuiteDocTitlePlaceholder',
        })
        .closeNode();*/
      },
      leave: (_, context) => {
        const { walkerContext } = context;
        const htmlRootDocContext =
          walkerContext.getGlobalContext('hast:html-root-doc');
        const isRootDoc = htmlRootDocContext ?? true;
        if (!isRootDoc) {
          return;
        }
        walkerContext.closeNode().closeNode().closeNode();
      },
    },
  };

export const RootBlockMahdaadHtmlAdapterExtension =
  BlockMahdaadHtmlAdapterExtension(rootBlockMahdaadHtmlAdapterMatcher);
