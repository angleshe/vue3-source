import type { ShapeFlags } from './shapeFlags';

export interface ComponentOptions {
  render?: () => void;
  template?: string;
}
export interface VNode {
  type: VNodeType;
  shapeFlag: ShapeFlags;
}

export type RootRenderFunction<HostElement> = (
  vnode: VNode,
  container: HostElement,
) => void;

export interface RendererOptions {}

export const Text = Symbol(__DEV__ ? 'Text' : undefined);
export type Component = ComponentOptions;

export type VNodeType = Component | typeof Text;
