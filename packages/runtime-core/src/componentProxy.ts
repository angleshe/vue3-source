import { EMPTY_OBJ, hasOwn } from '@vue/shared';
import type { ComponentInternalInstance } from './type';

export const publicInstanceProxyHandlers: ProxyHandler<ComponentInternalInstance> =
  {
    get(target: ComponentInternalInstance, key: string) {
      const { data, renderContext } = target;

      if (
        __RUNTIME_COMPILE__ &&
        (key as unknown as symbol) === Symbol.unscopables
      ) {
        return;
      }

      if (!key.startsWith('$')) {
        if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          return data[key];
        } else if (hasOwn(renderContext, key)) {
          return renderContext[key];
        }
      }
    },
    has(target: ComponentInternalInstance, key: string) {
      return !key.startsWith('_');
    },
  };
