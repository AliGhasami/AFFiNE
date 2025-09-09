import {
  type BlockComponent,
  BlockSelection,
  type EditorHost,
  SurfaceSelection,
  type TextRangePoint,
  TextSelection,
} from '@blocksuite/affine/std';
import { MAHDAAD_AI_PANEL_WIDGET } from './config';
import { MahdaadAIPanelWidget } from './widget';
import {
  getBlockSelectionsCommand,
  getImageSelectionsCommand,
  getSelectedBlocksCommand,
  getSelectedModelsCommand,
  getTextSelectionCommand,
} from '@blocksuite/affine-shared/commands';
import {
  type BlockModel,
  type BlockSnapshot,
  type DraftModel,
  Slice,
  type SliceSnapshot,
  type Store,
  toDraftModel,
} from '@blocksuite/store';
import {
  isInsideEdgelessEditor,
  matchModels,
} from '@blocksuite/affine-shared/utils';
import { DatabaseBlockModel, ImageBlockModel } from '@blocksuite/affine-model';
import {
  embedSyncedDocMiddleware,
  MarkdownAdapter,
  MixTextAdapter,
  pasteMiddleware,
  PlainTextAdapter,
  titleMiddleware,
} from '@blocksuite/affine-shared/adapters';
import { defaultImageProxyMiddleware } from '@blocksuite/affine-block-image';

export const getMahdaadAIPanelWidget = (
  host: EditorHost
): MahdaadAIPanelWidget => {
  const rootBlockId = host.doc.root?.id;
  if (!rootBlockId) {
    throw new Error('rootBlockId is not found');
  }
  const aiPanel = host.view.getWidget(MAHDAAD_AI_PANEL_WIDGET, rootBlockId);
  if (!(aiPanel instanceof MahdaadAIPanelWidget)) {
    throw new Error('AI panel not found');
  }
  return aiPanel;
};

export const getSelections = (
  host: EditorHost,
  mode: 'flat' | 'highest' = 'flat'
) => {
  const [_, data] = host.command
    .chain()
    .tryAll(chain => [
      chain.pipe(getTextSelectionCommand),
      chain.pipe(getBlockSelectionsCommand),
      chain.pipe(getImageSelectionsCommand),
    ])
    .pipe(getSelectedBlocksCommand, { types: ['text', 'block', 'image'], mode })
    .run();

  return data;
};

export function getSelectedModels(editorHost: EditorHost) {
  const [_, ctx] = editorHost.std.command.exec(getSelectedModelsCommand, {
    types: ['block', 'text'],
  });
  const { selectedModels } = ctx;
  return selectedModels;
}

export async function getSelectedTextContent(
  editorHost: EditorHost,
  type: 'markdown' | 'plain-text' = 'markdown'
) {
  const selectedModels = getSelectedModels(editorHost);
  if (!selectedModels) return '';
  return getTextContentFromBlockModels(editorHost, selectedModels, type);
}

export async function getTextContentFromBlockModels(
  editorHost: EditorHost,
  models: BlockModel[],
  type: 'markdown' | 'plain-text' = 'markdown'
) {
  // Currently only filter out images and databases
  const selectedTextModels = models.filter(
    model => !matchModels(model, [ImageBlockModel, DatabaseBlockModel])
  );
  const drafts = selectedTextModels.map(toDraftModel);
  drafts.forEach(draft => traverse(draft, drafts));
  const slice = Slice.fromModels(editorHost.std.store, drafts);
  return getContentFromSlice(editorHost, slice, type);
}

export function traverse(model: DraftModel, drafts: DraftModel[]) {
  const isDatabase = model.flavour === 'affine:database';
  const children = isDatabase
    ? model.children
    : model.children.filter(child => {
        const idx = drafts.findIndex(m => m.id === child.id);
        return idx >= 0;
      });

  children.forEach(child => {
    const idx = drafts.findIndex(m => m.id === child.id);
    if (idx >= 0) {
      drafts.splice(idx, 1);
    }
    traverse(child, drafts);
  });
  model.children = children;
}

export async function getContentFromSlice(
  host: EditorHost,
  slice: Slice,
  type: 'markdown' | 'plain-text' = 'markdown'
) {
  const transformer = host.std.store.getTransformer([
    titleMiddleware(host.std.store.workspace.meta.docMetas),
    embedSyncedDocMiddleware('content'),
  ]);
  const snapshot = transformer.sliceToSnapshot(slice);
  if (!snapshot) {
    return '';
  }
  processTextInSnapshot(snapshot, host);
  const adapter =
    type === 'markdown'
      ? new MarkdownAdapter(transformer, host.std.provider)
      : new PlainTextAdapter(transformer, host.std.provider);
  const content = await adapter.fromSliceSnapshot({
    snapshot,
    assets: transformer.assetsManager,
  });
  return content.file;
}

/**
 * Processes the text in the given snapshot if there is a text selection.
 * Only the selected portion of the snapshot will be processed.
 */
