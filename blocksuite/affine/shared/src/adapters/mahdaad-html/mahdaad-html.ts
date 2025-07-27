import { DefaultTheme, NoteDisplayMode } from '@blocksuite/affine-model';
import type { ServiceProvider } from '@blocksuite/global/di';
import {
  type AssetsManager,
  ASTWalker,
  BaseAdapter,
  type BlockSnapshot,
  BlockSnapshotSchema,
  type DocSnapshot,
  type ExtensionType,
  type FromBlockSnapshotPayload,
  type FromBlockSnapshotResult,
  type FromDocSnapshotPayload,
  type FromDocSnapshotResult,
  type FromSliceSnapshotPayload,
  type FromSliceSnapshotResult,
  nanoid,
  type SliceSnapshot,
  type ToBlockSnapshotPayload,
  type ToDocSnapshotPayload,
  type Transformer,
} from '@blocksuite/store';
import type { Root } from 'hast';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import rehypeRaw from 'rehype-raw';

import {
  type AdapterContext,
  AdapterFactoryIdentifier,
  type HtmlAST,
} from '../types';
import { HastUtils } from '../utils/hast';
import {
  type BlockMahdaadHtmlAdapterMatcher,
  BlockMahdaadHtmlAdapterMatcherIdentifier,
} from './block-adapter';
import {
  MahdaadHtmlASTToDeltaMatcherIdentifier,
  MahdaadHtmlDeltaConverter,
  MahdaadInlineDeltaToHtmlAdapterMatcherIdentifier,
} from './delta-converter';

export type MahdaadHtml = string;

type HtmlToSliceSnapshotPayload = {
  file: MahdaadHtml;
  assets?: AssetsManager;
  workspaceId: string;
  pageId: string;
};

export class MahdaadHtmlAdapter extends BaseAdapter<MahdaadHtml> {
  private readonly _astToHtml = (ast: Root) => {
    const processor = unified()
      .use(rehypeRaw) // پردازش raw
      .use(rehypeStringify); // تبدیل AST به HTML

    const processedAst = processor.runSync(ast); // پردازش AST
    return processor.stringify(processedAst); // خروجی HTML
  };

  private readonly _traverseHtml = async (
    html: HtmlAST,
    snapshot: BlockSnapshot,
    assets?: AssetsManager
  ) => {
    const walker = new ASTWalker<HtmlAST, BlockSnapshot>();
    walker.setONodeTypeGuard(
      (node): node is HtmlAST =>
        'type' in (node as object) && (node as HtmlAST).type !== undefined
    );
    walker.setEnter(async (o, context) => {
      for (const matcher of this.blockMatchers) {
        if (matcher.toMatch(o)) {
          const adapterContext: AdapterContext<
            HtmlAST,
            BlockSnapshot,
            MahdaadHtmlDeltaConverter
          > = {
            walker,
            walkerContext: context,
            configs: this.configs,
            job: this.job,
            deltaConverter: this.deltaConverter,
            textBuffer: { content: '' },
            assets,
          };
          await matcher.toBlockSnapshot.enter?.(o, adapterContext);
        }
      }
    });
    walker.setLeave(async (o, context) => {
      for (const matcher of this.blockMatchers) {
        if (matcher.toMatch(o)) {
          const adapterContext: AdapterContext<
            HtmlAST,
            BlockSnapshot,
            MahdaadHtmlDeltaConverter
          > = {
            walker,
            walkerContext: context,
            configs: this.configs,
            job: this.job,
            deltaConverter: this.deltaConverter,
            textBuffer: { content: '' },
            assets,
          };
          await matcher.toBlockSnapshot.leave?.(o, adapterContext);
        }
      }
    });
    return walker.walk(html, snapshot);
  };

