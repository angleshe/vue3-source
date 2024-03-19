import { DirectiveNode, Property, RootNode, TemplateChildNode } from './ast';
import { CompilerError } from './error';
export interface TransformContext extends Required<TransformOptions> {
  helpers: Set<symbol>;
  helper<T extends symbol>(name: T): T;
}
export type NodeTransform = (
  node: RootNode | TemplateChildNode,
  context: TransformContext,
) => void | (() => void);
export interface DirectiveTransformResult {
  props: Property[];
}
export type DirectiveTransform = (
  dir: DirectiveNode,
  context: TransformContext,
) => DirectiveTransformResult;
export interface TransformOptions {
  nodeTransforms?: NodeTransform[];
  directiveTransforms?: { [name: string]: DirectiveTransform };
}

export interface ParserOptions {
  delimiters?: [string, string];
  onError?: (error: CompilerError) => void;
  isNativeTag?: (tag: string) => boolean;
  isVoidTag?: (tag: string) => boolean;
}
