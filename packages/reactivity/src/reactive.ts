import { isObject, makeMap, toRawType } from '@vue/shared';

const isObservableType = /*#__PURE__*/ makeMap(
  'Object,Array,Map,Set,WeakMap,WeakSet',
);
export function reactive<T extends object>(target: T): T {
  return createReactiveObject(target);
}

function canObserve(value: unknown): boolean {
  return isObservableType(toRawType(value));
}

function createReactiveObject<T>(target: T): T {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }

  if (!canObserve(target)) {
    return target;
  }

  return target;
}
