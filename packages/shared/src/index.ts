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
