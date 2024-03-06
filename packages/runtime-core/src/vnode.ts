import { ShapeFlags } from './shapeFlags';
import { type VNode, type VNodeType } from './type';
import { isObject } from '@vue/shared';

function getShapeFlag(type: VNodeType): ShapeFlags {
  if (isObject(type)) {
    return ShapeFlags.STATEFUL_COMPONENT;
  }
  return ShapeFlags.UNKNOWN;
}

export function createVNode(type: VNodeType): VNode {
  console.log('createVNode====>', type);
  const vnode: VNode = {
    type,
    shapeFlag: getShapeFlag(type),
  };
  return vnode;
}
