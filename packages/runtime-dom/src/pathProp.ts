import { isOn } from '@vue/shared';
import { patchEvent } from './modules/event';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function patchProp(el: Element, key: string, value: any) {
  switch (key) {
    default:
      if (isOn(key)) {
        patchEvent(el, key.slice(2).toLowerCase(), value);
      }
      break;
  }
}
