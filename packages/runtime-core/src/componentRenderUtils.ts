import type { ComponentInternalInstance, VNode } from './type';
import { normalizeVNode } from './vnode';

export function renderComponentRoot(
  instance: ComponentInternalInstance,
): VNode {
  const { proxy } = instance;
  const result = normalizeVNode(instance.render!.call(proxy));
  return result;
}
