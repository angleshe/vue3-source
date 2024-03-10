import { isString } from '@vue/shared';
import { createRenderer, ComponentOptions } from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
const baseCreateApp = createRenderer<Node, Element>(nodeOps);
export function createApp() {
  const app = baseCreateApp();
  const mount = app.mount;
  (app.mount as unknown) = (component: ComponentOptions, selectors: string) => {
    if (isString(selectors)) {
      const container = document.querySelector<Element>(selectors);
      if (!container) {
        __DEV__ && console.warn('版定容器为空!');
        return;
      }

      if (__RUNTIME_COMPILE__ && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = '';
      return mount(component, container);
    }
  };

  return app;
}

export * from '@vue/runtime-core';