export function processTextInSnapshot(
  snapshot: SliceSnapshot,
  host: EditorHost
) {
  const { content } = snapshot;
  const text = host.selection.find(TextSelection);
  if (!content.length || !text) return;

  content.forEach(snapshot => processSnapshot(snapshot, text, host));
}

function processSnapshot(
  snapshot: BlockSnapshot,
  text: TextSelection,
  host: EditorHost
) {
  const model = host.doc.getModelById(snapshot.id);
  if (!model) {
    return;
  }

  const modelId = model.id;
  if (text.from.blockId === modelId) {
    updateSnapshotText(text.from, snapshot, toDraftModel(model));
  }
  if (text.to && text.to.blockId === modelId) {
    updateSnapshotText(text.to, snapshot, toDraftModel(model));
  }

  // If the snapshot has children, handle them recursively
  snapshot.children.forEach(childSnapshot =>
    processSnapshot(childSnapshot, text, host)
  );
}

const updateSnapshotText = (
  point: TextRangePoint,
  snapshot: BlockSnapshot,
  model: DraftModel
) => {
  const { index, length } = point;
  if (!snapshot.props.text || length === 0) {
    return;
  }
  (snapshot.props.text as Record<string, unknown>).delta =
    model.text?.sliceToDelta(index, length + index);
};

export function getSelection(host: EditorHost) {
  const textSelection = host.selection.find(TextSelection);
  const mode = textSelection ? 'flat' : 'highest';
  const { selectedBlocks } = getSelections(host, mode);
  if (!selectedBlocks) return;
  const length = selectedBlocks.length;
  const firstBlock = selectedBlocks[0];
  const lastBlock = selectedBlocks[length - 1];
  const selectedModels = selectedBlocks.map(block => block.model);
  return {
    textSelection,
    selectedModels,
    firstBlock,
    lastBlock,
  };
}

export const insertBelow = async (
  host: EditorHost,
  content: string,
  selectBlock: BlockComponent
) => {
  await insert(host, content, selectBlock, true);
};

export const insert = async (
  host: EditorHost,
  content: string,
  selectBlock: BlockComponent,
  below: boolean = true
) => {
  const blockParent = selectBlock.parentComponent;
  if (!blockParent) return;
  const index = blockParent.model.children.findIndex(
    model => model.id === selectBlock.model.id
  );
  const insertIndex = below ? index + 1 : index;

  const { doc } = host;
  const models = await insertFromMarkdown(
    host,
    content,
    doc,
    blockParent.model.id,
    insertIndex
  );
  await host.updateComplete;
  requestAnimationFrame(() => setBlockSelection(host, blockParent, models));
};

const setBlockSelection = (
  host: EditorHost,
  parent: BlockComponent,
  models: BlockModel[]
) => {
  const selections = models
    .map(model => model.id)
    .map(blockId => host.selection.create(BlockSelection, { blockId }));

  if (isInsideEdgelessEditor(host)) {
    const surfaceElementId = getNoteId(parent);
    const surfaceSelection = host.selection.create(
      SurfaceSelection,
      selections[0].blockId,
      [surfaceElementId],
      true
    );

    selections.push(surfaceSelection);
    host.selection.set(selections);
  } else {
    host.selection.setGroup('note', selections);
  }
};

const getNoteId = (blockElement: BlockComponent) => {
  let element = blockElement;
  while (element.flavour !== 'affine:note') {
    if (!element.parentComponent) {
      break;
    }
    element = element.parentComponent;
  }

  return element.model.id;
};

export async function insertFromMarkdown(
  host: EditorHost | undefined,
  markdown: string,
  doc: Store,
  parent?: string,
  index?: number
) {
  const { snapshot, transformer } = await markdownToSnapshot(
    markdown,
    doc,
    host
  );

  const snapshots = snapshot?.content.flatMap(x => x.children) ?? [];

  const models: BlockModel[] = [];
  for (let i = 0; i < snapshots.length; i++) {
    const blockSnapshot = snapshots[i];
    const model = await transformer.snapshotToBlock(
      blockSnapshot,
      doc,
      parent,
      (index ?? 0) + i
    );
    if (model) {
      models.push(model);
    }
  }

  return models;
}

export const markdownToSnapshot = async (
  markdown: string,
  store: Store,
  host?: EditorHost
) => {
  const middlewares = host
    ? [defaultImageProxyMiddleware, pasteMiddleware(host.std)]
    : [defaultImageProxyMiddleware];
  const transformer = store.getTransformer(middlewares);
  const markdownAdapter = new MixTextAdapter(transformer, store.provider);
  const payload = {
    file: markdown,
    assets: transformer.assetsManager,
    workspaceId: store.workspace.id,
    pageId: store.id,
  };

  const snapshot = await markdownAdapter.toSliceSnapshot(payload);

  return {
    snapshot,
    transformer,
  };
};
