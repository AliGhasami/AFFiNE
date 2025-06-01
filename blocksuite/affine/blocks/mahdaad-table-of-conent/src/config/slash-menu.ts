import { MahdaadTableOfContentBlockModel } from '@blocksuite/affine-model';
//import { focusBlockEnd } from '@blocksuite/affine-shared/commands';
//import { FeatureFlagService } from '@blocksuite/affine-shared/services';
import {
  findAncestorModel,
  //isInsideBlockByFlavour,
  matchModels,
} from '@blocksuite/affine-shared/utils';
import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import { html } from 'lit'

export const mahdaadTableOfContentSlashMenuConfig: SlashMenuConfig = {
  disableWhen: ({ model }) => {
    return (
      findAncestorModel(model, ancestor =>
        matchModels(ancestor, [MahdaadTableOfContentBlockModel])
      ) !== null
    );
  },
  items: [
    {
      name: 'Mahdaad table of conent ',
      description: 'Mahdaad description.',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: 'Mahdaad Table of content',
      },
      searchAlias: ['mahdaadTableOfContent'],
      group: '0_mahdaad@1',
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
        const tableOfContentId = doc.addBlock('affine:mahdaad-table-of-content', {}, parent, index + 1);
        if (!tableOfContentId) return;
        //const paragraphId = doc.addBlock('affine:paragraph', {}, calloutId);
        //if (!paragraphId) return;
        if(model.text?.length===0){
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
    },
  ],
};
