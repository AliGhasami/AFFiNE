//import { linkDeltaToHtmlAdapterMatcher } from '@blocksuite/affine-inline-link';
//import { referenceDeltaToHtmlAdapterMatcher } from '@blocksuite/affine-inline-reference';
import type {
  InlineHtmlAST,
  //MahdaadHtmlASTToDeltaExtension,
  //InlineDeltaToHtmlAdapterExtension,
  //MahdaadInlineDeltaToHtmlAdapterExtension,
  //InlineDeltaToMarkdownAdapterExtension,
} from '@blocksuite/affine-shared/adapters';
import { MahdaadInlineDeltaToHtmlAdapterExtension } from '@blocksuite/affine-shared/adapters';
import { ThemeProvider } from '@blocksuite/affine-shared/services';

export const boldDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'bold',
    match: delta => !!delta.attributes?.bold,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [context.current],
      };
    },
  });

export const italicDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'italic',
    match: delta => !!delta.attributes?.italic,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [context.current],
      };
    },
  });

export const strikeDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'strike',
    match: delta => !!delta.attributes?.strike,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'del',
        properties: {},
        children: [context.current],
      };
    },
  });

export const inlineCodeDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'inlineCode',
    match: delta => !!delta.attributes?.code,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'code',
        properties: {},
        children: [context.current],
      };
    },
  });

export const underlineDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'underline',
    match: delta => !!delta.attributes?.underline,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'u',
        properties: {},
        children: [context.current],
      };
    },
  });

export const highlightBackgroundDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'highlight-background',
    match: delta => !!delta.attributes?.background,
    toAST: (delta, context, provider) => {
      const hast: InlineHtmlAST = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [context.current],
      };
      if (!provider || !delta.attributes?.background) {
        return hast;
      }

      const theme = provider.getOptional(ThemeProvider);
      if (!theme) {
        return hast;
      }

      const backgroundVar = delta.attributes?.background.substring(
        'var('.length,
        delta.attributes?.background.indexOf(')')
      );
      const background = theme.getCssVariableColor(backgroundVar);
      return {
        type: 'element',
        tagName: 'mark',
        properties: {
          style: `background-color: ${background};`,
        },
        children: [context.current],
      };
    },
  });

export const highlightColorDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'highlight-color',
    match: delta => !!delta.attributes?.color,
    toAST: (delta, context, provider) => {
      const hast: InlineHtmlAST = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [context.current],
      };
      if (!provider || !delta.attributes?.color) {
        return hast;
      }

      const theme = provider.getOptional(ThemeProvider);
      if (!theme) {
        return hast;
      }

      const colorVar = delta.attributes?.color.substring(
        'var('.length,
        delta.attributes?.color.indexOf(')')
      );
      const color = theme.getCssVariableColor(colorVar);
      return {
        type: 'element',
        tagName: 'mark',
        properties: {
          style: `color: ${color};background-color: transparent`,
        },
        children: [context.current],
      };
    },
  });

export const InlineDeltaToMahdaadHtmlAdapterExtensions = [
  boldDeltaToMahdaadHtmlAdapterMatcher,
  italicDeltaToMahdaadHtmlAdapterMatcher,
  strikeDeltaToMahdaadHtmlAdapterMatcher,
  underlineDeltaToMahdaadHtmlAdapterMatcher,
  highlightBackgroundDeltaToMahdaadHtmlAdapterMatcher,
  highlightColorDeltaToMahdaadHtmlAdapterMatcher,
  inlineCodeDeltaToMahdaadHtmlAdapterMatcher,
  //referenceDeltaToHtmlAdapterMatcher,
  //linkDeltaToHtmlAdapterMatcher,
];
