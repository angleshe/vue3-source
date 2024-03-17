export const FRAGMENT = Symbol(__DEV__ ? `Fragment` : ``);
export const OPEN_BLOCK = Symbol(__DEV__ ? `openBlock` : ``);
export const CREATE_BLOCK = Symbol(__DEV__ ? `createBlock` : ``);
export const CREATE_VNODE = Symbol(__DEV__ ? 'createNode' : '');
export const CREATE_TEXT = Symbol(__DEV__ ? 'createText' : '');
export const TO_STRING = Symbol(__DEV__ ? `toString` : ``);
export const RESOLVE_COMPONENT = Symbol(__DEV__ ? 'resolveComponent' : '');

export const helperNameMap: Record<symbol, string> = {
  [FRAGMENT]: `Fragment`,
  [OPEN_BLOCK]: `openBlock`,
  [CREATE_BLOCK]: `createBlock`,
  [CREATE_VNODE]: 'createVNode',
  [CREATE_TEXT]: 'createTextVNode',
  [RESOLVE_COMPONENT]: 'resolveComponent',
  [TO_STRING]: `toString`,
};
