import type { ShapeFlags } from './shapeFlags';

export interface ComponentOptions {
  render?: RenderFunction;
  template?: string;
}

export type NormalizedChildren = string | null;
export interface VNode {
  type: VNodeType;
  shapeFlag: ShapeFlags;
  component?: ComponentInternalInstance;
  children: NormalizedChildren;
}

export type RootRenderFunction<HostElement> = (
  vnode: VNode,
  container: HostElement,
) => void;

// TODO 去除any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RendererOptions<HostNode = any, HostElement = any> {
  insert(el: HostNode, parent: HostElement): void;
  createText(text: string): HostNode;
}

export const Text = Symbol(__DEV__ ? 'Text' : undefined);
export type Component = ComponentOptions;

export type VNodeType = Component | typeof Text;

export interface ComponentInternalInstance {
  type: Component;
  render?: RenderFunction;
}

export type RenderFunction = () => VNodeChild | void;

export type CompileFunction = (template: string) => RenderFunction;

export type VNodeChildAtom = VNode | string | void;

export type VNodeChild = VNodeChildAtom;
