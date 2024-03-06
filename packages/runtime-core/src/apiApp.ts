import type { ComponentOptions, RootRenderFunction } from './type';
import { createVNode } from './vnode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface App<HostElement> {
  mount(options: ComponentOptions, container: HostElement): void;
}

export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
) {
  return function createApp() {
    const app: App<HostElement> = {
      mount(options, container) {
        const vnode = createVNode(options);

        // container 为什么要传进来呢?
        // 而不直接在返回一个VNode
        // 外层再根据VNode渲染
        render(vnode, container);
      },
    };

    return app;
  };
}
