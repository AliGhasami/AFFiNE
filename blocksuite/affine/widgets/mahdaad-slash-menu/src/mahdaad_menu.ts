import { insertContent } from '@blocksuite/affine-rich-text';
import { getInlineEditorByModel } from '@blocksuite/affine-rich-text';
import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts';
import {
  getCurrentNativeRange,
} from '@blocksuite/affine-shared/utils';
import { viewPresets } from "@blocksuite/data-view/view-presets";
import type { InlineEditor } from "@blocksuite/inline";
import { type BlockModel, uuidv4 } from '@blocksuite/store';
import type { DirectiveResult } from 'lit/directive.js';

import { objectTriggerKey } from '/@/claytapEditor/uitls/index.js'
import type { RootBlockComponent } from '../../types.js';
//import { REFERENCE_NODE } from '../../../_common/inline/presets/nodes/consts.js';
import { closeMentionMenu, showMentionMenu } from '../mahdaad-mention/index.js';
import type { AffineMahdaadObjectPickerWidget } from '../mahdaad-object-picker/index.js';
import type { IObjectType } from '../mahdaad-object-picker/type.js';
//import link from './icons/link.svg?raw';
import type { SlashMenuContext } from './types';
/*import accordion_h1 from './icons/accordion_h1.svg?raw';
import accordion_h2 from './icons/accordion_h2.svg?raw';
import accordion_h3 from './icons/accordion_h3.svg?raw';
import audio from './icons/audio.svg?raw';
import bread_crumb from './icons/bread_crumb.svg?raw';*/
//import button_link from './icons/button_link.svg?raw';
//import divider from './icons/divider.svg?raw';
//import empty_title from './icons/empty_title.svg?raw';
//import file from './icons/file.svg?raw';
//import notebook from './icons/notebook.svg?raw';
//import multi_column from './icons/multi_column.svg?raw';
//import table_of_content from './icons/table_of_content.svg?raw';
//import table_view from './icons/table_view.svg?raw';
//import tabler_files from './icons/tabler_files.svg?raw';
//import video from './icons/video.svg?raw';
import { tryRemoveEmptyLine } from './utils.js';
export interface ClayTapSlashMenuGroup {
  groupName: DirectiveResult;
  children: ClayTapSlashMenu[];
}
export interface ClayTapSlashMenu {
  icon: string;
  title: DirectiveResult;
  group?: string;
  key: string;
  description: DirectiveResult;
  action: (ctx: SlashMenuContext) => void | Promise<void>;
}

export interface MahdaadActionMenu {
  key: string;
  action: (ctx: SlashMenuContext) => void | Promise<void>;
}

