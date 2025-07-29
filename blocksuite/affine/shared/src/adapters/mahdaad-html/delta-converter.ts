import {
  createIdentifier,
  type ServiceIdentifier,
  type ServiceProvider,
} from '@blocksuite/global/di';
import type { DeltaInsert, ExtensionType } from '@blocksuite/store';

import type { AffineTextAttributes } from '../../types/index.js';
import {
  type ASTToDeltaMatcher,
  DeltaASTConverter,
  type DeltaASTConverterOptions,
  type InlineDeltaMatcher,
} from '../types/delta-converter.js';
import type { HtmlAST, InlineHtmlAST } from '../types/hast.js';
import { AdapterTextUtils } from '../utils/text.js';

export type MahdaadInlineDeltaToHtmlAdapterMatcher =
  InlineDeltaMatcher<InlineHtmlAST>;

export const MahdaadInlineDeltaToHtmlAdapterMatcherIdentifier =
  createIdentifier<MahdaadInlineDeltaToHtmlAdapterMatcher>(
    'MahdaadInlineDeltaToHtmlAdapterMatcher'
  );

export function MahdaadInlineDeltaToHtmlAdapterExtension(
  matcher: MahdaadInlineDeltaToHtmlAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<MahdaadInlineDeltaToHtmlAdapterMatcher>;
} {
  const identifier = MahdaadInlineDeltaToHtmlAdapterMatcherIdentifier(
    matcher.name
  );
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}

export type MahdaadHtmlASTToDeltaMatcher = ASTToDeltaMatcher<HtmlAST>;

export const MahdaadHtmlASTToDeltaMatcherIdentifier =
  createIdentifier<MahdaadHtmlASTToDeltaMatcher>(
    'MahdaadHtmlASTToDeltaMatcher'
  );

export function MahdaadHtmlASTToDeltaExtension(
  matcher: MahdaadHtmlASTToDeltaMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<MahdaadHtmlASTToDeltaMatcher>;
} {
  const identifier = MahdaadHtmlASTToDeltaMatcherIdentifier(matcher.name);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}

export class MahdaadHtmlDeltaConverter extends DeltaASTConverter<
  AffineTextAttributes,
  HtmlAST
> {
  constructor(
    readonly configs: Map<string, string>,
    readonly inlineDeltaMatchers: MahdaadInlineDeltaToHtmlAdapterMatcher[],
    readonly htmlASTToDeltaMatchers: MahdaadHtmlASTToDeltaMatcher[],
    readonly provider: ServiceProvider
  ) {
    super();
  }

  private _applyTextFormatting(
    delta: DeltaInsert<AffineTextAttributes>
  ): InlineHtmlAST {
    //console.log("tt",delta)
    let style = '';
    /*const properties={
      style:
    }*/
    if (delta && delta.attributes) {
      if (delta.attributes.background) {
        style += `background:${delta.attributes.background};`;
      }
      if (delta.attributes.color) {
        style += `color:${delta.attributes.color};`;
      }
    }
    // @ts-ignore
    let hast: InlineHtmlAST = {
      //type: 'text',
      //value: delta.insert,
      type: 'element',
      tagName: 'span',
      properties: {
        style,
      },
      //@ts-ignore
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: delta.insert,
            },
          ],
        },
      ],
    };

    const context: {
      configs: Map<string, string>;
      current: InlineHtmlAST;
    } = {
      configs: this.configs,
      current: hast,
    };
    for (const matcher of this.inlineDeltaMatchers) {
      if (matcher.match(delta)) {
        hast = matcher.toAST(delta, context);
        context.current = hast;
      }
    }

    return hast;
    /*let hast: InlineHtmlAST = {
      type: 'text',
      value: delta.insert,
    };

    const context: {
      configs: Map<string, string>;
      current: InlineHtmlAST;
    } = {
      configs: this.configs,
      current: hast,
    };
    for (const matcher of this.inlineDeltaMatchers) {
      if (matcher.match(delta)) {
        hast = matcher.toAST(delta, context, this.provider);
        context.current = hast;
      }
    }

    return hast;*/
  }

  private _spreadAstToDelta(
    ast: HtmlAST,
    options: DeltaASTConverterOptions = Object.create(null)
  ): DeltaInsert<AffineTextAttributes>[] {
    const context = {
      configs: this.configs,
      options,
      toDelta: (ast: HtmlAST, options?: DeltaASTConverterOptions) =>
        this._spreadAstToDelta(ast, options),
    };
    for (const matcher of this.htmlASTToDeltaMatchers) {
      if (matcher.match(ast)) {
        return matcher.toDelta(ast, context);
      }
    }
    return 'children' in ast
      ? ast.children.flatMap(child => this._spreadAstToDelta(child, options))
      : [];
  }

  astToDelta(
    ast: HtmlAST,
    options: DeltaASTConverterOptions = Object.create(null)
  ): DeltaInsert<AffineTextAttributes>[] {
    return this._spreadAstToDelta(ast, options).reduce((acc, cur) => {
      return AdapterTextUtils.mergeDeltas(acc, cur);
    }, [] as DeltaInsert<AffineTextAttributes>[]);
  }

  deltaToAST(
    deltas: DeltaInsert<AffineTextAttributes>[],
    depth = 0
  ): InlineHtmlAST[] {
    if (depth > 0) {
      deltas.unshift({ insert: ' '.repeat(4).repeat(depth) });
    }

    return deltas.map(delta => this._applyTextFormatting(delta));
  }
}