  private readonly _traverseSnapshot = async (
    snapshot: BlockSnapshot,
    html: HtmlAST,
    assets?: AssetsManager
  ) => {
    const assetsIds: string[] = [];
    const walker = new ASTWalker<BlockSnapshot, HtmlAST>();
    walker.setONodeTypeGuard(
      (node): node is BlockSnapshot =>
        BlockSnapshotSchema.safeParse(node).success
    );
    walker.setEnter(async (o, context) => {
      for (const matcher of this.blockMatchers) {
        if (matcher.fromMatch(o)) {
          const adapterContext: AdapterContext<
            BlockSnapshot,
            HtmlAST,
            MahdaadHtmlDeltaConverter
          > = {
            walker,
            walkerContext: context,
            configs: this.configs,
            job: this.job,
            deltaConverter: this.deltaConverter,
            provider: this.provider,
            textBuffer: { content: '' },
            assets,
            updateAssetIds: (assetsId: string) => {
              assetsIds.push(assetsId);
            },
          };
          await matcher.fromBlockSnapshot.enter?.(o, adapterContext);
        }
      }
    });
    walker.setLeave(async (o, context) => {
      for (const matcher of this.blockMatchers) {
        if (matcher.fromMatch(o)) {
          const adapterContext: AdapterContext<
            BlockSnapshot,
            HtmlAST,
            MahdaadHtmlDeltaConverter
          > = {
            walker,
            walkerContext: context,
            configs: this.configs,
            job: this.job,
            deltaConverter: this.deltaConverter,
            provider: this.provider,
            textBuffer: { content: '' },
            assets,
          };
          await matcher.fromBlockSnapshot.leave?.(o, adapterContext);
        }
      }
    });
    return {
      ast: (await walker.walk(snapshot, html)) as Root,
      assetsIds,
    };
  };

  deltaConverter: MahdaadHtmlDeltaConverter;

  readonly blockMatchers: BlockMahdaadHtmlAdapterMatcher[];

  constructor(job: Transformer, provider: ServiceProvider) {
    super(job, provider);
    const blockMatchers = Array.from(
      provider.getAll(BlockMahdaadHtmlAdapterMatcherIdentifier).values()
    );
    const inlineDeltaToHtmlAdapterMatchers = Array.from(
      provider.getAll(MahdaadInlineDeltaToHtmlAdapterMatcherIdentifier).values()
    );
    const htmlInlineToDeltaMatchers = Array.from(
      provider.getAll(MahdaadHtmlASTToDeltaMatcherIdentifier).values()
    );
    this.blockMatchers = blockMatchers;
    this.deltaConverter = new MahdaadHtmlDeltaConverter(
      job.adapterConfigs,
      inlineDeltaToHtmlAdapterMatchers,
      htmlInlineToDeltaMatchers,
      provider
    );
  }

  private _htmlToAst(html: MahdaadHtml) {
    return unified().use(rehypeParse).parse(html);
  }

  override async fromBlockSnapshot(
    payload: FromBlockSnapshotPayload
  ): Promise<FromBlockSnapshotResult<string>> {
    const root: Root = {
      type: 'root',
      children: [
        {
          type: 'doctype',
        },
      ],
    };
    const { ast, assetsIds } = await this._traverseSnapshot(
      payload.snapshot,
      root,
      payload.assets
    );
    return {
      file: this._astToHtml(ast),
      assetsIds,
    };
  }

  override async fromDocSnapshot(
    payload: FromDocSnapshotPayload
  ): Promise<FromDocSnapshotResult<string>> {
    const { file, assetsIds } = await this.fromBlockSnapshot({
      snapshot: payload.snapshot.blocks,
      assets: payload.assets,
    });
    return {
      file,
      assetsIds,
    };
  }

