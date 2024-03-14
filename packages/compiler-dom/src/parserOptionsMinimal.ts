import { ParserOptions } from '@vue/compiler-core';
import { isHTMLTag, isSVGTag, isVoidTag } from '@vue/shared';

export const parserOptionsMinimal: ParserOptions = {
  isNativeTag: (tag) => isHTMLTag(tag) || isSVGTag(tag),
  isVoidTag,
};
