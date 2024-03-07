import { compile } from '@vue/compiler-dom';
import { registerRuntimeCompile, type RenderFunction } from '@vue/runtime-dom';
import { NOOP } from '@vue/shared';
function compileToFunction(template: string): RenderFunction {
  const { code } = compile(template);
  console.log('code===>', code);
  return NOOP;
}
registerRuntimeCompile(compileToFunction);
export * from '@vue/runtime-dom';