  override async fromSliceSnapshot(
    payload: FromSliceSnapshotPayload
  ): Promise<FromSliceSnapshotResult<string>> {
    let buffer = '';
    const sliceAssetsIds: string[] = [];
    for (const contentSlice of payload.snapshot.content) {
      const root: Root = {
        type: 'root',
        children: [],
      };
      const { ast, assetsIds } = await this._traverseSnapshot(
        contentSlice,
        root,
        payload.assets
      );
      sliceAssetsIds.push(...assetsIds);
      buffer += this._astToHtml(ast);
    }
    const html = buffer;
    return {
      file: html,
      assetsIds: sliceAssetsIds,
    };
  }

  override toBlockSnapshot(
    payload: ToBlockSnapshotPayload<string>
  ): Promise<BlockSnapshot> {
    const htmlAst = this._htmlToAst(payload.file);
    const blockSnapshotRoot = {
      type: 'block',
      id: nanoid(),
      flavour: 'affine:note',
      props: {
        xywh: '[0,0,800,95]',
        background: DefaultTheme.noteBackgrounColor,
        index: 'a0',
        hidden: false,
        displayMode: NoteDisplayMode.DocAndEdgeless,
      },
      children: [],
    };
    return this._traverseHtml(
      htmlAst,
      blockSnapshotRoot as BlockSnapshot,
      payload.assets
    );
  }

  override async toDocSnapshot(
    payload: ToDocSnapshotPayload<string>
  ): Promise<DocSnapshot> {
    const htmlAst = this._htmlToAst(payload.file);
    const titleAst = HastUtils.querySelector(htmlAst, 'title');
    const blockSnapshotRoot = {
      type: 'block',
      id: nanoid(),
      flavour: 'affine:note',
      props: {
        xywh: '[0,0,800,95]',
        background: DefaultTheme.noteBackgrounColor,
        index: 'a0',
        hidden: false,
        displayMode: NoteDisplayMode.DocAndEdgeless,
      },
      children: [],
    };
    return {
      type: 'page',
      meta: {
        id: nanoid(),
        title: HastUtils.getTextContent(titleAst, 'Untitled'),
        createDate: Date.now(),
        tags: [],
      },
      blocks: {
        type: 'block',
        id: nanoid(),
        flavour: 'affine:page',
        props: {
          title: {
            '$blocksuite:internal:text$': true,
            delta: this.deltaConverter.astToDelta(
              titleAst ?? {
                type: 'text',
                value: 'Untitled',
              }
            ),
          },
        },
        children: [
          {
            type: 'block',
            id: nanoid(),
            flavour: 'affine:surface',
            props: {
              elements: {},
            },
            children: [],
          },
          await this._traverseHtml(
            htmlAst,
            blockSnapshotRoot as BlockSnapshot,
            payload.assets
          ),
        ],
      },
    };
  }

  override async toSliceSnapshot(
    payload: HtmlToSliceSnapshotPayload
  ): Promise<SliceSnapshot | null> {
    const htmlAst = this._htmlToAst(payload.file);
    const blockSnapshotRoot = {
      type: 'block',
      id: nanoid(),
      flavour: 'affine:note',
      props: {
        xywh: '[0,0,800,95]',
        background: DefaultTheme.noteBackgrounColor,
        index: 'a0',
        hidden: false,
        displayMode: NoteDisplayMode.DocAndEdgeless,
      },
      children: [],
    };
    const contentSlice = (await this._traverseHtml(
      htmlAst,
      blockSnapshotRoot as BlockSnapshot,
      payload.assets
    )) as BlockSnapshot;
    if (contentSlice.children.length === 0) {
      return null;
    }
    return {
      type: 'slice',
      content: [contentSlice],
      workspaceId: payload.workspaceId,
      pageId: payload.pageId,
    };
  }
}

export const MahdaadHtmlAdapterFactoryIdentifier =
  AdapterFactoryIdentifier('MahdaadHtml');

export const MahdaadHtmlAdapterFactoryExtension: ExtensionType = {
  setup: di => {
    di.addImpl(MahdaadHtmlAdapterFactoryIdentifier, provider => ({
      get: job => new MahdaadHtmlAdapter(job, provider),
    }));
  },
};
