import { ShapeFlags } from './shapeFlags';
import {
  type VNodeChild,
  type VNode,
  type VNodeType,
  Text,
  type NormalizedChildren,
} from './type';
import { isObject } from '@vue/shared';

function getShapeFlag(type: VNodeType): ShapeFlags {
  if (isObject(type)) {
    return ShapeFlags.STATEFUL_COMPONENT;
  }
  return ShapeFlags.UNKNOWN;
}

export function createVNode(
  type: VNodeType,
  children: NormalizedChildren = null,
): VNode {
  const vnode: VNode = {
    type,
    shapeFlag: getShapeFlag(type),
    children,
  };
  return vnode;
}

export function normalizeVNode(child: VNodeChild): VNode {
  if (!child) {
    throw new Error('TODO: 待补充逻辑');
  } else if (typeof child === 'object') {
    console.error('TODO: 待补充逻辑');
    return child;
  } else {
    return createVNode(Text, String(child));
  }
}
