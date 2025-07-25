import {
  createIdentifier,
  type ServiceIdentifier,
} from '@blocksuite/global/di';
import type { ExtensionType } from '@blocksuite/store';

import type { BlockAdapterMatcher } from '../types/adapter.js';
import type { HtmlAST } from '../types/hast.js';
import type { MahdaadHtmlDeltaConverter } from './delta-converter.js';

export type BlockMahdaadHtmlAdapterMatcher = BlockAdapterMatcher<
  HtmlAST,
  MahdaadHtmlDeltaConverter
>;

export const BlockMahdaadHtmlAdapterMatcherIdentifier =
  createIdentifier<BlockMahdaadHtmlAdapterMatcher>('BlockMahdaadHtmlAdapterMatcher');

export function BlockMahdaadHtmlAdapterExtension(
  matcher: BlockMahdaadHtmlAdapterMatcher
): ExtensionType & {
  identifier: ServiceIdentifier<BlockMahdaadHtmlAdapterMatcher>;
} {
  const identifier = BlockMahdaadHtmlAdapterMatcherIdentifier(matcher.flavour);
  return {
    setup: di => {
      di.addImpl(identifier, () => matcher);
    },
    identifier,
  };
}
