import { No } from '@vue/shared';
import {
  type RootNode,
  NodeType,
  type TemplateChildNode,
  TextNode,
  type Position,
  type InterpolationNode,
  ElementTypes,
  ElementNode,
} from './ast';
import { ErrorCodes, createCompilerError, defaultOnError } from './error';
import type { ParserOptions } from './options';
import { advancePositionWithMutation } from './utils';

type OptionalOptions = 'isNativeTag';
type MergedParserOptions = Omit<Required<ParserOptions>, OptionalOptions> &
  Pick<ParserOptions, OptionalOptions>;
interface ParserContext extends Position {
  options: MergedParserOptions;
  source: string;
}

export const defaultParserOptions: MergedParserOptions = {
  delimiters: ['{{', '}}'],
  onError: defaultOnError,
  isVoidTag: No,
};

export function parse(content: string, options: ParserOptions = {}): RootNode {
  const context = createParseContext(content, options);
  return {
    type: NodeType.ROOT,
    children: parseChildren(context),
    helper: [],
  };
}

function getCursor(context: ParserContext): Position {
  const { column, line, offset } = context;
  return { column, line, offset };
}

function emitError(
  context: ParserContext,
  code: ErrorCodes,
  loc: Position = getCursor(context),
): void {
  context.options.onError(
    createCompilerError(code, {
      start: loc,
      end: loc,
      source: '',
    }),
  );
}

function advanceBy(context: ParserContext, numberOfCharacters: number) {
  const { source } = context;
  advancePositionWithMutation(context, source, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
}

function advanceSpaces(context: ParserContext) {
  const match = /^\s+/.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length);
  }
}

function isEnd(context: ParserContext): boolean {
  const s = context.source;
  if (s.startsWith('</')) {
    return true;
  }
  return !s;
}

function startsWithEndTagOpen(source: string, tag: string): boolean {
  return (
    source.startsWith('</') &&
    source.substring(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\s>]/.test(source[2 + tag.length])
  );
}

function parseTextData(context: ParserContext, length: number): string {
  const rawText = context.source.slice(0, length);
  advanceBy(context, length);
  return rawText;
}

function parseText(context: ParserContext): TextNode {
  const endTokens = ['<', context.options.delimiters[0]];

  let endIndex = context.source.length;
  for (const element of endTokens) {
    const index = context.source.indexOf(element);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);
  return {
    type: NodeType.TEXT,
    content,
  };
}

function parseInterpolation(
  context: ParserContext,
): InterpolationNode | undefined {
  const [open, close] = context.options.delimiters;
  const closeIndex = context.source.indexOf(close, open.length);
  if (closeIndex === -1) {
    emitError(context, ErrorCodes.X_MISSING_INTERPOLATION_END);
    return undefined;
  }

  advanceBy(context, open.length);
  const innerStart = getCursor(context);
  const innerEnd = getCursor(context);
  const rawContentLength = closeIndex - open.length;
  const rawContent = context.source.slice(rawContentLength);
  const preTrimContent = parseTextData(context, rawContentLength);
  const content = preTrimContent.trim();
  const startOffset = preTrimContent.indexOf(content);
  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, rawContent, startOffset);
  }
  // TODO parseTextData逻辑后看怎么计算
  const endOffset =
    rawContentLength - (preTrimContent.length - content.length - startOffset);
  advancePositionWithMutation(innerEnd, rawContent, endOffset);
  advanceBy(context, close.length);

  return {
    type: NodeType.INTERPOLATION,
    content: {
      type: NodeType.SIMPLE_EXPRESSION,
      content,
    },
  };
}

enum TagType {
  Start,
  End,
}

function parseTag(context: ParserContext, type: TagType): ElementNode {
  const match = /^<\/?([a-z][^\s/>]*)/.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceSpaces(context);
  let isSelfClosing: boolean = false;
  if (context.source.length === 0) {
    emitError(context, ErrorCodes.EOF_IN_TAG);
  } else {
    isSelfClosing = context.source.startsWith('/>');
    if (type === TagType.End && isSelfClosing) {
      emitError(context, ErrorCodes.END_TAG_WITH_TRAILING_SOLIDUS);
    }
    advanceBy(context, isSelfClosing ? 2 : 1);
  }

  let tagType: ElementTypes = ElementTypes.ELEMENT;

  if (!context.options.isNativeTag?.(tag)) {
    tagType = ElementTypes.COMPONENT;
  }

  return {
    tag,
    tagType,
    type: NodeType.ELEMENT,
    children: [],
    isSelfClosing,
  };
}

function parseElement(context: ParserContext): ElementNode {
  // Start tag
  const element = parseTag(context, TagType.Start);

  if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
    return element;
  }

  // children
  element.children = parseChildren(context);

  // End tag
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    emitError(context, ErrorCodes.X_MISSING_END_TAG);
  }
  return element;
}

function parseChildren(context: ParserContext): TemplateChildNode[] {
  const nodes: TemplateChildNode[] = [];
  while (!isEnd(context)) {
    const s = context.source;
    let node: TemplateChildNode | undefined = undefined;
    if (s.startsWith(context.options.delimiters[0])) {
      node = parseInterpolation(context);
    } else if (s.startsWith('<')) {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context);
      }
    }

    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}

function createParseContext(
  content: string,
  options: ParserOptions,
): ParserContext {
  return {
    options: {
      ...defaultParserOptions,
      ...options,
    },
    source: content,
    column: 1,
    line: 1,
    offset: 0,
  };
}
