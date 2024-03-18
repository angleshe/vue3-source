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
  ExpressionNode,
  DirectiveNode,
  AttributeNode,
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

function parseAttributes(
  context: ParserContext,
  type: TagType,
): (AttributeNode | DirectiveNode)[] {
  const props: (AttributeNode | DirectiveNode)[] = [];
  const attributeNames = new Set<string>();
  while (
    context.source.length > 0 &&
    !context.source.startsWith('>') &&
    !context.source.startsWith('/>')
  ) {
    if (type === TagType.End) {
      emitError(context, ErrorCodes.END_TAG_WITH_ATTRIBUTES);
    }
    const attr = parseAttribute(context, attributeNames);
    if (type === TagType.Start) {
      props.push(attr);
    }

    if (/^[^\s/>]/.test(context.source)) {
      emitError(context, ErrorCodes.MISSING_WHITESPACE_BETWEEN_ATTRIBUTES);
    }

    advanceSpaces(context);
  }

  return props;
}

function parseAttribute(
  context: ParserContext,
  nameSet: Set<string>,
): DirectiveNode | AttributeNode {
  const match = /^[^\s/>][^\s/>=]*/.exec(context.source)!;

  const name = match[0];

  if (nameSet.has(name)) {
    emitError(context, ErrorCodes.DUPLICATE_ATTRIBUTE);
  }
  nameSet.add(name);

  if (name.startsWith('=')) {
    emitError(context, ErrorCodes.UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME);
  }
  if (/["'<]/g.exec(name)) {
    emitError(context, ErrorCodes.UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME);
  }

  advanceBy(context, name.length);

  let value:
    | {
        content: string;
      }
    | undefined = undefined;

  if (/^\s*=/.test(context.source)) {
    advanceSpaces(context);
    advanceBy(context, 1);
    advanceSpaces(context);
    value = parseAttributeValue(context);

    if (!value) {
      emitError(context, ErrorCodes.MISSING_ATTRIBUTE_VALUE);
    }
  }

  if (/^(v-|:|@|#)/.test(name)) {
    const match = /(?:^v-([a-z0-9-]+))?(?:(?::|^@|^#)([^.]+))?(.+)?$/i.exec(
      name,
    );

    let arg: ExpressionNode | undefined;
    if (match[2]) {
      arg = {
        type: NodeType.SIMPLE_EXPRESSION,
        content: match[2],
      };
    }

    return {
      type: NodeType.DIRECTIVE,
      name:
        match[1] ??
        (name.startsWith(':') ? 'bind' : name.startsWith('@') ? 'on' : 'slot'),
      arg,
      exp: value && {
        type: NodeType.SIMPLE_EXPRESSION,
        content: value.content,
      },
    };
  }
  return {
    type: NodeType.ATTRIBUTE,
    name,
    value: value && {
      type: NodeType.TEXT,
      content: value.content,
    },
  };
}

function parseAttributeValue(context: ParserContext) {
  let content: string;
  const quote = context.source[0];
  const isQuoted = quote === '"' || quote === `'`;

  if (isQuoted) {
    advanceBy(context, 1);

    const endIndex = context.source.indexOf(quote);

    if (endIndex === -1) {
      // TODO 什么case?
    } else {
      content = parseTextData(context, endIndex);
      advanceBy(context, 1);
    }
  } else {
    // TODO 什么case?
    const match = /^[^\s>]+/.exec(context.source);
    if (!match) {
      return undefined;
    }

    if (/["'<=`]/g.exec(match[0])) {
      emitError(
        context,
        ErrorCodes.UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE,
      );
    }
    content = parseTextData(context, match[0].length);
  }
  return { content };
}

function parseTag(context: ParserContext, type: TagType): ElementNode {
  const match = /^<\/?([a-z][^\s/>]*)/.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceSpaces(context);

  const props = parseAttributes(context, type);

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
    props,
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
