import { isString } from '@vue/shared';

export enum ElementTypes {
  ELEMENT,
  COMPONENT,
}
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

export interface ObjectExpression extends Node {
  type: NodeType.JS_OBJECT_EXPRESSION;
  properties: Array<Property>;
}

export interface Property extends Node {
  type: NodeType.JS_PROPERTY;
  key: ExpressionNode;
  value: JSChildNode;
}

export interface CompoundExpressionNode extends Node {
  type: NodeType.COMPOUND_EXPRESSION;
  children: (TextNode | InterpolationNode | SimpleExpressionNode | string)[];
}

export interface TextCallNode extends Node {
  type: NodeType.TEXT_CELL;
  content: TextNode | InterpolationNode | CompoundExpressionNode;
  codegenNode: CallExpression;
}

export interface CallExpression extends Node {
  type: NodeType.JS_CALL_EXPRESSION;
  callee: symbol;
  arguments: (
    | string
    | JSChildNode
    | symbol
    | TemplateChildNode
    | TemplateChildNode[]
  )[];
}

export interface SequenceExpression extends Node {
  type: NodeType.JS_SEQUENCE_EXPRESSION;
  expressions: JSChildNode[];
}

export interface BaseElementNode extends Node {
  type: NodeType.ELEMENT;
  tag: string;
  tagType: ElementTypes;
  children: TemplateChildNode[];
  isSelfClosing: boolean;
  codegenNode?: CallExpression;
  props: Array<AttributeNode | DirectiveNode>;
}

export interface PlainElementNode extends BaseElementNode {
  tagType: ElementTypes.ELEMENT;
}

export interface ComponentNode extends BaseElementNode {
  tagType: ElementTypes.COMPONENT;
}

export interface DirectiveNode extends Node {
  type: NodeType.DIRECTIVE;
  name: string;
  exp?: ExpressionNode;
  arg?: ExpressionNode;
}

export interface AttributeNode extends Node {
  type: NodeType.ATTRIBUTE;
  name: string;
  value?: TextNode;
}

export type ElementNode = PlainElementNode | ComponentNode;

export type TemplateChildNode =
  | ElementNode
  | TextNode
  | InterpolationNode
  | CompoundExpressionNode
  | TextCallNode;

export type JSChildNode =
  | CallExpression
  | SequenceExpression
  | ObjectExpression
  | ExpressionNode;

export type ExpressionNode = SimpleExpressionNode | CompoundExpressionNode;
export interface RootNode extends Node {
  type: NodeType.ROOT;
  children: TemplateChildNode[];
  codegenNode?: TemplateChildNode | JSChildNode;
  helper: symbol[];
}

export enum NodeType {
  ROOT,
  ELEMENT,
  TEXT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  TEXT_CELL,
  // codegen
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
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

export type ParentNode = RootNode | ElementNode;

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

export function createObjectExpression(
  properties: ObjectExpression['properties'],
): ObjectExpression {
  return {
    properties,
    type: NodeType.JS_OBJECT_EXPRESSION,
  };
}

export function createSimpleExpression(
  content: SimpleExpressionNode['content'],
): SimpleExpressionNode {
  return {
    type: NodeType.SIMPLE_EXPRESSION,
    content,
  };
}

export function createCompoundExpression(
  children: CompoundExpressionNode['children'],
): CompoundExpressionNode {
  return {
    type: NodeType.COMPOUND_EXPRESSION,
    children,
  };
}

export function createObjectProperty(
  key: Property['key'] | string,
  value: Property['value'],
): Property {
  return {
    type: NodeType.JS_PROPERTY,
    key: isString(key) ? createSimpleExpression(key) : key,
    value,
  };
}
