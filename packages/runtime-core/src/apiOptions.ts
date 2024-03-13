import { ComponentInternalInstance, ComponentOptions } from './type';

export function applyOptions(
  instance: ComponentInternalInstance,
  options: ComponentOptions,
) {
  const { data: dataOptions } = options;
  if (dataOptions) {
    instance.data = dataOptions;
  }
}
