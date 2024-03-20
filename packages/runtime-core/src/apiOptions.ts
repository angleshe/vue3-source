import { EMPTY_OBJ, isFunction } from '@vue/shared';
import { ComponentInternalInstance, ComponentOptions } from './type';
import { warn } from './warning';

enum OptionType {
  DATA = 'Data',
  METHODS = 'Methods',
}

function createDuplicateChecker() {
  const cache = Object.create(null);
  return (type: OptionType, key: string) => {
    if (cache[key]) {
      warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}

export function applyOptions(
  instance: ComponentInternalInstance,
  options: ComponentOptions,
) {
  const renderContext =
    instance.renderContext === EMPTY_OBJ
      ? (instance.renderContext = {})
      : instance.renderContext;

  const ctx = instance.proxy;

  const { data: dataOptions, methods } = options;

  const checkDuplicateProperties = __DEV__ ? createDuplicateChecker() : null;

  if (dataOptions) {
    if (__DEV__ && checkDuplicateProperties) {
      for (const key in dataOptions) {
        checkDuplicateProperties(OptionType.DATA, key);
      }
    }
    instance.data = dataOptions;
  }

  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        __DEV__ && checkDuplicateProperties?.(OptionType.METHODS, key);
        renderContext[key] = methodHandler.bind(ctx);
      } else if (__DEV__) {
        warn(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
            `Did you reference the function correctly?`,
        );
      }
    }
  }
}
