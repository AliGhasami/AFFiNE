import { insertContent } from '@blocksuite/affine-rich-text';
import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts'
import {uuidv4 } from '@blocksuite/store'

import type { SlashMenuConfig } from './types';

export const defaultSlashMenuConfig: SlashMenuConfig = {
  items: () => {
    return [
      {
        name: 'mention',
        //icon: TodayIcon(),
        //tooltip: slashMenuToolTips['Today'],
        //description: formatDate(now),
        group: '0_mahdaad@8',
        action: ({ std, model }) => {
          const triggerKey = '@';
          insertContent(std, model, triggerKey);
          const root = model.doc.root;
          if (!root) return;
          const mahdaadMentionWidget = std.view.getWidget(
            'mahdaad-mention-menu-widget',
            root.id
          );
          if (!mahdaadMentionWidget) return;
          setTimeout(()=>{
            // TODO(@L-Sun): make linked-doc-widget as extension
            // @ts-expect-error same as above
            mahdaadMentionWidget.show({ primaryTriggerKey:triggerKey });
          })
        },
      },
      {
        name: 'date',
        //icon: TodayIcon(),
        //tooltip: slashMenuToolTips['Today'],
        //description: formatDate(now),
        group: '0_mahdaad@9',
        action: ({ std, model }) => {
          const date = new Date();
          // Extract UTC time components
          const year = date.getUTCFullYear(); // Get hours in UTC and pad with leading zero if needed
          const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get minutes in UTC and pad with leading zero if needed
          const day = String(date.getUTCDate()).padStart(2, '0'); // Get seconds in UTC and pad with leading zero if needed
          const triggerKey = `${year}-${month}-${day}`;
          const temp = {
            date: triggerKey,
            time: null,
            id: uuidv4(),
          };
          /*{
            const triggerKey = '$';
            insertContent(rootComponent.host, model, triggerKey);
          }*/
          insertContent(std, model, REFERENCE_NODE, {
            date: temp,
          });
        },
      },
      {
        name: 'date_time',
        //icon: TodayIcon(),
        //tooltip: slashMenuToolTips['Today'],
        //description: formatDate(now),
        group: '0_mahdaad@10',
        action: ({ std, model }) => {
          const date = new Date();
          // Extract UTC time components
          const year = date.getUTCFullYear(); // Get hours in UTC and pad with leading zero if needed
          const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get minutes in UTC and pad with leading zero if needed
          const day = String(date.getUTCDate()).padStart(2, '0'); // Get seconds in UTC and pad with leading zero if needed
          const triggerKey = `${year}-${month}-${day}`;
          const hour = String(date.getUTCHours()).padStart(2, '0')
          const minute = String(date.getUTCMinutes()).padStart(2, '0')
          const second = String(date.getUTCSeconds()).padStart(2, '0')
          const time = `${hour}:${minute}:${second}`
          const temp = {
            date: triggerKey,
            time,
            id: uuidv4(),
          };
          window.focusedDateTime = temp.id
          /*{
            const triggerKey = '$';
            insertContent(rootComponent.host, model, triggerKey);
          }*/
          insertContent(std, model, REFERENCE_NODE, {
            date: temp,
          });
        },
      },
     /* {
        name: 'Today',
        icon: TodayIcon(),
        tooltip: slashMenuToolTips['Today'],
        description: formatDate(now),
        group: '6_Date@0',
        action: ({ std, model }) => {
          insertContent(std, model, formatDate(now));
        },
      },
      {
        name: 'Tomorrow',
        icon: TomorrowIcon(),
        tooltip: slashMenuToolTips['Tomorrow'],
        description: formatDate(tomorrow),
        group: '6_Date@1',
        action: ({ std, model }) => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          insertContent(std, model, formatDate(tomorrow));
        },
      },
      {
        name: 'Yesterday',
        icon: YesterdayIcon(),
        tooltip: slashMenuToolTips['Yesterday'],
        description: formatDate(yesterday),
        group: '6_Date@2',
        action: ({ std, model }) => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          insertContent(std, model, formatDate(yesterday));
        },
      },
      {
        name: 'Now',
        icon: NowIcon(),
        tooltip: slashMenuToolTips['Now'],
        description: formatTime(now),
        group: '6_Date@3',
        action: ({ std, model }) => {
          insertContent(std, model, formatTime(now));
        },
      },
      {
        name: 'Move Up',
        description: 'Shift this line up.',
        icon: ArrowUpBigIcon(),
        tooltip: slashMenuToolTips['Move Up'],
        group: '8_Actions@0',
        action: ({ std, model }) => {
          const { host } = std;
          const previousSiblingModel = host.doc.getPrev(model);
          if (!previousSiblingModel) return;

          const parentModel = host.doc.getParent(previousSiblingModel);
          if (!parentModel) return;

          host.doc.moveBlocks([model], parentModel, previousSiblingModel, true);
        },
      },
      {
        name: 'Move Down',
        description: 'Shift this line down.',
        icon: ArrowDownBigIcon(),
        tooltip: slashMenuToolTips['Move Down'],
        group: '8_Actions@1',
        action: ({ std, model }) => {
          const { host } = std;
          const nextSiblingModel = host.doc.getNext(model);
          if (!nextSiblingModel) return;

          const parentModel = host.doc.getParent(nextSiblingModel);
          if (!parentModel) return;

          host.doc.moveBlocks([model], parentModel, nextSiblingModel, false);
        },
      },
      {
        name: 'Copy',
        description: 'Copy this line to clipboard.',
        icon: CopyIcon(),
        tooltip: slashMenuToolTips['Copy'],
        group: '8_Actions@2',
        action: ({ std, model }) => {
          const slice = Slice.fromModels(std.store, [model]);

          std.clipboard
            .copy(slice)
            .then(() => {
              toast(std.host, 'Copied to clipboard');
            })
            .catch(e => {
              console.error(e);
            });
        },
      },
      {
        name: 'Duplicate',
        description: 'Create a duplicate of this line.',
        icon: DualLinkIcon(),
        tooltip: slashMenuToolTips['Copy'],
        group: '8_Actions@3',
        action: ({ std, model }) => {
          if (!model.text || !(model.text instanceof Text)) {
            console.error("Can't duplicate a block without text");
            return;
          }
          const { host } = std;
          const parent = host.doc.getParent(model);
          if (!parent) {
            console.error(
              'Failed to duplicate block! Parent not found: ' +
                model.id +
                '|' +
                model.flavour
            );
            return;
          }
          const index = parent.children.indexOf(model);

          // FIXME: this clone is not correct
          host.doc.addBlock(
            model.flavour,
            {
              type: (model as ParagraphBlockModel).props.type,
              text: new Text(
                (
                  model as ParagraphBlockModel
                ).props.text.toDelta() as DeltaInsert[]
              ),
              checked: (model as ListBlockModel).props.checked,
            },
            host.doc.getParent(model),
            index
          );
        },
      },
      {
        name: 'Delete',
        description: 'Remove this line permanently.',
        searchAlias: ['remove'],
        icon: DeleteIcon(),
        tooltip: slashMenuToolTips['Delete'],
        group: '8_Actions@4',
        action: ({ std, model }) => {
          std.host.doc.deleteBlock(model);
        },
      },*/
    ];
  },
};
