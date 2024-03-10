import type { ComponentInternalInstance, VNode } from './type';
import { normalizeVNode } from './vnode';

export function renderComponentRoot(
  instance: ComponentInternalInstance,
): VNode {
  const result = normalizeVNode(instance.render!());
  return result;
}
