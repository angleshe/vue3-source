export * from '@vue/runtime-dom';
function log(msg: string): void {
  console.log(msg);
}

export function main(): void {
  log('hello world!');
}
