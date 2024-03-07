export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}

export const NOOP = () => {};
