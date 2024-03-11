import { RootNode, TemplateChildNode } from './ast';
import { CompilerError } from './error';
export interface TransformContext extends Required<TransformOptions> {}
export type NodeTransform = (
  node: RootNode | TemplateChildNode,
  context: TransformContext,
) => void | (() => void);
export interface TransformOptions {
  nodeTransforms?: NodeTransform[];
}

export interface ParserOptions {
  delimiters?: [string, string];
  onError?: (error: CompilerError) => void;
}
