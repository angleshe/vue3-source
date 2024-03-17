import { ShapeFlags } from './shapeFlags';
import {
  type VNodeChild,
  type VNode,
  type VNodeTypes,
  Text,
  type NormalizedChildren,
  Data,
  VNodeProps,
} from './type';
import { isObject, isString } from '@vue/shared';
import { warn } from './warning';

function getShapeFlag(type: VNodeTypes): ShapeFlags {
  if (isString(type)) {
    return ShapeFlags.ELEMENT;
  }
  if (isObject(type)) {
    return ShapeFlags.STATEFUL_COMPONENT;
  }
  return ShapeFlags.UNKNOWN;
}

export function createVNode(
  type: VNodeTypes,
  _props: (Data & VNodeProps) | null = null,
  children: NormalizedChildren = null,
): VNode {
  if (__DEV__ && !type) {
    warn(`Invalid vnode type when creating vnode: ${String(type)}.`);
  }
  const vnode: VNode = {
    type,
    shapeFlag: getShapeFlag(type),
    children: null,
  };
  normalizedChildren(vnode, children);
  return vnode;
}

export function normalizedChildren(vnode: VNode, children: NormalizedChildren) {
  let type: ShapeFlags = ShapeFlags.UNKNOWN;
  if (!children) {
    children = null;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}

export function normalizeVNode(child: VNodeChild): VNode {
  if (!child) {
    throw new Error('TODO: 待补充逻辑');
  } else if (typeof child === 'object') {
    return child;
  } else {
    return createVNode(Text, null, String(child));
  }
}

export function openBlock() {
  console.log('open block');
}

export function createBlock(
  type: VNodeTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: { [key: string]: any } | null,
  children?: NormalizedChildren,
) {
  const vnode = createVNode(type, props, children);
  return vnode;
}

export function createTextVNode(text: string = ' '): VNode {
  return createVNode(Text, null, text);
}
