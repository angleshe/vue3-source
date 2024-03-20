// eslint-disable-next-line @typescript-eslint/ban-types
export function callWithErrorHandling(fn: Function, args?: unknown[]) {
  let res;
  try {
    res = args ? fn(args) : fn();
  } catch (e) {
    // TODO 错误处理
    console.error('TODO 错误处理====>', e);
  }
  return res;
}
