import { createAppAPI } from './apiApp';
import { createComponentInstance, finishComponentSetup } from './component';
import { ShapeFlags, isComponentShapeFlag } from './shapeFlags';
import type {
  ComponentInternalInstance,
  RendererOptions,
  RootRenderFunction,
  VNode,
} from './type';

export function createRenderer<HostElement>(_options: RendererOptions) {
  function setupRenderEffect(instance: ComponentInternalInstance) {
    console.log('setupRenderEffect===>', instance);
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
    setupRenderEffect(instance);
    console.log('mountComponent===>', vnode, container);
  }
  function processComponent(vnode: VNode, container: HostElement) {
    mountComponent(vnode, container);
  }

  const render: RootRenderFunction<HostElement> = (vnode, container) => {
    console.log('渲染界面', vnode);
    const { type, shapeFlag } = vnode;

    switch (type) {
      default:
        if (isComponentShapeFlag(shapeFlag)) {
          processComponent(vnode, container);
        }
        break;
    }
  };
  return createAppAPI<HostElement>(render);
}
