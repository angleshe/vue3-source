import { createAppAPI } from './apiApp';
import { isComponentShapeFlag } from './shapeFlags';
import type { RendererOptions, RootRenderFunction, VNode } from './type';

export function createRenderer<HostElement>(_options: RendererOptions) {
  function mountComponent(vnode: VNode, container: HostElement) {
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
