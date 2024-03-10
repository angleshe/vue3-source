import { RootNode, TemplateChildNode } from './ast';
export interface TransformContext extends Required<TransformOptions> {}
export type NodeTransform = (
  node: RootNode | TemplateChildNode,
  context: TransformContext,
) => void | (() => void);
export interface TransformOptions {
  nodeTransforms?: NodeTransform[];
}
