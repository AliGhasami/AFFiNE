//import { htmlLinkElementToDeltaMatcher } from '@blocksuite/affine-inline-link';
import {
  type HtmlAST,
  MahdaadHtmlASTToDeltaExtension,
} from '@blocksuite/affine-shared/adapters';
import { collapseWhiteSpace } from 'collapse-white-space';
import type { Element } from 'hast';

const isElement = (ast: HtmlAST): ast is Element => {
  return ast.type === 'element';
};

const textLikeElementTags = new Set(['span', 'bdi', 'bdo', 'ins']);
const listElementTags = new Set(['ol', 'ul']);
const strongElementTags = new Set(['strong', 'b']);
const italicElementTags = new Set(['i', 'em']);

export const mahdaadHtmlTextToDeltaMatcher = MahdaadHtmlASTToDeltaExtension({
  name: 'text',
  match: ast => ast.type === 'text',
  toDelta: (ast, context) => {
    if (!('value' in ast)) {
      return [];
    }
    const { options } = context;
    options.trim ??= true;

    if (options.pre) {
      return [{ insert: ast.value }];
    }

    const value = options.trim
      ? collapseWhiteSpace(ast.value, { trim: options.trim })
      : collapseWhiteSpace(ast.value);
    return value ? [{ insert: value }] : [];
  },
});

export const mahdaadHtmlTextLikeElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'text-like-element',
    match: ast => isElement(ast) && textLikeElementTags.has(ast.tagName),
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false })
      );
    },
  });

export const mahdaadHtmlListToDeltaMatcher = MahdaadHtmlASTToDeltaExtension({
  name: 'list-element',
  match: ast => isElement(ast) && listElementTags.has(ast.tagName),
  toDelta: () => {
    return [];
  },
});

export const mahdaadHtmlStrongElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'strong-element',
    match: ast => isElement(ast) && strongElementTags.has(ast.tagName),
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false }).map(delta => {
          delta.attributes = { ...delta.attributes, bold: true };
          return delta;
        })
      );
    },
  });

export const mahdaadHtmlItalicElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'italic-element',
    match: ast => isElement(ast) && italicElementTags.has(ast.tagName),
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false }).map(delta => {
          delta.attributes = { ...delta.attributes, italic: true };
          return delta;
        })
      );
    },
  });

export const mahdaadHtmlCodeElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'code-element',
    match: ast => isElement(ast) && ast.tagName === 'code',
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false }).map(delta => {
          delta.attributes = { ...delta.attributes, code: true };
          return delta;
        })
      );
    },
  });

export const mahdaadHtmlDelElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'del-element',
    match: ast => isElement(ast) && ast.tagName === 'del',
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false }).map(delta => {
          delta.attributes = { ...delta.attributes, strike: true };
          return delta;
        })
      );
    },
  });

export const mahdaadHtmlUnderlineElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'underline-element',
    match: ast => isElement(ast) && ast.tagName === 'u',
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false }).map(delta => {
          delta.attributes = { ...delta.attributes, underline: true };
          return delta;
        })
      );
    },
  });

export const mahdaadHtmlMarkElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'mark-element',
    match: ast => isElement(ast) && ast.tagName === 'mark',
    toDelta: (ast, context) => {
      if (!isElement(ast)) {
        return [];
      }
      return ast.children.flatMap(child =>
        context.toDelta(child, { trim: false }).map(delta => {
          delta.attributes = { ...delta.attributes };
          return delta;
        })
      );
    },
  });

export const mahdaadHtmlBrElementToDeltaMatcher =
  MahdaadHtmlASTToDeltaExtension({
    name: 'br-element',
    match: ast => isElement(ast) && ast.tagName === 'br',
    toDelta: () => {
      return [{ insert: '\n' }];
    },
  });

export const MahdaadHtmlInlineToDeltaAdapterExtensions = [
  mahdaadHtmlTextToDeltaMatcher,
  mahdaadHtmlTextLikeElementToDeltaMatcher,
  mahdaadHtmlStrongElementToDeltaMatcher,
  mahdaadHtmlItalicElementToDeltaMatcher,
  mahdaadHtmlCodeElementToDeltaMatcher,
  mahdaadHtmlDelElementToDeltaMatcher,
  mahdaadHtmlUnderlineElementToDeltaMatcher,
  //mahdaadHtmlLinkElementToDeltaMatcher,
  mahdaadHtmlMarkElementToDeltaMatcher,
  mahdaadHtmlBrElementToDeltaMatcher,
];
