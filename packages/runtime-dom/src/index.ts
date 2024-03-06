import { isString } from '@vue/shared';
interface VueOptions {}
export function createApp() {
  return {
    mount(app: VueOptions, selectors: string) {
      if (isString(selectors)) {
        const container = document.querySelector<Element>(selectors);
        if (!container) {
          __DEV__ && console.warn('版定容器为空!');
          return;
        }
        container.innerHTML = '';
        console.log('container', container);
      }
    },
  };
}
