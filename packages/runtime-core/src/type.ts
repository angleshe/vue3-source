import type { ShapeFlags } from './shapeFlags';

export interface MethodOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: Function;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ComponentOptions<D = {}, M extends MethodOptions = {}> {
  data?: D;
  render?: RenderFunction;
  template?: string;
  methods?: M;
}

export interface VNodeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type NormalizedChildren = string | VNodeChildren | null;
export interface VNode {
  type: VNodeTypes;
  shapeFlag: ShapeFlags;
  component?: ComponentInternalInstance;
  children: NormalizedChildren;
  props: VNodeProps | null;
}

export interface VNodeChildren extends Array<VNodeChild> {}

export type RootRenderFunction<HostElement> = (
  vnode: VNode,
  container: HostElement,
) => void;

// TODO 去除any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RendererOptions<HostNode = any, HostElement = any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patchProp(el: HostElement, key: string, value: any): void;
  insert(el: HostNode, parent: HostElement): void;
  createText(text: string): HostNode;
  createComment(text: string): HostNode;
  createElement(type: string): HostElement;
  setElementText(node: HostElement, text: string): void;
}

export const Text = Symbol(__DEV__ ? 'Text' : undefined);
export const Fragment = Symbol(__DEV__ ? 'Fragment' : undefined);
export type Component = ComponentOptions;

export type VNodeTypes = Component | typeof Text | typeof Fragment | string;

export type Data = Record<string, unknown>;

export interface ComponentInternalInstance {
  type: Component;
  render?: RenderFunction;
  proxy: ComponentPublicInstance | null;
  data: Data;
  renderContext: Data;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ComponentPublicInstance = {};

export type RenderFunction = () => VNodeChild | void;

export type CompileFunction = (template: string) => RenderFunction;

export type VNodeChildAtom = VNode | string | void;

export type VNodeChild = VNodeChildAtom;
