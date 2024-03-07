import type { ShapeFlags } from './shapeFlags';

export interface ComponentOptions {
  render?: RenderFunction;
  template?: string;
}
export interface VNode {
  type: VNodeType;
  shapeFlag: ShapeFlags;
  component?: ComponentInternalInstance;
}

export type RootRenderFunction<HostElement> = (
  vnode: VNode,
  container: HostElement,
) => void;

export interface RendererOptions {}

export const Text = Symbol(__DEV__ ? 'Text' : undefined);
export type Component = ComponentOptions;

export type VNodeType = Component | typeof Text;

export interface ComponentInternalInstance {
  type: Component;
  render?: RenderFunction;
}

export type RenderFunction = () => VNode | void;

export type CompileFunction = (template: string) => RenderFunction;