export const actionsMenu: MahdaadActionMenu[] = [
  {
    key: 'two_columns',
    action: ({ std }) => {
      //const { host } = std;
      std.command
        .chain()
        .getSelectedModels()
        .insertMahdaadColumnBlock({
          count:2
        })
        .run();
       /* rootComponent.std.command
        .chain()
        .updateBlockType({
          flavour:'affine:mahdaad-multi-column',
          props: {  },
        })
        .run();*/
    },
  },
  {
    key: 'three_columns',
    action: ({ std }) => {
      std.command
        .chain()
        .getSelectedModels()
        .insertMahdaadColumnBlock({
          count:3
        })
        .run();
        /*rootComponent.std.command
        .chain()
        .updateBlockType({
          flavour:'affine:mahdaad-multi-column',
          props: {  },
        })
        .run();*/
    },
  },
  {
    key: 'four_columns',
    action: ({ rootComponent }) => {
      rootComponent.std.command
        .chain()
        .getSelectedModels()
        .insertMahdaadColumnBlock({
          count:4
        })
        .run();
        /*rootComponent.std.command
        .chain()
        .updateBlockType({
          flavour:'affine:mahdaad-multi-column',
          props: {  },
        })
        .run();*/
    },
  },
  {
    key: 'callout',
    action: ({ std }) => {
      std.command
        .chain()
        .getSelectedModels()
        .insertCalloutBlock({
          type:'info'
          //viewType: viewPresets.tableViewMeta.type,
          //place: 'after',
          //removeEmptyLine: true,
        })
        .run();

      //runCommand(rootComponent, 'affine:mahdaad-callout', 'info');
      /*const aa =  rootComponent.std.command
        .chain()
        .updateBlockType({
          flavour:'affine:mahdaad-callout',
          props: { type:'info' },
        })
        .run();
      console.log('aa',aa);*/



    },
  },
  {
    key: 'text',
    action: ({ std }) => {
      runCommand(std, 'affine:paragraph', 'text');
    },
  },
  {
    key: 'h1',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:paragraph', 'h1');
    },
  },
  {
    key: 'h2',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:paragraph', 'h2');
    },
  },
  {
    key: 'h3',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:paragraph', 'h3');
    },
  },
  {
    key: 'bullet_list',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:list', 'bulleted');
    },
  },
  {
    key: 'number_list',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:list', 'numbered');
    },
  },
  {
    key: 'check_list',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:list', 'todo');
    },
  },
  {
    key: 'quote',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:paragraph', 'quote');
    },
  },
  /*{
    key: 'quote',
    action: ({ rootComponent }) => {
      runCommand(rootComponent, 'affine:paragraph', 'quote');
    },
  },*/
  {
    key: 'mention',
    action: ({ std, model }) => {
      const { host } = std;
      /*const triggerKey = '@';
      insertContent(rootComponent.host, model, triggerKey);
      assertExists(model.doc.root);
      //console.log('|11111', rootElement.widgetElements);
      //todo fix ali ghasami
      //@ts-ignore
      const widgetEle = rootElement.widgetElements['affine-mention-widget'];
      assertExists(widgetEle);
      // We have checked the existence of showLinkedDoc method in the showWhen
      const mentionWidget = widgetEle as AffineMentionWidget;
      // Wait for range to be updated
      setTimeout(() => {
        const inlineEditor = getInlineEditorByModel(
          rootComponent.host,
          model
        );
        assertExists(inlineEditor);
        mentionWidget.showMention(inlineEditor, triggerKey);
        //linkedDocWidget.showLinkedDoc(inlineEditor, triggerKey);
      });*/

      const triggerKey = '@';
      insertContent(host, model, triggerKey);
      //return;
      /*insertContent(rootComponent.host, model, REFERENCE_NODE, {
        date: temp,
      });*/
      if (!model.doc.root) return;     /* const widgetEle =
        rootComponent.widgetComponents['mahdaad-mention-menu-widget'];*/
      //if (!widgetEle) return;
      // We have checked the existence of showLinkedDoc method in the showWhen
      //const mentionWidget = widgetEle as MahdaadMentionMenuWidget;
      // Wait for range to be updated
      setTimeout(() => {
        const inlineEditor = getInlineEditorByModel(host, model);
        if (!inlineEditor) return;
        const curRange = getCurrentNativeRange();
        if (!curRange) return;
        closeMentionMenu();
        showMentionMenu({
          context: { model, rootComponent: rootComponent },
          range: curRange,
          triggerKey,
        });
      });
    },
  },
  {
    key: 'date',
    action: ({ rootComponent, model }) => {
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
      insertContent(rootComponent.host, model, REFERENCE_NODE, {
        date: temp,
      });
    },
  },
  {
    key: 'time',
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
      insertContent(rootComponent.host, model, REFERENCE_NODE, {
        date: temp,
      });
    },
  },
  {
    key: 'table',
    action: ({ std, model }) => {
      rootComponent.std.command
        .chain()
        .getSelectedModels()
        .insertDatabaseBlock({
          viewType: viewPresets.tableViewMeta.type,
          place: 'after',
          removeEmptyLine: true,
        })
        .run();
      //old method
      /*const parent = rootComponent.doc.getParent(model);
      if (!parent) return;
      const index = parent.children.indexOf(model);
      const id = rootComponent.doc.addBlock(
        'affine:data-view',
        {},
        rootComponent.doc.getParent(model),
        index + 1
      );
      const dataViewModel = rootComponent.doc.getBlock(id)!;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.resolve().then(() => {
        const dataView = rootComponent.std.view.getBlock(
          dataViewModel.id
        ) as DataViewBlockComponent | null;
        dataView?.dataSource.viewManager.viewAdd('table');
      });
      tryRemoveEmptyLine(model);*/
     /* //return;
      const parent = rootComponent.doc.getParent(model);
      assertExists(parent);
      const index = parent.children.indexOf(model);

      const id = rootComponent.doc.addBlock(
        'affine:database',
        {},
        rootComponent.doc.getParent(model),
        index + 1
      );
      const service = rootComponent.std.spec.getService('affine:database');
      service.initDatabaseBlock(
        rootComponent.doc,
        model,
        id,
        viewPresets.tableViewConfig,
        false
      );*/
      tryRemoveEmptyLine(model);
    },
  },
  {
    key: 'divider',
    action: ({ std }) => {
      runCommand(rootComponent, 'affine:divider', 'divider');
    },
  },
  /*{
    key: 'attachment',
    action: async ({ rootComponent, model }) => {
      const file = await openFileOrFiles();
      if (!file) return;
      const attachmentService =
        rootComponent.std.getService('affine:attachment');
      assertExists(attachmentService);
      const maxFileSize = attachmentService.maxFileSize;

      await addSiblingAttachmentBlocks(
        rootComponent.host,
        [file],
        maxFileSize,
        model
      );
      tryRemoveEmptyLine(model);
    },
  },*/
  {
    key: 'page',
    action: ({ std, model }) => {
      //std.host
      //rootComponent.doc.deleteBlock(model)
      //const triggerKey = '/page/';
      const triggerKey = objectTriggerKey.value.page;
      insertContent(std.host, model, triggerKey);
      openObjectPicker(rootComponent, model, 'document',triggerKey);
    },
  },
  {
    key: 'file',
    action: ({ rootComponent, model }) => {
      //const triggerKey = '/file/';
      const triggerKey = objectTriggerKey.value.file;
      insertContent(rootComponent.host, model, triggerKey);
      openObjectPicker(rootComponent, model, 'file',triggerKey);
    },
  },
  {
    key: 'weblink',
    action: ({ rootComponent, model }) => {
      //const triggerKey = '/weblink/';
      const triggerKey = objectTriggerKey.value.weblink;
      insertContent(rootComponent.host, model, triggerKey);
      openObjectPicker(rootComponent, model, 'weblink',triggerKey);
    },
  },
  {
    key: 'tag',
    action: ({ rootComponent, model }) => {
      //const triggerKey = '/tag/';
      const triggerKey =objectTriggerKey.value.tag;
      insertContent(rootComponent.host, model, triggerKey);
      openObjectPicker(rootComponent, model, 'tag',triggerKey);
    },
  },
  {
    key: 'template',
    action: ({ rootComponent, model }) => {
      //const triggerKey = '/template/';
      const triggerKey = objectTriggerKey.value.template;
      insertContent(rootComponent.host, model, triggerKey);
      openObjectPicker(rootComponent, model, 'template',triggerKey);
    },
  },
  {
    key: 'image',
    action: ({ rootComponent, model }) => {
     //const triggerKey = '/image/';
      const triggerKey = objectTriggerKey.value.image;
      insertContent(rootComponent.host, model, triggerKey);
      openObjectPicker(rootComponent, model, 'image',triggerKey);
    },
  },
  {
    key: 'table_of_content',
    action: ({ rootComponent,model }) => {
        const [result,{std,updatedBlocks}]= rootComponent.std.command
        .chain()
        .updateBlockType({
          flavour:'affine:mahdaad-table-of-content',
          props: {},
        })
        .run();
        setTimeout(()=>{
          if(updatedBlocks && updatedBlocks.length) {
            const new_model=updatedBlocks[0]
            const next = new_model.doc.getNext(new_model);

            if (next && rootComponent.host) {
              const inline: InlineEditor | null = getInlineEditorByModel(
                rootComponent.std.host,
                next
              );
              if (inline) {
                inline.focusEnd();
              }
            }
          }
        })
    },
  },
];

