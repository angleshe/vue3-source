export const FRAGMENT = Symbol(__DEV__ ? `Fragment` : ``);
export const OPEN_BLOCK = Symbol(__DEV__ ? `openBlock` : ``);
export const CREATE_BLOCK = Symbol(__DEV__ ? `createBlock` : ``);
export const TO_STRING = Symbol(__DEV__ ? `toString` : ``);

export const helperNameMap: Record<symbol, string> = {
  [FRAGMENT]: `Fragment`,
  [OPEN_BLOCK]: `openBlock`,
  [CREATE_BLOCK]: `createBlock`,
  [TO_STRING]: `toString`,
};
