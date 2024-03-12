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

export interface CompoundExpressionNode extends Node {
  type: NodeType.COMPOUND_EXPRESSION;
  children: (TextNode | InterpolationNode | string)[];
}

export interface CallExpression extends Node {
  type: NodeType.JS_CALL_EXPRESSION;
  callee: symbol;
  arguments: (string | JSChildNode | symbol | TemplateChildNode[])[];
}

export interface SequenceExpression extends Node {
  type: NodeType.JS_SEQUENCE_EXPRESSION;
  expressions: JSChildNode[];
}

export type TemplateChildNode =
  | TextNode
  | InterpolationNode
  | CompoundExpressionNode;

export type JSChildNode =
  | CallExpression
  | SequenceExpression
  | SimpleExpressionNode;
export interface RootNode extends Node {
  type: NodeType.ROOT;
  children: TemplateChildNode[];
  codegenNode?: TemplateChildNode | JSChildNode;
  helper: symbol[];
}

export enum NodeType {
  ROOT,
  TEXT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  // containers
  COMPOUND_EXPRESSION,
  // codegen
  JS_CALL_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
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

export function createCallExpression<T extends CallExpression['callee']>(
  callee: T,
  args: CallExpression['arguments'] = [],
): CallExpression {
  return {
    type: NodeType.JS_CALL_EXPRESSION,
    callee,
    arguments: args,
  };
}

export function createSequenceExpression(
  expressions: SequenceExpression['expressions'],
): SequenceExpression {
  return {
    type: NodeType.JS_SEQUENCE_EXPRESSION,
    expressions,
  };
}