/*export const clayTapGroupMenu: ClayTapSlashMenuGroup[] = [
  {
    groupName: t('basic'),
    children: [
      /!*{
        title: t('text'),
        description: t('normal_text'),
        icon: text,
        key: 'text',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:paragraph', 'text');
        },
      },*!/
      /!*{
        title: t('heading_1'),
        description: t('heading_1_description'),
        icon: h1,
        key: 'heading_1',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:paragraph', 'h1');
        },
      },*!/
      /!* {
        title: t('heading_2'),
        description: t('heading_2_description'),
        icon: h2,
        key: 'heading_2',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:paragraph', 'h2');
        },
      },*!/
      /!* {
        title: t('heading_3'),
        description: t('heading_3_description'),
        icon: h3,
        key: 'Heading_3',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:paragraph', 'h3');
        },
      },*!/
      /!*{
        title: t('bulleted_list'),
        description: t('bulleted_list_description'),
        icon: bulleted_list,
        key: 'bulleted_list',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:list', 'bulleted');
        },
      },*!/
      /!*{
        title: t('numbered_list'),
        description: t('numbered_list_description'),
        icon: numbered_list,
        key: 'numbered_list',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:list', 'numbered');
        },
      },*!/
      /!* {
        title: t('check_list'),
        description: t('check_list_description'),
        icon: check_list,
        key: 'check_list',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:list', 'todo');
        },
      },*!/
      /!*{
        title: t('quote'),
        description: t('quote_description'),
        icon: quote,
        key: 'quote',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:paragraph', 'quote');
        },
      },*!/
      /!* {
        title: 'Hint',
        description: 'Description',
        icon: hint,
        action: ({ rootComponent }) => {
          //console.log('rootElement', rootElement);
          //console.log('rootElement', rootComponent);
          //console.log('model', model);
          rootComponent.host.std.command
            .chain()
            .updateBlockType({
              flavour: 'affine:hint',
              props: {
                title: new Text('Title'),
                description: new Text('Description'),
                type: 'success',
              },
            })
            .inline((ctx, next) => {
              //console.log('this is inline in menu ', ctx);
              const newModels = ctx.updatedBlocks;
              if (!newModels || newModels.length == 0) {
                return false;
              }
              return next();
            })
            .run();

        },
      }*!/
    ],
  },
  {
    groupName: 'Insert',
    children: [
      /!* {
        title: t('mention'),
        description: t('mention_description'),
        icon: mention,
        key: 'mention',

      },*!/
      /!*{
        title: t('date'),
        description: t('date_description'),
        icon: date,
        key: 'date',

      },*!/
      /!*{
        title: 'Today',
        description: 'Description',
        icon: today,
        action: ({ rootComponent, model }) => {
          const date = new Date();
          insertContent(rootComponent.host, model, formatDate(date));
        },
      },*!/
      /!*{
        title: 'Link To Page',
        description: 'Description',
        icon: link_to_page,
        action: () => {},
      },*!/
      {
        title: t('table_view'),
        description: t('table_view_description'),
        icon: table_view,
        key: 'table_view',
        action: ({ rootComponent, model }) => {
          //return;
          const parent = rootComponent.doc.getParent(model);
          assertExists(parent);
          const index = parent.children.indexOf(model);

          const id = rootComponent.doc.addBlock(
            'affine:database',
            {},
            rootComponent.doc.getParent(model),
            index + 1
          );
          const service = rootComponent.std.spec.getService('affine:database');
          service.initDatabaseBlock(
            rootComponent.doc,
            model,
            id,
            viewPresets.tableViewConfig,
            false
          );
          tryRemoveEmptyLine(model);
        },
      },
      {
        title: t('divider'),
        description: t('divider_description'),
        icon: divider,
        key: 'divider',
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:divider', 'divider');
        },
      },
      /!*{
        title: 'Image',
        description: 'Description',
        icon: image,
        action: async ({ rootComponent, model }) => {
          //old method
          const parent = rootComponent.doc.getParent(model);
          if (!parent) {
            return;
          }
          const imageFiles = await getImageFilesFromLocal();
          if (!imageFiles.length) return;
          const imageService =
            rootComponent.host.spec.getService('affine:image');
          const maxFileSize = imageService.maxFileSize;
          addSiblingImageBlock(
            rootComponent.host,
            imageFiles,
            maxFileSize,
            model
          );
          tryRemoveEmptyLine(model);
          rootComponent.doc.addBlock('affine:paragraph', {}, parent);

          /!*const parent = rootElement.doc.getParent(model);
          if (!parent) {
            return;
          }

          const imageFiles = await getImageFilesFromLocal();
          if (!imageFiles.length) return;

          const imageService = rootElement.host.spec.getService('affine:image');
          const maxFileSize = imageService.maxFileSize;

          addSiblingImageBlock(
            rootElement.host,
            imageFiles,
            maxFileSize,
            model
          );
          tryRemoveEmptyLine(model);*!/
        },
      },*!/
      /!* {
        title: 'Video',
        description: 'Description',
        icon: video,
        action: () => {},
      },*!/
      /!*{
        title: 'Audio',
        description: 'Description',
        icon: audio,
        action: () => {},
      },*!/
      /!* {
        title: 'Code',
        description: 'Description',
        icon: code,
        action: ({ rootComponent }) => {
          runCommand(rootComponent, 'affine:code');
        },
      },*!/

      /!*{
        title: 'Link',
        description: 'Description',
        icon: link,
        action: () => {},
      },*!/
      /!*{
        title: 'Table Of Content',
        description: 'Description',
        icon: table_of_content,
        action: () => {},
      },*!/
      /!*{
        title: 'Button Link',
        description: 'Description',
        icon: button_link,
        action: () => {},
      },*!/
      /!*{
        title: 'Bread Crumb',
        description: 'Description',
        icon: bread_crumb,
        action: () => {},
      },*!/
      /!* {
        title: 'Accordion Heading 1',
        description: 'Description',
        icon: accordion_h1,
        action: () => {},
      },*!/
      /!*{
        title: 'Accordion Heading 2',
        description: 'Description',
        icon: accordion_h2,
        action: () => {},
      },*!/
      /!* {
        title: 'Accordion Heading 3',
        description: 'Description',
        icon: accordion_h3,
        action: () => {},
      },*!/
      /!*{
        title: 'Multi Column',
        description: 'Description',
        icon: multi_column,
        action: () => {},
      },*!/
      /!*{
        title: 'Link Doc',
        description: 'Description',
        icon: multi_column,
        action: ({ rootElement, model }) => {
          const triggerKey = '@';
          insertContent(rootElement.host, model, triggerKey);
          assertExists(model.doc.root);
          const widgetEle =
            rootElement.widgetElements['affine-linked-doc-widget'];
          assertExists(widgetEle);
          // We have checked the existence of showLinkedDoc method in the showWhen
          const linkedDocWidget = widgetEle as AffineLinkedDocWidget;
          // Wait for range to be updated
          setTimeout(() => {
            const inlineEditor = getInlineEditorByModel(
              rootElement.host,
              model
            );
            assertExists(inlineEditor);
            linkedDocWidget.showLinkedDoc(inlineEditor, triggerKey);
          });
        },
      },*!/
      /!*{
        title: 'Sketch',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },*!/
    ],
  },
  {
    groupName: t('media'),
    children: [
      /!* {
        title: t('attachment'),
        description: t('attachment_description'),
        icon: file,
        key: 'attachment',

      },*!/
      /!* {
        title: 'Title ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!* {
        title: 'Title  ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!*{
        title: 'Title   ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!* {
        title: 'Title     ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!*{
        title: 'Title         ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!* {
        title: 'figma',
        description: 'Description',
        icon: empty_title,
        action: async ({ rootElement, model }) => {
          const parentModel = rootElement.doc.getParent(model);
          if (!parentModel) {
            return;
          }
          const index = parentModel.children.indexOf(model) + 1;
          await toggleEmbedCardCreateModal(
            rootElement.host,
            'Figma',
            'The added Figma link will be displayed as an embed view.',
            { mode: 'page', parentModel, index }
          );
          tryRemoveEmptyLine(model);
        },
      },*!/
      /!*{
        title: 'simple',
        description: 'simple',
        icon: empty_title,
        action: async ({ rootElement }) => {
          rootElement.host.std.command
            .chain()
            .updateBlockType({
              flavour: 'affine:simple',
              props: {
                test_props: 'test_value',
                title: new Text('Title'),
                //title: new Text('Hello World!---titiel '),
                description: new Text(''),
              }, //type
            })
            .inline((ctx, next) => {
              //console.log('this is inline in menu ', ctx);
              const newModels = ctx.updatedBlocks;
              if (!newModels || newModels.length == 0) {
                return false;
              }
              return next();
            })
            .run();
        },
      },*!/
      /!*{
        title: 'Embed',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Figma',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Github',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Jira',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Oktuple',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Google Drive',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Miro',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Trello',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Gitlab',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },*!/
    ],
  },
  {
    groupName: t('object'),
    children: [
      {
        title: t('page'),
        description: t('page_description'),
        icon: notebook,
        key: 'page',
        action: ({ rootComponent, model }) => {
          //rootComponent.doc.deleteBlock(model)
          const triggerKey = '/page/';
          insertContent(rootComponent.host, model, triggerKey);
          openObjectPicker(rootComponent, model, 'document');
        },
      },
      {
        title: t('file'),
        description: t('file_description'),
        icon: tabler_files,
        key: 'file',
      },
      {
        title: t('image'),
        description: t('image_description'),
        icon: file,
        key: 'image',
        action: ({ rootComponent, model }) => {
          const triggerKey = '/image/';
          insertContent(rootComponent.host, model, triggerKey);
          openObjectPicker(rootComponent, model, 'image');
        },
      },
      {
        title: t('weblink'),
        description: t('weblink_description'),
        icon: file,
        key: 'weblink',
        action: ({ rootComponent, model }) => {
          const triggerKey = '/weblink/';
          insertContent(rootComponent.host, model, triggerKey);
          openObjectPicker(rootComponent, model, 'weblink');
        },
      },
      {
        title: t('tag'),
        description: t('tag_description'),
        icon: file,
        key: 'tag',
        action: ({ rootComponent, model }) => {
          const triggerKey = '/tag/';
          insertContent(rootComponent.host, model, triggerKey);
          openObjectPicker(rootComponent, model, 'tag');
        },
      },
      /!* {
        title: 'Title ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!* {
        title: 'Title  ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!*{
        title: 'Title   ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!* {
        title: 'Title     ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!*{
        title: 'Title         ',
        description: 'Description',
        icon: empty_title,
        action: () => {},
      },*!/
      /!* {
        title: 'figma',
        description: 'Description',
        icon: empty_title,
        action: async ({ rootElement, model }) => {
          const parentModel = rootElement.doc.getParent(model);
          if (!parentModel) {
            return;
          }
          const index = parentModel.children.indexOf(model) + 1;
          await toggleEmbedCardCreateModal(
            rootElement.host,
            'Figma',
            'The added Figma link will be displayed as an embed view.',
            { mode: 'page', parentModel, index }
          );
          tryRemoveEmptyLine(model);
        },
      },*!/
      /!*{
        title: 'simple',
        description: 'simple',
        icon: empty_title,
        action: async ({ rootElement }) => {
          rootElement.host.std.command
            .chain()
            .updateBlockType({
              flavour: 'affine:simple',
              props: {
                test_props: 'test_value',
                title: new Text('Title'),
                //title: new Text('Hello World!---titiel '),
                description: new Text(''),
              }, //type
            })
            .inline((ctx, next) => {
              //console.log('this is inline in menu ', ctx);
              const newModels = ctx.updatedBlocks;
              if (!newModels || newModels.length == 0) {
                return false;
              }
              return next();
            })
            .run();
        },
      },*!/
      /!*{
        title: 'Embed',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Figma',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Github',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Jira',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Oktuple',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Google Drive',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Miro',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Trello',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },
      {
        title: 'Gitlab',
        description: 'Description',
        icon: h1,
        action: ({ rootElement }) => {},
      },*!/
    ],
  },
];*/

