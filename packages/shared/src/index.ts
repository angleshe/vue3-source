export { makeMap } from './makeMap';
export * from './domTagConfig';
export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}

export const isArray = Array.isArray;

export function isSymbol(val: unknown): val is symbol {
  return typeof val === 'symbol';
}

export const NOOP = () => {};

export const No = () => false;

export const EMPTY_OBJ: { readonly [key: string]: never } = __DEV__
  ? Object.freeze({})
  : {};

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const hasOwn = (val: object, key: string | symbol) =>
  hasOwnProperty.call(val, key);

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string =>
  objectToString.call(value);
export function toRawType(value: unknown): string {
  return toTypeString(value).slice(8, -1);
}
