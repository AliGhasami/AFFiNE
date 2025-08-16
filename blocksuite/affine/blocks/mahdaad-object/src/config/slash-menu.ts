import { MahdaadCalloutBlockModel } from '@blocksuite/affine-model';
import { insertContent } from '@blocksuite/affine-rich-text';
import {
  findAncestorModel,
  matchModels,
} from '@blocksuite/affine-shared/utils';
import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import type { BlockStdScope } from '@blocksuite/std';
import type { BlockModel } from '@blocksuite/store';
import { html } from 'lit';
import { objectTriggerKey } from '../../../../../../../src/claytapEditor/utils';
import type { IObjectType } from '../../../../../../../src/types/object';
export const mahdaadObjectSlashMenuConfig: SlashMenuConfig = {
  disableWhen: ({ model }) => {
    return (
      findAncestorModel(model, ancestor =>
        matchModels(ancestor, [MahdaadCalloutBlockModel])
      ) !== null
    );
  },
  items: [
    {
      name: 'page',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@2',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.page;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'document', triggerKey);
        }, 50);
      },
    },
    {
      name: 'daily_note',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@11',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.daily_note;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'daily_note', triggerKey);
        }, 50);
      },
    },
    {
      name: 'file',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@3',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.file;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'file', triggerKey);
        }, 50);
      },
    },
    {
      name: 'weblink',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@4',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.weblink;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'weblink', triggerKey);
        }, 50);
      },
    },
    {
      name: 'tag',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@5',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.tag;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'tag', triggerKey);
        }, 50);
      },
    },
    {
      name: 'template',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@6',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.template;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'template', triggerKey);
        }, 50);
      },
    },
    {
      name: 'image',
      description: '',
      //icon: FontIcon(),
      tooltip: {
        figure: html``,
        caption: '',
      },
      searchAlias: [''],
      group: '0_mahdaad@7',
      when: () => {
        return true;
        /*return (
          std.get(FeatureFlagService).getFlag('enable_callout') &&
          !isInsideBlockByFlavour(model.doc, model, 'affine:edgeless-text')
        );*/
      },
      action: ({ model, std }) => {
        const triggerKey = objectTriggerKey.value.image;
        setTimeout(() => {
          insertContent(std, model, triggerKey);
          openObjectPicker(std, model, 'image', triggerKey);
        }, 50);
      },
    },
  ],
};

function openObjectPicker(
  std: BlockStdScope,
  model: BlockModel,
  obj_type: IObjectType,
  triggerKey: string
) {
  const root = model.doc.root;
  if (!root) return;
  const objectPickerWidget = std.view.getWidget(
    'mahdaad-object-picker-widget',
    root.id
  );
  if (!objectPickerWidget) return;
  setTimeout(() => {
    //const inlineEditor = getInlineEditorByModel(std, model);
    // @ts-expect-error same as above
    objectPickerWidget.showObjectPicker(
      std,
      //inlineEditor,
      triggerKey,
      obj_type,
      model
    );
  });
}