function openObjectPicker(
  rootComponent: RootBlockComponent,
  model: BlockModel,
  obj_type: IObjectType,
  triggerKey:string
) {
  //console.log('111', rootComponent.host);
  /*rootComponent.host.std.command
    .chain()
    .updateBlockType({
      flavour: 'affine:code',
      props: {},
      //props: { type },
    })
    .inline((ctx, next) => {
      const newModels = ctx.updatedBlocks;
      if (!newModels) {
        return false;
      }
      // Reset selection if the target is code block
      if (['affine:code'].includes('affine:code')) {
        if (newModels.length !== 1) {
          console.error("Failed to reset selection! New model length isn't 1");
          return false;
        }
        const codeModel = newModels[0];
        onModelTextUpdated(rootComponent.host, codeModel, richText => {
          const inlineEditor = richText.inlineEditor;
          assertExists(inlineEditor);
          inlineEditor.focusEnd();
        }).catch(console.error);
      }
      //console.log('next - change inline menu');
      return next();
    })
    .run();

  return;*/

  //const triggerKey = 'templates/';
  const widgetEle =
    // @ts-ignore
    rootComponent.widgetComponents['affine-mahdaad-object-picker-widget'];
  ///assertExists(widgetEle);
  // We have checked the existence of showLinkedDoc method in the showWhen
  const objectPickerWidget = widgetEle as AffineMahdaadObjectPickerWidget;
  // Wait for range to be updated
  setTimeout(() => {
    const inlineEditor = getInlineEditorByModel(rootComponent.host, model);
    //assertExists(inlineEditor);
    objectPickerWidget.showObjectPicker(
      inlineEditor,
      triggerKey,
      obj_type,
      model
    );
  });

  /*setTimeout(() => {
    const inlineEditor = getInlineEditorByModel(rootElement.host, model);
    assertExists(inlineEditor);
    linkedDocWidget.showLinkedDoc(inlineEditor, triggerKey);
  });*/
}

