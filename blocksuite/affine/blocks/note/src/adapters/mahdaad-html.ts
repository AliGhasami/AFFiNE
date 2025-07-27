import {
  NoteBlockSchema,
  MahdaadMultiColumnBlockSchema,
} from '@blocksuite/affine-model';
import {
  HastUtils,
  BlockMahdaadHtmlAdapterExtension,
  type BlockMahdaadHtmlAdapterMatcher,
} from '@blocksuite/affine-shared/adapters';

export const NoteBlockMahdaadHtmlAdapterMatcher: BlockMahdaadHtmlAdapterMatcher =
  {
    flavour: NoteBlockSchema.model.flavour,
    toMatch: () => false,
    fromMatch: o => o.node.flavour === NoteBlockSchema.model.flavour,
    toBlockSnapshot: {
      enter: (o, context) => {
        if (!HastUtils.isElement(o.node)) {
          return;
        }
      },
    },
    fromBlockSnapshot: {
      enter: (o, context) => {
        if (
          o.parent &&
          o.parent.node.flavour == MahdaadMultiColumnBlockSchema.model.flavour
        ) {
          const sizes = o.parent.node.props.sizes;
          //console.log("bbbbb",sizes[o.index]);
          const { walkerContext } = context;
          walkerContext.openNode(
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: [`column`],
                style: `width:${sizes[o.index]}%`,
              },
              children: [],
            },
            'children'
          );
        }

        return;
      },
      leave: (o, context) => {
        if (
          o.parent &&
          o.parent.node.flavour == MahdaadMultiColumnBlockSchema.model.flavour
        ) {
          const { walkerContext } = context;
          walkerContext.closeNode();
        }
        return;
      },
    },
  };

export const NoteBlockMahdaadHtmlAdapterExtension =
  BlockMahdaadHtmlAdapterExtension(NoteBlockMahdaadHtmlAdapterMatcher);
