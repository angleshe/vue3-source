import { createAppAPI } from './apiApp';
import { createComponentInstance, finishComponentSetup } from './component';
import { renderComponentRoot } from './componentRenderUtils';
import { ShapeFlags, isComponentShapeFlag } from './shapeFlags';
import {
  type ComponentInternalInstance,
  type RendererOptions,
  type RootRenderFunction,
  type VNode,
  Text,
} from './type';

export function createRenderer<HostNode, HostElement>(
  options: RendererOptions<HostNode, HostElement>,
) {
  const { createText: hostCreateText, insert: hostInsert } = options;

  function patch(n1: VNode | null, n2: VNode, container: HostElement) {
    const { type, shapeFlag } = n2;

    switch (type) {
      case Text:
        processText(n2, container);
        break;
      default:
        if (isComponentShapeFlag(shapeFlag)) {
          processComponent(n2, container);
        }
        break;
    }
  }
  function setupRenderEffect(
    instance: ComponentInternalInstance,
    container: HostElement,
  ) {
    console.log('setupRenderEffect===>', instance);
    const subTree = renderComponentRoot(instance);

    patch(null, subTree, container);
  }

  function mountComponent(vnode: VNode, container: HostElement) {
    // 1.创建实例
    const instance: ComponentInternalInstance = (vnode.component =
      createComponentInstance(vnode));

    // 2.设置状态组件
    if (vnode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) {
      finishComponentSetup(instance);
    }

    // 3.设置渲染效果
    setupRenderEffect(instance, container);
    console.log('mountComponent===>', vnode, container);
  }
  function processComponent(vnode: VNode, container: HostElement) {
    mountComponent(vnode, container);
  }

  function processText(vnode: VNode, container: HostElement) {
    hostInsert(hostCreateText(vnode.children), container);
  }

  const render: RootRenderFunction<HostElement> = (vnode, container) => {
    console.log('渲染界面', vnode);
    patch(null, vnode, container);
  };
  return createAppAPI<HostElement>(render);
}
