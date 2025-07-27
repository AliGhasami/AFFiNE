import { MahdaadMultiColumnBlockSchema } from '@blocksuite/affine-model';
import {
  BlockMahdaadHtmlAdapterExtension,
  type BlockMahdaadHtmlAdapterMatcher,
  HastUtils,
} from '@blocksuite/affine-shared/adapters';

export const MultiColumnBlockMahdaadHtmlAdapterMatcher: BlockMahdaadHtmlAdapterMatcher =
  {
    flavour: MahdaadMultiColumnBlockSchema.model.flavour,
    toMatch: () => false,
    fromMatch: o =>
      o.node.flavour === MahdaadMultiColumnBlockSchema.model.flavour,
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
        walkerContext.openNode(
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: [
                `mahdaad-block-container mahdaad-multi-column`,
                lang == 'fa' ? 'rtl' : 'ltr',
              ],
            },
            children: [],
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

export const MahdaadMultiColumnBlockHtmlAdapterExtension =
  BlockMahdaadHtmlAdapterExtension(MultiColumnBlockMahdaadHtmlAdapterMatcher);
