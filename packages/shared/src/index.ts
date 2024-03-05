export function isString(val: unknown): val is String {
  return typeof val === 'string';
}
