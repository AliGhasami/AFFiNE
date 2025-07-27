import { MahdaadCalloutBlockSchema } from '@blocksuite/affine-model';
import {
  BlockHtmlAdapterExtension,
  BlockMahdaadHtmlAdapterExtension,
  type BlockMahdaadHtmlAdapterMatcher,
  HastUtils,
} from '@blocksuite/affine-shared/adapters';

export const CalloutBlockMahdaadHtmlAdapterMatcher: BlockMahdaadHtmlAdapterMatcher =
  {
    flavour: MahdaadCalloutBlockSchema.model.flavour,
    //todo ali ghasami for implement after
    toMatch: o => HastUtils.isElement(o.node) && o.node.tagName === 'div',
    fromMatch: o => o.node.flavour === MahdaadCalloutBlockSchema.model.flavour,
    toBlockSnapshot: {
      enter: async (o, context) => {
        if (!HastUtils.isElement(o.node)) {
          return;
        }
      },
    },
    fromBlockSnapshot: {
      enter: (o, context) => {
        const { walkerContext } = context;

        const style = {
          textColor: `rgb(var(--mt-${o.node.props.background}-5))`,
          backgroundColor:
            o.node.props.background == 'gray'
              ? `rgb(var(--mt-${o.node.props.background}-1))`
              : `rgb(var(--mt-${o.node.props.background}-0))`,
          borderColor: `rgb(var(--mt-${o.node.props.background}-1))`,
        };

        walkerContext
          .openNode(
            {
              type: 'element',
              tagName: 'div',
              properties: {
                dir: o.node.props.dir as string,
                className: [`mahdaad-block-container mahdaad-callout`],
                style: `background-color:${style.backgroundColor};border-color:${style.borderColor}`,
              },
              children: [],
            },
            'children'
          )
          .openNode({
            type: 'element',
            tagName: 'div',
            properties: {
              style: `color:${style.textColor}`,
              className: ['icon'],
            },
            children: [],
          })
          .openNode(
            {
              type: 'element',
              tagName: 'iconify-icon',
              properties: {
                className: [],
                //src:'https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js'
                icon: o.node.props.icon,
                style: 'font-size: 24px',
              },
              children: [],
            },
            'children'
          )
          .closeNode()
          .closeNode()
          .openNode({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['content'],
            },
            children: [],
          });
      },
      leave: (_, context) => {
        const { walkerContext } = context;
        //console.log("111111",walkerContext);
        /*const htmlRootDocContext =
        walkerContext.getGlobalContext('hast:html-root-doc');
      const isRootDoc = htmlRootDocContext ?? true;
      if (!isRootDoc) {
        return;
      }*/
        walkerContext.closeNode().closeNode();
      },
    },
  };

export const MahdaadCalloutBlockMahdaadHtmlAdapterExtension =
  BlockMahdaadHtmlAdapterExtension(CalloutBlockMahdaadHtmlAdapterMatcher);