function runCommand(
  rootComponent: RootBlockComponent,
  flavour: BlockSuite.Flavour,
  type?: string
) {
  rootComponent.std.command
    .chain()
    .updateBlockType({
      flavour,
      props: { type },
    })
    .run();
  //console.log('aa',aa);
  //const temp1=doc.addBlock('affine:mahdaad-callout', {}, noteId)
  //doc.addBlock('affine:paragraph', {}, temp1)

  /* rootElement.host.std.command
    .chain()
    .updateBlockType({
      flavour,
      props: { type },
    })
    .inline((ctx, next) => (ctx.updatedBlocks ? next() : false))
    .run();*/

  //console.log('this is root element', rootElement);
 /* rootComponent.host.std.command
    .chain()
    .updateBlockType({
      flavour,
      props: { type },
    })
    .inline((ctx, next) => {
      const newModels = ctx.updatedBlocks;
      if (!newModels) {
        return false;
      }
      // Reset selection if the target is code block
      if (['affine:code'].includes(flavour)) {
        if (newModels.length !== 1) {
          console.error("Failed to reset selection! New model length isn't 1");
          return false;
        }
        const codeModel = newModels[0];
        onModelTextUpdated(rootComponent.host, codeModel, richText => {
          const inlineEditor = richText.inlineEditor;
          assertExists(inlineEditor);
          inlineEditor.focusEnd();
        }).catch(console.error);
      }
      //console.log('next - change inline menu');
      return next();
    })
    .run();*/
}
