import { MahdaadMultiColumnBlockModel } from '@blocksuite/affine-model';
import { focusTextModel } from '@blocksuite/affine-rich-text'
//import { focusBlockEnd } from '@blocksuite/affine-shared/commands';
import {
  findAncestorModel,
  matchModels,
} from '@blocksuite/affine-shared/utils';
import { type SlashMenuConfig, type SlashMenuItem } from '@blocksuite/affine-widget-slash-menu'
import { html } from 'lit'


const items : SlashMenuItem[] =[2,3,4].map(item=> {
  return {
    name: 'Mahdaad Multi column',
    description: 'Mahdaad Multi column description.',
    //icon: FontIcon(),
    tooltip: {
      figure: html``,
      caption: 'Mahdaad Multi column',
    },
    searchAlias: [''],
    group: `0_mahdaad_multi_column@${item}`,
    when: () => {
      return true
      /*return (
        std.get(FeatureFlagService).getFlag('enable_callout') &&
        !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
      );*/
    },
    action: ({ model, std }) => {
      const { doc } = model;
      const parent = doc.getParent(model);
      if (!parent) return;

      const index = parent.children.indexOf(model);
      if (index === -1) return;
      const multiColumnId = doc.addBlock('affine:mahdaad-multi-column', { count: 2 }, parent, index + 1);
      if (!multiColumnId) return;
      let firstParagraphId=null
      for (let i = 0 ;i<item;i++) {
        const noteId= doc.addBlock('affine:note', {}, multiColumnId)
        const paragraphId= doc.addBlock('affine:paragraph', {},noteId)
        if(i==0) {
          firstParagraphId= paragraphId
        }
      }
      if(firstParagraphId) {
        focusTextModel(std, firstParagraphId);
      }

      //const paragraphId = doc.addBlock('affine:paragraph', {}, multiColumnId);
      //if (!paragraphId) return;
      if (model.text?.length === 0) {
        doc.deleteBlock(model)
      }
      /*std.host.updateComplete
        .then(() => {
          const paragraph = std.view.getBlock(paragraphId);
          if (!paragraph) return;
          std.command.exec(focusBlockEnd, {
            focusBlock: paragraph,
          });
        })
        .catch(console.error);*/
    },
  }
})


export const mahdaadMultiColumnSlashMenuConfig: SlashMenuConfig = {
  disableWhen: ({ model }) => {
    return (
      findAncestorModel(model, ancestor =>
        matchModels(ancestor, [MahdaadMultiColumnBlockModel])
      ) !== null
    );
  },
  items
};
