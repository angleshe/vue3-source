import {
  type RootNode,
  NodeType,
  type TemplateChildNode,
  TextNode,
} from './ast';

interface ParserContext {
  source: string;
}

function advanceBy(context: ParserContext, numberOfCharacters: number) {
  const { source } = context;
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
  const content = parseTextData(context, context.source.length);
  return {
    type: NodeType.TEXT,
    content,
  };
}

function parseChildren(context: ParserContext): TemplateChildNode[] {
  const nodes: TemplateChildNode[] = [];
  while (!isEnd(context)) {
    const node = parseText(context);
    nodes.push(node);
  }
  return nodes;
}

function createParseContext(content: string): ParserContext {
  return {
    source: content,
  };
}

export function parse(content: string): RootNode {
  const context = createParseContext(content);
  return {
    type: NodeType.ROOT,
    children: parseChildren(context),
  };
}
