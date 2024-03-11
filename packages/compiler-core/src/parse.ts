import {
  type RootNode,
  NodeType,
  type TemplateChildNode,
  TextNode,
  type Position,
  type InterpolationNode,
} from './ast';
import { ErrorCodes, createCompilerError, defaultOnError } from './error';
import type { ParserOptions } from './options';
import { advancePositionWithMutation } from './utils';

type MergedParserOptions = Required<ParserOptions>;
interface ParserContext extends Position {
  options: MergedParserOptions;
  source: string;
}

export const defaultParserOptions: MergedParserOptions = {
  delimiters: ['{{', '}}'],
  onError: defaultOnError,
};

export function parse(content: string, options: ParserOptions = {}): RootNode {
  const context = createParseContext(content, options);
  return {
    type: NodeType.ROOT,
    children: parseChildren(context),
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

function isEnd(context: ParserContext): boolean {
  const s = context.source;
  return !s;
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

function parseChildren(context: ParserContext): TemplateChildNode[] {
  const nodes: TemplateChildNode[] = [];
  while (!isEnd(context)) {
    const s = context.source;
    let node: TemplateChildNode | undefined = undefined;
    if (s.startsWith(context.options.delimiters[0])) {
      node = parseInterpolation(context);
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
