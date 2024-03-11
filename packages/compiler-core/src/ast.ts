export interface Node {
  type: NodeType;
}

export interface TextNode extends Node {
  type: NodeType.TEXT;
  content: string;
}

export interface InterpolationNode extends Node {
  type: NodeType.INTERPOLATION;
  content: SimpleExpressionNode;
}

export interface SimpleExpressionNode extends Node {
  type: NodeType.SIMPLE_EXPRESSION;
  content: string;
}

export type TemplateChildNode = TextNode | InterpolationNode;
export interface RootNode extends Node {
  type: NodeType.ROOT;
  children: TemplateChildNode[];
  codegenNode?: TemplateChildNode;
}

export enum NodeType {
  ROOT,
  TEXT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
}

export interface Position {
  offset: number;
  line: number;
  column: number;
}

export interface SourceLocation {
  start: Position;
  end: Position;
  source: string;
}
